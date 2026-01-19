let token = null;

const KEY = 'loggedVsmeDatakortitAppUser'

const setUser = (user) => {
  window.localStorage.setItem(KEY, JSON.stringify(user))
  token = user.token
}

const getUser = () => {
  const loggedJsonformUser = window
    .localStorage
    .getItem(KEY)
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
