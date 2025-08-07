import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, ImageBackground, SafeAreaView, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate, 
  useAnimatedScrollHandler,
  SharedValue
} from 'react-native-reanimated';
import { useMovieStore, Movie, getImageUrl } from '../store/movieStore';
import { MovieCard } from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { lightTheme, darkTheme } from '../constants/Theme';
import { BlurView } from "@react-native-community/blur";
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

export default function HomeTab() {
  const { 
    isDarkMode, 
    toggleTheme, 
    popularMovies, 
    isLoading, 
    error, 
    fetchPopularMovies 
  } = useMovieStore();
  const navigation = useNavigation();
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [activeLiveIndex, setActiveLiveIndex] = useState(0);

  const CARD_WIDTH = width - 40;
  const CARD_SPACING = 12
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollX.value = e.contentOffset.x / (CARD_WIDTH + CARD_SPACING)
  })

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <MovieCard
      movie={item}
      onPress={() => navigation.navigate('movie-details', { id: item?.id })}
      index={index}
    />
  );

  const LiveNowItem = ({ item, index, scrollX }: { item: Movie; index: number, scrollX: SharedValue<number> }) => {
    const stylez = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(scrollX.value,
              [index-1, index, index+1],
              [1.4, 1, 1.4]
            ),
          },
          {
            translateX: interpolate(scrollX.value,
              [index-1, index, index+1],
              [15, 0, 15]
            )
          }
        ]
      }
    });

    const textStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollX.value,
          [index-1, index, index+1],
          [0, 1, 0]
        )
      }
    })

    return (
      <ImageBackground 
        style={{
          width: CARD_WIDTH,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
        source={{ uri: getImageUrl(item.backdrop_path, 'large') || 'https://placehold.jp/61d0f5/ffffff/120x120.png' }}
      >
        <View style={{
          flexDirection: 'row',
          height: 200,
        }}>
          {/* Left Content */}
          <View style={{
            flex: 1,
            padding: 20,
            justifyContent: 'space-between',
          }}>
            <Animated.View style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'gray'
              },
              // textStyle
            ]}>
              <BlurView
                blurAmount={40}
                reducedTransparencyFallbackColor="gray"
                style={{
                  width: 'auto',
                  height: '100%'
                }}
              />
            </Animated.View>

            <Animated.View style={textStyle}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
                backgroundColor: '#fff',
                alignSelf: 'flex-start',
                padding: 3,
                borderRadius: 20,
                paddingHorizontal: 7
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#FF3B30',
                  marginRight: 8,
                }} />
                <Text style={{
                  color: '#FF3B30',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                  Live now
                </Text>
              </View>
              
                <Text 
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    lineHeight: 24,
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                
                <Text numberOfLines={2} style={{
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 20,
                }}>
                  {item.overview}
                </Text>
            </Animated.View>
            
            <TouchableOpacity 
               style={{
                 backgroundColor: theme.primary,
                 paddingHorizontal: 20,
                 paddingVertical: 10,
                 borderRadius: 20,
                 alignSelf: 'flex-start',
                 marginTop: 7
               }}
               onPress={() => navigation.navigate('movie-details', { id: item?.id })}
             >
               <Text style={{
                 color: '#FFFFFF',
                 fontSize: 12,
                 fontWeight: 'bold',
               }}>
                 Watch Now
               </Text>
             </TouchableOpacity>
          </View>
          
          {/* Right Image */}
          <View style={{
            width: CARD_WIDTH * 0.40,
            height: '100%',
            overflow: 'hidden'
          }}>
            <Animated.Image
              source={{ uri: getImageUrl(item.backdrop_path, 'large') || 'https://placehold.jp/61d0f5/ffffff/120x120.png' }}
              style={[{
                flex: 1
              }, stylez]}
              resizeMode="cover"
            />
          </View>
        </View>
      </ImageBackground>
    )
  };

  if (isLoading && popularMovies.length === 0) {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: Platform.OS === 'ios' ? 0 : 30
      }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Skeleton */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}>
            <View>
              <View style={{
                height: 14,
                backgroundColor: theme.border,
                borderRadius: 4,
                marginBottom: 4,
                width: 100,
              }} />
              <View style={{
                height: 24,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 150,
              }} />
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={{
                  width: 20,
                  height: 20,
                  backgroundColor: theme.border,
                  borderRadius: 10,
                  marginLeft: 16,
                }} />
              ))}
            </View>
          </View>

          {/* Live Now Skeleton */}
          <View style={{ marginBottom: 32 }}>
            <View style={{
              width: width - 40,
              height: 200,
              backgroundColor: theme.border,
              borderRadius: 16,
              marginHorizontal: 20,
            }} />
          </View>

          {/* Latest Movies Skeleton */}
          <View style={{ marginBottom: 32 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 16,
            }}>
              <View style={{
                height: 20,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 120,
              }} />
              <View style={{
                height: 14,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 60,
              }} />
            </View>
            
            <SkeletonLoader type="movie-card" count={5} />
          </View>

          {/* Top Rated Skeleton */}
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 16,
            }}>
              <View style={{
                height: 20,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 100,
              }} />
              <View style={{
                height: 14,
                backgroundColor: theme.border,
                borderRadius: 4,
                width: 60,
              }} />
            </View>
            
            <SkeletonLoader type="movie-card" count={5} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error && popularMovies.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchPopularMovies} />;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 0 : 30
    }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          height: '100%',
        }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}>
          <View>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 14,
              marginBottom: 4,
            }}>
              Welcome back,
            </Text>
            <Text style={{
              color: theme.text,
              fontSize: 24,
              fontWeight: 'bold',
            }}>
              Blackvibes
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                marginRight: 16,
                padding: 8,
              }}
            >
              <Ionicons name={!isDarkMode ? 'moon-outline' : 'sunny-outline'} size={20} color={theme.text} />
            </TouchableOpacity>
            
            <TouchableOpacity>
              <Ionicons name='notifications-outline' size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Now Section */}
        <View style={{ marginBottom: 32 }}>
          <Animated.FlatList
            data={popularMovies.slice(0, 5)}
            renderItem={({item, index}) => <LiveNowItem item={item} index={index} scrollX={scrollX} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH)/2, gap: CARD_SPACING }}
            pagingEnabled
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate={'fast'}
            
            onScroll={onScroll}
            scrollEventThrottle={1000/60}
          />
          
          {/* Pagination Dots */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
          }}>
            {popularMovies.slice(0, 5).map((_, index) => {
              const PaginationDot = () => {
                const dotStyle = useAnimatedStyle(() => {
                  const inputRange = [index - 0.5, index, index + 0.5];
                  const outputRange = [0.3, 1, 0.3];
                  
                  return {
                    opacity: interpolate(
                      scrollX.value,
                      inputRange,
                      outputRange,
                      Extrapolate.CLAMP
                    ),
                    transform: [{
                      scale: interpolate(
                        scrollX.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                      )
                    }]
                  };
                });

                return (
                  <Animated.View
                    key={index}
                    style={[{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.primary,
                      marginHorizontal: 4,
                    }, dotStyle]}
                  />
                );
              };

              return <PaginationDot key={index} />;
            })}
          </View>
        </View>

        {/* Latest Movies Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
              Latest movies
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('see-all', { type: 'latest' })}
            >
              <Text style={{
                color: theme.primary,
                fontSize: 14,
                fontWeight: '600',
              }}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularMovies.slice(0, 10)}
            renderItem={renderMovieItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Top Rated Section */}
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
              Top rated
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('see-all', { type: 'top-rated' })}
            >
              <Text style={{
                color: theme.primary,
                fontSize: 14,
                fontWeight: '600',
              }}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularMovies.slice(10, 20)}
            renderItem={renderMovieItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
