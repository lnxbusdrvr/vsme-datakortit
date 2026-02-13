import axios from 'axios'
import storageService from './storageService'

const baseUrl = '/api/answers'


const headers = {
  Authorization: storageService.loadUser()
  ? `Bearer ${storageService.loadUser().token}`
  : null
}

const createAnswer = async (answer) => {
  const request = await axios.post(baseUrl, answer, { headers })
  return request.data
}

export default {
  createAnswer
}
