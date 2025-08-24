/**
 * CSS Sanitizer utility for preventing XSS attacks
 * Only allows safe CSS properties and values for chart styling
 */

interface CSSRule {
  selector: string;
  declarations: string[];
}

/**
 * Allowed CSS properties for chart styling
 */
const ALLOWED_CSS_PROPERTIES = new Set([
  '--color-',
  'color',
  'background-color',
  'border-color',
  'fill',
  'stroke'
]);

/**
 * Sanitizes CSS content to prevent XSS attacks
 * @param cssContent - Raw CSS content to sanitize
 * @returns Sanitized CSS content safe for injection
 */
export function sanitizeCSS(cssContent: string): string {
  if (!cssContent || typeof cssContent !== 'string') {
    return '';
  }

  // Remove potentially dangerous content
  const dangerous = [
    /javascript:/gi,
    /expression\s*\(/gi,
    /import\s+/gi,
    /@import/gi,
    /url\s*\(/gi,
    /behavior\s*:/gi,
    /-moz-binding/gi,
    /eval\s*\(/gi,
    /script/gi,
    /onload/gi,
    /onclick/gi,
    /onerror/gi
  ];

  let sanitized = cssContent;
  
  // Remove dangerous patterns
  for (const pattern of dangerous) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Parse and validate CSS rules
  const rules = parseCSSRules(sanitized);
  const validRules = rules.filter(rule => isValidCSSRule(rule));

  return validRules
    .map(rule => `${rule.selector} {\n${rule.declarations.join('\n')}\n}`)
    .join('\n');
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
 * Validate a CSS declaration for safety
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

  // Validate value (basic validation - no functions or dangerous content)
  const dangerousValuePatterns = [
    /javascript:/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import/i,
    /@/,
    /</,
    />/,
    /script/i
  ];

  return !dangerousValuePatterns.some(pattern => pattern.test(value));
}