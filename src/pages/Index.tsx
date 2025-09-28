import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  MessageSquare, 
  Zap, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Bot,
  History 
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to chat
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.CHAT);
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Support',
      description: 'Get instant solutions with our advanced AI assistant trained on POWERGRID systems.',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access support anytime with our automated system that never sleeps.',
    },
    {
      icon: CheckCircle,
      title: 'Quick Resolution',
      description: 'Most common issues resolved in under 2 minutes with step-by-step guidance.',
    },
    {
      icon: Users,
      title: 'Expert Escalation',
      description: 'Complex issues automatically escalated to specialized IT teams.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            PowerSupport AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Intelligent IT helpdesk for POWERGRID employees. Get instant solutions, 
            track tickets, and connect with expert support teams.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="gradient-primary">
              <Link to={ROUTES.CHAT}>
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Chat Support
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to={ROUTES.LOGIN}>
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-elevated transition-fast">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Trusted by POWERGRID Teams
            </h2>
            <p className="text-muted-foreground">
              Supporting IT operations across India's power grid network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Issues Resolved Instantly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">&lt; 30s</div>
              <div className="text-muted-foreground">Average Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Availability</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto gradient-accent text-accent-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-accent-foreground/80">
                Join thousands of POWERGRID employees already using PowerSupport AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to={ROUTES.REGISTER}>
                    Create Account
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
                  <Link to={ROUTES.LOGIN}>
                    Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">PowerSupport AI</p>
                <p className="text-xs text-muted-foreground">POWERGRID Corporation of India Ltd.</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-fast">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-fast">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-fast">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
