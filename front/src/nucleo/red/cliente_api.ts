/**
 * Cliente HTTP configurado para la API real (futuro).
 * De momento no se usa; los repositorios consumen datos mock.
 */
import axios from 'axios'

export const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir token cuando exista API real
clienteApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
