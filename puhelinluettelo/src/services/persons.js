import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  console.log("ui/services/persons.js getAll",baseUrl)
  return axios.get(baseUrl)
}

const create = newObject => {
  console.log("ui/services/persons.js create",baseUrl)
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }