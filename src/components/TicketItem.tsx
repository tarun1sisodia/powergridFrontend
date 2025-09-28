import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, User, RefreshCw } from 'lucide-react';
import type { ITicket } from '@/types';
import { formatRelativeDate, getStatusColor, getPriorityColor, truncateText } from '@/lib/utils';

interface TicketItemProps {
  ticket: ITicket;
  onReopen?: (ticketId: string) => void;
  showActions?: boolean;
}

export const TicketItem = ({ ticket, onReopen, showActions = true }: TicketItemProps) => {
  const statusVariant = getStatusColor(ticket.status);
  const priorityVariant = getPriorityColor(ticket.priority);

  return (
    <Card className="transition-fast hover:shadow-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link 
              to={`/tickets/${ticket.id}`}
              className="text-base font-medium text-foreground hover:text-primary transition-fast"
            >
              {ticket.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {truncateText(ticket.description, 120)}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={statusVariant as any} className="text-xs">
              {ticket.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant={priorityVariant as any} size="sm">
              {ticket.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeDate(ticket.createdAt)}</span>
            </div>
            {ticket.assignedAgent && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Assigned to {ticket.assignedAgent.name}</span>
              </div>
            )}
            <div className="text-xs">
              <span className="font-medium">#{ticket.id.slice(-6)}</span>
            </div>
          </div>
          
          {showActions && ticket.status === 'resolved' && onReopen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReopen(ticket.id)}
              className="h-7 px-2 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reopen
            </Button>
          )}
        </div>
        
        {ticket.category && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {ticket.category}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};