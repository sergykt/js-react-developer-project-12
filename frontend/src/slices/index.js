import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, {
  addChannel, changeChannel, renameChannel, removeChannel, setInitialState,
} from './channelsSlice.js';
import messagesReducer, { addMessage } from './messagesSlice.js';
import modalsReducer, {
  closeModal, setModalAdd, setModalRemove, setModalRename,
} from './modalsSlice.js';

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
