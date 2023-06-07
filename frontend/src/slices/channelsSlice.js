import axios from "axios";

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
      });
  },
});

export const { actions } = channelsSlice;

export default channelsSlice.reducer;