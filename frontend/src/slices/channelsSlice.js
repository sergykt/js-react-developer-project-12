import axios from 'axios';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from "../routes.js";

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

export const fetchData = createAsyncThunk(
  'channels/fetchData',
  async () => {
    const responce = await axios(routes.dataPath(), {
      method: 'GET',
      headers: getAuthHeader(),
    });

    return(responce.data);
  },
);

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
      });
  },
});

export const {
  addChannel, 
  changeChannel, 
  renameChannel, 
  removeChannel, 
} = channelsSlice.actions;

export default channelsSlice.reducer;