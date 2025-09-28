import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ROUTES } from "@/lib/constants";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChatInterface from "./pages/user/ChatInterface";
import TicketHistory from "./pages/user/TicketHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          
          {/* Protected User Routes */}
          <Route 
            path={ROUTES.CHAT} 
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.TICKET_HISTORY} 
            element={
              <ProtectedRoute>
                <TicketHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes - Coming Soon */}
          <Route 
            path={ROUTES.ADMIN_DASHBOARD} 
            element={
              <ProtectedRoute requireRole="admin">
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Coming Soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
