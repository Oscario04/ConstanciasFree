import { Award, CalendarDays, FileCheck, LayoutDashboard, LogOut, ScanLine, Settings, Shield, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { Button } from './ui';
import type { LucideIcon } from 'lucide-react';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${isActive ? 'bg-primary text-white' : 'text-ink hover:bg-surface-container'}`;

export function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="border-b border-outline-soft bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 md:px-12">
          <NavLink to="/" className="text-lg font-bold text-primary">ConstanciasFree</NavLink>
          <nav className="flex items-center gap-2">
            <NavLink className={navClass} to="/eventos">Eventos</NavLink>
            <NavLink className={navClass} to="/verificar">Verificar</NavLink>
            {user ? <Button onClick={() => navigate('/app')}>Mi panel</Button> : <Button onClick={() => navigate('/login')}>Entrar</Button>}
            {user ? <button className="text-sm font-semibold text-muted" onClick={logout}>Salir</button> : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-12"><Outlet /></main>
    </div>
  );
}

function AppChrome({ mode }: { mode: 'app' | 'admin' | 'staff' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links: Array<[string, string, LucideIcon]> = mode === 'admin'
    ? [
        ['/admin', 'Dashboard', LayoutDashboard],
        ['/admin/eventos', 'Eventos', CalendarDays],
        ['/admin/usuarios', 'Usuarios', Users],
        ['/admin/configuracion', 'Config', Settings],
      ]
    : mode === 'staff'
      ? [['/staff/asistencia', 'Asistencia', ScanLine]]
      : [
          ['/app', 'Resumen', LayoutDashboard],
          ['/app/solicitudes', 'Solicitudes', FileCheck],
          ['/app/documentos', 'Documentos', Award],
          ['/app/perfil', 'Perfil', Users],
        ];

  return (
    <div className="min-h-screen bg-background text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-outline-soft bg-white p-4 md:block">
        <div className="mb-8 flex items-center gap-2 text-lg font-bold text-primary"><Shield className="h-5 w-5" />ConstanciasFree</div>
        <nav className="grid gap-1">
          {links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/admin' || to === '/app'} className={navClass}><Icon className="h-4 w-4" />{label}</NavLink>)}
          {user?.role === 'admin' || user?.role === 'organizer' ? <NavLink to="/admin" className={navClass}><Shield className="h-4 w-4" />Admin</NavLink> : null}
          {user?.role === 'staff' || user?.role === 'admin' || user?.role === 'organizer' ? <NavLink to="/staff/asistencia" className={navClass}><ScanLine className="h-4 w-4" />Staff</NavLink> : null}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-outline-soft bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <div className="text-sm text-muted">{user?.name ?? 'Sesion activa'} · {user?.role}</div>
            <Button className="h-9" onClick={() => { logout(); navigate('/login'); }}><LogOut className="h-4 w-4" />Salir</Button>
          </div>
        </header>
        <main className="px-4 py-8 md:px-8"><Outlet /></main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return <AppChrome mode="app" />;
}

export function AdminLayout() {
  return <AppChrome mode="admin" />;
}

export function StaffLayout() {
  return <AppChrome mode="staff" />;
}
