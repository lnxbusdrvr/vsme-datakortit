import { createSlice } from '@reduxjs/toolkit'

import loginService from '../services/loginService';
import usersService from '../services/usersService';
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
      console.log('Login response:', loginResponse);
      console.log(`Token set, fetching user details...`)

      // fetch full user details from users controller
      const fullUser = await usersService.getUserById(loginResponse.id)
      console.log(`Full user data: ${fullUser}`)
      const user = { ...fullUser, token: loginResponse.token }

      storageService.saveUser(user)
      dispatch(set(user))
      return user
    } catch (e) {
      dispatch(notify('wrong username or password', 'error'))
    }
  }
}

export const initUser = () => {
  return async dispatch => {
    const user = storageService.loadUser()
    dispatch(set(user))
  }
}

export const clearUser = () => {
  return async dispatch => {
    storageService.removeUser()
    dispatch(clear())
  }
}


export default slice.reducer

