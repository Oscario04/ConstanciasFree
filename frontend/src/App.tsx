import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout, AppLayout, PublicLayout, StaffLayout } from './components/layouts';
import { RoleRoute, AuthenticatedRoute } from './routes/guards';
import { LoginPage, RegisterPage } from './pages/auth';
import { EventDetailPage, EventsPage, HomePage, RequestEventPage, VerifyPage, VerifyResultPage } from './pages/public';
import { MyDocumentsPage, MyRequestsPage, ProfilePage, UserDashboardPage } from './pages/user';
import {
  AdminDashboardPage,
  AdminEventsPage,
  ConfigPage,
  EventAttendancePage,
  EventDocumentsPage,
  EventFormPage,
  EventRequestsPage,
  StaffAttendancePage,
  UsersPage,
} from './pages/admin';

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/eventos/:eventId" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/verificar" element={<VerifyPage />} />
        <Route path="/verificar/:code" element={<VerifyResultPage />} />
      </Route>

      <Route element={<AuthenticatedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<UserDashboardPage />} />
          <Route path="/app/perfil" element={<ProfilePage />} />
          <Route path="/app/solicitudes" element={<MyRequestsPage />} />
          <Route path="/app/documentos" element={<MyDocumentsPage />} />
          <Route path="/app/eventos/:eventId/solicitar" element={<RequestEventPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['admin', 'organizer']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/eventos" element={<AdminEventsPage />} />
          <Route path="/admin/eventos/nuevo" element={<EventFormPage />} />
          <Route path="/admin/eventos/:eventId" element={<EventFormPage />} />
          <Route path="/admin/eventos/:eventId/solicitudes" element={<EventRequestsPage />} />
          <Route path="/admin/eventos/:eventId/asistencia" element={<EventAttendancePage />} />
          <Route path="/admin/eventos/:eventId/documentos" element={<EventDocumentsPage />} />
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/admin/usuarios" element={<UsersPage />} />
            <Route path="/admin/configuracion" element={<ConfigPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['admin', 'organizer', 'staff']} />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/asistencia" element={<StaffAttendancePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

