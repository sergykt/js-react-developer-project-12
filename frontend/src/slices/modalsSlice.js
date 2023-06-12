import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpened: false,
  type: null,
  extra: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    closeModal(state) {
      state.isOpened = false;
      state.type = null;
      state.extra = null;
    },
    setModalAdd(state) {
      state.type = 'adding';
      state.isOpened = true;
    },
    setModalRename(state, { payload }) {
      state.type = 'renaming';
      state.isOpened = true;
      state.extra = payload;
    },
    setModalRemove(state, { payload }) {
      state.type = 'removing';
      state.isOpened = true;
      state.extra = payload;
    },
  },
});

export const { closeModal, setModalAdd, setModalRemove, setModalRename } = modalsSlice.actions;

export default modalsSlice.reducer;
