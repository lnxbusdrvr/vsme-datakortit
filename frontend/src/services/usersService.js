import axios from 'axios';
import userService from './userService'

const baseUrl = '/api/users';


const createUser = async (newUser) => {
  const request = await axios.post(baseUrl, newUser);
  return request.data;
};

const getUserById = async (id) => {
  const token = userService.getToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const request = await axios.get(`${baseUrl}/${id}`, config)
  return request.data
}

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

export default {
  createUser,
  getAll,
  getUserById
};
