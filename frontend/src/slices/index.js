import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice.js';

export default configureStore({
  reducer: {
    // BEGIN (write your solution here)
    users: usersReducer,
    // END
  },
});