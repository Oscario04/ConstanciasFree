import type {
  ApiMessage,
  AttendanceRecord,
  DashboardStats,
  DocumentRecord,
  DocumentType,
  Event,
  EventListResponse,
  EventStatus,
  LoginResponse,
  ParticipationRequest,
  RequestStatus,
  User,
  UserStatus,
  VerificationResult,
} from '../../types/domain';
import { apiRequest, csvUrl, pdfUrl, storeLoginSession } from './client';

export const authApi = {
  async login(username: string, password: string) {
    const body = new URLSearchParams({ username, password });
    const response = await apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    storeLoginSession(response);
    return response;
  },
  register(data: { name: string; email: string; password: string; role?: string }) {
    return apiRequest<ApiMessage>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: data.role ?? 'attendee' }),
    });
  },
};

export const usersApi = {
  me: () => apiRequest<User>('/api/users/me'),
  updateMe: (data: Partial<User>) => apiRequest<ApiMessage>('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  list: () => apiRequest<User[]>('/api/users/'),
  updateStatus: (userId: string, status: UserStatus) => apiRequest<ApiMessage>(`/api/users/${userId}/status?status=${status}`, { method: 'PATCH' }),
};

export const eventsApi = {
  list: (params: { status?: EventStatus; skip?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    query.set('skip', String(params.skip ?? 0));
    query.set('limit', String(params.limit ?? 20));
    return apiRequest<EventListResponse>(`/api/events/?${query.toString()}`);
  },
  get: (eventId: string) => apiRequest<Event>(`/api/events/${eventId}`),
  create: (data: Partial<Event>) => apiRequest<{ id: string; message: string }>('/api/events/', { method: 'POST', body: JSON.stringify(data) }),
  update: (eventId: string, data: Partial<Event>) => apiRequest<ApiMessage>(`/api/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  archive: (eventId: string) => apiRequest<ApiMessage>(`/api/events/${eventId}`, { method: 'DELETE' }),
};

export const requestsApi = {
  create: (data: { event_id: string; requested_role?: string; message?: string }) => apiRequest<{ id: string; message: string }>('/api/requests/', { method: 'POST', body: JSON.stringify(data) }),
  mine: () => apiRequest<ParticipationRequest[]>('/api/requests/me'),
  byEvent: (eventId: string, status?: RequestStatus) => apiRequest<ParticipationRequest[]>(`/api/requests/event/${eventId}${status ? `?status=${status}` : ''}`),
  get: (requestId: string) => apiRequest<ParticipationRequest>(`/api/requests/${requestId}`),
  review: (requestId: string, data: { status: Extract<RequestStatus, 'approved' | 'rejected'>; admin_message?: string }) =>
    apiRequest<ApiMessage>(`/api/requests/${requestId}/review`, { method: 'PATCH', body: JSON.stringify(data) }),
  cancel: (requestId: string) => apiRequest<ApiMessage>(`/api/requests/${requestId}`, { method: 'DELETE' }),
};

export const attendanceApi = {
  checkIn: (data: { user_id: string; event_id: string; session_id?: string; method?: string }) => apiRequest<{ id: string; message: string }>('/api/attendance/check-in', { method: 'POST', body: JSON.stringify(data) }),
  checkOut: (attendanceId: string) => apiRequest<ApiMessage>(`/api/attendance/check-out/${attendanceId}`, { method: 'POST' }),
  byEvent: (eventId: string) => apiRequest<AttendanceRecord[]>(`/api/attendance/event/${eventId}`),
  createQr: (eventId: string, userId: string) => apiRequest<{ token: string; qr_url: string }>(`/api/attendance/qr/${eventId}/${userId}`),
  scanQr: (token: string) => apiRequest<{ id: string; message: string }>(`/api/attendance/qr-scan/${token}`, { method: 'POST' }),
};

export const documentsApi = {
  issue: (eventId: string, userId: string, docType: DocumentType = 'constancia') =>
    apiRequest<{ id: string; verification_code: string; public_url: string; pdf_url: string; message: string }>(`/api/documents/issue?event_id=${eventId}&user_id=${userId}&doc_type=${docType}`, { method: 'POST' }),
  verify: (code: string) => apiRequest<VerificationResult>(`/api/documents/verify/${code}`),
  downloadUrl: pdfUrl,
  mine: () => apiRequest<DocumentRecord[]>('/api/documents/me'),
  byEvent: (eventId: string) => apiRequest<DocumentRecord[]>(`/api/documents/event/${eventId}`),
  issueBatch: (eventId: string, docType: DocumentType = 'constancia') => apiRequest<{ issued: number; skipped: number; errors: unknown[]; message: string }>(`/api/documents/issue-batch/${eventId}?doc_type=${docType}`, { method: 'POST' }),
  revoke: (docId: string, reason: string) => apiRequest<ApiMessage>(`/api/documents/${docId}/revoke?reason=${encodeURIComponent(reason)}`, { method: 'PATCH' }),
};

export const statsApi = {
  dashboard: () => apiRequest<DashboardStats>('/api/stats/dashboard'),
  eventStats: (eventId: string) => apiRequest<DashboardStats>(`/api/stats/event/${eventId}`),
  attendanceCsvPath: (eventId: string) => csvUrl(`/api/stats/event/${eventId}/export/attendance`),
  documentsCsvPath: (eventId: string) => csvUrl(`/api/stats/event/${eventId}/export/documents`),
};

export const adminApi = {
  getConfig: () => apiRequest<Record<string, unknown>>('/api/admin/config'),
  updateConfig: (data: Record<string, unknown>) => apiRequest<ApiMessage>('/api/admin/config', { method: 'PATCH', body: JSON.stringify(data) }),
};
