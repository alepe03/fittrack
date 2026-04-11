/**
 * Autenticación contra la API Laravel (Sanctum).
 */
import { clienteApi } from '@/nucleo/red/cliente_api'
import type { RespuestaAuth, RespuestaMe, UsuarioLogin, UsuarioRegistro } from '../model/entidades'

export const autenticacionRepositorio = {
  async login(credenciales: UsuarioLogin): Promise<RespuestaAuth> {
    const resp = await clienteApi.post<RespuestaAuth>('/auth/login', credenciales)
    return resp.data
  },

  async register(datos: UsuarioRegistro): Promise<RespuestaAuth> {
    const resp = await clienteApi.post<RespuestaAuth>('/auth/register', datos)
    return resp.data
  },

  async me(): Promise<RespuestaMe> {
    const resp = await clienteApi.get<RespuestaMe>('/auth/me')
    return resp.data
  },

  async logout(): Promise<void> {
    await clienteApi.post('/auth/logout')
  },
}
