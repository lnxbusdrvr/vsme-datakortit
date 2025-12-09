import { createSlice } from '@reduxjs/toolkit'

import usersService from '../services/usersService'


const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, { payload }) {
      return payload
    }
  }
});

const { setUsers } = slice.actions;

export const initializeUsers = () => {
  return async dispatch => {
    const data = await usersService.getAll()
    dispatch(setUsers(data))
  }
};

export default slice.reducer;
