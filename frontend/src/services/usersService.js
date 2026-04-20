import axios from 'axios';
import storageService from './storageService'


const baseUrl = '/api/users';

const createUser = async (newUser) => {
  const request = await axios.post(baseUrl, newUser);
  return request.data;
};

const getUserById = async (id) => {
  // Do not do this globally, token won't be set yet
  // Adwised above from ChatGPT or Gemini prompt, or Lumo AI
  const config = {
    headers: { Authorization: `Bearer ${storageService.loadUser().token}` }
  }
  const request = await axios.get(`${baseUrl}/${id}`, config)
  return request.data
}

const getAll = async () => {
  const config = {
    headers: { Authorization: `Bearer ${storageService.loadUser().token}` }
  }
  const request = await axios.get(baseUrl, config);
  return request.data;
};

const updateUser = async (id, updatedUserInfo) => {
  const config = {
    headers: { Authorization: `Bearer ${storageService.loadUser().token}` }
  }
  const response = await axios.patch(`${baseUrl}/${id}`, updatedUserInfo, config)
  return response.data
}

export default {
  createUser,
  getAll,
  getUserById,
  updateUser
}
