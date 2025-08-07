import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useMovieStore, Movie } from '../store/movieStore';
import { MovieCard } from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { lightTheme, darkTheme, screenWidth } from '../constants/Theme';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

export default function SearchTab() {
  const { 
    isDarkMode, 
    searchResults, 
    isLoading, 
    isLoadingMore,
    error, 
    searchCurrentPage,
    searchHasMorePages,
    searchMovies, 
    clearSearch 
  } = useMovieStore();
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery, 1);
      } else {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadMoreSearchResults = () => {
    if (!isLoadingMore && searchHasMorePages && searchQuery.trim()) {
      searchMovies(searchQuery, searchCurrentPage + 1);
    }
  };

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <MovieCard
      movie={item}
      onPress={() => navigation.navigate('movie-details', { id: item?.id })}
      index={index}
      cardWidth={(screenWidth - 52) / 2}
    />
  );

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    }}>
      <Text style={{
        fontSize: 48,
        marginBottom: 16,
      }}>
        🔍
      </Text>
      <Text style={{
        color: theme.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        Search for movies
      </Text>
      <Text style={{
        color: theme.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
      }}>
        Find your favorite movies by typing in the search bar above
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 30 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
        <SafeAreaView style={{
          flex: 1,
        }}>
          {/* Search Header */}
          <View style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}>
            <Text style={{
              color: theme.text,
              fontSize: 28,
              fontWeight: 'bold',
              marginBottom: 16,
            }}>
              Search
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.surface,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}>
              <View style={{ marginRight: 12 }}>
                <Ionicons name="search" size={24} color={theme.text} />
              </View>
              <TextInput
                ref={searchInputRef}
                style={{
                  flex: 1,
                  color: theme.text,
                  fontSize: 16,
                }}
                placeholder="Search for movies..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    searchMovies(searchQuery);
                  }
                }}
                blurOnSubmit={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              )}
            </View>
          </View>

        {/* Search Results */}
        {isLoading && searchQuery.trim() ? (
          <FlatList
          data={Array(6).fill(0)}
          renderItem={() => <SkeletonLoader type="movie-card-individual" cardWidth={(screenWidth - 52) / 2} />}
          keyExtractor={(item, index) => `${index}`}
          numColumns={2}
          contentContainerStyle={{ padding: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
        ) : error && searchQuery.trim() ? (
          <ErrorMessage message={error} onRetry={() => searchMovies(searchQuery)} />
        ) : searchQuery.trim() ? (
          <FlatList
            data={searchResults}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ padding: 20 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreSearchResults}
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
                  😕
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
                  Try searching with different keywords
                </Text>
              </View>
            }
          />
        ) : (
          renderEmptyState()
        )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
} 