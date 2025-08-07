import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay 
} from 'react-native-reanimated';
import { useMovieStore, Movie } from '../store/movieStore';
import { getImageUrl } from '../config/api';
import { lightTheme, darkTheme } from '../constants/Theme';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');
const cardWidthDefault = width * 0.4;

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  index?: number;
  cardWidth?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress, index = 0, cardWidth=cardWidthDefault }) => {
  const { isDarkMode, isFavorite, addToFavorites, removeFromFavorites } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const scale = useSharedValue(1);
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const delay = index * 100;
    opacity.value = withDelay(delay, withSpring(1, { damping: 15 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleFavoritePress = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{
          width: cardWidth,
          marginRight: 12,
          marginBottom: 16,
        }}
      >
        <View style={{
          borderRadius: 12,
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ 
                uri: getImageUrl(movie.poster_path) || 'https://via.placeholder.com/300x450'
              }}
              style={{
                width: '100%',
                height: cardWidth * 1.5,
                borderRadius: 20,
                borderTopRightRadius: 12,
              }}
              resizeMode="cover"
            />
            
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 20,
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons size={16} name={isFavorite(movie.id) ? 'heart' : 'heart-outline'} color={isFavorite(movie.id) ? '#FFD700' : '#FFFFFF'} />
            </TouchableOpacity>

            <View style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                {formatRating(movie.vote_average)}
              </Text>
            </View>
          </View>

          <View style={{ padding: 12 }}>
            <Text 
              style={{
                color: theme.text,
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            
            <Text 
              style={{
                color: theme.textSecondary,
                fontSize: 12,
              }}
            >
              {formatDate(movie.release_date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
