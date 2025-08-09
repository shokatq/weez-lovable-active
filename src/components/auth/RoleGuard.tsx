import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";

interface RoleGuardProps {
  allowedRoles: Array<'admin' | 'team_lead' | 'employee' | 'viewer'>;
  children: ReactNode;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { loading, userRole } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // SEO basics per page
    if (location.pathname.includes('employee-dashboard')) {
      document.title = 'Employee Dashboard • Weez AI';
      const desc = 'Employee workspace: documents, uploads, search, and tasks.';
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', desc);
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', window.location.href);
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const role = userRole?.role;

  // If role is known and not permitted, smart-redirect based on role
  if (role && !allowedRoles.includes(role)) {
    if (role === 'admin' || role === 'team_lead') {
      navigate('/admin-dashboard', { replace: true });
      return null;
    } else {
      navigate('/employee-dashboard', { replace: true });
      return null;
    }
  }

  return <>{children}</>;
};

export default RoleGuard;
