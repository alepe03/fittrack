/**
 * API real de rutinas.
 * Convierte el payload Laravel (snake_case + timestamps ISO) al modelo del frontend (camelCase + timestamps numéricos).
 */
import type { Rutina, RutinaEjercicio, SerieObjetivo } from '../model/entidades'
import { clienteApi } from '@/nucleo/red/cliente_api'

const USER_ID_FIJO = 1

function parseFechaIsoToMillis(fechaIso: unknown): number | undefined {
  if (!fechaIso) return undefined
  if (typeof fechaIso === 'number') return fechaIso
  const t = Date.parse(String(fechaIso))
  return Number.isFinite(t) ? t : undefined
}

function pesoASugeridoNumero(peso_sugerido: unknown): number {
  if (peso_sugerido === null || peso_sugerido === undefined) return 0
  const n = Number(peso_sugerido)
  return Number.isFinite(n) ? n : 0
}

function mapSerieObjetivoDesdeApi(serie: any): SerieObjetivo {
  return {
    reps: Number(serie.reps_objetivo),
    pesoSugerido: pesoASugeridoNumero(serie.peso_sugerido),
    orden: serie.orden != null ? Number(serie.orden) : undefined,
  }
}

function mapEjercicioDesdeApi(ej: any): RutinaEjercicio {
  return {
    id: String(ej.id),
    nombre: ej.nombre,
    orden: ej.orden,
    seriesObjetivo: (ej.series ?? []).map(mapSerieObjetivoDesdeApi),
  }
}

function mapRutinaListadoDesdeApi(apiRutina: any): Rutina {
  return {
    id: String(apiRutina.id),
    nombre: apiRutina.nombre,
    descripcion: apiRutina.descripcion ?? null,
    createdAt: parseFechaIsoToMillis(apiRutina.created_at),
    updatedAt: parseFechaIsoToMillis(apiRutina.updated_at),
    ejercicios_count: Number(apiRutina.ejercicios_count ?? 0),
    // En listado no hace falta traer ejercicios completos.
    ejercicios: [],
  }
}

function mapRutinaCompletaDesdeApi(apiRutina: any): Rutina {
  return {
    id: String(apiRutina.id),
    nombre: apiRutina.nombre,
    descripcion: apiRutina.descripcion ?? null,
    createdAt: parseFechaIsoToMillis(apiRutina.created_at),
    updatedAt: parseFechaIsoToMillis(apiRutina.updated_at),
    ejercicios_count: undefined,
    ejercicios: (apiRutina.ejercicios ?? []).map(mapEjercicioDesdeApi),
  }
}

function mapEjerciciosParaApi(ejercicios: RutinaEjercicio[]): any[] {
  return ejercicios.map((ej, idx) => {
    const ordenEj = idx + 1
    return {
      nombre: ej.nombre,
      orden: ordenEj,
      series: (ej.seriesObjetivo ?? []).map((s, sIdx) => ({
        orden: sIdx + 1,
        reps_objetivo: Number(s.reps),
        peso_sugerido: s.pesoSugerido,
      })),
    }
  })
}

function extraerMensajeError(error: unknown): string {
  if (typeof error === 'object' && error) {
    const anyErr = error as any
    if (anyErr?.response?.data?.message) return String(anyErr.response.data.message)
    if (anyErr?.message) return String(anyErr.message)
  }
  return 'Error en la operación'
}

export async function listarRutinas(): Promise<Rutina[]> {
  const resp = await clienteApi.get('/rutinas')
  if (import.meta.env.DEV) {
    // Temporal para verificar el contrato real que devuelve el backend en entorno local.
    console.log('[rutinas_api] GET /rutinas payload:', resp.data)
  }

  if (!Array.isArray(resp.data)) {
    throw new Error('Respuesta inválida en GET /rutinas: se esperaba un array JSON.')
  }

  return resp.data.map(mapRutinaListadoDesdeApi)
}

export async function obtenerRutinaPorId(id: string): Promise<Rutina | null> {
  try {
    const resp = await clienteApi.get(`/rutinas/${id}`)
    return mapRutinaCompletaDesdeApi(resp.data)
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) return null
    throw new Error(extraerMensajeError(error))
  }
}

export async function crearRutina(rutina: Omit<Rutina, 'id'>): Promise<Rutina> {
  const payload = {
    user_id: USER_ID_FIJO,
    nombre: rutina.nombre,
    descripcion: rutina.descripcion ?? null,
    ejercicios: mapEjerciciosParaApi(rutina.ejercicios ?? []),
  }

  const resp = await clienteApi.post('/rutinas', payload)
  return mapRutinaCompletaDesdeApi(resp.data)
}

export async function actualizarRutina(id: string, datos: Partial<Rutina>): Promise<Rutina | null> {
  // Implementación mínima: si no viene la rutina completa (ejercicios), no tiene sentido
  // porque la API hace reemplazo total.
  if (!datos.nombre || !datos.ejercicios) return null

  const payload = {
    user_id: USER_ID_FIJO,
    nombre: datos.nombre,
    descripcion: datos.descripcion ?? null,
    ejercicios: mapEjerciciosParaApi(datos.ejercicios),
  }

  try {
    const resp = await clienteApi.put(`/rutinas/${id}`, payload)
    return mapRutinaCompletaDesdeApi(resp.data)
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) return null
    throw new Error(extraerMensajeError(error))
  }
}

/** Actualiza una rutina completa (reemplazo total). */
export async function actualizarRutinaCompleta(rutina: Rutina): Promise<Rutina | null> {
  return actualizarRutina(rutina.id, rutina)
}

export async function eliminarRutina(id: string): Promise<boolean> {
  try {
    await clienteApi.delete(`/rutinas/${id}`)
    return true
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) return false
    throw new Error(extraerMensajeError(error))
  }
}

export async function duplicarRutina(idOrigen: string): Promise<Rutina | null> {
  try {
    const resp = await clienteApi.post(`/rutinas/${idOrigen}/duplicar`)
    return mapRutinaCompletaDesdeApi(resp.data)
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) return null
    throw new Error(extraerMensajeError(error))
  }
}
