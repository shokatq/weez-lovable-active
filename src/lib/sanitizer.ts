/**
 * Enhanced CSS Sanitizer utility for preventing XSS attacks
 * Only allows safe CSS properties and values for chart styling with expanded security
 */

interface CSSRule {
  selector: string;
  declarations: string[];
}

/**
 * Allowlist of safe CSS properties for chart styling - Enhanced with additional security
 */
const ALLOWED_CSS_PROPERTIES = new Set([
  // Layout properties
  'display', 'position', 'top', 'right', 'bottom', 'left',
  'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  
  // Color and background properties
  'color', 'background-color', 'background', 'opacity',
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'border-color',
  
  // Typography
  'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
  
  // Border and visual properties
  'border', 'border-radius', 'box-shadow',
  
  // Chart-specific variables
  '--color-'
]);

// Enhanced dangerous patterns that should be blocked
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /expression\s*\(/gi,
  /url\s*\(\s*["']?\s*javascript:/gi,
  /url\s*\(\s*["']?\s*data:/gi,
  /import\s/gi,
  /@import/gi,
  /behavior\s*:/gi,
  /binding\s*:/gi,
  /mozbinding/gi,
  /-moz-binding/gi,
  /<script/gi,
  /onload/gi,
  /onclick/gi,
  /onerror/gi,
  /eval\s*\(/gi
];

/**
 * Enhanced sanitizes CSS content to prevent XSS attacks with additional security measures
 * @param cssContent - Raw CSS content to sanitize
 * @returns Sanitized CSS content safe for injection
 */
export function sanitizeCSS(cssContent: string): string {
  if (!cssContent || typeof cssContent !== 'string') {
    return '';
  }

  // Check for dangerous patterns first
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(cssContent)) {
      console.warn('Dangerous CSS pattern detected, content blocked');
      return '';
    }
  }

  // Additional sanitization for common attack vectors
  let sanitized = cssContent
    // Remove comments that could hide malicious content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove dangerous patterns
    .replace(/javascript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(\s*["']?\s*javascript:/gi, 'url(')
    .replace(/url\s*\(\s*["']?\s*data:/gi, 'url(')
    .replace(/import\s/gi, '')
    .replace(/@import/gi, '')
    // Remove HTML-like tags that shouldn't be in CSS
    .replace(/<[^>]*>/g, '');

  try {
    // Parse and validate CSS rules
    const rules = parseCSSRules(sanitized);
    const validRules = rules.filter(rule => isValidCSSRule(rule));

    return validRules
      .map(rule => `${rule.selector} {\n${rule.declarations.join('\n')}\n}`)
      .join('\n');
  } catch (error) {
    console.warn('CSS parsing error:', error);
    return '';
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param htmlContent Raw HTML content from user input
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(htmlContent: string): string {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  // Basic HTML sanitization - remove script tags and dangerous attributes
  return htmlContent
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Parse CSS content into rules
 */
function parseCSSRules(css: string): CSSRule[] {
  const rules: CSSRule[] = [];
  const rulePattern = /([^{]+)\{([^}]+)\}/g;
  let match;

  while ((match = rulePattern.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarationsText = match[2].trim();
    
    const declarations = declarationsText
      .split(';')
      .map(decl => decl.trim())
      .filter(decl => decl.length > 0);

    rules.push({ selector, declarations });
  }

  return rules;
}

/**
 * Validate a CSS rule for safety
 */
function isValidCSSRule(rule: CSSRule): boolean {
  // Only allow specific selectors for chart components
  if (!rule.selector.includes('[data-chart=') && 
      !rule.selector.includes('.dark') && 
      rule.selector.trim() !== '') {
    return false;
  }

  // Validate all declarations
  return rule.declarations.every(isValidCSSDeclaration);
}

/**
 * Validate a CSS declaration for safety with enhanced security
 */
function isValidCSSDeclaration(declaration: string): boolean {
  const colonIndex = declaration.indexOf(':');
  if (colonIndex === -1) return false;

  const property = declaration.substring(0, colonIndex).trim();
  const value = declaration.substring(colonIndex + 1).trim();

  // Check if property is allowed
  const isAllowedProperty = ALLOWED_CSS_PROPERTIES.has(property) ||
    Array.from(ALLOWED_CSS_PROPERTIES).some(allowed => 
      property.startsWith(allowed)
    );

  if (!isAllowedProperty) return false;

  // Enhanced value validation - no functions or dangerous content
  const dangerousValuePatterns = [
    /javascript:/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import/i,
    /@/,
    /</,
    />/,
    /script/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i
  ];

  return !dangerousValuePatterns.some(pattern => pattern.test(value)) && value.length <= 200;
}