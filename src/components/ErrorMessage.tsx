import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useMovieStore } from '../store/movieStore';
import { lightTheme, darkTheme } from '../constants/Theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { isDarkMode } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    }}>
      <View style={{
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: theme.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <Text style={{
          fontSize: 48,
          marginBottom: 16,
        }}>
          😕
        </Text>
        
        <Text style={{
          color: theme.text,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Oops!
        </Text>
        
        <Text style={{
          color: theme.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 20,
        }}>
          {message}
        </Text>
        
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}; 