import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useMovieStore, Movie } from '../store/movieStore';
import { MovieCard } from '../components/MovieCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { lightTheme, darkTheme, screenWidth } from '../constants/Theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Ionicons} from '@react-native-vector-icons/ionicons';

export default function SeeAllScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params;
  const { 
    isDarkMode, 
    popularMovies, 
    isLoading, 
    isLoadingMore,
    error, 
    currentPage,
    hasMorePages,
    fetchPopularMovies,
    resetPagination
  } = useMovieStore();
  
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    resetPagination();
    fetchPopularMovies(1);
  }, [type]);

  const getTitle = () => {
    switch (type) {
      case 'latest':
        return 'Latest Movies';
      case 'top-rated':
        return 'Top Rated Movies';
      default:
        return 'All Movies';
    }
  };

  const getMovies = () => {
    return popularMovies;
  };

  const loadMoreMovies = useCallback(() => {
    if (!isLoadingMore && hasMorePages) {
      fetchPopularMovies(currentPage + 1);
    }
  }, [isLoadingMore, hasMorePages, currentPage, fetchPopularMovies]);

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <MovieCard
      movie={item}
      onPress={() => navigation.navigate('movie-details', { id: item?.id })}
      index={index}
      cardWidth={(screenWidth - 52) / 2}
    />
  );

  if (isLoading && popularMovies.length === 0) {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: theme.background,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          
          <Text style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: 'bold',
          }}>
            {getTitle()}
          </Text>
          
          <View style={{ width: 36 }} />
        </View>
        
        <FlatList
          data={Array(8).fill(0)}
          renderItem={() => <SkeletonLoader type="movie-card-individual" cardWidth={(screenWidth - 52) / 2} />}
          keyExtractor={(item, index) => `${index}`}
          numColumns={2}
          contentContainerStyle={{ padding: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  if (error && popularMovies.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchPopularMovies(1)} />;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 0 : 30
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={{
          color: theme.text,
          fontSize: 20,
          fontWeight: 'bold',
        }}>
          {getTitle()}
        </Text>
        
        <View style={{ width: 36 }} />
      </View>

      {/* Movies Grid */}
      <FlatList
        data={getMovies()}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <SkeletonLoader type="movie-card" count={4} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
            paddingTop: 60,
          }}>
            <Text style={{
              fontSize: 48,
              marginBottom: 16,
            }}>
              🎬
            </Text>
            <Text style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              No movies found
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Try refreshing the page
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
} 