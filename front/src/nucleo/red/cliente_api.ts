/**
 * Cliente HTTP para la API Laravel (Sanctum Bearer en rutas protegidas).
 */
import axios from 'axios'
import { obtenerToken } from '@/nucleo/almacenamiento/storage'

export const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

clienteApi.interceptors.request.use((config) => {
  const token = obtenerToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
