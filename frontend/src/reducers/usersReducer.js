import { createSlice } from '@reduxjs/toolkit'

import usersService from '../services/usersService'
import { notify } from '../reducers/notificationReducer';


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
    try {
      const resNewUser = await usersService.createUser(newUser)
      dispatch(appendUser(resNewUser))
      dispatch(notify(`Käyttäjä ${newUser.name} luotu!`, 5, false));
      return true;
    } catch {
      dispatch(notify('Käyttäjätunnuksen luominen onnistui, ehkä sähköposti, tai/ja Y-tunnus jo käytössä', 10, true));
      return false;
    }
  }
};

export default slice.reducer;
