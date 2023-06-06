import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, { payload: { user } }) => {
      // BEGIN (write your solution here)
      state.tasks.push(user);
      // END
    },
  },
});

export const { actions } = usersSlice;

export default usersSlice.reducer;