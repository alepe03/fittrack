/**
 * ViewModel de autenticación: login, registro, logout y sesión vía Sanctum.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { autenticacionRepositorio } from '../data/autenticacion_repositorio'
import { guardarToken, borrarToken, obtenerToken } from '@/nucleo/almacenamiento/storage'
import { estadoInicial } from './autenticacion_estado'
import type { UsuarioLogin, UsuarioRegistro, UsuarioSesion } from '../model/entidades'
import { extraerMensajesRespuestaError } from '@/nucleo/red/extraer_mensajes_error'

export const useAutenticacionViewModel = defineStore('autenticacion', () => {
  const cargando = ref(estadoInicial.cargando)
  const error = ref<string | null>(estadoInicial.error)
  const usuario = ref<UsuarioSesion | null>(null)

  const estaLogueado = computed(() => usuario.value !== null && !!obtenerToken())

  function limpiarSesionLocal(): void {
    borrarToken()
    usuario.value = null
    error.value = null
  }

  function aplicarRespuestaAuth(data: { token: string; user: UsuarioSesion }): void {
    guardarToken(data.token)
    usuario.value = data.user
  }

  async function asegurarSesion(): Promise<void> {
    if (!obtenerToken()) {
      throw new Error('Sesión no disponible')
    }
    if (usuario.value !== null) {
      return
    }
    const { user } = await autenticacionRepositorio.me()
    usuario.value = user
  }

  async function login(credenciales: UsuarioLogin): Promise<boolean> {
    cargando.value = true
    error.value = null
    try {
      const data = await autenticacionRepositorio.login(credenciales)
      aplicarRespuestaAuth(data)
      return true
    } catch (e: unknown) {
      usuario.value = null
      error.value = extraerMensajesRespuestaError(e)
      return false
    } finally {
      cargando.value = false
    }
  }

  async function register(datos: UsuarioRegistro): Promise<boolean> {
    cargando.value = true
    error.value = null
    try {
      const data = await autenticacionRepositorio.register(datos)
      aplicarRespuestaAuth(data)
      return true
    } catch (e: unknown) {
      usuario.value = null
      error.value = extraerMensajesRespuestaError(e)
      return false
    } finally {
      cargando.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      if (obtenerToken()) {
        await autenticacionRepositorio.logout()
      }
    } catch {
      // Si el token ya era inválido, igualmente limpiamos el cliente.
    } finally {
      limpiarSesionLocal()
    }
  }

  return {
    cargando,
    error,
    usuario,
    estaLogueado,
    login,
    register,
    logout,
    asegurarSesion,
    limpiarSesionLocal,
  }
})
