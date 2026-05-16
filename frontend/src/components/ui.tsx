import { AlertTriangle, CheckCircle, Clock, FileText, Loader2, ShieldAlert, XCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded border border-outline-soft bg-white px-4 text-sm font-semibold text-primary transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function IconButton({ label, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded border border-outline-soft bg-white text-primary transition hover:border-primary ${className}`}
      {...props}
    />
  );
}

export function Field({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-ink">
      {label}
      <input
        className="h-10 rounded border border-outline-soft bg-white px-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft"
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

export function Textarea({ label, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-ink">
      {label}
      <textarea
        className="min-h-24 rounded border border-outline-soft bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft"
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-50 text-success border-green-200',
  verified: 'bg-green-50 text-success border-green-200',
  valid: 'bg-green-50 text-success border-green-200',
  approved: 'bg-green-50 text-success border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-danger border-red-200',
  revoked: 'bg-red-50 text-danger border-red-200',
  archived: 'bg-slate-100 text-muted border-slate-200',
  cancelled: 'bg-slate-100 text-muted border-slate-200',
};

function StatusIcon({ status }: { status: string }) {
  if (['active', 'verified', 'valid', 'approved'].includes(status)) return <CheckCircle className="h-3.5 w-3.5" />;
  if (['pending', 'draft'].includes(status)) return <Clock className="h-3.5 w-3.5" />;
  if (['rejected', 'revoked'].includes(status)) return <XCircle className="h-3.5 w-3.5" />;
  if (status === 'archived') return <ShieldAlert className="h-3.5 w-3.5" />;
  return <FileText className="h-3.5 w-3.5" />;
}

export function Badge({ status, children }: { status: string; children?: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[status] ?? 'bg-white text-muted border-outline-soft'}`}>
      <StatusIcon status={status} />
      {children ?? status}
    </span>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded border border-outline-soft bg-white p-5 shadow-paper ${className}`}>{children}</section>;
}

export function Alert({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'success' }) {
  const cls = tone === 'error' ? 'border-red-200 bg-red-50 text-danger' : tone === 'success' ? 'border-green-200 bg-green-50 text-success' : 'border-outline-soft bg-surface-low text-ink';
  return <div className={`flex items-start gap-2 rounded border p-3 text-sm ${cls}`}><AlertTriangle className="mt-0.5 h-4 w-4" />{children}</div>;
}

export function LoadingState({ label = 'Cargando' }: { label?: string }) {
  return <div className="flex items-center gap-2 rounded border border-outline-soft bg-white p-4 text-sm text-muted"><Loader2 className="h-4 w-4 animate-spin" />{label}</div>;
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="rounded border border-dashed border-outline-soft bg-white p-8 text-center text-muted"><p className="font-semibold text-ink">{title}</p>{action ? <div className="mt-4">{action}</div> : null}</div>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function DataTable<T>({ rows, columns }: { rows: T[]; columns: Array<{ key: string; header: string; render: (row: T) => ReactNode }> }) {
  return (
    <div className="overflow-hidden rounded border border-outline-soft bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-container text-xs uppercase text-muted">
            <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 font-semibold">{column.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-outline-soft">
            {rows.map((row, index) => <tr key={index} className="hover:bg-surface-low">{columns.map((column) => <td key={column.key} className="px-4 py-3">{column.render(row)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
