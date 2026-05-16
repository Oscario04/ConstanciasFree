import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { Alert, Badge, Button, Card, DataTable, EmptyState, Field, LoadingState, PageHeader } from '../components/ui';
import { documentsApi, requestsApi, usersApi } from '../lib/api/modules';
import { useAuth } from '../lib/auth/AuthContext';
import type { DocumentRecord, ParticipationRequest } from '../types/domain';

export function UserDashboardPage() {
  const { user } = useAuth();
  const requests = useQuery({ queryKey: ['my-requests'], queryFn: requestsApi.mine });
  const documents = useQuery({ queryKey: ['my-documents'], queryFn: documentsApi.mine });
  return (
    <>
      <PageHeader title={`Hola, ${user?.name ?? 'usuario'}`} description="Resumen de solicitudes y documentos emitidos." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card><p className="text-sm text-muted">Solicitudes</p><p className="mt-2 text-3xl font-bold text-ink">{requests.data?.length ?? 0}</p></Card>
        <Card><p className="text-sm text-muted">Documentos</p><p className="mt-2 text-3xl font-bold text-ink">{documents.data?.length ?? 0}</p></Card>
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
  const current = { ...form, name: form.name || data?.name || '', phone: form.phone || data?.phone || '', institution: form.institution || data?.institution || '', bio: form.bio || data?.bio || '' };
  return (
    <Card className="max-w-2xl">
      <PageHeader title="Perfil" description={data?.email} />
      {mutation.isSuccess ? <Alert tone="success">Perfil actualizado.</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <Field label="Nombre" value={current.name} onChange={(event) => setForm({ ...current, name: event.target.value })} />
        <Field label="Telefono" value={current.phone} onChange={(event) => setForm({ ...current, phone: event.target.value })} />
        <Field label="Institucion" value={current.institution} onChange={(event) => setForm({ ...current, institution: event.target.value })} />
        <Field label="Bio" value={current.bio} onChange={(event) => setForm({ ...current, bio: event.target.value })} />
        <Button>Guardar</Button>
      </form>
    </Card>
  );
}

export function MyRequestsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['my-requests'], queryFn: requestsApi.mine });
  const cancel = useMutation({ mutationFn: requestsApi.cancel, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-requests'] }) });
  if (isLoading) return <LoadingState />;
  if (!data?.length) return <EmptyState title="No tienes solicitudes registradas." />;
  return (
    <>
      <PageHeader title="Mis solicitudes" />
      <DataTable<ParticipationRequest>
        rows={data}
        columns={[
          { key: 'event', header: 'Evento', render: (row) => row.event_id },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'actions', header: 'Acciones', render: (row) => row.status === 'pending' ? <Button className="h-8" onClick={() => confirm('Cancelar solicitud?') && cancel.mutate(row.id)}>Cancelar</Button> : null },
        ]}
      />
    </>
  );
}

export function MyDocumentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['my-documents'], queryFn: documentsApi.mine });
  if (isLoading) return <LoadingState />;
  if (!data?.length) return <EmptyState title="No tienes documentos emitidos." />;
  return (
    <>
      <PageHeader title="Mis documentos" />
      <DataTable<DocumentRecord>
        rows={data}
        columns={[
          { key: 'type', header: 'Tipo', render: (row) => row.document_type },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'code', header: 'Codigo', render: (row) => row.verification_code },
          { key: 'actions', header: 'Acciones', render: (row) => <a href={documentsApi.downloadUrl(row.verification_code)}><Button className="h-8"><Download className="h-4 w-4" />PDF</Button></a> },
        ]}
      />
    </>
  );
}

