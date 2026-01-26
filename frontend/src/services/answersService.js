import axios from 'axios'
import storageService from './storageService'

const baseUrl = '/api/answers'


const headers = {
  Authorization: storageService.loadUser()
  ? `Bearer ${storageService.loadUser().token}`
  : null
}

const createAnswers = async (object) => {
  const request = await axios.post(baseUrl, object, { header })
  return request.data
}

export default {
  createAnswer
}
