import { createServer, type Server } from 'node:http';
import { ToxiProxyContainer, type StartedToxiProxyContainer } from '@testcontainers/toxiproxy';
import { TestContainers } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('controlled network faults through Toxiproxy', () => {
  let upstream: Server; let toxiproxy: StartedToxiProxyContainer; let proxy: Awaited<ReturnType<StartedToxiProxyContainer['createProxy']>>; let url: string;

  beforeAll(async () => {
    upstream = createServer((_request, response) => { response.writeHead(200, { 'content-type': 'application/json' }); response.end(JSON.stringify({ status: 'ok' })); });
    await new Promise<void>((resolve) => upstream.listen(0, '0.0.0.0', resolve));
    const address = upstream.address(); if (!address || typeof address === 'string') throw new Error('Could not resolve upstream port');
    await TestContainers.exposeHostPorts(address.port);
    toxiproxy = await new ToxiProxyContainer('ghcr.io/shopify/toxiproxy:2.12.0').start();
    proxy = await toxiproxy.createProxy({ name: 'local-http', upstream: `host.testcontainers.internal:${address.port}` });
    url = `http://${proxy.host}:${proxy.port}`;
  });

  afterAll(async () => { if (toxiproxy) await toxiproxy.stop(); if (upstream) await new Promise<void>((resolve, reject) => upstream.close((error) => error ? reject(error) : resolve())); });

  it('injects measurable latency then restores normal traffic', async () => {
    expect((await fetch(url)).status).toBe(200);
    const toxic = await proxy.instance.addToxic<{ latency: number; jitter: number }>({ name: 'latency-demo', type: 'latency', stream: 'downstream', toxicity: 1, attributes: { latency: 300, jitter: 0 } });
    const started = performance.now(); expect((await fetch(url)).status).toBe(200); expect(performance.now() - started).toBeGreaterThanOrEqual(250);
    await toxic.remove();
  });

  it('classifies a cut connection and recovers with a bounded retry', async () => {
    await proxy.setEnabled(false);
    await expect(fetch(url, { signal: AbortSignal.timeout(1_000) })).rejects.toThrow();
    let attempts = 0;
    const withRetry = async (): Promise<Response> => {
      while (attempts < 3) {
        attempts += 1;
        try { return await fetch(url, { signal: AbortSignal.timeout(1_000) }); }
        catch (error) { if (attempts >= 3) throw error; await proxy.setEnabled(true); }
      }
      throw new Error('bounded retry exhausted');
    };
    expect((await withRetry()).status).toBe(200); expect(attempts).toBe(2);
  });
});
