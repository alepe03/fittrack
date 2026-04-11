/**
 * Cliente HTTP para la API Laravel (Sanctum Bearer en rutas protegidas).
 */
import axios from 'axios'

export const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Bearer Sanctum cuando hay token en localStorage
clienteApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
