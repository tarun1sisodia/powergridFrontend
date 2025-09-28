export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CHAT: '/chat',
  TICKET_HISTORY: '/tickets',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TICKETS: '/admin/tickets',
  ADMIN_KB: '/admin/knowledge-base',
  ADMIN_TEAMS: '/admin/teams',
  ADMIN_ALERTS: '/admin/alerts',
} as const;

export const TICKET_STATUSES = [
  { value: 'open', label: 'Open', variant: 'destructive' },
  { value: 'in_progress', label: 'In Progress', variant: 'warning' },
  { value: 'resolved', label: 'Resolved', variant: 'success' },
  { value: 'closed', label: 'Closed', variant: 'secondary' },
] as const;

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low', variant: 'secondary' },
  { value: 'medium', label: 'Medium', variant: 'default' },
  { value: 'high', label: 'High', variant: 'warning' },
  { value: 'critical', label: 'Critical', variant: 'destructive' },
] as const;

export const CATEGORIES = [
  'Hardware Issues',
  'Software Problems',
  'Network Connectivity',
  'Email & Communication',
  'Security & Access',
  'Printer & Peripherals',
  'Application Support',
  'Data Recovery',
  'System Performance',
  'Other',
] as const;

export const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'agent', label: 'Agent' },
  { value: 'admin', label: 'Administrator' },
] as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'powersupport_auth_token',
  DRAFT_MESSAGE: 'powersupport_draft_message',
  THEME: 'powersupport_theme',
} as const;

export const SAMPLE_CREDENTIALS = {
  ADMIN: {
    email: 'admin@powergrid.gov.in',
    password: 'admin123',
  },
  USER: {
    email: 'user@powergrid.gov.in',
    password: 'user123',
  },
  AGENT: {
    email: 'agent@powergrid.gov.in',
    password: 'agent123',
  },
} as const;