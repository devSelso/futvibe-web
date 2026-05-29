import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { getToken, updateToken, clearSession } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export const client = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
})

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingRequests: ((token: string) => void)[] = []

function resolvePending(token: string) {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean }

    if (err.response?.status !== 401 || original._retry || typeof window === 'undefined') {
      return Promise.reject(err)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          if (original.headers) original.headers['Authorization'] = `Bearer ${token}`
          resolve(client(original))
        })
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true },
      )
      updateToken(data.token)
      resolvePending(data.token)
      original.headers ??= {}
      original.headers['Authorization'] = `Bearer ${data.token}`
      return client(original)
    } catch {
      clearSession()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)
