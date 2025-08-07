import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG, getImageUrl, getBackdropUrl, getProfileUrl } from '../config/api';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: Cast[];
    crew: { id: number; name: string; job: string }[];
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

interface MovieState {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Movies
  popularMovies: Movie[];
  searchResults: Movie[];
  movieDetails: MovieDetails | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMorePages: boolean;
  searchCurrentPage: number;
  searchHasMorePages: boolean;
  
  // Favorites
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  
  // API calls
  fetchPopularMovies: (page?: number) => Promise<void>;
  searchMovies: (query: string, page?: number) => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  clearSearch: () => void;
  resetPagination: () => void;
}

// Re-export helper functions for backward compatibility
export { getImageUrl, getBackdropUrl, getProfileUrl };

export const useMovieStore = create<MovieState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Movies
      popularMovies: [],
      searchResults: [],
      movieDetails: null,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      currentPage: 1,
      hasMorePages: true,
      searchCurrentPage: 1,
      searchHasMorePages: true,
      
      // Favorites
      favorites: [],
      addToFavorites: (movie) => {
        const { favorites } = get();
        if (!favorites.find(fav => fav.id === movie.id)) {
          set({ favorites: [...favorites, movie] });
        }
      },
      removeFromFavorites: (movieId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.id !== movieId) });
      },
      isFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === movieId);
      },
      
      // API calls
      fetchPopularMovies: async (page = 1) => {
        if (page === 1) {
          set({ isLoading: true, error: null });
        } else {
          set({ isLoadingMore: true });
        }
        
        try {
          const response = await axios.get(`${API_CONFIG.TMDB_BASE_URL}/movie/popular`, {
            params: {
              api_key: API_CONFIG.TMDB_API_KEY,
              language: 'en-US',
              page,
            },
          });
          
          const newMovies = response.data.results;
          const totalPages = response.data.total_pages;
          
          set((state) => ({
            popularMovies: page === 1 ? newMovies : [...state.popularMovies, ...newMovies],
            currentPage: page,
            hasMorePages: page < totalPages,
            isLoading: false,
            isLoadingMore: false,
          }));
        } catch (error) {
          set({ 
            error: 'Failed to fetch popular movies', 
            isLoading: false, 
            isLoadingMore: false 
          });
        }
      },
      
      searchMovies: async (query, page = 1) => {
        if (!query.trim()) {
          set({ searchResults: [] });
          return;
        }
        
        if (page === 1) {
          set({ isLoading: true, error: null });
        } else {
          set({ isLoadingMore: true });
        }
        
        try {
          const response = await axios.get(`${API_CONFIG.TMDB_BASE_URL}/search/movie`, {
            params: {
              api_key: API_CONFIG.TMDB_API_KEY,
              language: 'en-US',
              query: query.trim(),
              page,
            },
          });
          
          const newResults = response.data.results;
          const totalPages = response.data.total_pages;
          
          set((state) => ({
            searchResults: page === 1 ? newResults : [...state.searchResults, ...newResults],
            searchCurrentPage: page,
            searchHasMorePages: page < totalPages,
            isLoading: false,
            isLoadingMore: false,
          }));
        } catch (error) {
          set({ error: 'Failed to search movies', isLoading: false, isLoadingMore: false });
        }
      },
      
      fetchMovieDetails: async (movieId) => {
        set({ isLoading: true, error: null });
        try {
          const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
            axios.get(`${API_CONFIG.TMDB_BASE_URL}/movie/${movieId}`, {
              params: { api_key: API_CONFIG.TMDB_API_KEY, language: 'en-US' },
            }),
            axios.get(`${API_CONFIG.TMDB_BASE_URL}/movie/${movieId}/credits`, {
              params: { api_key: API_CONFIG.TMDB_API_KEY, language: 'en-US' },
            }),
            axios.get(`${API_CONFIG.TMDB_BASE_URL}/movie/${movieId}/videos`, {
              params: { api_key: API_CONFIG.TMDB_API_KEY, language: 'en-US' },
            }),
          ]);
          
          const movieDetails: MovieDetails = {
            ...movieResponse.data,
            credits: creditsResponse.data,
            videos: videosResponse.data,
          };
          
          set({ movieDetails, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch movie details', isLoading: false });
        }
      },
      
      clearSearch: () => set({ searchResults: [], searchCurrentPage: 1, searchHasMorePages: true }),
      resetPagination: () => set({ currentPage: 1, hasMorePages: true }),
    }),
    {
      name: 'movie-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        favorites: state.favorites,
      }),
    }
  )
); 