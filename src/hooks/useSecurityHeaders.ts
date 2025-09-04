import { useEffect } from 'react';
import { setSecurityHeaders } from '@/lib/security';

/**
 * Hook to set security headers on component mount
 * This helps protect against XSS and other client-side attacks
 */
export function useSecurityHeaders() {
  useEffect(() => {
    // Set security headers
    setSecurityHeaders();

    // Add additional security meta tags
    const addSecurityMeta = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // X-Frame-Options equivalent
    addSecurityMeta('X-Frame-Options', 'DENY');
    
    // X-Content-Type-Options
    addSecurityMeta('X-Content-Type-Options', 'nosniff');
    
    // Referrer Policy
    addSecurityMeta('referrer', 'strict-origin-when-cross-origin');

    // Disable autocomplete for sensitive forms
    document.querySelectorAll('input[type="password"]').forEach(input => {
      (input as HTMLInputElement).autocomplete = 'new-password';
    });
  }, []);
}