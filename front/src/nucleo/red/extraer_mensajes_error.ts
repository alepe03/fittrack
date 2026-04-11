/**
 * Unifica mensajes de error de Axios / API Laravel (422, mensaje único, red).
 */

type CuerpoError = {
  message?: string
  errors?: Record<string, string[] | string>
}

export function extraerMensajesRespuestaError(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'No se pudo completar la operación. Inténtalo de nuevo.'
  }

  const anyErr = error as Record<string, unknown>
  const resp = anyErr.response as Record<string, unknown> | undefined
  const data = resp?.data as CuerpoError | undefined

  if (data?.errors && typeof data.errors === 'object') {
    const partes: string[] = []
    for (const msgs of Object.values(data.errors)) {
      if (Array.isArray(msgs)) {
        partes.push(...msgs.filter((m) => typeof m === 'string' && m.length > 0))
      } else if (typeof msgs === 'string' && msgs.length > 0) {
        partes.push(msgs)
      }
    }
    if (partes.length > 0) {
      return partes.join(' ')
    }
  }

  if (data?.message && typeof data.message === 'string' && data.message.length > 0) {
    return data.message
  }

  const axiosMsg = typeof anyErr.message === 'string' ? anyErr.message : ''

  if (axiosMsg === 'Network Error') {
    return 'No hay conexión con el servidor. Comprueba tu red.'
  }
  if (axiosMsg.toLowerCase().includes('timeout')) {
    return 'La petición ha tardado demasiado. Inténtalo de nuevo.'
  }
  if (axiosMsg.length > 0) {
    return axiosMsg
  }

  return 'No se pudo completar la operación. Inténtalo de nuevo.'
}
