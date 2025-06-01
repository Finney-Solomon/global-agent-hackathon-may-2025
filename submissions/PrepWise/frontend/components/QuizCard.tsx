import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QuizQuestion } from '@/types';
import { CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react-native';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showAnswer: boolean;
}

export default function QuizCard({ question, selectedAnswer, onSelectAnswer, showAnswer }: QuizCardProps) {
  const getOptionStyle = (option: string) => {
    if (!showAnswer) {
      return [styles.option, selectedAnswer === option && styles.selectedOption];
    }
    
    if (option === question.correctAnswer) {
      return [styles.option, styles.correctOption];
    }
    
    if (selectedAnswer === option && option !== question.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }
    
    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!showAnswer) {
      return [styles.optionText, selectedAnswer === option && styles.selectedOptionText];
    }
    
    if (option === question.correctAnswer) {
      return [styles.optionText, styles.correctOptionText];
    }
    
    if (selectedAnswer === option && option !== question.correctAnswer) {
      return [styles.optionText, styles.incorrectOptionText];
    }
    
    return styles.optionText;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question.question}</Text>
      
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => onSelectAnswer(option)}
            disabled={showAnswer}
          >
            <Text style={getOptionTextStyle(option)}>{option}</Text>
            
            {showAnswer && option === question.correctAnswer && (
              <CheckCircle2 size={20} color="#10B981" />
            )}
            
            {showAnswer && selectedAnswer === option && option !== question.correctAnswer && (
              <XCircle size={20} color="#EF4444" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {showAnswer && (
        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  correctOption: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  incorrectOption: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
  },
  selectedOptionText: {
    color: '#7C3AED',
    fontWeight: '500',
  },
  correctOptionText: {
    color: '#10B981',
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  explanation: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
});