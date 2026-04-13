import axios from 'axios'
import storageService from './storageService'

const baseUrl = '/api/answers'


const getHeaders = () => ({
  Authorization: storageService.loadUser()
  ? `Bearer ${storageService.loadUser().token}`
  : null
})

const createAnswer = async (answer) => {
  // First Try to update
  answer.groupAnswers.map(a => (
  console.log(`answer.groupAnswers: ${a}`)
  ))
  try {
    const response = await axios
      .put(`${baseUrl}/${answer.id}`, answer, { headers: getHeaders() })
  }
  catch (error) {
    if (error.response?.status === 404) {
      // if fails then create new
      const response = await axios.post(baseUrl, answer, { headers: getHeaders() })
      return response.data
    }
    throw error
  }
}

const getAll = async () => {
  const request = await axios.get(baseUrl, { headers: getHeaders() })
  return request.data
}

const getAnswerById = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}`, { headers: getHeaders() })
  return request.data
}

const updateAnswer = async (id, updatedAnswer) => {
  const response = await axios.patch(`${baseUrl}/${id}`, updatedAnswer, { headers: getHeaders() })
  return response.data
}

const deleteAnswer = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`, { headers: getHeaders() })
  return request.data
}

export default {
  createAnswer,
  getAll,
  getAnswerById,
  updateAnswer,
  deleteAnswer
}
