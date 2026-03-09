/**
 * Wrapper simple sobre localStorage para token y datos persistentes.
 */

const CLAVE_TOKEN = 'token'

export function obtenerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function guardarToken(token: string): void {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export function borrarToken(): void {
  localStorage.removeItem(CLAVE_TOKEN)
}

export function estaLogueado(): boolean {
  return !!obtenerToken()
}
