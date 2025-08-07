// Template Enhancement Utilities
// Ensures all templates meet ATS-compatibility, print-friendly, mobile responsive, and brand consistency standards

import type { Template } from '@/lib/types/template';

/**
 * ATS-Compatible Design Standards
 * - Simple, clean layouts without complex graphics
 * - Standard section ordering (Contact, Summary, Experience, Education, Skills)
 * - Readable fonts and appropriate font sizes
 * - Proper heading hierarchy
 * - No tables or complex layouts that ATS can't parse
 * - Standard date formats
 * - Clear section divisions
 */
export const atsCompatibilityStandards = {
  // Font requirements
  fonts: {
    acceptable: [
      'Times New Roman, serif',
      'Arial, sans-serif', 
      'Helvetica, sans-serif',
      'Calibri, sans-serif',
      'Georgia, serif',
      'system-ui, -apple-system, sans-serif'
    ],
    minSize: '9pt',
    maxSize: '14pt',
    lineHeight: { min: 1.2, max: 1.6 }
  },
  
  // Layout requirements
  layout: {
    maxColumns: 2, // ATS can handle up to 2 columns
    margins: { min: '0.5in', max: '1in' },
    spacing: 'normal', // Avoid too tight or too loose spacing
    sections: ['contact', 'summary', 'experience', 'education', 'skills'] // Standard order
  },
  
  // Content requirements
  content: {
    dateFormat: 'MM/YYYY', // Standard format
    bulletPoints: ['•', '-', '■'], // ATS-friendly bullets
    avoidGraphics: true, // No images, charts, or complex graphics
    textBased: true // All content should be text-based
  }
};

/**
 * Print-Friendly Design Standards
 * - Proper page breaks and margins
 * - High contrast colors that work in B&W
 * - Readable font sizes when printed
 * - No background colors or images that waste ink
 * - Standard paper size compatibility (8.5" x 11")
 */
export const printFriendlyStandards = {
  colors: {
    // High contrast ratios for readability
    textContrast: 4.5, // WCAG AA standard
    backgroundColors: 'white', // White backgrounds for printing
    inkSaving: true // Avoid heavy backgrounds
  },
  
  layout: {
    pageSize: { width: '8.5in', height: '11in' },
    margins: { min: '0.5in', recommended: '0.75in' },
    pageBreaks: 'avoid-inside', // Avoid breaking sections across pages
    fontSize: { min: '9pt', recommended: '10pt' }
  },
  
  graphics: {
    vectorBased: true, // SVG icons scale better
    highContrast: true,
    noPhotos: true // Avoid photos that don't print well
  }
};

/**
 * Mobile Responsive Design Standards
 * - Flexible layouts that work on small screens
 * - Touch-friendly interface elements
 * - Readable font sizes on mobile
 * - Proper scaling and zoom behavior
 * - Single-column layouts for narrow screens
 */
export const mobileResponsiveStandards = {
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  },
  
  layout: {
    flexibleColumns: true, // Stack columns on mobile
    touchTargets: { minSize: '44px' }, // iOS HIG recommendation
    scrolling: 'vertical', // Avoid horizontal scrolling
    zoomable: true // Allow pinch-to-zoom
  },
  
  typography: {
    scalable: true,
    minMobileSize: '14px', // Minimum readable size on mobile
    lineHeight: { mobile: 1.4, desktop: 1.2 }
  }
};

/**
 * Brand Consistency Standards
 * - LaunchCV mission-themed colors and typography
 * - Consistent use of rocket/launch metaphors
 * - Professional appearance with launch aesthetic
 * - Cohesive visual identity across all templates
 */
export const brandConsistencyStandards = {
  colors: {
    primary: '#2563eb', // Launch Blue
    accent: '#f97316', // Rocket Orange
    professional: ['#2c3e50', '#34495e', '#1a202c'], // Professional variants
    backgrounds: ['#ffffff', '#f8f9fa', '#f7fafc'] // Clean backgrounds
  },
  
  typography: {
    personality: 'professional', // Professional but approachable
    hierarchy: 'clear', // Clear heading structure
    consistency: 'maintained' // Consistent across templates
  },
  
  terminology: {
    missionThemed: false, // Templates should be professional, not overly themed
    professional: true, // Use standard resume terminology
    approachable: true // Friendly but professional tone
  }
};

/**
 * Validates if a template meets ATS compatibility standards
 */
export const validateATSCompatibility = (template: Template): boolean => {
  const { typography, layout, colorScheme } = template;
  
  // Check font compatibility
  const fontAcceptable = atsCompatibilityStandards.fonts.acceptable.some(acceptableFont =>
    typography.body.fontFamily.toLowerCase().includes(acceptableFont.toLowerCase().split(',')[0])
  );
  
  // Check layout simplicity
  const layoutSimple = layout.columns <= atsCompatibilityStandards.layout.maxColumns;
  
  // Check color contrast (high contrast for ATS parsing)
  const hasHighContrast = colorScheme.text.primary !== colorScheme.background.primary;
  
  return fontAcceptable && layoutSimple && hasHighContrast;
};

/**
 * Validates if a template meets print-friendly standards
 */
export const validatePrintFriendly = (template: Template): boolean => {
  const { colorScheme, typography, layout } = template;
  
  // Check for ink-saving design
  const inkSaving = colorScheme.background.primary === '#ffffff' || 
                   colorScheme.background.primary === '#fff';
  
  // Check readable font size
  const fontSizeGood = parseInt(typography.body.fontSize) >= 9;
  
  // Check proper margins
  const marginsGood = layout.margins.top !== '0' && layout.margins.bottom !== '0';
  
  return inkSaving && fontSizeGood && marginsGood;
};

/**
 * Validates if a template meets mobile responsive standards
 */
export const validateMobileResponsive = (template: Template): boolean => {
  // All our templates use Tailwind responsive classes and flexible layouts
  // This is more of a implementation check
  const hasFlexibleLayout = template.layout.spacing !== 'compact'; // Allows for better mobile spacing
  const hasReadableSize = parseInt(template.typography.body.fontSize) >= 10;
  
  return hasFlexibleLayout && hasReadableSize;
};

/**
 * Validates if a template meets brand consistency standards
 */
export const validateBrandConsistency = (template: Template): boolean => {
  const { colorScheme, typography } = template;
  
  // Check if colors are professional
  const professionalColors = [
    colorScheme.text.primary,
    colorScheme.text.secondary,
    colorScheme.primary,
    colorScheme.secondary
  ].every(color => color.match(/^#[0-9a-f]{6}$/i)); // Valid hex colors
  
  // Check typography consistency
  const consistentTypography = typography.body.fontFamily.length > 0 &&
                              typography.headings.fontFamily.length > 0;
  
  return professionalColors && consistentTypography;
};

/**
 * Comprehensive template validation
 */
export const validateTemplate = (template: Template) => {
  return {
    atsCompatible: validateATSCompatibility(template),
    printFriendly: validatePrintFriendly(template),
    mobileResponsive: validateMobileResponsive(template),
    brandConsistent: validateBrandConsistency(template),
    overall: validateATSCompatibility(template) && 
             validatePrintFriendly(template) && 
             validateMobileResponsive(template) && 
             validateBrandConsistency(template)
  };
};

/**
 * Template enhancement recommendations
 */
export const getTemplateRecommendations = (template: Template) => {
  const validation = validateTemplate(template);
  const recommendations: string[] = [];
  
  if (!validation.atsCompatible) {
    recommendations.push('Consider using a more ATS-friendly font and simpler layout');
  }
  
  if (!validation.printFriendly) {
    recommendations.push('Use white backgrounds and ensure sufficient contrast for printing');
  }
  
  if (!validation.mobileResponsive) {
    recommendations.push('Implement responsive design with flexible layouts');
  }
  
  if (!validation.brandConsistent) {
    recommendations.push('Ensure consistent use of professional colors and typography');
  }
  
  return recommendations;
};

export default {
  atsCompatibilityStandards,
  printFriendlyStandards,
  mobileResponsiveStandards,
  brandConsistencyStandards,
  validateTemplate,
  getTemplateRecommendations
};