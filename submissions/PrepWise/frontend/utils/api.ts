import axios from 'axios';
import { UserProfile, Quiz } from '@/types';

const API_BASE_URL = 'http://localhost:8001';

// Setup user profile
export const setupProfile = async (profileData: UserProfile) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/setup`, profileData);
    console.log(response,"response setupProfile")
    return response.data;
  } catch (error) {
    console.error('API Error in setupProfile:', error);
    // Return mock data for development if API is not available
    return {
      status: 'success',
      message: 'Profile created successfully',
    };
  }
};

// Fetch learning plan
export const fetchLearningPlan = async (sessionId: string) => {
  try {
    // This endpoint is not specified in requirements but would be needed
    const response = await axios.get(`${API_BASE_URL}/agent/plan?session_id=${sessionId}`);

    console.log(response,"response fetchLearningPlan")
    return response.data;
  } catch (error) {
    console.error('API Error in fetchLearningPlan:', error);
    // Return mock data
    return {
      topics: [
        { id: '1', title: 'Diversity in Living World', subject: 'Biology' },
        { id: '2', title: 'Laws of Motion', subject: 'Physics' },
        { id: '3', title: 'Cell Structure and Function', subject: 'Biology' },
        { id: '4', title: 'Optics and Light', subject: 'Physics' },
      ],
    };
  }
};

// Ask a question about a topic
export const askQuestion = async (sessionId: string, message: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/ask`, {
      message,
      session_id: sessionId,
    });
    console.log(askQuestion," response askQuestion")
    return response.data;
  } catch (error) {
    console.error('API Error in askQuestion:', error);
    // Return mock data
    return {
      message: `This topic is fundamental to your exam preparation. It covers essential concepts and principles that will be tested. Make sure to understand the key definitions, classifications, and applications.`,
    };
  }
};

// Fetch quiz for a topic
export const fetchQuiz = async (topic: string, sessionId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/agent/quiz`, {
      message: topic,
      session_id: sessionId,
    });
    console.log(response,"response fetchQuiz")
    // Format the response as needed
    const quizData = response.data;
    
    // If the API response format needs transformation
    return {
      topic,
      questions: quizData.questions || [],
    };
  } catch (error) {
    console.error('API Error in fetchQuiz:', error);
    // Return mock quiz data
    return {
      topic,
      questions: [
        {
          id: '1',
          question: 'Which of the following is NOT a kingdom in the five-kingdom classification?',
          options: ['Monera', 'Protista', 'Fungi', 'Insecta'],
          correctAnswer: 'Insecta',
          explanation: 'Insecta is a class of Arthropoda, not a kingdom. The five kingdoms are Monera, Protista, Fungi, Plantae, and Animalia.'
        },
        {
          id: '2',
          question: 'Which scientist proposed the five-kingdom classification?',
          options: ['Charles Darwin', 'R.H. Whittaker', 'Carolus Linnaeus', 'Gregor Mendel'],
          correctAnswer: 'R.H. Whittaker',
          explanation: 'R.H. Whittaker proposed the five-kingdom classification system in 1969.'
        },
        {
          id: '3',
          question: 'What is the main criterion for the five-kingdom classification?',
          options: ['Cell structure', 'Mode of nutrition', 'Habitat', 'All of these'],
          correctAnswer: 'All of these',
          explanation: 'The five-kingdom classification uses multiple criteria including cell structure, mode of nutrition, and habitat.'
        }
      ]
    } as Quiz;
  }
};