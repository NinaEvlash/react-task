import reducer, { toggleItem, clearItems } from './selectedItemSlice';

const mockItem = {
  name: 'Item 1',
  description: 'Description 1',
};

describe('selectedItemSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      items: [],
    });
  });

  it('should add item if not exists', () => {
    const initialState = {
      items: [],
    };

    const state = reducer(initialState, toggleItem(mockItem));

    expect(state.items).toEqual([mockItem]);
  });

  it('should remove item if already exists', () => {
    const initialState = {
      items: [mockItem],
    };

    const state = reducer(initialState, toggleItem(mockItem));

    expect(state.items).toEqual([]);
  });

  it('should clear all items', () => {
    const initialState = {
      items: [
        mockItem,
        {
          name: 'Item 2',
          description: 'Description 2',
        },
      ],
    };

    const state = reducer(initialState, clearItems());

    expect(state.items).toEqual([]);
  });
});
