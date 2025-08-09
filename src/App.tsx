
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkspaceNew from "./pages/WorkspaceNew";
import ChatInterface from "./components/ChatInterface";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeSignup from "./pages/EmployeeSignup";
import AcceptInvitation from "./pages/AcceptInvitation";
import Audit from "./pages/Audit";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import { useGlobalAuditLogger } from "./hooks/useGlobalAuditLogger";

const queryClient = new QueryClient();

const AppContent = () => {
  useGlobalAuditLogger(); // Global audit logging
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin','team_lead']}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        } />
        <Route path="/employee-dashboard" element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['employee','viewer']}>
              <EmployeeDashboard />
            </RoleGuard>
          </ProtectedRoute>
        } />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/employee-signup" element={<EmployeeSignup />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatInterface />
          </ProtectedRoute>
        } />
        <Route path="/workspace" element={
          <ProtectedRoute>
            <WorkspaceNew />
          </ProtectedRoute>
        } />
        <Route path="/audit" element={
          <ProtectedRoute>
            <Audit />
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  // Force dark mode globally
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    // Ensure dark theme persists
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
