import axios from 'axios'
import { getToken, clearSession } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export const client = axios.create({ baseURL: `${API_URL}/api` })

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined' && err.response?.status === 401) {
      clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
