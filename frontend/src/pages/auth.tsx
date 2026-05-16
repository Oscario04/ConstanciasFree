import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Alert, Button, Card, Field, PageHeader, SecondaryButton } from '../components/ui';
import { authApi } from '../lib/api/modules';
import { useAuth } from '../lib/auth/AuthContext';

const emailSchema = z.string().email('Email invalido');

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
    <Card className="mx-auto max-w-md">
      <PageHeader title="Inicio de sesion" description="Accede a solicitudes, documentos y herramientas operativas." />
      {mutation.error ? <Alert tone="error">{mutation.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>
        <Field label="Email" value={username} onChange={(event) => setUsername(event.target.value)} />
        <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Entrando...' : 'Entrar'}</Button>
      </form>
      <Link to="/registro"><SecondaryButton className="mt-3 w-full">Crear cuenta</SecondaryButton></Link>
    </Card>
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
    <Card className="mx-auto max-w-md">
      <PageHeader title="Registro de usuario" description="El rol inicial sera attendee para participantes." />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {mutation.error ? <Alert tone="error">{mutation.error.message}</Alert> : null}
      <form className="mt-4 grid gap-4" onSubmit={submit}>
        <Field label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Field label="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Field label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Creando...' : 'Crear cuenta'}</Button>
      </form>
    </Card>
  );
}

