/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import { setInitialState, removeChannel } from './channelsSlice.js';

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
      .addCase(setInitialState, (state, { payload: { messages } }) => {
        state.messages = messages;
      })
      .addCase(removeChannel, (state, { payload }) => {
        const { id } = payload;
        state.messages = state.messages.filter(({ channelId }) => channelId !== id);
      });
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
