import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { perfilApi } from '../data/perfil_api'
import type { ActualizarPerfilPayload, CambiarPasswordPayload } from '../data/perfil_api'
import { extraerMensajesRespuestaError } from '@/nucleo/red/extraer_mensajes_error'

type CampoError = Record<string, string>

function extraerErrores422(error: unknown): CampoError {
  if (typeof error !== 'object' || error === null) return {}
  const anyErr = error as Record<string, unknown>
  const response = anyErr.response as Record<string, unknown> | undefined
  const data = response?.data as { errors?: Record<string, string[] | string> } | undefined
  if (!data?.errors || typeof data.errors !== 'object') return {}

  const resultado: CampoError = {}
  for (const [campo, mensajes] of Object.entries(data.errors)) {
    if (Array.isArray(mensajes) && mensajes.length > 0) {
      resultado[campo] = String(mensajes[0] ?? '')
      continue
    }
    if (typeof mensajes === 'string' && mensajes.length > 0) {
      resultado[campo] = mensajes
    }
  }
  return resultado
}

export const usePerfilViewModel = defineStore('perfil', () => {
  const guardandoDatos = ref(false)
  const guardandoPassword = ref(false)
  const exitoDatos = ref<string | null>(null)
  const exitoPassword = ref<string | null>(null)
  const errorGeneralDatos = ref<string | null>(null)
  const errorGeneralPassword = ref<string | null>(null)
  const erroresDatos = reactive<CampoError>({})
  const erroresPassword = reactive<CampoError>({})

  function limpiarErroresDatos(): void {
    for (const key of Object.keys(erroresDatos)) delete erroresDatos[key]
    errorGeneralDatos.value = null
  }

  function limpiarErroresPassword(): void {
    for (const key of Object.keys(erroresPassword)) delete erroresPassword[key]
    errorGeneralPassword.value = null
  }

  async function guardarDatosPersonales(payload: ActualizarPerfilPayload): Promise<{
    ok: boolean
    user?: { id: number; name: string; email: string; plan: 'free' | 'premium' }
  }> {
    guardandoDatos.value = true
    exitoDatos.value = null
    limpiarErroresDatos()
    try {
      const resp = await perfilApi.actualizarPerfil(payload)
      exitoDatos.value = resp.message
      return { ok: true, user: resp.user }
    } catch (e: unknown) {
      Object.assign(erroresDatos, extraerErrores422(e))
      if (Object.keys(erroresDatos).length === 0) {
        errorGeneralDatos.value = extraerMensajesRespuestaError(e)
      }
      return { ok: false }
    } finally {
      guardandoDatos.value = false
    }
  }

  async function cambiarPassword(payload: CambiarPasswordPayload): Promise<boolean> {
    guardandoPassword.value = true
    exitoPassword.value = null
    limpiarErroresPassword()
    try {
      const resp = await perfilApi.cambiarPassword(payload)
      exitoPassword.value = resp.message
      return true
    } catch (e: unknown) {
      Object.assign(erroresPassword, extraerErrores422(e))
      if (Object.keys(erroresPassword).length === 0) {
        errorGeneralPassword.value = extraerMensajesRespuestaError(e)
      }
      return false
    } finally {
      guardandoPassword.value = false
    }
  }

  return {
    guardandoDatos,
    guardandoPassword,
    exitoDatos,
    exitoPassword,
    errorGeneralDatos,
    errorGeneralPassword,
    erroresDatos,
    erroresPassword,
    guardarDatosPersonales,
    cambiarPassword,
  }
})
