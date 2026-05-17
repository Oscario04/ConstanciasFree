import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Badge, Button, CapacityBar, Card, DataTable, EmptyState, Field, LoadingState, PageHeader, SecondaryButton, StatCard, Textarea } from '../components/ui';
import { adminApi, attendanceApi, documentsApi, eventsApi, requestsApi, statsApi, usersApi } from '../lib/api/modules';
import type { AttendanceRecord, DocumentRecord, Event, EventType, ParticipationRequest, User } from '../types/domain';

function MetricList({ title, values }: { title: string; values?: Record<string, number> }) {
  const entries = Object.entries(values ?? {});

  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-ink">{title}</h2>
      {!entries.length ? <p className="text-sm text-muted">Sin datos disponibles.</p> : (
        <div className="grid gap-3">
          {entries.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded border border-outline-soft bg-surface-lowest px-3 py-2 text-sm">
              <span className="font-semibold text-ink">{label}</span>
              <span className="text-muted">{value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['stats'], queryFn: statsApi.dashboard });

  return (
    <>
      <PageHeader title="Panel administrativo" description="Metricas operativas del sistema." />
      {isLoading ? <LoadingState /> : error ? <Alert tone="error">No se pudieron cargar metricas.</Alert> : (
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Eventos" value={data?.total_events ?? 0} />
            <StatCard label="Usuarios" value={data?.total_users ?? 0} />
            <StatCard label="Documentos" value={data?.total_documents ?? 0} />
            <StatCard label="Solicitudes" value={data?.total_requests ?? 0} hint={`${data?.pending_requests ?? 0} pendientes`} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <MetricList title="Documentos por tipo" values={data?.documents_by_type} />
            <MetricList title="Eventos por estado" values={data?.events_by_status} />
          </div>
        </div>
      )}
    </>
  );
}

export function AdminEventsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['events', 'admin'], queryFn: () => eventsApi.list({ limit: 100 }) });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudieron cargar los eventos.</Alert>;

  return (
    <>
      <PageHeader title="Eventos" description="Gestiona cupo, solicitudes, asistencia y documentos." actions={<Link to="/admin/eventos/nuevo"><Button>Nuevo evento</Button></Link>} />
      <DataTable<Event>
        rows={data?.events ?? []}
        columns={[
          { key: 'title', header: 'Evento', render: (row) => <Link className="font-semibold text-primary" to={`/admin/eventos/${row.id}`}>{row.title}</Link> },
          { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
          { key: 'capacity', header: 'Cupo', render: (row) => <div className="min-w-48"><CapacityBar registered={row.registered ?? 0} capacity={row.capacity} /></div> },
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
      <PageHeader title={eventId ? 'Editar evento' : 'Nuevo evento'} description="Captura los datos base del evento y su capacidad." />
      {save.isSuccess ? <Alert tone="success">Evento guardado.</Alert> : null}
      {save.error ? <Alert tone="error">{save.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
        <Field label="Titulo" value={String(payload.title ?? '')} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <Textarea label="Descripcion" value={String(payload.description ?? '')} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <Field label="Tipo" value={String(payload.event_type ?? 'conference')} onChange={(event) => setForm({ ...form, event_type: event.target.value as EventType })} />
        <Field label="Inicio ISO" value={String(payload.start_date ?? '')} onChange={(event) => setForm({ ...form, start_date: event.target.value })} />
        <Field label="Fin ISO" value={String(payload.end_date ?? '')} onChange={(event) => setForm({ ...form, end_date: event.target.value })} />
        <Field label="Sede" value={String(payload.venue ?? '')} onChange={(event) => setForm({ ...form, venue: event.target.value })} />
        <Field label="Capacidad" type="number" value={String(payload.capacity ?? 0)} onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })} />
        <div className="flex gap-2"><Button disabled={save.isPending}>{save.isPending ? 'Guardando...' : 'Guardar'}</Button>{eventId ? <SecondaryButton type="button" onClick={() => confirm('Archivar evento?') && archive.mutate()}>Archivar</SecondaryButton> : null}</div>
      </form>
    </Card>
  );
}

export function EventRequestsPage() {
  const { eventId = '' } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['event-requests', eventId], queryFn: () => requestsApi.byEvent(eventId) });
  const review = useMutation({ mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => requestsApi.review(id, { status, admin_message: status }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-requests', eventId] }) });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudieron cargar las solicitudes.</Alert>;
  if (!data?.length) return <EmptyState title="No hay solicitudes para este evento." />;

  return (
    <>
      <PageHeader title="Solicitudes del evento" />
      {review.error ? <Alert tone="error">{review.error.message}</Alert> : null}
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
  const { data, isLoading, error } = useQuery({ queryKey: ['attendance', eventId], queryFn: () => attendanceApi.byEvent(eventId) });
  const checkIn = useMutation({ mutationFn: () => attendanceApi.checkIn({ event_id: eventId, user_id: userId, method: 'manual' }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance', eventId] }) });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudo cargar la asistencia.</Alert>;

  return (
    <>
      <PageHeader title="Asistencia" actions={<a href={statsApi.attendanceCsvPath(eventId)}><SecondaryButton>Export CSV</SecondaryButton></a>} />
      {checkIn.error ? <Alert tone="error">{checkIn.error.message}</Alert> : null}
      <Card className="mb-4 max-w-xl"><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); checkIn.mutate(); }}><Field label="User ID" value={userId} onChange={(event) => setUserId(event.target.value)} /><Button className="self-end" disabled={checkIn.isPending}>{checkIn.isPending ? 'Registrando...' : 'Check-in'}</Button></form></Card>
      <DataTable<AttendanceRecord> rows={data ?? []} columns={[{ key: 'user', header: 'Usuario', render: (row) => row.user_id }, { key: 'method', header: 'Metodo', render: (row) => row.method }, { key: 'status', header: 'Salida', render: (row) => row.check_out ? 'Registrada' : 'Activa' }]} />
    </>
  );
}

export function EventDocumentsPage() {
  const { eventId = '' } = useParams();
  const [userId, setUserId] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['event-documents', eventId], queryFn: () => documentsApi.byEvent(eventId) });
  const issue = useMutation({ mutationFn: () => documentsApi.issue(eventId, userId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-documents', eventId] }) });
  const batch = useMutation({ mutationFn: () => documentsApi.issueBatch(eventId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-documents', eventId] }) });
  const revoke = useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => documentsApi.revoke(id, reason), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-documents', eventId] }) });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudieron cargar los documentos.</Alert>;

  return (
    <>
      <PageHeader title="Documentos del evento" actions={<><a href={statsApi.documentsCsvPath(eventId)}><SecondaryButton>Export CSV</SecondaryButton></a><Button onClick={() => confirm('Emitir lote?') && batch.mutate()} disabled={batch.isPending}>Emision masiva</Button></>} />
      {issue.error ? <Alert tone="error">{issue.error.message}</Alert> : null}
      {batch.error ? <Alert tone="error">{batch.error.message}</Alert> : null}
      <Card className="mb-4 max-w-xl"><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); issue.mutate(); }}><Field label="User ID aprobado" value={userId} onChange={(event) => setUserId(event.target.value)} /><Button className="self-end" disabled={issue.isPending}>{issue.isPending ? 'Emitiendo...' : 'Emitir'}</Button></form></Card>
      <DataTable<DocumentRecord> rows={data ?? []} columns={[{ key: 'code', header: 'Codigo', render: (row) => <span className="font-mono text-xs">{row.verification_code}</span> }, { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status}>{row.status}</Badge> }, { key: 'actions', header: 'Acciones', render: (row) => row.status === 'active' ? <SecondaryButton className="h-8" onClick={() => { const reason = prompt('Motivo de revocacion') ?? ''; if (reason) revoke.mutate({ id: row.id, reason }); }}>Revocar</SecondaryButton> : null }]} />
    </>
  );
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: usersApi.list });
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: User['status'] }) => usersApi.updateStatus(id, status ?? 'active'), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) });

  if (isLoading) return <LoadingState />;
  if (error) return <Alert tone="error">No se pudieron cargar usuarios.</Alert>;

  return <><PageHeader title="Usuarios" /><DataTable<User> rows={data ?? []} columns={[{ key: 'name', header: 'Nombre', render: (row) => row.name }, { key: 'role', header: 'Rol', render: (row) => row.role }, { key: 'status', header: 'Estado', render: (row) => <Badge status={row.status ?? 'active'}>{row.status ?? 'active'}</Badge> }, { key: 'actions', header: 'Acciones', render: (row) => <SecondaryButton className="h-8" onClick={() => update.mutate({ id: row.id ?? row._id ?? '', status: row.status === 'active' ? 'inactive' : 'active' })}>Cambiar estado</SecondaryButton> }]} /></>;
}

export function ConfigPage() {
  const [appName, setAppName] = useState('Constancias Claras');
  const { data, isLoading, error } = useQuery({ queryKey: ['admin-config'], queryFn: adminApi.getConfig });
  const mutation = useMutation({ mutationFn: () => adminApi.updateConfig({ app_name: appName }) });
  const modules = (data?.modules ?? {}) as Record<string, unknown>;

  return (
    <Card className="max-w-2xl">
      <PageHeader title="Ajustes" description="Configuracion operativa disponible en el backend actual." />
      {isLoading ? <LoadingState /> : error ? <Alert tone="error">No se pudo cargar la configuracion.</Alert> : (
        <div className="mb-4 grid gap-2">
          {Object.entries(modules).map(([name, enabled]) => (
            <div key={name} className="flex items-center justify-between rounded border border-outline-soft px-3 py-2 text-sm">
              <span className="font-semibold text-ink">{name}</span>
              <Badge status={enabled ? 'active' : 'archived'}>{enabled ? 'activo' : 'inactivo'}</Badge>
            </div>
          ))}
        </div>
      )}
      {mutation.isSuccess ? <Alert tone="success">Ajustes enviados.</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <Field label="Nombre de app" value={appName} onChange={(event) => setAppName(event.target.value)} />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Guardando...' : 'Guardar'}</Button>
      </form>
    </Card>
  );
}

export function StaffAttendancePage() {
  return <Card><PageHeader title="Asistencia staff" description="Selecciona un evento desde administracion para registrar asistencia manual o exportar datos." /><Link to="/admin/eventos"><Button>Ir a eventos</Button></Link></Card>;
}
