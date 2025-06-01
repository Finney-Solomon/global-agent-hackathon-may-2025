import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import learningPlanReducer from './slices/learningPlanSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
     learningPlan: learningPlanReducer,
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;