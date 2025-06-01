export interface Topic {
  id: string;
  title: string;
  subject: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface UserProfile {
  session_id: string;
  name: string;
  exam: string;
  subjects: string[];
  understanding_level: string;
  school_year: string;
  target_year: string;
  daily_study_time: string;
}