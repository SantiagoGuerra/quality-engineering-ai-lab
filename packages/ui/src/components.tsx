import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ children, loading = false, size = 'medium', variant = 'primary', disabled, ...props }: ButtonProps) {
  return <button className={`tl-button tl-button--${variant} tl-button--${size}`} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading ? <><span className="tl-spinner" aria-hidden="true" /> Loading…</> : children}</button>;
}

interface FormFieldProps { label: string; htmlFor: string; hint?: string | undefined; error?: string | undefined; required?: boolean | undefined; children: ReactNode }
export function FormField({ label, htmlFor, hint, error, required, children }: FormFieldProps) {
  return <div className="tl-field"><label htmlFor={htmlFor}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>{children}{hint && !error ? <span className="tl-hint" id={`${htmlFor}-hint`}>{hint}</span> : null}{error ? <span className="tl-error" id={`${htmlFor}-error`}>{error}</span> : null}</div>;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; hint?: string }
export function Input({ label, error, hint, id: providedId, required, ...props }: InputProps) {
  const generatedId = useId(); const id = providedId ?? generatedId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return <FormField label={label} htmlFor={id} error={error} hint={hint} required={required}><input id={id} required={required} aria-invalid={Boolean(error)} aria-describedby={describedBy} {...props} /></FormField>;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label: string; options: Array<{ value: string; label: string }>; error?: string }
export function Select({ label, options, error, id: providedId, ...props }: SelectProps) {
  const generatedId = useId(); const id = providedId ?? generatedId;
  return <FormField label={label} htmlFor={id} error={error}><select id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormField>;
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> { label: string }
export function Checkbox({ label, id: providedId, ...props }: CheckboxProps) {
  const generatedId = useId(); const id = providedId ?? generatedId;
  return <div className="tl-checkbox"><input type="checkbox" id={id} {...props} /><label htmlFor={id}>{label}</label></div>;
}

export function Alert({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'success' | 'error' }) { return <div className={`tl-alert tl-alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>; }
export function Toast({ children }: { children: ReactNode }) { return <div className="tl-toast" role="status" aria-live="polite">{children}</div>; }
export function LoadingIndicator({ label = 'Loading content' }: { label?: string }) { return <div className="tl-loading" role="status"><span className="tl-spinner" aria-hidden="true" /><span>{label}</span></div>; }
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <section className="tl-state"><h2>{title}</h2><p>{description}</p>{action}</section>; }
export function ErrorState({ title = 'Something went wrong', description, onRetry }: { title?: string; description: string; onRetry?: () => void }) { return <section className="tl-state tl-state--error" role="alert"><h2>{title}</h2><p>{description}</p>{onRetry ? <Button onClick={onRetry}>Try again</Button> : null}</section>; }

interface DialogProps { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }
export function Dialog({ open, title, children, onClose, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null); const titleId = useId();
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) { dialog.showModal(); const initial = dialog.querySelector<HTMLElement>('[data-dialog-initial-focus]'); initial?.focus(); } if (!open && dialog.open) dialog.close(); }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose}><div className="tl-dialog"><header><h2 id={titleId}>{title}</h2><Button variant="secondary" size="small" aria-label="Close dialog" onClick={onClose}>×</Button></header><div>{children}</div>{footer ? <footer>{footer}</footer> : null}</div></dialog>;
}

interface TableProps { caption: string; columns: string[]; rows: Array<Array<ReactNode>> }
export function Table({ caption, columns, rows }: TableProps) {
  // The focusable wrapper lets keyboard users scroll a table that overflows on narrow screens.
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return <div className="tl-table-wrap" tabIndex={0}><table><caption>{caption}</caption><thead><tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void }
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) { return <nav className="tl-pagination" aria-label="Pagination"><Button variant="secondary" size="small" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button><span aria-live="polite">Page {page} of {totalPages}</span><Button variant="secondary" size="small" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button></nav>; }

interface TabsProps { tabs: Array<{ id: string; label: string; content: ReactNode }> }
export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const selectRelative = (current: number, delta: number) => { const target = tabs[(current + delta + tabs.length) % tabs.length]; if (target) setActive(target.id); };
  return <div><div role="tablist" aria-label="Sections">{tabs.map((tab, index) => <button key={tab.id} type="button" role="tab" id={`tab-${tab.id}`} aria-controls={`panel-${tab.id}`} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} onKeyDown={(event) => { if (event.key === 'ArrowRight') selectRelative(index, 1); if (event.key === 'ArrowLeft') selectRelative(index, -1); }}>{tab.label}</button>)}</div>{tabs.map((tab) => <div key={tab.id} role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id}>{tab.content}</div>)}</div>;
}
