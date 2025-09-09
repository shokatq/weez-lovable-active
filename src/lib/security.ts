// Security utilities for input validation and rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiting utility
 * @param key Unique identifier for the action (e.g., user_id + action_type)
 * @param maxAttempts Maximum number of attempts allowed
 * @param windowMs Time window in milliseconds
 * @returns true if action is allowed, false if rate limited
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First attempt or window expired
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Clear expired rate limit entries
 */
export function clearExpiredRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate team name format
 */
export function isValidTeamName(name: string): boolean {
  return name.length >= 3 && name.length <= 50 && /^[a-zA-Z0-9\s-_]+$/.test(name);
}

/**
 * Sanitize user input for display
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Content Security Policy headers - Improved security
 */
export const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' https://cdn.jsdelivr.net 'nonce-${nonce}'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://usuthdsminfqguflnzgs.supabase.co wss://usuthdsminfqguflnzgs.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ');

/**
 * Set security headers for the application
 */
export function setSecurityHeaders(): void {
  // This would typically be done on the server side
  // For client-side, we can add meta tags
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = CSP_HEADER;
  document.head.appendChild(meta);
}

/**
 * Validate file upload security
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/json'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large' };
  }

  // Check for suspicious file names
  if (/[<>:"/\\|?*]/.test(file.name)) {
    return { valid: false, error: 'Invalid file name characters' };
  }

  return { valid: true };
}

// Clean up expired rate limits every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(clearExpiredRateLimits, 5 * 60 * 1000);
}