/**
 * Accessibility contrast utilities for LaunchCV
 * Implements WCAG 2.1 contrast ratio calculations and color adjustments
 */

// WCAG contrast ratio thresholds
export const CONTRAST_RATIOS = {
  NORMAL_TEXT: 4.5,
  LARGE_TEXT: 3.0,
  MINIMUM: 3.0
} as const;

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  const srgb = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function isAccessible(
  foreground: string, 
  background: string, 
  threshold: number = CONTRAST_RATIOS.NORMAL_TEXT
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= threshold;
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 + (percent / 100);
  return rgbToHex(
    Math.min(255, Math.round(rgb.r * factor)),
    Math.min(255, Math.round(rgb.g * factor)),
    Math.min(255, Math.round(rgb.b * factor))
  );
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - (percent / 100);
  return rgbToHex(
    Math.max(0, Math.round(rgb.r * factor)),
    Math.max(0, Math.round(rgb.g * factor)),
    Math.max(0, Math.round(rgb.b * factor))
  );
}

/**
 * Calculate average color from gradient stops
 */
function getAverageColor(color1: string, color2: string): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  return rgbToHex(
    Math.round((rgb1.r + rgb2.r) / 2),
    Math.round((rgb1.g + rgb2.g) / 2),
    Math.round((rgb1.b + rgb2.b) / 2)
  );
}

/**
 * Adjust gradient colors to meet accessibility requirements
 */
export function adjustGradientForContrast(
  primaryColor: string,
  secondaryColor: string,
  textColor: string,
  threshold: number = CONTRAST_RATIOS.NORMAL_TEXT
): {
  primary: string;
  secondary: string;
  needsOverlay: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
} {
  // Check contrast against average gradient color
  const averageColor = getAverageColor(primaryColor, secondaryColor);
  const currentRatio = getContrastRatio(textColor, averageColor);
  
  if (currentRatio >= threshold) {
    return {
      primary: primaryColor,
      secondary: secondaryColor,
      needsOverlay: false
    };
  }

  // Try adjusting colors first
  let adjustedPrimary = primaryColor;
  let adjustedSecondary = secondaryColor;
  
  // Determine if text is light or dark
  const textRgb = hexToRgb(textColor);
  const isLightText = textRgb && getLuminance(textRgb) > 0.5;
  
  // Adjust gradient colors
  const adjustmentPercent = 30;
  if (isLightText) {
    // Darken background for light text
    adjustedPrimary = darkenColor(primaryColor, adjustmentPercent);
    adjustedSecondary = darkenColor(secondaryColor, adjustmentPercent);
  } else {
    // Lighten background for dark text
    adjustedPrimary = lightenColor(primaryColor, adjustmentPercent);
    adjustedSecondary = lightenColor(secondaryColor, adjustmentPercent);
  }
  
  // Check if adjustment worked
  const adjustedAverage = getAverageColor(adjustedPrimary, adjustedSecondary);
  const adjustedRatio = getContrastRatio(textColor, adjustedAverage);
  
  if (adjustedRatio >= threshold) {
    return {
      primary: adjustedPrimary,
      secondary: adjustedSecondary,
      needsOverlay: false
    };
  }

  // If adjustment didn't work, use overlay
  const overlayColor = isLightText ? '#000000' : '#ffffff';
  const overlayOpacity = Math.min(0.4, (threshold - currentRatio) / threshold * 0.6);
  
  return {
    primary: primaryColor,
    secondary: secondaryColor,
    needsOverlay: true,
    overlayColor,
    overlayOpacity
  };
}

/**
 * Get accessible fallback gradient
 */
export const ACCESSIBLE_GRADIENTS = {
  light: {
    primary: '#f8fafc',
    secondary: '#e2e8f0'
  },
  dark: {
    primary: '#1e293b',
    secondary: '#334155'
  }
} as const;

/**
 * Get fallback gradient based on text color
 */
export function getAccessibleFallbackGradient(textColor: string): {
  primary: string;
  secondary: string;
} {
  const textRgb = hexToRgb(textColor);
  const isLightText = textRgb && getLuminance(textRgb) > 0.5;
  
  return isLightText ? ACCESSIBLE_GRADIENTS.dark : ACCESSIBLE_GRADIENTS.light;
}