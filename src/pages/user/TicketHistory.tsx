import { useState, useEffect } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';
import { TicketItem } from '@/components/TicketItem';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Search, 
  Filter, 
  RefreshCw,
  TicketPlus,
  AlertCircle 
} from 'lucide-react';
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@/lib/constants';
import type { ITicket } from '@/types';

export default function TicketHistory() {
  const { tickets, loading, error, fetchTickets, updateTicket } = useTickets();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTickets();
      toast({
        title: 'Refreshed',
        description: 'Ticket list has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to refresh',
        description: 'Could not update ticket list.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReopenTicket = async (ticketId: string) => {
    try {
      await updateTicket(ticketId, { status: 'open' });
      toast({
        title: 'Ticket reopened',
        description: 'Your ticket has been reopened and will be reviewed by our team.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to reopen ticket',
        description: error.message,
      });
    }
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter((ticket: ITicket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCount = (status: string) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-muted-foreground">Loading your tickets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Error Loading Tickets
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Tickets</h1>
              <p className="text-muted-foreground">
                View and manage your support requests
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button asChild>
              <a href="/chat">
                <TicketPlus className="h-4 w-4 mr-2" />
                New Ticket
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TICKET_STATUSES.map((status) => (
            <div
              key={status.value}
              className="bg-card rounded-lg p-4 border border-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{status.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {getStatusCount(status.value)}
                  </p>
                </div>
                <Badge variant={status.variant as any}>
                  {status.label}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tickets by title, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {TICKET_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {TICKET_PRIORITIES.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your filters'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              {tickets.length === 0 
                ? 'Start a conversation with our AI assistant to create your first support ticket.'
                : 'Try adjusting your search terms or filters to find the tickets you\'re looking for.'
              }
            </p>
            {tickets.length === 0 && (
              <Button asChild>
                <a href="/chat">
                  <TicketPlus className="h-4 w-4 mr-2" />
                  Start Chat
                </a>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTickets.length} of {tickets.length} tickets
              </p>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Filter className="h-3 w-3" />
                <span>Active filters: {[searchTerm, statusFilter !== 'all' ? statusFilter : '', priorityFilter !== 'all' ? priorityFilter : ''].filter(Boolean).join(', ') || 'None'}</span>
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onReopen={handleReopenTicket}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}