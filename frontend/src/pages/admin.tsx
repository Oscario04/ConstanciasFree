import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Badge, Button, Card, DataTable, EmptyState, Field, LoadingState, PageHeader, SecondaryButton, Textarea } from '../components/ui';
import { adminApi, attendanceApi, documentsApi, eventsApi, requestsApi, statsApi, usersApi } from '../lib/api/modules';
import type { AttendanceRecord, DocumentRecord, Event, EventType, ParticipationRequest, User } from '../types/domain';

export function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['stats'], queryFn: statsApi.dashboard });
  return (
    <>
      <PageHeader title="Dashboard administrativo" description="Metricas operativas desde /api/stats/dashboard." />
      {isLoading ? <LoadingState /> : error ? <Alert tone="error">No se pudieron cargar metricas.</Alert> : <Card><pre className="overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre></Card>}
    </>
  );
}

export function AdminEventsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['events', 'admin'], queryFn: () => eventsApi.list({ limit: 100 }) });
  if (isLoading) return <LoadingState />;
  return (
    <>
      <PageHeader title="Eventos" actions={<Link to="/admin/eventos/nuevo"><Button>Nuevo evento</Button></Link>} />
      <DataTable<Event>
        rows={data?.events ?? []}
        columns={[
          { key: 'title', header: 'Evento', render: (row) => <Link className="font-semibold text-primary" to={`/admin/eventos/${row.id}`}>{row.title}</Link> },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'venue', header: 'Sede', render: (row) => row.venue ?? 'Por confirmar' },
          { key: 'actions', header: 'Operar', render: (row) => <div className="flex gap-2"><Link to={`/admin/eventos/${row.id}/solicitudes`}><SecondaryButton className="h-8">Solicitudes</SecondaryButton></Link><Link to={`/admin/eventos/${row.id}/asistencia`}><SecondaryButton className="h-8">Asistencia</SecondaryButton></Link><Link to={`/admin/eventos/${row.id}/documentos`}><SecondaryButton className="h-8">Docs</SecondaryButton></Link></div> },
        ]}
      />
    </>
  );
}

export function EventFormPage() {
  const { eventId } = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['event', eventId], queryFn: () => eventsApi.get(eventId ?? ''), enabled: Boolean(eventId) });
  const [form, setForm] = useState<Partial<Event>>({});
  const payload: Partial<Event> = {
    event_type: 'conference',
    title: '',
    description: '',
    venue: '',
    capacity: 0,
    start_date: '',
    end_date: '',
    retention_years: 5,
    ...(data ?? {}),
    ...form,
  };
  const save = useMutation({
    mutationFn: () => eventId ? eventsApi.update(eventId, payload) : eventsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
  const archive = useMutation({ mutationFn: () => eventsApi.archive(eventId ?? ''), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }) });
  return (
    <Card className="max-w-3xl">
      <PageHeader title={eventId ? 'Editar evento' : 'Nuevo evento'} />
      {save.isSuccess ? <Alert tone="success">Evento guardado.</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
        <Field label="Titulo" value={String(payload.title ?? '')} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <Textarea label="Descripcion" value={String(payload.description ?? '')} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <Field label="Tipo" value={String(payload.event_type ?? 'conference')} onChange={(event) => setForm({ ...form, event_type: event.target.value as EventType })} />
        <Field label="Inicio ISO" value={String(payload.start_date ?? '')} onChange={(event) => setForm({ ...form, start_date: event.target.value })} />
        <Field label="Fin ISO" value={String(payload.end_date ?? '')} onChange={(event) => setForm({ ...form, end_date: event.target.value })} />
        <Field label="Sede" value={String(payload.venue ?? '')} onChange={(event) => setForm({ ...form, venue: event.target.value })} />
        <Field label="Capacidad" type="number" value={String(payload.capacity ?? 0)} onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })} />
        <div className="flex gap-2"><Button>Guardar</Button>{eventId ? <SecondaryButton type="button" onClick={() => confirm('Archivar evento?') && archive.mutate()}>Archivar</SecondaryButton> : null}</div>
      </form>
    </Card>
  );
}

export function EventRequestsPage() {
  const { eventId = '' } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['event-requests', eventId], queryFn: () => requestsApi.byEvent(eventId) });
  const review = useMutation({ mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => requestsApi.review(id, { status, admin_message: status }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-requests', eventId] }) });
  if (isLoading) return <LoadingState />;
  if (!data?.length) return <EmptyState title="No hay solicitudes para este evento." />;
  return (
    <>
      <PageHeader title="Solicitudes del evento" />
      <DataTable<ParticipationRequest>
        rows={data}
        columns={[
          { key: 'user', header: 'Usuario', render: (row) => row.user_id },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'actions', header: 'Acciones', render: (row) => row.status === 'pending' ? <div className="flex gap-2"><Button className="h-8" onClick={() => review.mutate({ id: row.id, status: 'approved' })}>Aprobar</Button><SecondaryButton className="h-8" onClick={() => review.mutate({ id: row.id, status: 'rejected' })}>Rechazar</SecondaryButton></div> : null },
        ]}
      />
    </>
  );
}

export function EventAttendancePage() {
  const { eventId = '' } = useParams();
  const [userId, setUserId] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['attendance', eventId], queryFn: () => attendanceApi.byEvent(eventId) });
  const checkIn = useMutation({ mutationFn: () => attendanceApi.checkIn({ event_id: eventId, user_id: userId, method: 'manual' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance', eventId] }) });
  if (isLoading) return <LoadingState />;
  return (
    <>
      <PageHeader title="Asistencia" actions={<a href={statsApi.attendanceCsvPath(eventId)}><SecondaryButton>Export CSV</SecondaryButton></a>} />
      <Card className="mb-4 max-w-xl"><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); checkIn.mutate(); }}><Field label="User ID" value={userId} onChange={(event) => setUserId(event.target.value)} /><Button className="self-end">Check-in</Button></form></Card>
      <DataTable<AttendanceRecord> rows={data ?? []} columns={[{ key: 'user', header: 'Usuario', render: (row) => row.user_id }, { key: 'method', header: 'Metodo', render: (row) => row.method }, { key: 'status', header: 'Salida', render: (row) => row.check_out ? 'Registrada' : 'Activa' }]} />
    </>
  );
}

export function EventDocumentsPage() {
  const { eventId = '' } = useParams();
  const [userId, setUserId] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['event-documents', eventId], queryFn: () => documentsApi.byEvent(eventId) });
  const issue = useMutation({ mutationFn: () => documentsApi.issue(eventId, userId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-documents', eventId] }) });
  const batch = useMutation({ mutationFn: () => documentsApi.issueBatch(eventId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-documents', eventId] }) });
  const revoke = useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => documentsApi.revoke(id, reason), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-documents', eventId] }) });
  if (isLoading) return <LoadingState />;
  return (
    <>
      <PageHeader title="Documentos del evento" actions={<><a href={statsApi.documentsCsvPath(eventId)}><SecondaryButton>Export CSV</SecondaryButton></a><Button onClick={() => confirm('Emitir lote?') && batch.mutate()}>Emision masiva</Button></>} />
      <Card className="mb-4 max-w-xl"><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); issue.mutate(); }}><Field label="User ID aprobado" value={userId} onChange={(event) => setUserId(event.target.value)} /><Button className="self-end">Emitir</Button></form></Card>
      <DataTable<DocumentRecord> rows={data ?? []} columns={[{ key: 'code', header: 'Codigo', render: (row) => row.verification_code }, { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> }, { key: 'actions', header: 'Acciones', render: (row) => row.status === 'active' ? <SecondaryButton className="h-8" onClick={() => { const reason = prompt('Motivo de revocacion') ?? ''; if (reason) revoke.mutate({ id: row.id, reason }); }}>Revocar</SecondaryButton> : null }]} />
    </>
  );
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: usersApi.list });
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: User['status'] }) => usersApi.updateStatus(id, status ?? 'active'), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) });
  if (isLoading) return <LoadingState />;
  return <><PageHeader title="Usuarios" /><DataTable<User> rows={data ?? []} columns={[{ key: 'name', header: 'Nombre', render: (row) => row.name }, { key: 'role', header: 'Rol', render: (row) => row.role }, { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status ?? 'active'}>{row.status ?? 'active'}</Badge> }, { key: 'actions', header: 'Acciones', render: (row) => <SecondaryButton className="h-8" onClick={() => update.mutate({ id: row.id ?? row._id ?? '', status: row.status === 'active' ? 'inactive' : 'active' })}>Cambiar estado</SecondaryButton> }]} /></>;
}

export function ConfigPage() {
  const [appName, setAppName] = useState('ConstanciasFree');
  const { data } = useQuery({ queryKey: ['admin-config'], queryFn: adminApi.getConfig });
  const mutation = useMutation({ mutationFn: () => adminApi.updateConfig({ app_name: appName }) });
  return <Card className="max-w-xl"><PageHeader title="Configuracion" description="El backend actual no garantiza persistencia completa de esta configuracion." /><pre className="mb-4 rounded bg-surface-low p-3 text-xs">{JSON.stringify(data, null, 2)}</pre><form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}><Field label="Nombre de app" value={appName} onChange={(event) => setAppName(event.target.value)} /><Button>Guardar</Button></form></Card>;
}

export function StaffAttendancePage() {
  return <Card><PageHeader title="Asistencia staff" description="Selecciona un evento desde admin para registrar asistencia manual o usa el escaneo QR publico cuando este disponible." /><Link to="/admin/eventos"><Button>Ir a eventos</Button></Link></Card>;
}
