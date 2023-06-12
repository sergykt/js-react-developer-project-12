import { createSelector } from "@reduxjs/toolkit";

export const getCurrentChannelId = (state) => state.channelsReducer.currentChannelId;
export const getChannels = (state) => state.channelsReducer.channels;

export const getChannelById = (id) => createSelector(
  (state) => state.channelsReducer.channels,
  (channels) => channels.find((item) => item.id === id),
);

export const getChannelName = createSelector(
  (state) => state.channelsReducer.channels,
  (state) => state.channelsReducer.currentChannelId,
  (channels, currentChannelId) => {
    const channel = channels.find(({ id }) => id === currentChannelId) || { name: ''};
    return channel.name;
  },
);

export const getChannelsNames = createSelector(
  (state) => state.channelsReducer.channels,
  (channels) => channels.map(({ name }) => name),
);

export const getMessages = (state) => state.messagesReducer;

export const getChannelMessages = createSelector(
  (state) => state.messagesReducer.messages,
  (state) => state.channelsReducer.currentChannelId,
  (messages, currentChannelId) => messages.filter(({ channelId }) => channelId === currentChannelId),
);

export const getUserName = () => {
  const userId = JSON.parse(localStorage.getItem('userId')) || { username: '' };
  return userId.username;
};

export const getIsModalOpened = (state) => state.modalsReducer.isOpened;

export const getModalType = (state) => state.modalsReducer.type;

export const getExtraId = (state) => state.modalsReducer.extra;


