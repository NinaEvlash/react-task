import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type Submission = {
  id: string;
  type: 'uncontrolled' | 'rhf';
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  image: string;
  password: string;
  confirmPassword: string;
  country: string;
};

type FormsState = {
  submissions: Submission[];
};

const initialState: FormsState = {
  submissions: [],
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<Submission>) => {
      console.log(action.payload);
      state.submissions.push(action.payload);
    },
  },
});

export const { addSubmission } = formsSlice.actions;
export default formsSlice.reducer;
