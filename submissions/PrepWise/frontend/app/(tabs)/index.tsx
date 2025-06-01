import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Platform,
  Picker,
} from "react-native";
import { fetchLearningPlan, askQuestion } from "@/utils/api";
import TopicCard from "@/components/TopicCard";
import { Topic } from "@/types";
import { ArrowRight, Search, X } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  setTopicDetails,
  setTopics,
  setTopicDoubts,
} from "@/store/slices/learningPlanSlice";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function LearningPlanScreen() {
  const { sessionId, name, exam } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const topics = useAppSelector((state) => state.learningPlan.topics);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [doubtInput, setDoubtInput] = useState("");
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const doubtScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const loadLearningPlan = async () => {
      const response = await fetchLearningPlan(sessionId);
      dispatch(setTopics(response?.topics));
      setLoading(false);
    };
    loadLearningPlan();
  }, [sessionId]);

  useEffect(() => {
    // Auto-scroll to the bottom when doubts change
    if (selectedTopic && doubtScrollRef.current) {
      doubtScrollRef.current.scrollToEnd({ animated: true });
    }
  }, [selectedTopic?.id, topics]);

  const handleExplainTopic = async (topic: Topic) => {
    setSelectedTopic(topic);
    setExplanationLoading(true);
    const response = await askQuestion(sessionId, `Explain ${topic.title}`);
    dispatch(setTopicDetails({ topicId: topic.id, details: response.reply }));
    setExplanationLoading(false);
  };

  const handleAskDoubt = async () => {
    if (!selectedTopic || doubtInput.trim() === "") return;
    setDoubtLoading(true);
    try {
      const prompt = `I have a doubt in ${selectedTopic.title}: ${doubtInput}`;
      const response = await askQuestion(sessionId, prompt);
      dispatch(
        setTopicDoubts({
          topicId: selectedTopic.id,
          doubt: `Q: ${doubtInput}\nA: ${response.reply}`,
        })
      );
      setDoubtInput("");
    } catch (e) {
      console.error("Doubt error:", e);
    } finally {
      setDoubtLoading(false);
    }
  };

  // Get unique subjects for the filter
  const subjects = ["All", ...new Set(topics.map((topic) => topic.subject))];

  // Filter topics based on search query and selected subject
  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedSubject === "All" || topic.subject === selectedSubject)
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Preparing your learning plan...</Text>
      </View>
    );
  }

  const selectedTopicDetails = selectedTopic
    ? topics.find((t) => t.id === selectedTopic.id)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {name}!</Text>
        <Text style={styles.subTitle}>
          Here's what you should learn next for {exam}
        </Text>
      </View>

      <View style={[styles.contentRow, isTablet ? styles.tabletRow : styles.phoneRow]}>
<View
  style={[
    styles.topicsColumn,
    !isTablet && selectedTopic ? { display: 'none' } : null,
    isTablet && selectedTopic ? { maxWidth: '30%' } : null,
  ]}
>
          <View style={styles.stickyHeader}>
            <Text style={styles.sectionTitle}>Recommended Topics</Text>
            <View style={styles.filterContainer}>
              <Picker
                selectedValue={selectedSubject}
                onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                style={styles.subjectPicker}
                accessibilityLabel="Filter by subject"
                accessibilityHint="Select a subject to filter topics"
              >
                {subjects.map((subject) => (
                  <Picker.Item key={subject} label={subject} value={subject} />
                ))}
              </Picker>
            </View>
            <View style={styles.searchContainer}>
              <Search size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search topics..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                accessibilityLabel="Search topics"
                accessibilityHint="Enter a topic name to filter the list"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                  accessibilityLabel="Clear search"
                  accessibilityHint="Clears the search input field"
                >
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView style={{marginHorizontal:20,paddingHorizontal:6}}>
            {filteredTopics.length === 0 ? (
              <Text style={styles.noResultsText}>No topics found</Text>
            ) : (
              filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onPress={() => handleExplainTopic(topic)}
                  isSelected={selectedTopic?.id === topic.id}
                />
              ))
            )}
          </ScrollView>
        </View>

        {selectedTopic && (
          <View style={styles.explanationColumn}>
            <View style={styles.explanationHeader}>
              <Text style={styles.explanationTitle}>{selectedTopic.title}</Text>
              {!isTablet && (
                <TouchableOpacity
                  onPress={() => setSelectedTopic(null)}
                  style={styles.backButton}
                  accessibilityLabel="Back to topics"
                  accessibilityHint="Returns to the topic list"
                >
                  <Text style={styles.backButtonText}>Back to Topics</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={styles.explanationScroll} ref={doubtScrollRef}>
              {explanationLoading ? (
                <ActivityIndicator size="small" color="#7C3AED" style={styles.explanationLoading} />
              ) : (
                <Text style={styles.explanationText}>
                  {selectedTopicDetails?.details || "No explanation available."}
                </Text>
              )}
              {selectedTopicDetails?.doubts?.length > 0 && (
                <View style={styles.doubtsContainer}>
                  <Text style={styles.sectionTitle}>Conversation</Text>
                  {selectedTopicDetails?.doubts?.map((d, idx) => {
                    const [question, answer] = d.split("\nA: ");
                    return (
                      <View key={idx} style={styles.doubtWrapper}>
                        <Text style={[styles.doubtBubble, styles.userDoubt]}>Q: {question.replace("Q: ", "")}</Text>
                        <Text style={[styles.doubtBubble, styles.aiDoubt]}>A: {answer}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
            <View style={styles.doubtInputContainer}>
              <TextInput
                placeholder="Ask anything... AI is listening"
                value={doubtInput}
                onChangeText={setDoubtInput}
                style={styles.chatInput}
                accessibilityLabel="Ask a doubt"
                accessibilityHint="Enter your question about the selected topic"
                returnKeyType="send"
                onSubmitEditing={handleAskDoubt}
              />
              <TouchableOpacity
                onPress={handleAskDoubt}
                style={[styles.chatSendButton, doubtLoading && styles.disabledButton]}
                disabled={doubtLoading}
                accessibilityLabel="Send doubt"
                accessibilityHint="Submits your question about the topic"
              >
                {doubtLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ArrowRight size= {20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 16,
    color: "#64748B",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
  },
  tabletRow: {
    flexDirection: "row",
    gap: 16,
  },
  phoneRow: {
    flexDirection: "column",
  },
  topicsColumn: {
    flex: 1,
    minWidth: 300,
    // maxWidth:"30%"
  },
  stickyHeader: {
    backgroundColor: "#F8FAFC",
    paddingBottom: 12,
    zIndex: 1,
    // maxWidth:"40%"

  },
  sectionTitle: {
    fontSize: 16, // Decreased size from 18
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  filterContainer: {
    marginBottom: 12,
       paddingHorizontal:20
  },
  subjectPicker: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 8,
    fontSize: 16,
    color: "#1E293B",
    paddingHorizontal:20
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginHorizontal:20
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#1E293B",
    paddingHorizontal:20

  },
  clearButton: {
    padding: 4,
  },
  noResultsText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 20,
  },
  explanationColumn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 300,
  },
  explanationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#7C3AED",
    fontWeight: "600",
  },
  explanationScroll: {
    flex: 1,
    marginBottom: 80,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
  },
  explanationLoading: {
    marginVertical: 20,
  },
  doubtsContainer: {
    marginTop: 24,
  },
  doubtWrapper: {
    marginBottom: 12,
  },
  doubtBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  userDoubt: {
    backgroundColor: "#E2E8F0",
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  aiDoubt: {
    backgroundColor: "#7C3AED",
    color: "#FFFFFF",
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  doubtInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0B56B1FF",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#B7C0C9FF",
    fontSize: 16,
    marginRight: 8,
  },
  chatSendButton: {
    backgroundColor: "#0B5380FF",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A78BFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
  },
});