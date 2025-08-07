// In App.js in a new project

import * as React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { NavigationContainer, ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './src/screens/HomeTab';
import FavoritesTab from './src/screens/FavoritesTab';
import SeeAllScreen from './src/screens/SeeAllScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import SearchTab from './src/screens/SearchTab';
import { useMovieStore } from './src/store/movieStore';
import { darkTheme, lightTheme } from './src/constants/Theme';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator 
      initialRouteName='tabs'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="tabs" component={TabNav} />
      <Stack.Screen name="see-all" component={SeeAllScreen} />
      <Stack.Screen name="movie-details" component={MovieDetailsScreen} />
    </Stack.Navigator>
  );
}

function TabNav() {
  const { isDarkMode } = useMovieStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.card,
        borderTopColor: theme.border,
        borderTopWidth: 1,
      },
      headerShown: false,
    }}
    >
      <Tab.Screen
        name="home"
        component={HomeTab}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (<Ionicons name="home-outline" color={color} size={size} />),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchTab}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (<Ionicons name="search" color={color} size={size} />),
        }}
      />
      <Tab.Screen
        name="favorites"
        component={FavoritesTab}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (<Ionicons name="heart-outline" color={color} size={size} />),
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const colorScheme = useColorScheme();
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState<boolean | null>(null);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}