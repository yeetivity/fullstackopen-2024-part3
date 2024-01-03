import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = newContact => {
    return axios.post(baseUrl, newContact).then(response => response.data)
}

const update = changedContact => {
    return axios.put(`${baseUrl}/${changedContact.id}`, changedContact).then(response => response.data)
}

const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, deleteContact }