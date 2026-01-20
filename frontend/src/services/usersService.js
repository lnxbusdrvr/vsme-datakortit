import axios from 'axios';
import userService from './userService'


const baseUrl = '/api/users';

const createUser = async (newUser) => {
  const request = await axios.post(baseUrl, newUser);
  return request.data;
};

const getUserById = async (id) => {
  // Do not do this globally, token won't be set yet
  const config = {
    headers: { Authorization: `Bearer ${userService.getToken()}` }
  }
  const request = await axios.get(`${baseUrl}/${id}`, config)
  return request.data
}

const getAll = async () => {
  const config = {
    headers: { Authorization: `Bearer ${userService.getToken()}` }
  }
  const request = await axios.get(baseUrl, config);
  return request.data;
};

export default {
  createUser,
  getAll,
  getUserById
};
