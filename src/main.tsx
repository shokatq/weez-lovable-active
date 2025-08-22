import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/hooks/useAuth'
import { RBACProvider } from '@/contexts/RBACContext'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Pages
import Index from "@/pages/Index";
import Intro from "@/pages/Intro";
import Demo from "@/pages/Demo";
import Auth from "@/pages/Auth";
import AuthLanding from "@/pages/AuthLanding";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import EmployeeLogin from "@/pages/EmployeeLogin";
import EmployeeSignup from "@/pages/EmployeeSignup";
import WorkspaceNew from "@/pages/WorkspaceNew";
import AcceptInvitation from "@/pages/AcceptInvitation";
import Audit from "@/pages/Audit";
import NotFound from "@/pages/NotFound";

// Components
import ChatInterface from "@/components/ChatInterface";
import EnterpriseWorkspace from "@/components/EnterpriseWorkspace";

// Query client
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/intro",
    element: <Intro />,
  },
  {
    path: "/demo",
    element: <Demo />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/auth-landing",
    element: <AuthLanding />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/employee-dashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "/employee-login",
    element: <EmployeeLogin />,
  },
  {
    path: "/employee-signup",
    element: <EmployeeSignup />,
  },
  {
    path: "/chat",
    element: <ChatInterface />,
  },
  {
    path: "/workspace-new",
    element: <WorkspaceNew />,
  },
  {
    path: "/workspace",
    element: <EnterpriseWorkspace />,
  },
  {
    path: "/accept-invitation/:invitationId",
    element: <AcceptInvitation />,
  },
  {
    path: "/audit",
    element: <Audit />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RBACProvider>
          <RouterProvider router={router} />
          <Toaster />
        </RBACProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)