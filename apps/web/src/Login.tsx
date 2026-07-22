import { useState, type FormEvent } from 'react';
import { Alert, Button, Input } from '@talent-lab/ui';
import { ApiClientError, api, type Session } from './api.js';

export function Login({ onAuthenticated }: { onAuthenticated: (session: Session) => void }) {
  const [email, setEmail] = useState('recruiter@talent.test');
  const [password, setPassword] = useState('QaDemo!2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { onAuthenticated(await api.login(email, password)); }
    catch (reason) { setError(reason instanceof ApiClientError ? reason.message : 'Unexpected login error'); }
    finally { setLoading(false); }
  };

  return <main id="main-content" className="login-shell"><section className="login-card" aria-labelledby="login-title"><p className="eyebrow">Talent Lab</p><h1 id="login-title">Sign in to the interview workspace</h1><p>Use local synthetic QA accounts only. No real candidate data belongs here.</p>{error ? <Alert tone="error">{error}</Alert> : null}<form onSubmit={submit} noValidate><Input label="Email" id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><Input label="Password" id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /><Button type="submit" loading={loading}>Sign in</Button></form><details><summary>Local QA accounts</summary><ul><li>admin@talent.test</li><li>recruiter@talent.test</li><li>reviewer@talent.test</li><li>candidate@talent.test</li></ul><p>Password: <code>QaDemo!2026</code></p></details></section></main>;
}
