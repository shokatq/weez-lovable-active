import { useEffect } from 'react';
import { useAuditLogger } from './useAuditLogger';
import { useAuth } from './useAuth';

export const useGlobalAuditLogger = () => {
  const { user } = useAuth();
  const { logAuditEvent } = useAuditLogger();

  useEffect(() => {
    if (!user) return;

    // Log page visits
    const logPageVisit = () => {
      logAuditEvent({
        action: 'page_visit',
        resourceType: 'navigation',
        metadata: {
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        },
        severity: 'low'
      });
    };

    // Log page visit on mount
    logPageVisit();

    // Log page visits on navigation
    const handlePopState = () => {
      logPageVisit();
    };

    window.addEventListener('popstate', handlePopState);

    // Log user interactions with important elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Log clicks on important buttons and links
      if (target.matches('button, a, [role="button"]')) {
        const elementInfo = {
          tagName: target.tagName,
          text: target.textContent?.substring(0, 50) || '',
          className: target.className
        };

        logAuditEvent({
          action: 'ui_interaction',
          resourceType: 'interface',
          metadata: {
            elementInfo,
            page: window.location.pathname,
            timestamp: new Date().toISOString()
          },
          severity: 'low'
        });
      }
    };

    document.addEventListener('click', handleClick);

    // Log errors
    const handleError = (event: ErrorEvent) => {
      logAuditEvent({
        action: 'client_error',
        resourceType: 'application',
        metadata: {
          error: event.error?.toString() || 'Unknown error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        severity: 'high'
      });
    };

    window.addEventListener('error', handleError);

    // Log unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logAuditEvent({
        action: 'unhandled_promise_rejection',
        resourceType: 'application',
        metadata: {
          reason: event.reason?.toString() || 'Unknown rejection',
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        severity: 'high'
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [user, logAuditEvent]);

  return {
    logCustomEvent: (action: string, resourceType: string, metadata?: any, severity?: 'low' | 'medium' | 'high' | 'critical') => {
      logAuditEvent({
        action,
        resourceType,
        metadata: {
          ...metadata,
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        severity: severity || 'medium'
      });
    }
  };
};