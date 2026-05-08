import axios from 'axios'

const baseUrl = '/api/comprehensive'


const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default {
  getAll
}
