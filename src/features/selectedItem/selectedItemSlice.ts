import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  items: [] as string[],
};

const selectedItemSlice = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<string>) {
      const exists = state.items.includes(action.payload);

      if (exists) {
        state.items = state.items.filter((p) => p !== action.payload);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { toggleItem } = selectedItemSlice.actions;
export default selectedItemSlice.reducer;
