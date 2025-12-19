import { createSlice } from '@reduxjs/toolkit'

import usersService from '../services/usersService'


const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, { payload }) {
      return payload
    },
    appendUser(state, { payload }) {
      state.push(payload)
    }
  }
});

const { setUsers, appendUser } = slice.actions;

export const initializeUsers = () => {
  return async dispatch => {
    const data = await usersService.getAll()
    dispatch(setUsers(data))
  }
};

export const createUser = (newUser) => {
  return async dispatch => {
    const resNewUser = await usersService.createUser(newUser)
    dispatch(appendUser(resNewUser))
  }
};

export default slice.reducer;
