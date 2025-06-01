import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchQuiz } from '@/utils/api';
import { Quiz } from '@/types';
import {
  setTopicQuiz,
  setTopicQuizResult,
} from '@/store/slices/learningPlanSlice';
import {
  CircleCheck as CheckCircle2,
  CircleAlert as AlertCircle,
} from 'lucide-react-native';

export default function QuizScreen() {
  const dispatch = useAppDispatch();
  const { sessionId } = useAppSelector((state) => state.user);
  const topics = useAppSelector((state) => state.learningPlan.topics);

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selected: string; correct: string }[]
  >([]);

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C...

  const startQuiz = async (topicId: string, topicTitle: string) => {
    setSelectedTopic(topicTitle);
    setSelectedTopicId(topicId);
    setLoading(true);

    try {
      const quizData = await fetchQuiz(topicTitle, sessionId);
      setQuiz(quizData);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setUserAnswers([]);

      dispatch(setTopicQuiz({ topicId, quiz: quizData.questions }));
    } catch (error) {
      console.error('Error fetching quiz:', error);

      const dummyQuiz: Quiz = {
        topic: topicTitle,
        questions: [
          {
            id: '1',
            question: 'Which of the following is NOT a kingdom?',
            options: ['Monera', 'Protista', 'Fungi', 'Insecta'],
            correctAnswer: 'D',
            explanation: 'Insecta is a class, not a kingdom.',
          },
        ],
      };

      setQuiz(dummyQuiz);
      dispatch(setTopicQuiz({ topicId, quiz: dummyQuiz.questions }));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerChecked) setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    if (selectedAnswer && quiz) {
      setIsAnswerChecked(true);
      const currentQuestion = quiz.questions[currentQuestionIndex];

      // Save user's answer
      setUserAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          selected: selectedAnswer,
          correct: currentQuestion.correctAnswer,
        },
      ]);

      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setQuizCompleted(true);

      const percentage = Math.round(
        (score / (quiz.questions.length || 1)) * 100
      );

      dispatch(
        setTopicQuizResult({
          topicId: selectedTopicId,
          result: {
            answers: userAnswers,
            scorePercentage: percentage,
          },
        })
      );
    }
  };

  const resetQuiz = () => {
    setSelectedTopic('');
    setSelectedTopicId('');
    setQuiz(null);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const renderTopicSelection = () => (
    <View style={styles.topicsContainer}>
      <Text style={styles.sectionTitle}>Select a Topic for Quiz</Text>
      {topics.map((topic) => (
        <TouchableOpacity
          key={topic.id}
          style={styles.topicCard}
          onPress={() => startQuiz(topic.id, topic.title)}
        >
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <Text style={styles.topicSubject}>{topic.subject}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuiz = () => {
    if (!quiz) return null;
    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
      <View style={styles.quizContainer}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizTopic}>{quiz.topic}</Text>
          <Text style={styles.quizProgress}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {currentQuestion.options.map((option, index) => {
            const optionLetter = getOptionLabel(index);
            const isCorrect = optionLetter === currentQuestion.correctAnswer;
            const isSelected = selectedAnswer === optionLetter;
            const isIncorrect = isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isAnswerChecked && isCorrect && styles.correctOption,
                  isAnswerChecked && isIncorrect && styles.incorrectOption,
                  !isAnswerChecked && isSelected && styles.selectedOption,
                ]}
                onPress={() => handleAnswerSelect(optionLetter)}
                disabled={isAnswerChecked}
              >
                <Text
                  style={[
                    styles.optionText,
                    isAnswerChecked && isCorrect && styles.correctOptionText,
                    isAnswerChecked && isIncorrect && styles.incorrectOptionText,
                  ]}
                >
                  {`${optionLetter}. ${option}`}
                </Text>

                {isAnswerChecked && isCorrect && (
                  <CheckCircle2 size={20} color="#10B981" style={styles.optionIcon} />
                )}
                {isAnswerChecked && isIncorrect && (
                  <AlertCircle size={20} color="#EF4444" style={styles.optionIcon} />
                )}
              </TouchableOpacity>
            );
          })}

          {isAnswerChecked && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              <Text style={styles.explanationText}>
                Correct Answer: {currentQuestion.correctAnswer}.{' '}
                {currentQuestion.options[currentQuestion.correctAnswer.charCodeAt(0) - 65]}
              </Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            {!isAnswerChecked ? (
              <TouchableOpacity
                style={[styles.actionButton, !selectedAnswer && styles.disabledButton]}
                onPress={checkAnswer}
                disabled={!selectedAnswer}
              >
                <Text style={styles.actionButtonText}>Check Answer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.actionButton} onPress={nextQuestion}>
                <Text style={styles.actionButtonText}>
                  {currentQuestionIndex < quiz.questions.length - 1
                    ? 'Next Question'
                    : 'See Results'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultTitle}>Quiz Completed!</Text>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTopic}>{quiz?.topic}</Text>
        <Text style={styles.scoreText}>
          Your score: {score}/{quiz?.questions.length}
        </Text>
        <Text style={styles.scorePercentage}>
          {Math.round((score / (quiz?.questions.length || 1)) * 100)}%
        </Text>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
        <Text style={styles.resetButtonText}>Try Another Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Preparing your quiz...</Text>
        </View>
      ) : (
        <>
          {!selectedTopic && renderTopicSelection()}
          {selectedTopic && !quizCompleted && renderQuiz()}
          {quizCompleted && renderResults()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 300 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#64748B' },
  topicsContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#334155', marginBottom: 16 },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topicTitle: { fontSize: 17, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  topicSubject: { fontSize: 14, color: '#64748B' },
  quizContainer: { flex: 1 },
  quizHeader: { marginBottom: 16 },
  quizTopic: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  quizProgress: { fontSize: 14, color: '#64748B' },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  questionText: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 20, lineHeight: 26 },
  optionButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: { backgroundColor: '#EDE9FE', borderColor: '#7C3AED', borderWidth: 1 },
  correctOption: { backgroundColor: '#ECFDF5', borderColor: '#10B981', borderWidth: 1 },
  incorrectOption: { backgroundColor: '#FEF2F2', borderColor: '#EF4444', borderWidth: 1 },
  optionText: { fontSize: 16, color: '#334155', flex: 1 },
  correctOptionText: { color: '#10B981', fontWeight: '600' },
  incorrectOptionText: { color: '#EF4444', fontWeight: '600' },
  optionIcon: { marginLeft: 8 },
  explanationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  explanationTitle: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 4 },
  explanationText: { fontSize: 15, color: '#475569', lineHeight: 22 },
  actionButtons: { marginTop: 8 },
  actionButton: { backgroundColor: '#7C3AED', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  disabledButton: { backgroundColor: '#CBD5E1' },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  resultsContainer: { alignItems: 'center', paddingVertical: 24 },
  resultTitle: { fontSize: 24, fontWeight: '700', color: '#1E293B', marginBottom: 24 },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  scoreTopic: { fontSize: 18, color: '#64748B', marginBottom: 8 },
  scoreText: { fontSize: 20, fontWeight: '600', color: '#334155', marginBottom: 12 },
  scorePercentage: { fontSize: 36, fontWeight: '700', color: '#7C3AED' },
  resetButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
