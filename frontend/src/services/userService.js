let token = null;

const setUser = (user) => {
  token = user.token
}

const getToken = () => token

const clearUser = () => {
  token = null
}

export default {
  setUser,
  getToken,
  clearUser
}
