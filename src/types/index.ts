export interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'agent';
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  userId: string;
  assignedTo?: string;
  aiResponse?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  user?: IUser;
  assignedAgent?: IUser;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface IKnowledgeBase {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  author?: IUser;
}

export interface IAlertRule {
  id: string;
  name: string;
  condition: {
    field: 'priority' | 'category' | 'status';
    operator: 'equals' | 'contains' | 'greater_than';
    value: string;
  };
  action: {
    type: 'email' | 'sms' | 'slack';
    recipients: string[];
  };
  isActive: boolean;
  createdAt: string;
}

export interface IStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number; // in hours
  topCategory: string;
  todayTickets: number;
  thisWeekTickets: number;
}

export interface IChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  ticketId?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  name: string;
  department?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IAuthStore {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: ILoginCredentials) => Promise<void>;
  register: (data: IRegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export interface ITicketStore {
  tickets: ITicket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  createTicket: (ticket: Partial<ITicket>) => Promise<ITicket>;
  updateTicket: (id: string, updates: Partial<ITicket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}