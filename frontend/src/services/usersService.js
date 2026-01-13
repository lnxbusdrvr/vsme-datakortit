import axios from 'axios';

const baseUrl = '/api/users';


const createUser = async (newUser) => {
  const request = await axios.post(baseUrl, newUser);
  return request.data;
};

const getUserById = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`)
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
