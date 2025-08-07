import React from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  interpolate 
} from 'react-native-reanimated';
import { useMovieStore } from '../store/movieStore';
import { lightTheme, darkTheme } from '../constants/Theme';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  const { isDarkMode } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    }}>
      <Animated.View style={[animatedStyle]}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 3,
          borderColor: theme.primary,
          borderTopColor: 'transparent',
        }} />
      </Animated.View>
      <Text style={{
        color: theme.textSecondary,
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
      }}>
        {message}
      </Text>
    </View>
  );
}; 