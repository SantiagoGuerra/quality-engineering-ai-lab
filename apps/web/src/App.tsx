import { useEffect, useState } from 'react';
import type { Role } from '@talent-lab/contracts';
import { Alert, Button, Tabs } from '@talent-lab/ui';
import { api, type Session } from './api.js';
import { Candidates } from './Candidates.js';
import { Login } from './Login.js';
import { Projects } from './Projects.js';

const storageKey = 'talent-lab-session';

function readSession(): Session | null { try { const value = localStorage.getItem(storageKey); return value ? JSON.parse(value) as Session : null; } catch { return null; } }
const canWriteCandidates = (role: Role) => role === 'admin' || role === 'recruiter';
const canWriteProjects = (role: Role) => role === 'admin' || role === 'recruiter';

export function App() {
  const [session, setSession] = useState<Session | null>(readSession); const [notice, setNotice] = useState('');
  useEffect(() => { const expired = () => { localStorage.removeItem(storageKey); setSession(null); setNotice('Your session expired. Sign in again.'); }; window.addEventListener('talent:session-expired', expired); return () => window.removeEventListener('talent:session-expired', expired); }, []);
  if (window.location.pathname === '/fixtures/a11y-broken') return <BrokenAccessibilityFixture />;
  if (!session) return <><a className="skip-link" href="#main-content">Skip to main content</a>{notice ? <Alert tone="error">{notice}</Alert> : null}<Login onAuthenticated={(next) => { localStorage.setItem(storageKey, JSON.stringify(next)); setSession(next); setNotice(''); }} /></>;
  const logout = async () => { try { await api.logout(session.token); } finally { localStorage.removeItem(storageKey); setSession(null); } };
  return <><a className="skip-link" href="#main-content">Skip to main content</a><header className="app-header"><div><span className="brand">Talent Lab</span><span className="environment">Local QA</span></div><div><span>{session.user.name} · {session.user.role}</span><Button variant="secondary" size="small" onClick={() => void logout()}>Sign out</Button></div></header><main id="main-content" className="app-shell"><h1>Interview operations</h1>{session.user.role === 'candidate' ? <Alert tone="info">Candidate self-service is intentionally read-only in this demo.</Alert> : <Tabs tabs={[{ id: 'candidates', label: 'Candidates', content: <Candidates token={session.token} canWrite={canWriteCandidates(session.user.role)} /> }, { id: 'projects', label: 'Projects', content: <Projects token={session.token} canWrite={canWriteProjects(session.user.role)} /> }, { id: 'interviews', label: 'Interviews', content: <section><h2>Interviews</h2><p>Interviews, invitations and evaluations are available through the documented API and deterministic E2E helpers.</p><a href="http://localhost:3001/docs">Open API documentation</a></section> }]} />}</main></>;
}

function BrokenAccessibilityFixture() { return <main><h1>Intentional accessibility fixture</h1><p>This isolated page must fail automated checks and is never linked from the product.</p><input placeholder="Missing programmatic label" /><button type="button"><span aria-hidden="true">★</span></button><div role="button" tabIndex={-1}>Not keyboard reachable</div></main>; }
