import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileCheck, FileText } from 'lucide-react';
import { useState } from 'react';
import { Alert, Badge, Button, Card, DataTable, EmptyState, Field, LoadingState, PageHeader, StatCard, Textarea } from '../components/ui';
import { documentsApi, requestsApi, usersApi } from '../lib/api/modules';
import { useAuth } from '../lib/auth/AuthContext';
import type { DocumentRecord, ParticipationRequest } from '../types/domain';

export function UserDashboardPage() {
  const { user } = useAuth();
  const requests = useQuery({ queryKey: ['my-requests'], queryFn: requestsApi.mine });
  const documents = useQuery({ queryKey: ['my-documents'], queryFn: documentsApi.mine });
  const pending = requests.data?.filter((request) => request.status === 'pending').length ?? 0;
  const activeDocs = documents.data?.filter((document) => document.status === 'active').length ?? 0;

  return (
    <>
      <PageHeader title={`Hola, ${user?.name ?? 'usuario'}`} description="Tu actividad reciente, documentos y solicitudes." />
      {(requests.error || documents.error) ? <Alert tone="error">No se pudo cargar todo el resumen. Intenta refrescar la pagina.</Alert> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Solicitudes" value={requests.isLoading ? '...' : requests.data?.length ?? 0} hint={`${pending} pendientes`} />
        <StatCard label="Documentos activos" value={documents.isLoading ? '...' : activeDocs} hint="Listos para descargar" />
        <StatCard label="Rol" value={<span className="text-2xl">{user?.role ?? '-'}</span>} hint="Permisos de tu cuenta" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2 font-bold text-ink"><FileCheck className="h-5 w-5 text-primary" />Ultimas solicitudes</div>
          {requests.isLoading ? <LoadingState /> : !requests.data?.length ? <EmptyState title="Aun no tienes solicitudes." /> : (
            <div className="grid gap-3">
              {requests.data.slice(0, 4).map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-3 rounded border border-outline-soft p-3">
                  <span className="truncate text-sm font-semibold text-ink">{request.event_id}</span>
                  <Badge status={request.status}>{request.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <div className="mb-4 flex items-center gap-2 font-bold text-ink"><FileText className="h-5 w-5 text-primary" />Documentos recientes</div>
          {documents.isLoading ? <LoadingState /> : !documents.data?.length ? <EmptyState title="Aun no tienes documentos emitidos." /> : (
            <div className="grid gap-3">
              {documents.data.slice(0, 4).map((document) => (
                <div key={document.id} className="flex items-center justify-between gap-3 rounded border border-outline-soft p-3">
                  <span className="truncate text-sm font-semibold text-ink">{document.document_type}</span>
                  <Badge status={document.status}>{document.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['me'], queryFn: usersApi.me });
  const [form, setForm] = useState({ name: '', phone: '', institution: '', bio: '' });
  const mutation = useMutation({
    mutationFn: () => usersApi.updateMe(form),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });

  if (isLoading) return <LoadingState />;

  const current = {
    ...form,
    name: form.name || data?.name || '',
    phone: form.phone || data?.phone || '',
    institution: form.institution || data?.institution || '',
    bio: form.bio || data?.bio || '',
  };

  return (
    <Card className="max-w-2xl">
      <PageHeader title="Perfil" description={data?.email} />
      {mutation.isSuccess ? <Alert tone="success">Perfil actualizado.</Alert> : null}
      {mutation.error ? <Alert tone="error">{mutation.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <Field label="Nombre" value={current.name} onChange={(event) => setForm({ ...current, name: event.target.value })} />
        <Field label="Telefono" value={current.phone} onChange={(event) => setForm({ ...current, phone: event.target.value })} />
        <Field label="Institucion" value={current.institution} onChange={(event) => setForm({ ...current, institution: event.target.value })} />
        <Textarea label="Bio" value={current.bio} onChange={(event) => setForm({ ...current, bio: event.target.value })} />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Guardando...' : 'Guardar'}</Button>
      </form>
    </Card>
  );
}

export function MyRequestsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['my-requests'], queryFn: requestsApi.mine });
  const cancel = useMutation({ mutationFn: requestsApi.cancel, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-requests'] }) });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudieron cargar tus solicitudes.</Alert>;
  if (!data?.length) return <EmptyState title="No tienes solicitudes registradas." />;

  return (
    <>
      <PageHeader title="Mis solicitudes" description="Revisa el estado de participacion en eventos." />
      {cancel.error ? <Alert tone="error">{cancel.error.message}</Alert> : null}
      <DataTable<ParticipationRequest>
        rows={data}
        columns={[
          { key: 'event', header: 'Evento', render: (row) => <span className="font-semibold text-ink">{row.event_id}</span> },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'message', header: 'Mensaje', render: (row) => row.admin_message || row.message || 'Sin mensaje' },
          { key: 'actions', header: 'Acciones', render: (row) => row.status === 'pending' ? <Button className="h-8" onClick={() => confirm('Cancelar solicitud?') && cancel.mutate(row.id)}>Cancelar</Button> : null },
        ]}
      />
    </>
  );
}

export function MyDocumentsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['my-documents'], queryFn: documentsApi.mine });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudieron cargar tus documentos.</Alert>;
  if (!data?.length) return <EmptyState title="No tienes documentos emitidos." />;

  return (
    <>
      <PageHeader title="Mis documentos" description="Constancias, diplomas y reconocimientos emitidos." />
      <DataTable<DocumentRecord>
        rows={data}
        columns={[
          { key: 'type', header: 'Tipo', render: (row) => <span className="font-semibold text-ink">{row.document_type}</span> },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'code', header: 'Codigo', render: (row) => <span className="font-mono text-xs">{row.verification_code}</span> },
          { key: 'actions', header: 'Acciones', render: (row) => <a href={documentsApi.downloadUrl(row.verification_code)}><Button className="h-8"><Download className="h-4 w-4" />PDF</Button></a> },
        ]}
      />
    </>
  );
}
