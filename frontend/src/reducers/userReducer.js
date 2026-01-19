import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/loginService';
import userService from '../services/userService';
import storageService from '../services/storageService';
import { notify } from './notificationReducer'


const initialState = null

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set(state, action) {
      return action.payload
    },
    clear() {
      return initialState
    }
  },
})

export const { set, clear } = slice.actions

export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      console.log('Sending login request with:', credentials);

      // fetch token and id from login controller
      const loginResponse = await loginService.login(credentials)

      // Save to storage and to userService
      storageService.saveUser(loginResponse)
      // and to userService
      userService.setUser(loginResponse)

      dispatch(set(loginResponse))
      dispatch(notify(`Tervetuloa takaisin, ${loginResponse.name}!`, 5, false))
      return loginResponse // return for the component
    } catch (e) {
      dispatch(notify( 'Väärä käyttäjätunnus tai salasana', 5, true ));
    }
  }
}

export const initUser = () => {
  return async dispatch => {
    const user = storageService.loadUser()
    if (user) {
      userService.setUser(user)
      dispatch(set(user))
    }
  }
}

export const clearUser = () => {
  return async dispatch => {
    storageService.removeUser()
    dispatch(clear())
  }
}


export default slice.reducer

