import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FormData = {
  id: string;
  type: 'uncontrolled' | 'rhf';
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
};

type FormsState = {
  submissions: FormData[];
};

const initialState: FormsState = {
  submissions: [],
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<FormData>) => {
      state.submissions.push(action.payload);
    },
  },
});

export const { addSubmission } = formsSlice.actions;
export default formsSlice.reducer;
