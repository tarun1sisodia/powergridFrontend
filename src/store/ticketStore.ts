import { create } from 'zustand';
import { ticketsAPI } from '@/lib/api';
import type { ITicketStore, ITicket } from '@/types';

export const useTicketStore = create<ITicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ticketsAPI.getAll();
      if (response.success && response.data) {
        set({ tickets: response.data, loading: false });
      } else {
        throw new Error(response.message || 'Failed to fetch tickets');
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch tickets',
        loading: false,
      });
    }
  },

  createTicket: async (ticketData: Partial<ITicket>) => {
    try {
      const response = await ticketsAPI.create(ticketData);
      if (response.success && response.data) {
        const newTicket = response.data;
        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }));
        return newTicket;
      } else {
        throw new Error(response.message || 'Failed to create ticket');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create ticket';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateTicket: async (id: string, updates: Partial<ITicket>) => {
    try {
      const response = await ticketsAPI.update(id, updates);
      if (response.success && response.data) {
        const updatedTicket = response.data;
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id ? updatedTicket : ticket
          ),
        }));
      } else {
        throw new Error(response.message || 'Failed to update ticket');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update ticket';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteTicket: async (id: string) => {
    try {
      const response = await ticketsAPI.delete(id);
      if (response.success) {
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
        }));
      } else {
        throw new Error(response.message || 'Failed to delete ticket');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete ticket';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));