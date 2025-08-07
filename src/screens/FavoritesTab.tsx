import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useMovieStore, Movie } from '../store/movieStore';
import { MovieCard } from '../components/MovieCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { lightTheme, darkTheme, screenWidth } from '../constants/Theme';
import { useNavigation } from '@react-navigation/native';

export default function FavoritesTab() {
  const { isDarkMode, favorites, isLoading } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation()

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
        ❤️
      </Text>
      <Text style={{
        color: theme.text,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        No favorites yet
      </Text>
      <Text style={{
        color: theme.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
      }}>
        Start exploring movies and add them to your favorites
      </Text>
      
      <TouchableOpacity
        onPress={() => router.push('/(tabs)')}
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
          Explore Movies
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 0 : 30
    }}>
      {/* Header */}
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
          marginBottom: 8,
        }}>
          Favorites
        </Text>
        <Text style={{
          color: theme.textSecondary,
          fontSize: 16,
        }}>
          {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {/* Favorites List */}
      {isLoading ? (
        <View style={{ padding: 20 }}>
          <SkeletonLoader type="movie-card" count={6} />
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
} 