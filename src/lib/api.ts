import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from './constants';
import type { 
  IUser, 
  ITicket, 
  IStats, 
  IKnowledgeBase, 
  IAlertRule, 
  IApiResponse,
  ILoginCredentials,
  IRegisterData
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: ILoginCredentials): Promise<IApiResponse<{ user: IUser; token: string }>> => {
    const response: AxiosResponse<IApiResponse<{ user: IUser; token: string }>> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: IRegisterData): Promise<IApiResponse<{ user: IUser; token: string }>> => {
    const response: AxiosResponse<IApiResponse<{ user: IUser; token: string }>> = await api.post('/auth/register', userData);
    return response.data;
  },

  verifyToken: async (): Promise<IApiResponse<IUser>> => {
    const response: AxiosResponse<IApiResponse<IUser>> = await api.get('/auth/verify');
    return response.data;
  },

  logout: async (): Promise<IApiResponse<null>> => {
    const response: AxiosResponse<IApiResponse<null>> = await api.post('/auth/logout');
    return response.data;
  },
};

// Tickets API
export const ticketsAPI = {
  getAll: async (): Promise<IApiResponse<ITicket[]>> => {
    const response: AxiosResponse<IApiResponse<ITicket[]>> = await api.get('/tickets');
    return response.data;
  },

  getById: async (id: string): Promise<IApiResponse<ITicket>> => {
    const response: AxiosResponse<IApiResponse<ITicket>> = await api.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (ticketData: Partial<ITicket>): Promise<IApiResponse<ITicket>> => {
    const response: AxiosResponse<IApiResponse<ITicket>> = await api.post('/tickets', ticketData);
    return response.data;
  },

  update: async (id: string, updates: Partial<ITicket>): Promise<IApiResponse<ITicket>> => {
    const response: AxiosResponse<IApiResponse<ITicket>> = await api.patch(`/tickets/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response: AxiosResponse<IApiResponse<null>> = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  submitQuery: async (query: string): Promise<IApiResponse<{ response: string; ticketId: string }>> => {
    const response: AxiosResponse<IApiResponse<{ response: string; ticketId: string }>> = await api.post('/tickets/query', { query });
    return response.data;
  },
};

// Stats API
export const statsAPI = {
  getDashboard: async (): Promise<IApiResponse<IStats>> => {
    const response: AxiosResponse<IApiResponse<IStats>> = await api.get('/stats/dashboard');
    return response.data;
  },
};

// Knowledge Base API
export const kbAPI = {
  getAll: async (): Promise<IApiResponse<IKnowledgeBase[]>> => {
    const response: AxiosResponse<IApiResponse<IKnowledgeBase[]>> = await api.get('/knowledge-base');
    return response.data;
  },

  create: async (kbData: Partial<IKnowledgeBase>): Promise<IApiResponse<IKnowledgeBase>> => {
    const response: AxiosResponse<IApiResponse<IKnowledgeBase>> = await api.post('/knowledge-base', kbData);
    return response.data;
  },

  update: async (id: string, updates: Partial<IKnowledgeBase>): Promise<IApiResponse<IKnowledgeBase>> => {
    const response: AxiosResponse<IApiResponse<IKnowledgeBase>> = await api.patch(`/knowledge-base/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response: AxiosResponse<IApiResponse<null>> = await api.delete(`/knowledge-base/${id}`);
    return response.data;
  },
};

// Alert Rules API
export const alertsAPI = {
  getAll: async (): Promise<IApiResponse<IAlertRule[]>> => {
    const response: AxiosResponse<IApiResponse<IAlertRule[]>> = await api.get('/alerts');
    return response.data;
  },

  create: async (alertData: Partial<IAlertRule>): Promise<IApiResponse<IAlertRule>> => {
    const response: AxiosResponse<IApiResponse<IAlertRule>> = await api.post('/alerts', alertData);
    return response.data;
  },

  update: async (id: string, updates: Partial<IAlertRule>): Promise<IApiResponse<IAlertRule>> => {
    const response: AxiosResponse<IApiResponse<IAlertRule>> = await api.patch(`/alerts/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response: AxiosResponse<IApiResponse<null>> = await api.delete(`/alerts/${id}`);
    return response.data;
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async (): Promise<IApiResponse<IUser[]>> => {
    const response: AxiosResponse<IApiResponse<IUser[]>> = await api.get('/users');
    return response.data;
  },

  update: async (id: string, updates: Partial<IUser>): Promise<IApiResponse<IUser>> => {
    const response: AxiosResponse<IApiResponse<IUser>> = await api.patch(`/users/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<IApiResponse<null>> => {
    const response: AxiosResponse<IApiResponse<null>> = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;