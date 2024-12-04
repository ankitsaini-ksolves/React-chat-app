import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalType: 'add',
  currentPost: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isModalOpen = !state.isModalOpen;
      if (action.payload) {
        state.modalType = action.payload.type;
        state.currentPost = action.payload.post || null;
      } else {
        state.modalType = 'add';
        state.currentPost = null;
      }
    },
  },
});

export const { toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
