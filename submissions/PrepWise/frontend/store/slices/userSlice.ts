import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  sessionId: string;
  name: string;
  exam: string;
  subjects: string[];
  understandingLevel: string;
  schoolYear: string;
  targetYear: string;
  dailyStudyTime: string;
  isProfileComplete: boolean;
}

const initialState: UserState = {
  sessionId: '',
  name: '',
  exam: '',
  subjects: [],
  understandingLevel: '',
  schoolYear: '',
  targetYear: '',
  dailyStudyTime: '',
  isProfileComplete: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    resetProfile: () => initialState,
  },
});

export const { setUserProfile, resetProfile } = userSlice.actions;
export default userSlice.reducer;