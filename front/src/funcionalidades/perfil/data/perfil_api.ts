import { clienteApi } from '@/nucleo/red/cliente_api'
import type { UsuarioSesion } from '@/funcionalidades/autenticacion/model/entidades'

export interface ActualizarPerfilPayload {
  name: string
  email: string
}

export interface CambiarPasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

interface PerfilResponse {
  user: UsuarioSesion
}

interface ActualizarPerfilResponse {
  message: string
  user: UsuarioSesion
}

interface CambiarPasswordResponse {
  message: string
}

export const perfilApi = {
  async obtenerPerfil(): Promise<PerfilResponse> {
    const resp = await clienteApi.get<PerfilResponse>('/profile')
    return resp.data
  },

  async actualizarPerfil(payload: ActualizarPerfilPayload): Promise<ActualizarPerfilResponse> {
    const resp = await clienteApi.put<ActualizarPerfilResponse>('/profile', payload)
    return resp.data
  },

  async cambiarPassword(payload: CambiarPasswordPayload): Promise<CambiarPasswordResponse> {
    const resp = await clienteApi.put<CambiarPasswordResponse>('/profile/password', payload)
    return resp.data
  },
}
