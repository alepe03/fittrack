/**
 * Entidades del módulo autenticación (mínimas para login mock).
 */
export interface UsuarioLogin {
  email: string
  password: string
}

export interface SesionMock {
  token: string
  email: string
}
