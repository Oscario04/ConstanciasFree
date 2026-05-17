import {
  Award,
  CalendarDays,
  ChevronDown,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Settings,
  Shield,
  UserCircle,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { Button, IconButton } from './ui';
import type { LucideIcon } from 'lucide-react';

const APP_NAME = 'Constancias Claras';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-ink hover:bg-surface-container hover:text-primary'}`;

type NavItem = [string, string, LucideIcon];

function userInitial(name?: string) {
  return (name?.trim()?.[0] || 'U').toUpperCase();
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function signOut() {
    logout();
    setOpen(false);
    navigate('/login');
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded border border-outline-soft bg-white px-2 py-1.5 text-left shadow-sm transition hover:border-primary hover:bg-surface-low focus:outline-none focus:ring-2 focus:ring-primary-soft"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white ring-2 ring-primary-soft">
          {userInitial(user?.name)}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-40 truncate text-sm font-bold text-ink">{user?.name ?? 'Usuario'}</span>
          <span className="block truncate text-xs text-muted">{user?.role ?? 'sesion'}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded border border-outline-soft bg-white shadow-paper" role="menu">
          <div className="border-b border-outline-soft bg-surface-low px-3 py-3">
            <p className="truncate text-sm font-bold text-ink">{user?.name ?? 'Usuario'}</p>
            <p className="truncate text-xs text-muted">{user?.email ?? user?.role}</p>
          </div>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-surface-container"
            onClick={() => { setOpen(false); navigate('/app/perfil'); }}
            role="menuitem"
          >
            <UserCircle className="h-4 w-4 text-primary" />Perfil
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-danger transition hover:bg-red-50"
            onClick={signOut}
            role="menuitem"
          >
            <LogOut className="h-4 w-4" />Salir
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="border-b border-outline-soft bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 md:px-12">
          <NavLink to="/" className="flex min-w-0 items-center gap-2 text-lg font-bold text-primary">
            <Shield className="h-5 w-5 shrink-0" />
            <span className="truncate">{APP_NAME}</span>
          </NavLink>
          <nav className="flex items-center gap-2 overflow-x-auto">
            <NavLink className={navClass} to="/eventos">Eventos</NavLink>
            <NavLink className={navClass} to="/verificar">Verificar</NavLink>
            {user ? <Button onClick={() => navigate('/app')}>Mi panel</Button> : <Button onClick={() => navigate('/login')}>Entrar</Button>}
            {user ? <button className="text-sm font-semibold text-muted transition hover:text-primary" onClick={logout}>Salir</button> : null}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-12"><Outlet /></main>
    </div>
  );
}

function AppChrome({ mode }: { mode: 'app' | 'admin' | 'staff' }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('constancias_sidebar') === 'collapsed');
  const links: NavItem[] = useMemo(() => {
    if (mode === 'admin') {
      return [
        ['/admin', 'Panel', LayoutDashboard],
        ['/admin/eventos', 'Eventos', CalendarDays],
        ['/admin/usuarios', 'Usuarios', Users],
        ['/admin/configuracion', 'Ajustes', Settings],
      ];
    }

    if (mode === 'staff') return [['/staff/asistencia', 'Asistencia', ScanLine]];

    return [
      ['/app', 'Resumen', LayoutDashboard],
      ['/app/solicitudes', 'Solicitudes', FileCheck],
      ['/app/documentos', 'Documentos', Award],
      ['/app/perfil', 'Perfil', Users],
    ];
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('constancias_sidebar', collapsed ? 'collapsed' : 'expanded');
  }, [collapsed]);

  const sidebarWidth = collapsed ? 'md:w-20' : 'md:w-64';
  const contentPadding = collapsed ? 'md:pl-20' : 'md:pl-64';
  const headerLabel = mode === 'admin' ? 'Administracion' : mode === 'staff' ? 'Operacion staff' : 'Mi espacio';
  const areaLinks: NavItem[] = ([
    ['/app', 'Mi espacio', LayoutDashboard] as NavItem,
    ...(user?.role === 'admin' || user?.role === 'organizer' ? [['/admin', 'Admin', Shield] as NavItem] : []),
    ...(user?.role === 'staff' || user?.role === 'admin' || user?.role === 'organizer' ? [['/staff/asistencia', 'Staff', ScanLine] as NavItem] : []),
  ] as NavItem[]).filter(([to]) => {
    if (mode === 'app') return to !== '/app';
    if (mode === 'admin') return to !== '/admin';
    return to !== '/staff/asistencia';
  });

  function renderNavItem([to, label, Icon]: NavItem) {
    return (
      <NavLink
        key={to}
        to={to}
        end={to === '/admin' || to === '/app'}
        className={({ isActive }) => `${navClass({ isActive })} ${collapsed ? 'justify-center px-2' : ''}`}
        title={label}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed ? label : null}
      </NavLink>
    );
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <aside className={`fixed inset-y-0 left-0 z-20 hidden overflow-hidden border-r border-outline-soft bg-white/98 shadow-sm transition-all md:block ${sidebarWidth}`}>
        <div className="absolute inset-x-0 top-0 h-28 bg-primary" aria-hidden="true" />
        <div className="absolute inset-x-0 top-28 h-20 bg-surface-container" aria-hidden="true" />
        <div className="relative p-4">
          <div className={`mb-7 flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
            <NavLink to="/app" className="flex min-w-0 items-center gap-2 text-lg font-bold text-white" title={APP_NAME}>
              <Shield className="h-5 w-5 shrink-0" />
              {!collapsed ? <span className="truncate">{APP_NAME}</span> : null}
            </NavLink>
            {!collapsed ? <IconButton label="Contraer barra lateral" className="border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => setCollapsed(true)}><PanelLeftClose className="h-4 w-4" /></IconButton> : null}
          </div>

          {collapsed ? <IconButton label="Expandir barra lateral" className="mb-4 w-full" onClick={() => setCollapsed(false)}><PanelLeftOpen className="h-4 w-4" /></IconButton> : null}

          {!collapsed ? (
            <div className="mb-4 rounded border border-primary-soft bg-white p-3 shadow-paper">
              <p className="text-xs font-semibold uppercase text-muted">Area actual</p>
              <p className="mt-1 text-sm font-bold text-primary">{headerLabel}</p>
            </div>
          ) : null}

          <nav className="grid gap-1 rounded border border-outline-soft bg-white p-2 shadow-paper">
            {links.map(renderNavItem)}
          </nav>

          {areaLinks.length ? (
            <div className="mt-4">
              {!collapsed ? <p className="mb-2 px-1 text-xs font-semibold uppercase text-muted">Cambiar area</p> : null}
              <nav className="grid gap-1">
                {areaLinks.map(([to, label, Icon]) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 rounded border border-outline-soft bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-primary-soft ${collapsed ? 'justify-center px-2' : ''}`}
                    title={label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed ? label : null}
                  </NavLink>
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </aside>

      <div className={contentPadding}>
        <header className="sticky top-0 z-10 border-b border-outline-soft bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Menu className="h-5 w-5 shrink-0 text-primary md:hidden" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{headerLabel}</p>
                <p className="truncate text-xs text-muted">Sesion activa - {user?.role}</p>
              </div>
            </div>
            <ProfileMenu />
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
            {links.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === '/admin' || to === '/app'} className={navClass}>
                <Icon className="h-4 w-4" />{label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-[1280px] px-4 py-8 md:px-8"><Outlet /></main>
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
