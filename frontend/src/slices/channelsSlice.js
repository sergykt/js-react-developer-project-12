import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState(state, { payload }) {
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    },
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },
    changeChannel(state, { payload }) {
      state.currentChannelId = payload;
    },
    renameChannel(state, { payload }) {
      const { id } = payload;
      const channelIndex = state.channels.findIndex((item) => item.id === id);
      state.channels[channelIndex] = payload;
    },
    removeChannel(state, { payload }) {
      const { id } = payload;
      const channelIndex = state.channels.findIndex((item) => item.id === id);
      state.channels.splice(channelIndex, 1);
      if (state.currentChannelId === payload.id) {
        state.currentChannelId = state.channels[0].id;
      }
    },
  },
});

export const {
  setInitialState,
  addChannel,
  changeChannel,
  renameChannel,
  removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
