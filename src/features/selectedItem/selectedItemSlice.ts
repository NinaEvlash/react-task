import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SelectedItem = {
  name: string;
  description: string;
};

type SelectedItemState = {
  items: SelectedItem[];
};

const initialState: SelectedItemState = {
  items: [],
};

const selectedItemSlice = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<SelectedItem>) {
      const exists = state.items.some((item) => item.name === action.payload.name);

      if (exists) {
        state.items = state.items.filter((item) => item.name !== action.payload.name);
      } else {
        state.items.push(action.payload);
      }
    },
    clearItems(state) {
      state.items = [];
    },
  },
});

export const { toggleItem, clearItems } = selectedItemSlice.actions;
export default selectedItemSlice.reducer;
