import { useEffect } from 'react';
import { useTicketStore } from '@/store/ticketStore';

export const useTickets = () => {
  const ticketStore = useTicketStore();

  useEffect(() => {
    // Fetch tickets on mount
    ticketStore.fetchTickets();
  }, []);

  return {
    tickets: ticketStore.tickets,
    loading: ticketStore.loading,
    error: ticketStore.error,
    fetchTickets: ticketStore.fetchTickets,
    createTicket: ticketStore.createTicket,
    updateTicket: ticketStore.updateTicket,
    deleteTicket: ticketStore.deleteTicket,
  };
};