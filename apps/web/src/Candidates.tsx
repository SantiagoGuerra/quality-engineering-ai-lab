import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { Candidate } from '@talent-lab/contracts';
import { Alert, Button, Dialog, EmptyState, ErrorState, Input, LoadingIndicator, Pagination, Table, Toast } from '@talent-lab/ui';
import { ApiClientError, api } from './api.js';

export function Candidates({ token, canWrite }: { token: string; canWrite: boolean }) {
  const [items, setItems] = useState<Candidate[]>([]); const [page, setPage] = useState(1); const [total, setTotal] = useState(0);
  const [q, setQ] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false); const [success, setSuccess] = useState('');

  const load = useCallback(async () => { setLoading(true); setError(''); try { const result = await api.candidates(token, page, q); setItems(result.items); setTotal(result.total); } catch (reason) { setError(reason instanceof ApiClientError ? reason.message : 'Could not load candidates'); } finally { setLoading(false); } }, [page, q, token]);
  useEffect(() => { void load(); }, [load]);

  return <section aria-labelledby="candidates-heading"><div className="section-heading"><div><p className="eyebrow">Recruitment pipeline</p><h2 id="candidates-heading">Candidates</h2></div>{canWrite ? <Button onClick={() => setDialogOpen(true)}>Create candidate</Button> : null}</div><form className="filter" role="search" onSubmit={(event) => { event.preventDefault(); setPage(1); void load(); }}><Input label="Filter candidates" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Name or email" /><Button type="submit" variant="secondary">Apply filter</Button></form>{error ? <ErrorState description={error} onRetry={() => void load()} /> : loading ? <LoadingIndicator label="Loading candidates" /> : items.length === 0 ? <EmptyState title="No candidates found" description={q ? 'Try a different filter.' : 'Create the first candidate for this workspace.'} action={canWrite ? <Button onClick={() => setDialogOpen(true)}>Create candidate</Button> : undefined} /> : <><Table caption={`${total} candidates`} columns={['Name', 'Email', 'Location', 'Version']} rows={items.map((item) => [`${item.firstName} ${item.lastName}`, item.email, item.location ?? '—', item.version])} /><Pagination page={page} totalPages={Math.max(1, Math.ceil(total / 10))} onPageChange={setPage} /></>}<CandidateDialog open={dialogOpen} token={token} onClose={() => setDialogOpen(false)} onCreated={(candidate) => { setDialogOpen(false); setSuccess(`${candidate.firstName} ${candidate.lastName} created`); void load(); }} />{success ? <Toast>{success}</Toast> : null}</section>;
}

function CandidateDialog({ open, token, onClose, onCreated }: { open: boolean; token: string; onClose: () => void; onCreated: (candidate: Candidate) => void }) {
  const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState(''); const [email, setEmail] = useState(''); const [location, setLocation] = useState('');
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); if (saving) return; setSaving(true); setError(''); try { onCreated(await api.createCandidate(token, { firstName, lastName, email, location }, crypto.randomUUID())); setFirstName(''); setLastName(''); setEmail(''); setLocation(''); } catch (reason) { setError(reason instanceof ApiClientError ? reason.message : 'Could not create candidate'); } finally { setSaving(false); } };
  return <Dialog open={open} title="Create candidate" onClose={onClose} footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button form="candidate-form" type="submit" loading={saving}>Save candidate</Button></>}><form id="candidate-form" onSubmit={submit}>{error ? <Alert tone="error">{error}</Alert> : null}<Input data-dialog-initial-focus label="First name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} /><Input label="Last name" required value={lastName} onChange={(event) => setLastName(event.target.value)} /><Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><Input label="Location" value={location} onChange={(event) => setLocation(event.target.value)} /></form></Dialog>;
}
