/**
 * Entidades del módulo autenticación (API Laravel + Sanctum).
 */
export interface UsuarioLogin {
  email: string
  password: string
}

export interface UsuarioRegistro {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UsuarioSesion {
  id: number
  name: string
  email: string
}

export interface RespuestaAuth {
  token: string
  user: UsuarioSesion
}

export interface RespuestaMe {
  user: UsuarioSesion
}
