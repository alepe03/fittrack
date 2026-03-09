/**
 * Repositorio de autenticación: delega en la API (mock) y expone login.
 */
import { loginMock } from './autenticacion_api'
import type { UsuarioLogin } from '../model/entidades'

export const autenticacionRepositorio = {
  async login(credenciales: UsuarioLogin) {
    return loginMock(credenciales)
  },
}
