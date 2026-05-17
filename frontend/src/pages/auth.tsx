import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Alert, Button, Card, Field, PageHeader, SecondaryButton } from '../components/ui';
import { authApi } from '../lib/api/modules';
import { useAuth } from '../lib/auth/AuthContext';

const emailSchema = z.string().email('Email invalido');

function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
      <section className="rounded border border-outline-soft bg-white p-8 shadow-paper">
        <p className="text-sm font-semibold text-success">Acceso seguro</p>
        <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-ink md:text-4xl">Tu historial de constancias, solicitudes y eventos en orden.</h1>
        <p className="mt-4 max-w-lg text-sm text-muted">Entra para revisar documentos emitidos, seguir solicitudes y operar eventos segun tu rol.</p>
        <div className="mt-8 grid gap-3 text-sm text-muted">
          <p><strong className="text-ink">Verificacion publica:</strong> codigos consultables sin iniciar sesion.</p>
          <p><strong className="text-ink">Panel personal:</strong> solicitudes y documentos en un solo lugar.</p>
          <p><strong className="text-ink">Roles operativos:</strong> herramientas para admin, organizadores y staff.</p>
        </div>
      </section>
      <Card>
        <PageHeader title={title} description={description} />
        {children}
      </Card>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation({
    mutationFn: () => authApi.login(username, password),
    onSuccess(response) {
      setUser(response.user);
      const from = (location.state as { from?: string } | null)?.from ?? '/app';
      navigate(from);
    },
  });

  return (
    <AuthShell title="Iniciar sesion" description="Accede a tus herramientas y documentos.">
      {mutation.error ? <Alert tone="error">{mutation.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <Field label="Email" type="email" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="email" required />
        <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Entrando...' : 'Entrar'}</Button>
      </form>
      <Link to="/registro"><SecondaryButton className="mt-3 w-full">Crear cuenta</SecondaryButton></Link>
    </AuthShell>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const mutation = useMutation({
    mutationFn: () => authApi.register(form),
    onSuccess: () => navigate('/login'),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = emailSchema.safeParse(form.email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Email invalido');
      return;
    }
    setError('');
    mutation.mutate();
  }

  return (
    <AuthShell title="Crear cuenta" description="El rol inicial sera participante.">
      {error ? <Alert tone="error">{error}</Alert> : null}
      {mutation.error ? <Alert tone="error">{mutation.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={submit}>
        <Field label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" required />
        <Field label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required />
        <Field label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="new-password" required />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Creando...' : 'Crear cuenta'}</Button>
      </form>
      <Link to="/login"><SecondaryButton className="mt-3 w-full">Ya tengo cuenta</SecondaryButton></Link>
    </AuthShell>
  );
}
