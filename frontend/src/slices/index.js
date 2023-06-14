import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import modalsReducer from './modalsSlice.js';
import { addChannel, changeChannel, renameChannel, removeChannel, setInitialState } from './channelsSlice.js';
import { addMessage } from './messagesSlice.js';
import { closeModal, setModalAdd, setModalRemove, setModalRename } from './modalsSlice.js';

export default configureStore({
  reducer: {
    channelsReducer,
    messagesReducer,
    modalsReducer,
  },
});

export const actions = {
  addChannel,
  changeChannel,
  renameChannel,
  removeChannel,
  addMessage,
  closeModal,
  setModalAdd,
  setModalRemove,
  setModalRename,
  setInitialState,
};
