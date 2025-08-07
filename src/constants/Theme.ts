import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#0085FE',
  secondary: '#5856D6',
  text: '#000000',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  card: '#FFFFFF',
  cardShadow: '#00000010',
};

export const darkTheme = {
  background: '#000000',
  surface: '#1C1C1E',
  primary: '#0085FE',
  secondary: '#5E5CE6',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  card: '#1C1C1E',
  cardShadow: '#00000040',
};

export { width as screenWidth, height as screenHeight };

export type Theme = typeof lightTheme;