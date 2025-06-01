import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '@/store/slices/userSlice';
import { setupProfile } from '@/utils/api';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { SquareCheck as CheckSquare, Square, ArrowRight, Book, Trophy } from 'lucide-react-native';

export default function SetupScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    exam: '',
    subjects: [] as string[],
    understandingLevel: '',
    schoolYear: '',
    targetYear: '',
    dailyStudyTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const allSubjects = [
    'Biology', 'Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science'
  ];
  
  const understandingLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const schoolYears = ['Class 9', 'Class 10', 'Class 11', 'Class 12',"Undergraduate",'Postgraduate'];
  const targetYears = ['2025', '2026', '2027','2028','2029','2030'];
  const studyTimes = ['1 hour', '2 hours', '3 hours', '4 hours',, '6 hours', '8 hours', '12 hours',, '14+ hours'];
  const exams = ['NEET', 'JEE', 'UPSC', 'CAT', 'GATE', 'SSC', 'Banking', 'Other'];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const toggleSubject = (subject: string) => {
    if (formData.subjects.includes(subject)) {
      handleInputChange('subjects', formData.subjects.filter(s => s !== subject));
    } else {
      handleInputChange('subjects', [...formData.subjects, subject]);
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.exam) newErrors.exam = 'Please select an exam';
    } else if (currentStep === 2) {
      if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
      if (!formData.understandingLevel) newErrors.understandingLevel = 'Please select your understanding level';
    } else if (currentStep === 3) {
      if (!formData.schoolYear) newErrors.schoolYear = 'Please select your current school year';
      if (!formData.targetYear) newErrors.targetYear = 'Please select your target year';
      if (!formData.dailyStudyTime) newErrors.dailyStudyTime = 'Please select your daily study time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    const sessionId = uuidv4();
    
    try {
      await setupProfile({
        session_id: sessionId,
        name: formData.name,
        exam: formData.exam,
        subjects: formData.subjects,
        understanding_level: formData.understandingLevel,
        school_year: formData.schoolYear,
        target_year: formData.targetYear,
        daily_study_time: formData.dailyStudyTime,
      });
      dispatch(setUserProfile({
        sessionId,
        name: formData.name,
        exam: formData.exam,
        subjects: formData.subjects,
        understandingLevel: formData.understandingLevel,
        schoolYear: formData.schoolYear,
        targetYear: formData.targetYear,
        dailyStudyTime: formData.dailyStudyTime,
        isProfileComplete: true,
      }));
      router.replace('/(tabs)/');
    } catch (error) {
      console.error('Error setting up profile:', error);
      dispatch(setUserProfile({
        sessionId,
        name: formData.name,
        exam: formData.exam,
        subjects: formData.subjects,
        understandingLevel: formData.understandingLevel,
        schoolYear: formData.schoolYear,
        targetYear: formData.targetYear,
        dailyStudyTime: formData.dailyStudyTime,
        isProfileComplete: true,
      }));
      router.replace('/(tabs)/');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleActive}><Text style={styles.stepTextActive}>1</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepCircle}><Text style={styles.stepText}>2</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepCircle}><Text style={styles.stepText}>3</Text></View>
      </View>
      
      <Text style={styles.stepTitle}>Let's get started</Text>
      <Text style={styles.stepDescription}>Tell us a bit about yourself to create a personalized learning plan.</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preparing for</Text>
        <View style={styles.optionsGrid}>
          {exams.map((exam) => (
            <TouchableOpacity
              key={exam}
              style={[
                styles.optionButton,
                formData.exam === exam ? styles.optionButtonSelected : null,
              ]}
              onPress={() => handleInputChange('exam', exam)}
            >
              <Book size={18} color={formData.exam === exam ? '#7C3AED' : '#64748B'} />
              <Text
                style={[
                  styles.optionText,
                  formData.exam === exam ? styles.optionTextSelected : null,
                ]}
              >
                {exam}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.exam ? <Text style={styles.errorText}>{errors.exam}</Text> : null}
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleCompleted}><Text style={styles.stepTextCompleted}>✓</Text></View>
        <View style={styles.stepLineCompleted} />
        <View style={styles.stepCircleActive}><Text style={styles.stepTextActive}>2</Text></View>
        <View style={styles.stepLine} />
        <View style={styles.stepCircle}><Text style={styles.stepText}>3</Text></View>
      </View>
      
      <Text style={styles.stepTitle}>Your study preferences</Text>
      <Text style={styles.stepDescription}>Select subjects and your current knowledge level.</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Subjects</Text>
        <View style={styles.checkboxContainer}>
          {allSubjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={styles.checkboxRow}
              onPress={() => toggleSubject(subject)}
            >
              {formData.subjects.includes(subject) ? (
                <CheckSquare size={22} color="#7C3AED" />
              ) : (
                <Square size={22} color="#94A3B8" />
              )}
              <Text style={styles.checkboxLabel}>{subject}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.subjects ? <Text style={styles.errorText}>{errors.subjects}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Your current understanding level</Text>
        <View style={styles.optionsRow}>
          {understandingLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                formData.understandingLevel === level ? styles.levelButtonSelected : null,
              ]}
              onPress={() => handleInputChange('understandingLevel', level)}
            >
              <Trophy 
                size={18} 
                color={formData.understandingLevel === level ? '#7C3AED' : '#64748B'} 
              />
              <Text
                style={[
                  styles.levelText,
                  formData.understandingLevel === level ? styles.levelTextSelected : null,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.understandingLevel ? <Text style={styles.errorText}>{errors.understandingLevel}</Text> : null}
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleCompleted}><Text style={styles.stepTextCompleted}>✓</Text></View>
        <View style={styles.stepLineCompleted} />
        <View style={styles.stepCircleCompleted}><Text style={styles.stepTextCompleted}>✓</Text></View>
        <View style={styles.stepLineCompleted} />
        <View style={styles.stepCircleActive}><Text style={styles.stepTextActive}>3</Text></View>
      </View>
      
      <Text style={styles.stepTitle}>Final details</Text>
      <Text style={styles.stepDescription}>Complete your profile to get a personalized study plan.</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current school year</Text>
        <View style={styles.optionsRow}>
          {schoolYears.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.optionPill,
                formData.schoolYear === year ? styles.optionPillSelected : null,
              ]}
              onPress={() => handleInputChange('schoolYear', year)}
            >
              <Text
                style={[
                  styles.optionPillText,
                  formData.schoolYear === year ? styles.optionPillTextSelected : null,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.schoolYear ? <Text style={styles.errorText}>{errors.schoolYear}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Target year for exam</Text>
        <View style={styles.optionsRow}>
          {targetYears.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.optionPill,
                formData.targetYear === year ? styles.optionPillSelected : null,
              ]}
              onPress={() => handleInputChange('targetYear', year)}
            >
              <Text
                style={[
                  styles.optionPillText,
                  formData.targetYear === year ? styles.optionPillTextSelected : null,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.targetYear ? <Text style={styles.errorText}>{errors.targetYear}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Daily study time</Text>
        <View style={styles.optionsRow}>
          {studyTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.optionPill,
                formData.dailyStudyTime === time ? styles.optionPillSelected : null,
              ]}
              onPress={() => handleInputChange('dailyStudyTime', time)}
            >
              <Text
                style={[
                  styles.optionPillText,
                  formData.dailyStudyTime === time ? styles.optionPillTextSelected : null,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.dailyStudyTime ? <Text style={styles.errorText}>{errors.dailyStudyTime}</Text> : null}
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.backButton} onPress={prevStep} disabled={loading}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.submitButton, loading ? styles.disabledButton : null]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Create Learning Plan</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
             <Text style={styles.logo}>Welcome to PrepWise</Text>
        <Text >Your AI-Powered Learning Companion</Text>
       
      </View>

      <View style={styles.formContainer}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom:8
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#64748B',
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepTextCompleted: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  stepLineCompleted: {
    flex: 1,
    height: 2,
    backgroundColor: '#10B981',
    marginHorizontal: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginBottom: 12,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionButtonSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  optionText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
  },
  optionTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  checkboxContainer: {
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flex: 1,
    justifyContent: 'center',
  },
  levelButtonSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  levelText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  levelTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  optionPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionPillSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  optionPillText: {
    fontSize: 14,
    color: '#64748B',
  },
  optionPillTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#A78BFA',
  },
});