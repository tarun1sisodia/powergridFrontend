import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFormPersist } from '@/hooks/useFormPersist';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Layout } from '@/components/Layout';
import { 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  CheckCircle,
  Clock,
  MessageSquare 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatRelativeDate } from '@/lib/utils';
import type { IChatMessage } from '@/types';

const chatSchema = z.object({
  message: z.string().min(1, 'Please enter your question').max(1000, 'Message too long'),
});

type ChatFormData = z.infer<typeof chatSchema>;

export default function ChatInterface() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { value: draftMessage, setValue: setDraftMessage, clearPersistedValue } = useFormPersist('chat');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: draftMessage,
    },
  });

  const messageValue = watch('message');

  // Update draft as user types
  useEffect(() => {
    setDraftMessage(messageValue || '');
  }, [messageValue, setDraftMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (data: ChatFormData) => {
    setIsLoading(true);
    
    // Add user message immediately
    const userMessage: IChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: data.message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    reset();
    clearPersistedValue();

    try {
      // Call Supabase Edge Function for AI response
      const { data: response, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: data.message }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }
      
      if (response) {
        const aiMessage: IChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.response,
          timestamp: new Date().toISOString(),
          ticketId: response.ticketId,
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        toast({
          title: 'Response received',
          description: 'AI has analyzed your query and provided a solution.',
        });
      } else {
        throw new Error('No response received from AI');
      }
    } catch (error: any) {
      // Add error message
      const errorMessage: IChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please try again or contact IT support directly.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to get response',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Support Chat</h1>
              <p className="text-sm text-muted-foreground">
                Describe your IT issue and get instant assistance
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Welcome to PowerSupport AI
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    I'm here to help you with IT issues. Describe your problem in detail, 
                    and I'll provide step-by-step solutions or escalate to our IT team if needed.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[80%] space-x-3 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-accent-foreground'
                        }`}
                      >
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message Content */}
                      <Card
                        className={`${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card'
                        }`}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
                            <p
                              className={`text-xs ${
                                message.type === 'user'
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {formatRelativeDate(message.timestamp)}
                            </p>
                            {message.ticketId && (
                              <Badge variant="outline" className="text-xs">
                                Ticket #{message.ticketId.slice(-6)}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <Card className="bg-card">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <p className="text-sm text-muted-foreground">
                            AI is analyzing your query...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-card p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-3">
            <div className="flex-1">
              <Textarea
                {...register('message')}
                placeholder="Describe your IT issue in detail..."
                className={`resize-none ${errors.message ? 'border-destructive' : ''}`}
                rows={3}
                disabled={isLoading}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !messageValue?.trim()}
              size="lg"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-success" />
                <span>Auto-save enabled</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Typical response: &lt; 30 seconds</span>
              </div>
            </div>
            <p>{messageValue?.length || 0}/1000</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}