import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './channelsSlice.js';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, { payload }) {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload: { messages } }) => {
        state.messages = messages;
      });
  },
});

export const { actions } = messagesSlice;

export default messagesSlice.reducer;