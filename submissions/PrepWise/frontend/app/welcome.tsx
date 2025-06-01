import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { BookOpen, MessageSquare, Lightbulb, ArrowRight } from "lucide-react-native";
import { useAppSelector } from "@/hooks/hooks";
import { Redirect, router } from "expo-router";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function WelcomeScreen() {
  const { isProfileComplete } = useAppSelector((state) => state.user);

  if (isProfileComplete) {
    return <Redirect href="/(tabs)/" />;
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.push("/setup");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Welcome to PrepWise</Text>
        <Text style={styles.subtitle}>Your AI-Powered Learning Companion</Text>

        <View style={styles.featuresContainer}>
          <Animated.View
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <BookOpen size={isTablet ? 28 : 24} color="#7C3AED" />
            <Text style={styles.featureText}>
              Personalized topics tailored to your goals
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <MessageSquare size={isTablet ? 28 : 24} color="#7C3AED" />
            <Text style={styles.featureText}>
              Ask doubts and get instant AI answers
            </Text>
          </Animated.View>
          <Animated.View style={[ styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Lightbulb size={isTablet ? 28 : 24} color="#7C3AED" />
            <Text style={styles.featureText}>
              Test your knowledge with AI-generated quizzes
            </Text>
          </Animated.View>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          accessibilityLabel="Get started with PrepWise"
          accessibilityHint="Navigate to set up your profile"
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <ArrowRight size={isTablet ? 24 : 20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: isTablet ? 24 : 16,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 600,
  },
  title: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isTablet ? 20 : 16,
    color: "#64748B",
    marginBottom: 32,
    textAlign: "center",
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  featureText: {
    fontSize: isTablet ? 18 : 16,
    color: "#334155",
    marginLeft: 12,
    flex: 1,
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  getStartedText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
});