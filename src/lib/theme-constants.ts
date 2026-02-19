/**
 * Shared theme constants for consistent styling across the application
 * 
 * WCAG AA Compliance Notes (4.5:1 contrast ratio for normal text):
 * - On dark backgrounds (#111827, #1f2937): Use gray[300], gray[400], or white with min 0.87 opacity
 * - Avoid: gray[500], gray[600] on dark backgrounds - insufficient contrast
 * - For colored text/borders: Use brighter shades or higher opacity values
 */

export const COLORS = {
  // Primary Purple Shades
  purple: {
    50: 'rgba(192, 132, 252, 0.05)',
    100: 'rgba(192, 132, 252, 0.1)',
    200: 'rgba(192, 132, 252, 0.2)',
    300: 'rgba(192, 132, 252, 0.3)',
    400: 'rgba(192, 132, 252, 0.4)',
    500: 'rgba(192, 132, 252, 0.5)',
    600: 'rgba(192, 132, 252, 0.6)',
    800: 'rgba(192, 132, 252, 0.8)',
    solid: '#c084fc',
  },
  
  // Secondary Purple (darker)
  purpleDark: {
    200: 'rgba(168, 85, 247, 0.2)',
    400: 'rgba(168, 85, 247, 0.4)',
    500: 'rgba(168, 85, 247, 0.5)',
    solid: '#a855f7',
    solidHover: '#9333ea',
  },
  
  // Pink Shades
  pink: {
    100: 'rgba(244, 114, 182, 0.1)',
    200: 'rgba(244, 114, 182, 0.2)',
    400: 'rgba(244, 114, 182, 0.4)',
    500: 'rgba(244, 114, 182, 0.5)',
    solid: '#f472b6',
  },
  
  // Gray Shades (WCAG AA compliant on dark backgrounds from 300 and up)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db', // ✓ WCAG AA on dark backgrounds
    400: '#9ca3af', // ✓ WCAG AA on dark backgrounds
    500: '#6b7280', // ⚠ Low contrast on dark backgrounds
    600: '#4b5563', // ⚠ Low contrast on dark backgrounds
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // WCAG AA compliant text colors for dark backgrounds
  text: {
    primary: 'rgba(255, 255, 255, 0.95)',    // High contrast
    secondary: 'rgba(255, 255, 255, 0.87)',  // Standard text
    tertiary: 'rgba(255, 255, 255, 0.8)',    // Minimum for WCAG AA
    disabled: 'rgba(255, 255, 255, 0.5)',    // Not for important text
  },
  
  // Accessible blue shades for links/buttons on dark backgrounds
  blue: {
    light: '#a5b4fc',   // ✓ WCAG AA compliant
    medium: '#8b9fff',  // ✓ WCAG AA compliant
    border: '#8b9fff',  // ✓ WCAG AA compliant for borders
  },
  
  // Background Gradients
  darkGradient: {
    light: 'rgba(31, 41, 55, 0.8)',
    dark: 'rgba(17, 24, 39, 0.8)',
    lightMedium: 'rgba(31, 41, 55, 0.85)',
    darkMedium: 'rgba(17, 24, 39, 0.85)',
    lightHeavy: 'rgba(31, 41, 55, 0.9)',
    darkHeavy: 'rgba(17, 24, 39, 0.9)',
    lightFull: 'rgba(31, 41, 55, 0.95)',
    darkFull: 'rgba(17, 24, 39, 0.95)',
  },
} as const;

export const GRADIENTS = {
  // Card backgrounds
  card: `linear-gradient(135deg, ${COLORS.darkGradient.darkMedium}, ${COLORS.darkGradient.lightMedium})`,
  cardLight: `linear-gradient(135deg, ${COLORS.darkGradient.dark}, ${COLORS.darkGradient.light})`,
  cardHeavy: `linear-gradient(135deg, ${COLORS.darkGradient.darkHeavy}, ${COLORS.darkGradient.lightHeavy})`,
  
  // Flip card back
  flipCardBack: `linear-gradient(135deg, ${COLORS.purple[100]}, ${COLORS.pink[100]})`,
  
  // Text gradients
  textPurplePink: 'linear-gradient(to right, #c084fc, #f472b6)',
  textPinkPurple: 'linear-gradient(to right, #f472b6, #c084fc)',
  purplePink: 'linear-gradient(to right, #a855f7, #ec4899)',
  
  // Decorative gradients
  purpleShade: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
} as const;

export const SHADOWS = {
  cardHover: '0 8px 32px rgba(192, 132, 252, 0.2)',
  cardHoverLight: '0 8px 32px rgba(192, 132, 252, 0.15)',
  buttonHover: '0 4px 12px rgba(168, 85, 247, 0.4)',
  dark: '0 4px 20px rgba(0,0,0,0.6)',
} as const;

export const TRANSITIONS = {
  default: 'all 0.3s ease',
  fast: 'all 0.2s ease',
  transform: 'transform 0.2s ease-in-out',
  opacity: 'opacity 0.3s ease',
} as const;

export const BORDER_RADIUS = {
  sm: 1,
  md: 1.5,
  lg: 2,
} as const;
