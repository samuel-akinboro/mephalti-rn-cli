// API Configuration
export const API_CONFIG = {
  TMDB_API_KEY: '7ad474e0be07d11f1f444bfa7deb0098', // Replace with your actual API key
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
};

// Image size options for TMDb
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
} as const;

// Helper function to get image URL
export const getImageUrl = (
  path: string, 
  size: keyof typeof IMAGE_SIZES.poster = 'medium'
) => {
  if (!path) return null;
  return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.poster[size]}${path}`;
};

// Helper function to get backdrop image URL
export const getBackdropUrl = (
  path: string, 
  size: keyof typeof IMAGE_SIZES.backdrop = 'medium'
) => {
  if (!path) return null;
  return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop[size]}${path}`;
};

// Helper function to get profile image URL
export const getProfileUrl = (
  path: string, 
  size: keyof typeof IMAGE_SIZES.profile = 'medium'
) => {
  if (!path) return null;
  return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.profile[size]}${path}`;
}; 