import axios from 'axios'
import storageService from './storageService'

const baseUrl = '/api/comprehensive'


const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

export default {
  getAll
}
