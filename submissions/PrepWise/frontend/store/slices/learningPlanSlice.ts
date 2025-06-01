// store/slices/learningPlanSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizQuestion {
 id: string;
 question: string;
 options: string[];
 correctAnswer: string;
 explanation: string;
}
interface QuizResult {
  answers: { questionId: string; selected: string; correct: string }[];
  scorePercentage: number;
}

interface Topic {
 id: string;
 title: string;
 subject: string;
 details?: string;
 doubts?: string[]; // explanation text
 quizResult?: QuizResult;
}

interface LearningPlanState {
 topics: Topic[];
}

const initialState: LearningPlanState = {
 topics: [],
};

const learningPlanSlice = createSlice({
 name: "learningPlan",
 initialState,
 reducers: {
  setTopics: (state, action: PayloadAction<Topic[]>) => {
   state.topics = action.payload;
  },
  setTopicDetails: (
   state,
   action: PayloadAction<{ topicId: string; details: string }>
  ) => {
   const topic = state.topics.find((t) => t.id === action.payload.topicId);
   if (topic) topic.details = action.payload.details;
  },
  setTopicQuiz: (
   state,
   action: PayloadAction<{ topicId: string; quiz: QuizQuestion[] }>
  ) => {
   const topic = state.topics.find((t) => t.id === action.payload.topicId);
   if (topic) topic.quiz = action.payload.quiz;
  },
  setTopicDoubts: (state, action) => {
   const { topicId, doubt } = action.payload;
   const index = state.topics.findIndex((t) => t.id === topicId);
   if (index !== -1) {
    if (!state.topics[index].doubts) {
     state.topics[index].doubts = [];
    }
    state.topics[index].doubts.push(doubt);
   }
  },
  setTopicQuizResult: (
  state,
  action: PayloadAction<{
    topicId: string;
    result: QuizResult;
  }>
) => {
  const topic = state.topics.find((t) => t.id === action.payload.topicId);
  if (topic) {
    topic.quizResult = action.payload.result;
  }
},

 },
});

export const { setTopics, setTopicDetails, setTopicQuiz, setTopicDoubts,setTopicQuizResult } =
 learningPlanSlice.actions;
export default learningPlanSlice.reducer;
