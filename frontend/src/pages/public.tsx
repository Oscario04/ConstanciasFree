import { Download, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi, eventsApi, requestsApi } from '../lib/api/modules';
import { useAuth } from '../lib/auth/AuthContext';
import { Alert, Badge, Button, Card, EmptyState, Field, LoadingState, PageHeader, SecondaryButton, Textarea } from '../components/ui';
import type { Event } from '../types/domain';

function formatDate(value?: string) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function HomePage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['events', 'home'], queryFn: () => eventsApi.list({ status: 'published', limit: 6 }) });
  return (
    <div className="grid gap-8">
      <section className="rounded border border-outline-soft bg-white p-8 shadow-paper">
        <p className="text-sm font-semibold text-success">Gestion VisDeDat · Constancias verificables</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-ink">Gestion de eventos, solicitudes y documentos verificables.</h1>
        <p className="mt-4 max-w-2xl text-muted">Consulta eventos publicados, solicita participacion y verifica constancias por codigo publico.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/eventos"><Button>Ver eventos</Button></Link>
          <Link to="/verificar"><SecondaryButton>Verificar documento</SecondaryButton></Link>
        </div>
      </section>
      <section>
        <PageHeader title="Eventos disponibles" />
        {isLoading ? <LoadingState /> : error ? <Alert tone="error">No se pudieron cargar los eventos publicados: {error.message}</Alert> : <EventGrid events={data?.events ?? []} />}
      </section>
    </div>
  );
}

function EventGrid({ events }: { events: Event[] }) {
  if (!events.length) return <EmptyState title="No hay eventos publicados por ahora." />;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">{event.title}</h2>
            <Badge status={event.status}>{event.status}</Badge>
          </div>
          <p className="line-clamp-3 text-sm text-muted">{event.description}</p>
          <dl className="grid gap-1 text-sm text-muted">
            <div><dt className="inline font-semibold text-ink">Inicio: </dt><dd className="inline">{formatDate(event.start_date)}</dd></div>
            <div><dt className="inline font-semibold text-ink">Sede: </dt><dd className="inline">{event.venue ?? 'Por confirmar'}</dd></div>
          </dl>
          <Link to={`/eventos/${event.id}`}><Button className="w-full">Ver detalle</Button></Link>
        </Card>
      ))}
    </div>
  );
}

export function EventsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['events'], queryFn: () => eventsApi.list({ limit: 50 }) });
  return (
    <>
      <PageHeader title="Catalogo de eventos" description="Eventos publicados, activos y archivados segun el estado real del backend." />
      {isLoading ? <LoadingState /> : error ? <Alert tone="error">No se pudieron cargar los eventos.</Alert> : <EventGrid events={data?.events ?? []} />}
    </>
  );
}

export function EventDetailPage() {
  const { eventId = '' } = useParams();
  const { user } = useAuth();
  const { data: event, isLoading } = useQuery({ queryKey: ['event', eventId], queryFn: () => eventsApi.get(eventId), enabled: Boolean(eventId) });
  if (isLoading) return <LoadingState />;
  if (!event) return <EmptyState title="Evento no encontrado." />;
  const canRequest = event.status === 'published' || event.status === 'ongoing';
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <PageHeader title={event.title} description={event.description} />
        <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
          <p><strong className="text-ink">Tipo:</strong> {event.event_type}</p>
          <p><strong className="text-ink">Estado:</strong> <Badge status={event.status}>{event.status}</Badge></p>
          <p><strong className="text-ink">Inicio:</strong> {formatDate(event.start_date)}</p>
          <p><strong className="text-ink">Fin:</strong> {formatDate(event.end_date)}</p>
          <p><strong className="text-ink">Sede:</strong> {event.venue ?? 'Por confirmar'}</p>
          <p><strong className="text-ink">Cupo:</strong> {event.registered ?? 0}/{event.capacity || 'sin limite'}</p>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-bold">Solicitud</h2>
        <p className="mt-2 text-sm text-muted">{canRequest ? 'Puedes solicitar participacion en este evento.' : 'Este evento no acepta solicitudes en su estado actual.'}</p>
        {canRequest ? <Link to={user ? `/app/eventos/${event.id}/solicitar` : '/login'}><Button className="mt-4 w-full">Solicitar participacion</Button></Link> : null}
      </Card>
    </div>
  );
}

export function RequestEventPage() {
  const { eventId = '' } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const mutation = useMutation({
    mutationFn: () => requestsApi.create({ event_id: eventId, requested_role: 'participante', message }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-requests'] }),
  });
  return (
    <Card className="max-w-2xl">
      <PageHeader title="Solicitud de participacion" description="La solicitud quedara pendiente hasta revision administrativa." />
      {mutation.isSuccess ? <Alert tone="success">Solicitud enviada correctamente.</Alert> : null}
      {mutation.error ? <Alert tone="error">{mutation.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <Textarea label="Mensaje para el organizador" value={message} onChange={(event) => setMessage(event.target.value)} />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Enviando...' : 'Enviar solicitud'}</Button>
      </form>
    </Card>
  );
}

export function VerifyPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    if (code.trim()) navigate(`/verificar/${encodeURIComponent(code.trim())}`);
  }
  return (
    <Card className="mx-auto max-w-xl">
      <PageHeader title="Verificador publico" description="Introduce el codigo de una constancia para validar su autenticidad." />
      <form className="grid gap-4" onSubmit={submit}>
        <Field label="Codigo de verificacion" value={code} onChange={(event) => setCode(event.target.value)} />
        <Button><Search className="h-4 w-4" />Verificar</Button>
      </form>
    </Card>
  );
}

export function VerifyResultPage() {
  const { code = '' } = useParams();
  const { data, isLoading, error } = useQuery({ queryKey: ['verify', code], queryFn: () => documentsApi.verify(code), retry: false });
  if (isLoading) return <LoadingState label="Verificando documento" />;
  if (error) return <Alert tone="error">Documento no encontrado o no valido para uso publico.</Alert>;
  return (
    <Card className="mx-auto max-w-2xl">
      <PageHeader title="Documento verificado" description="El codigo corresponde a un documento activo." actions={<Badge status="verified">Verificado</Badge>} />
      <dl className="grid gap-3 text-sm">
        <div><dt className="font-semibold text-ink">Tipo</dt><dd className="text-muted">{data?.document_type}</dd></div>
        <div><dt className="font-semibold text-ink">Emitido</dt><dd className="text-muted">{formatDate(data?.issued_at)}</dd></div>
        {Object.entries(data?.metadata ?? {}).map(([key, value]) => <div key={key}><dt className="font-semibold text-ink">{key}</dt><dd className="text-muted">{value}</dd></div>)}
      </dl>
      <a href={documentsApi.downloadUrl(code)} className="mt-5 inline-flex"><Button><Download className="h-4 w-4" />Descargar PDF</Button></a>
    </Card>
  );
}
