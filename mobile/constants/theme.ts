import { MD3DarkTheme } from 'react-native-paper';

// Custom theme matching the web app's purple theme
export const theme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#782FEF', // reelPurple-500 from web
    primaryContainer: '#5a23b8',
    secondary: '#9d4edd',
    secondaryContainer: '#7b2cbf',
    tertiary: '#c77dff',
    background: '#111827', // matching web gradient start
    surface: '#1f2937', // matching web gradient middle
    surfaceVariant: '#374151',
    error: '#ef4444',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    outline: '#6b7280',
    shadow: '#000000',
  },
  roundness: 12,
};

export type AppTheme = typeof theme;
