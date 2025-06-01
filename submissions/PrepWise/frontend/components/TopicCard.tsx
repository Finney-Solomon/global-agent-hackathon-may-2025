import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Book, ChevronRight } from "lucide-react-native";
import { Topic } from "@/types";
import { useRef, useEffect } from "react";

interface TopicCardProps {
  topic: Topic;
  onPress: () => void;
  isSelected: boolean;
}

export default function TopicCard({ topic, onPress, isSelected }: TopicCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        accessibilityLabel={`Select topic: ${topic.title}`}
        accessibilityHint={`Opens details for ${topic.title}`}
      >
        <View style={styles.iconContainer}>
          <Book size={20} color="#7C3AED" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.subject}>{topic.subject}</Text>
          {topic.progress && (
            <Text style={styles.progressText}>{topic.progress}% Complete</Text>
          )}
        </View>
        <ChevronRight size={20} color="#94A3B8" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  selectedCard: {
    borderColor: "#7C3AED",
    backgroundColor: "#F5F3FF",
    borderWidth: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#7C3AED",
    fontWeight: "500",
  },
});