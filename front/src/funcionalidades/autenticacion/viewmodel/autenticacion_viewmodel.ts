/**
 * ViewModel de autenticación: acciones que usa la vista (login, logout).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { autenticacionRepositorio } from '../data/autenticacion_repositorio'
import { guardarToken, borrarToken, obtenerToken } from '@/nucleo/almacenamiento/storage'
import { estadoInicial } from './autenticacion_estado'
import type { UsuarioLogin } from '../model/entidades'

export const useAutenticacionViewModel = defineStore('autenticacion', () => {
  const cargando = ref(estadoInicial.cargando)
  const error = ref<string | null>(estadoInicial.error)

  const estaLogueado = computed(() => !!obtenerToken())

  async function login(credenciales: UsuarioLogin): Promise<boolean> {
    cargando.value = true
    error.value = null
    try {
      const sesion = await autenticacionRepositorio.login(credenciales)
      if (sesion) {
        guardarToken(sesion.token)
        return true
      }
      error.value = 'Usuario o contraseña incorrectos'
      return false
    } finally {
      cargando.value = false
    }
  }

  function logout(): void {
    borrarToken()
    error.value = null
  }

  return { cargando, error, estaLogueado, login, logout }
})
