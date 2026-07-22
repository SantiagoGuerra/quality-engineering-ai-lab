import http from 'k6/http';
import { check, sleep } from 'k6';
const api = __ENV.API_BASE_URL || 'http://host.docker.internal:3001';
export const options = { vus: 10, duration: '15s', thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<750', 'p(99)<1200'], http_reqs: ['rate>5'] } };
export default function () { check(http.get(`${api}/health`), { 'health is 200': (response) => response.status === 200 }); sleep(0.2); }
