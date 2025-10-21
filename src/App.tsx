
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkspaceNew from "./pages/WorkspaceNew";
import WorkspaceManagement from "./pages/WorkspaceManagement";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import SpacePage from "./pages/Space";
import ChatInterface from "./components/ChatInterface";
import Auth from "./pages/Auth";
import Blank from "./pages/Blank";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeSignup from "./pages/EmployeeSignup";
import AcceptInvitation from "./pages/AcceptInvitation";
import Audit from "./pages/Audit";
import VerificationSuccess from "./pages/VerificationSuccess";
import VerificationFailed from "./pages/VerificationFailed";
import { AuthProvider } from "./hooks/useAuth";
import { MemberProvider } from "./contexts/MemberContext";
import { useWorkspaceInitialization } from "./hooks/useWorkspaceInitialization";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";
import { useGlobalAuditLogger } from "./hooks/useGlobalAuditLogger";

const queryClient = new QueryClient();

const AppContent = () => {
  useGlobalAuditLogger();
  useWorkspaceInitialization();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Email Verification Routes */}
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-failed" element={<VerificationFailed />} />
        
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin', 'team_lead']}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        } />
        <Route path="/employee-dashboard" element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['employee', 'viewer']}>
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
        <Route path="/page/:name" element={
          <ProtectedRoute>
            <Blank />
          </ProtectedRoute>
        } />
        <Route path="/space/:spaceName" element={
          <ProtectedRoute>
            <Blank />
          </ProtectedRoute>
        } />
        <Route path="/space/id/:spaceId" element={
          <ProtectedRoute>
            <SpacePage />
          </ProtectedRoute>
        } />
        <Route path="/workspace-management" element={
          <ProtectedRoute>
            <WorkspaceManagement />
          </ProtectedRoute>
        } />
        <Route path="/workspace/:workspaceId" element={
          <ProtectedRoute>
            <WorkspaceDetail />
          </ProtectedRoute>
        } />
        <Route path="/audit" element={
          <ProtectedRoute>
            <Audit />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <MemberProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </MemberProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
