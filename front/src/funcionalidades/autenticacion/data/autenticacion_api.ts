/**
 * API mock de autenticación. Sin backend; valida credenciales fijas.
 */
import type { UsuarioLogin, SesionMock } from '../model/entidades'

const EMAIL_DEMO = 'admin@demo.com'
const PASS_DEMO = '1234'
const TOKEN_DEMO = 'demo-token'

export async function loginMock(credenciales: UsuarioLogin): Promise<SesionMock | null> {
  await new Promise((r) => setTimeout(r, 400)) // simula latencia
  if (credenciales.email === EMAIL_DEMO && credenciales.password === PASS_DEMO) {
    return { token: TOKEN_DEMO, email: credenciales.email }
  }
  return null
}
