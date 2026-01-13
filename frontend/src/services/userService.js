let token = null;

import { KEY as STORAGE_KEY } from './storageService';


const setUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.strigify(user))
  token = user.token
}

const getUser = () => {
  const loggedJsonformUser = window
    .localStorage
    .getItem(STORAGE_KEY)
  if (loggedJsonformUser) {
    const user = JSON.parse(loggedJsonformUser)
    token = user.token
    return user
  }
  return null
}

const clearUser = () => {
  localStorage.clear()
  token = null
}

const getToken = () => token

export default {
  setUser,
  getUser,
  clearUser,
  getToken
}
