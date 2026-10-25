import axios from 'axios'
import { env } from '../config/env'

export const apiClient = axios.create({ baseURL: env.apiUrl, timeout: 20000 })

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('vistar-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) window.dispatchEvent(new CustomEvent('vistar:unauthorized'))
      if (error.response?.status === 403) window.dispatchEvent(new CustomEvent('vistar:forbidden-response'))
    }
    return Promise.reject(error)
  },
)