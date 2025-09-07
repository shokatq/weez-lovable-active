import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;