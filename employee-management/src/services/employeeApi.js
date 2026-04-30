import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/posts`,
})

export const getAll = () => api.get('/')
export const create = (data) => api.post('/', data)
export const update = (id, data) => api.put(`/${id}`, data)
export const remove = (id) => api.delete(`/${id}`)
