import axios from 'axios'
import storageService from './storageService'

const baseUrl = '/api/answers'


const getHeaders = () => ({
  Authorization: storageService.loadUser()
  ? `Bearer ${storageService.loadUser().token}`
  : null
})

const createAnswer = async (answer) => {
  const response = await axios.post(baseUrl, answer, { headers: getHeaders() })
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl, { headers: getHeaders() })
  return response.data
}

const getAnswerById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, { headers: getHeaders() })
  return response.data
}

const updateAnswer = async (id, updatedAnswer) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updatedAnswer, { headers: getHeaders() })
  return response.data
}

const deleteAnswer = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, { headers: getHeaders() })
  return response.data
}

export default {
  createAnswer,
  getAll,
  getAnswerById,
  updateAnswer,
  deleteAnswer
}
