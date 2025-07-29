import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star, Check, ArrowRight } from 'lucide-react';

const AuthLanding = () => {
  const { isSignedIn } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (isSignedIn) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Marketing content */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Weez AI</h1>
                <p className="text-muted-foreground">Your AI File Assistant</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground leading-tight">
                Transform how you work with files
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AI-powered file management that understands your content. Search, summarize, and interact with your documents like never before.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'AI-powered semantic search across all platforms',
                'Instant document summaries and insights',
                'Natural language file operations',
                'Enterprise-grade security and privacy'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-muted-foreground">
                Trusted by 10,000+ professionals
              </span>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  {authMode === 'signin' ? 'Welcome back' : 'Get started today'}
                </h3>
                <p className="text-muted-foreground">
                  {authMode === 'signin' 
                    ? 'Sign in to access your AI file assistant' 
                    : 'Create your account to start organizing files with AI'
                  }
                </p>
              </div>

              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={authMode === 'signin' ? 'default' : 'ghost'}
                  className="flex-1 h-9"
                  onClick={() => setAuthMode('signin')}
                >
                  Sign In
                </Button>
                <Button
                  variant={authMode === 'signup' ? 'default' : 'ghost'}
                  className="flex-1 h-9"
                  onClick={() => setAuthMode('signup')}
                >
                  Sign Up
                </Button>
              </div>

              <div className="min-h-[400px]">
                {authMode === 'signin' ? (
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                      }
                    }}
                    forceRedirectUrl="/chat"
                  />
                ) : (
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                      }
                    }}
                    forceRedirectUrl="/chat"
                  />
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;