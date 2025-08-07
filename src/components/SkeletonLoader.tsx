import React from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate 
} from 'react-native-reanimated';
import { useMovieStore } from '../store/movieStore';
import { lightTheme, darkTheme } from '../constants/Theme';

const { width } = Dimensions.get('window');
const cardWidthDefault = width * 0.4;

interface SkeletonLoaderProps {
  type?: 'movie-card' | 'movie-details' | 'cast-item' | 'movie-card-individual';
  count?: number;
  cardWidth?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'movie-card', 
  count = 6,
  cardWidth = cardWidthDefault
}) => {
  const { isDarkMode } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  const renderMovieCardSkeleton = (cardWidth?: number) => (
    <View style={{
      width: cardWidth,
      marginRight: 12,
      marginBottom: 16,
    }}>
      <View style={{
        backgroundColor: theme.surface,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        {/* Poster Skeleton */}
        <Animated.View style={[{
          width: '100%',
          height: cardWidth ? cardWidth * 1.5 : cardWidthDefault * 1.5,
          backgroundColor: theme.border,
        }, shimmerStyle]} />
        
        {/* Content Skeleton */}
        <View style={{ padding: 12 }}>
          <Animated.View style={[{
            height: 16,
            backgroundColor: theme.border,
            borderRadius: 4,
            marginBottom: 8,
            width: '80%',
          }, shimmerStyle]} />
          
          <Animated.View style={[{
            height: 12,
            backgroundColor: theme.border,
            borderRadius: 4,
            width: '40%',
          }, shimmerStyle]} />
        </View>
      </View>
    </View>
  );

  const renderMovieDetailsSkeleton = () => (
    <View style={{ padding: 20 }}>
      {/* Title Skeleton */}
      <Animated.View style={[{
        height: 32,
        backgroundColor: theme.border,
        borderRadius: 4,
        marginBottom: 16,
        width: '70%',
      }, shimmerStyle]} />
      
      {/* Info Row Skeleton */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {[1, 2, 3, 4].map((_, index) => (
          <Animated.View key={index} style={[{
            height: 20,
            backgroundColor: theme.border,
            borderRadius: 4,
            marginRight: 12,
            width: 60,
          }, shimmerStyle]} />
        ))}
      </View>
      
      {/* Buttons Skeleton */}
      <View style={{ flexDirection: 'row', marginBottom: 24 }}>
        <Animated.View style={[{
          height: 44,
          backgroundColor: theme.border,
          borderRadius: 8,
          marginRight: 12,
          width: 120,
        }, shimmerStyle]} />
        
        <Animated.View style={[{
          height: 44,
          backgroundColor: theme.border,
          borderRadius: 8,
          flex: 1,
        }, shimmerStyle]} />
      </View>
      
      {/* Synopsis Skeleton */}
      {[1, 2, 3].map((_, index) => (
        <Animated.View key={index} style={[{
          height: 16,
          backgroundColor: theme.border,
          borderRadius: 4,
          marginBottom: 8,
          width: index === 2 ? '60%' : '100%',
        }, shimmerStyle]} />
      ))}
    </View>
  );

  const renderCastItemSkeleton = () => (
    <View style={{
      alignItems: 'center',
      marginRight: 20,
      width: 80,
    }}>
      <Animated.View style={[{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.border,
        marginBottom: 8,
      }, shimmerStyle]} />
      
      <Animated.View style={[{
        height: 12,
        backgroundColor: theme.border,
        borderRadius: 4,
        marginBottom: 4,
        width: '80%',
      }, shimmerStyle]} />
      
      <Animated.View style={[{
        height: 10,
        backgroundColor: theme.border,
        borderRadius: 4,
        width: '60%',
      }, shimmerStyle]} />
    </View>
  );

  const renderSkeleton = (cardWidth?: number) => {
    switch (type) {
      case 'movie-details':
        return renderMovieDetailsSkeleton();
      case 'cast-item':
        return Array(count).fill(0).map((_, index) => (
          <View key={index}>
            {renderCastItemSkeleton()}
          </View>
        ));
      case 'movie-card-individual':
        return renderMovieCardSkeleton(cardWidth);
      default:
        return <FlatList
          horizontal
          data={Array(count).fill(0)}
          renderItem={({ item, index }) => renderMovieCardSkeleton(cardWidth)}
          keyExtractor={(item, index) => `${index}`}
          showsHorizontalScrollIndicator={false}
          style={{paddingHorizontal: 20}}
        />
    }
  };

  return (
    <View style={{ flexDirection: type === 'cast-item' ? 'row' : 'column' }}>
      {renderSkeleton(cardWidth)}
    </View>
  );
}; 