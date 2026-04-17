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
      return [...state, payload]
    },
    update(state, { payload }) {
      const updatedUserInfo = payload
      return state.map(u => u.id === updatedUserInfo.id
        ? updatedUserInfo
        : u)
    }
  }
});

const { setUsers, appendUser, update } = slice.actions;

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
      dispatch(notify('Käyttäjätunnuksen luominen epäonnistui, ehkä sähköposti, tai/ja Y-tunnus on jo käytössä', 10, true));
      return false;
    }
  }
};

export const updateUser = (id, updatedUserValue) => {
  return async dispatch => {
    try {
      const resUpdatedUserInfo = await usersService.updateUser(id, updatedUserValue)
      dispatch(update(resUpdatedUserInfo))
      dispatch(notify(`Käyttäjän ${updatedUserValue.name} tieto päivitetty!`, 5, false));
      return true;
    }
    catch (error){
      dispatch(notify(`Käyttäjätietojen päivittäminen epäonnistui ${error}`, 10, true));
      return false;
    }
  }
}

export default slice.reducer;
