import { createSlice } from '@reduxjs/toolkit'

import usersService from '../services/usersService'


const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    set(state, { payload }) {
      return payload
    }
  }
});

const { set } = slice.actions;

export const initializeUsers = () => {
  return async dispatch => {
    const data = await usersService.getAll()
    dispatch(set(data))
  }
};

export default slice.reducer;
