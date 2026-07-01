import axios from 'axios'
import { store } from '../store'
import { setSessionExpired } from '../store/slices/authSlice'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) store.dispatch(setSessionExpired(true))
      if (status === 403) return Promise.reject(new Error('You do not have permission to perform this action.'))
      if (status === 404) return Promise.reject(new Error('The requested resource was not found.'))
      if (status >= 500) return Promise.reject(new Error('A server error occurred. Please try again later.'))
      return Promise.reject(new Error(error.response.data?.message || 'Request failed'))
    }
    if (error.request) return Promise.reject(new Error('Network error. Please check your connection.'))
    return Promise.reject(new Error(error.message))
  }
)

export default apiClient
