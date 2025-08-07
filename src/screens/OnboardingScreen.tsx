import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    symbol: 'DT',
    title: 'Discover trending\nmovies at a glance',
    bgColor: '#000000', // Dark slate
    color: '#FBBF24',   // Amber
  },
  {
    id: 2,
    symbol: '🎞️',
    title: 'See full movie\ndetails and ratings',
    bgColor: '#000000', // Navy
    color: '#60A5FA',   // Sky blue
  },
  {
    id: 3,
    symbol: 'WT',
    title: 'Watch trailers\nbefore you decide',
    bgColor: '#000000', // Jet black
    color: '#22C55E',   // Lime green
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const progress = useSharedValue(0);
  const slideIn = useSharedValue(0);

  useEffect(() => {
    slideIn.value = 0;
    slideIn.value = withTiming(1, { duration: 600 });
    progress.value = withTiming(currentSlide / (slides.length - 1));
  }, [currentSlide]);

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('tabs');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('tabs');
  };

  const slide = slides[currentSlide];

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${(progress.value + 0.01) * 100}%`,
  }));

  const symbolStyle = useAnimatedStyle(() => ({
    opacity: slideIn.value,
    transform: [
      {
        translateY: interpolate(
          slideIn.value,
          [0, 1],
          [40, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: slideIn.value,
    transform: [
      {
        translateY: interpolate(
          slideIn.value,
          [0, 1],
          [60, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: slide.bgColor }]}>
      {/* Skip */}
      <TouchableOpacity onPress={handleSkip} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Animated.Text
          style={[styles.symbol, { color: slide.color }, symbolStyle]}
        >
          {slide.symbol}
        </Animated.Text>

        <Animated.Text style={[styles.title, titleStyle]}>
          {slide.title}
        </Animated.Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Ionicons
            name={currentSlide === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  skip: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: '#ffffffaa',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 100,
    fontWeight: '900',
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 36,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff55',
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
  },
  nextButton: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
