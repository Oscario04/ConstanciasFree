export type Role = 'admin' | 'organizer' | 'speaker' | 'attendee' | 'staff';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type EventStatus = 'draft' | 'published' | 'ongoing' | 'finished' | 'archived';
export type EventType = 'conference' | 'workshop' | 'course' | 'seminar' | 'webinar';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type DocumentType = 'diploma' | 'constancia' | 'reconocimiento';
export type DocumentStatus = 'active' | 'revoked' | 'archived';
export type AttendanceMethod = 'qr' | 'manual' | 'session';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  phone?: string;
  institution?: string;
  bio?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: EventType;
  start_date: string;
  end_date: string;
  venue?: string;
  capacity: number;
  registered?: number;
  status: EventStatus;
  retention_years?: number;
}

export interface EventListResponse {
  events: Event[];
  total: number;
}

export interface ParticipationRequest {
  id: string;
  user_id: string;
  event_id: string;
  requested_role?: string;
  status: RequestStatus;
  message?: string;
  admin_message?: string;
  created_at?: string;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  event_id: string;
  document_type: DocumentType;
  status: DocumentStatus;
  verification_code: string;
  public_url?: string;
  pdf_url?: string;
  issued_at?: string;
  expires_at?: string;
  metadata?: Record<string, string>;
}

export interface VerificationResult {
  valid: boolean;
  document_type: DocumentType;
  issued_at: string;
  expires_at?: string;
  metadata: Record<string, string>;
  pdf_url?: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  event_id: string;
  session_id?: string;
  check_in: string;
  check_out?: string | null;
  method: AttendanceMethod;
}

export interface DashboardStats {
  [key: string]: unknown;
}

export interface ApiMessage {
  message: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

