import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Alert, Button, EmptyState, Input, LoadingIndicator, Table } from '@talent-lab/ui';
import { ApiClientError, api, type Project } from './api.js';

export function Projects({ token, canWrite }: { token: string; canWrite: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]); const [name, setName] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setProjects(await api.projects(token)); } catch (reason) { setError(reason instanceof ApiClientError ? reason.message : 'Could not load projects'); } finally { setLoading(false); } }, [token]);
  useEffect(() => { void load(); }, [load]);
  const submit = async (event: FormEvent) => { event.preventDefault(); setSaving(true); setError(''); try { await api.createProject(token, { name, description: 'Created from the QA demo UI' }); setName(''); await load(); } catch (reason) { setError(reason instanceof ApiClientError ? reason.message : 'Could not create project'); } finally { setSaving(false); } };
  return <section aria-labelledby="projects-heading"><h2 id="projects-heading">Projects</h2>{error ? <Alert tone="error">{error}</Alert> : null}{canWrite ? <form className="inline-form" onSubmit={submit}><Input label="Project name" required value={name} onChange={(event) => setName(event.target.value)} /><Button type="submit" loading={saving}>Create project</Button></form> : null}{loading ? <LoadingIndicator label="Loading projects" /> : projects.length ? <Table caption="Recruitment projects" columns={['Name', 'Description']} rows={projects.map((item) => [item.name, item.description ?? '—'])} /> : <EmptyState title="No projects" description="Create a project before scheduling an interview." />}</section>;
}
