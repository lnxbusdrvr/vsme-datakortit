import axios from 'axios'

const baseUrl = '/api/comprehensive'


const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

export default {
  getAll
}
