/**
 * Entrenamientos: CRUD principal vía API Laravel;
 * localStorage queda como fallback para listado/detalle en errores puntuales.
 */
import type { Entreno, SerieReal } from '../model/entidades'
import { clienteApi } from '@/nucleo/red/cliente_api'
import { extraerMensajesRespuestaError } from '@/nucleo/red/extraer_mensajes_error'

const CLAVE_STORAGE = 'gym_entrenos'

function cargarDesdeStorage(): Entreno[] {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE)
    if (raw) {
      const parsed = JSON.parse(raw) as Entreno[]
      return Array.isArray(parsed) ? parsed : []
    }
  } catch {
    // ignorar
  }
  return []
}

function guardarEnStorage(entrenos: Entreno[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(entrenos))
}

let entrenos: Entreno[] = cargarDesdeStorage()

/** Payload snake_case para POST /api/entrenos */
function construirPayloadApi(datos: Omit<Entreno, 'id'>): Record<string, unknown> {
  return {
    rutina_id: datos.rutinaId ? Number(datos.rutinaId) : null,
    nombre_rutina: datos.nombreRutina,
    fecha_entreno: datos.fechaISO,
    nota_general: datos.notaGeneral ?? null,
    duracion_segundos: datos.duracionSegundos ?? null,
    descanso_segundos_usado: datos.descansoSegundosUsado ?? null,
    ejercicios: datos.items.map((item, idx) => ({
      rutina_ejercicio_id: item.rutinaEjercicioId ?? null,
      nombre: item.nombre,
      orden: item.orden ?? idx + 1,
      series: item.series.map((s, sIdx) => ({
        orden: s.orden ?? sIdx + 1,
        reps: s.reps,
        peso: s.peso,
        rir: s.rir === undefined || s.rir === null ? null : s.rir,
        completada: Boolean(s.completada),
      })),
    })),
  }
}

function mapComparativaDesdeApi(v: unknown): 'superado' | 'cumplido' | 'debajo' | null {
  if (v === 'superado' || v === 'cumplido' || v === 'debajo') return v
  return null
}

function mapSerieDesdeApi(se: any): SerieReal {
  return {
    orden: se.orden != null ? Number(se.orden) : undefined,
    reps: Number(se.reps),
    peso: Number(se.peso),
    completada: Boolean(se.completada),
    rir: se.rir === null || se.rir === undefined ? null : Number(se.rir),
    /** Fuente única de verdad PR en entrenos persistidos (Laravel). */
    esPR: se.es_pr === true || se.es_pr === 1,
    comparativaObjetivo: mapComparativaDesdeApi(se.comparativa_objetivo),
  }
}

function mapEntrenoDesdeApi(data: any): Entreno {
  const fechaRaw = data.fecha_entreno
  const fechaISO =
    typeof fechaRaw === 'string'
      ? fechaRaw.includes('T')
        ? fechaRaw
        : new Date(fechaRaw.replace(' ', 'T')).toISOString()
      : new Date(fechaRaw).toISOString()

  return {
    id: String(data.id),
    fechaISO,
    rutinaId: data.rutina_id != null ? String(data.rutina_id) : '',
    nombreRutina: data.nombre_rutina,
    items: (data.ejercicios ?? []).map((ej: any) => ({
      ejercicioId: String(ej.id),
      nombre: ej.nombre,
      orden: ej.orden != null ? Number(ej.orden) : undefined,
      rutinaEjercicioId: ej.rutina_ejercicio_id != null ? Number(ej.rutina_ejercicio_id) : null,
      series: (ej.series ?? []).map(mapSerieDesdeApi),
    })),
    notaGeneral: data.nota_general ?? undefined,
    duracionSegundos: data.duracion_segundos ?? undefined,
    descansoSegundosUsado: data.descanso_segundos_usado ?? undefined,
  }
}

export async function listarEntrenos(): Promise<Entreno[]> {
  try {
    const resp = await clienteApi.get('/entrenos')
    console.log('[entrenamientos_api] GET /entrenos respuesta', resp.status, resp.data)
    if (!Array.isArray(resp.data)) {
      throw new Error('La respuesta del listado de entrenos no es válida.')
    }
    return resp.data.map((row: any) => mapEntrenoDesdeApi(row))
  } catch (error: unknown) {
    console.error('[entrenamientos_api] GET /entrenos error', error)
    entrenos = cargarDesdeStorage()
    if (entrenos.length > 0) {
      console.warn('[entrenamientos_api] GET /entrenos: usando fallback localStorage')
      return [...entrenos].sort((a, b) => (b.fechaISO > a.fechaISO ? 1 : -1))
    }
    throw new Error(extraerMensajesRespuestaError(error))
  }
}

export async function obtenerEntrenoPorId(id: string): Promise<Entreno | null> {
  try {
    const resp = await clienteApi.get(`/entrenos/${id}`)
    console.log('[entrenamientos_api] GET /entrenos/:id respuesta', id, resp.status, resp.data)
    return mapEntrenoDesdeApi(resp.data)
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) {
      entrenos = cargarDesdeStorage()
      return entrenos.find((e) => e.id === id) ?? null
    }
    console.error('[entrenamientos_api] GET /entrenos/:id error', error)
    throw new Error(extraerMensajesRespuestaError(error))
  }
}

export async function crearEntreno(datos: Omit<Entreno, 'id'>): Promise<Entreno> {
  const payload = construirPayloadApi(datos)
  console.log('[entrenamientos_api] POST /entrenos payload', JSON.stringify(payload, null, 2))

  try {
    const resp = await clienteApi.post('/entrenos', payload)
    console.log('[entrenamientos_api] POST /entrenos respuesta', resp.status, resp.data)

    const entrenoId = resp.data?.entreno_id
    if (entrenoId == null) {
      throw new Error('La respuesta del servidor no incluye el identificador del entreno.')
    }

    const showResp = await clienteApi.get(`/entrenos/${entrenoId}`)
    console.log('[entrenamientos_api] GET /entrenos/:id tras crear', entrenoId, showResp.status, showResp.data)

    const entreno = mapEntrenoDesdeApi(showResp.data)
    return entreno
  } catch (error: unknown) {
    console.error('[entrenamientos_api] POST /entrenos error', error)
    throw new Error(extraerMensajesRespuestaError(error))
  }
}

export async function actualizarEntreno(id: string, datos: Omit<Entreno, 'id'>): Promise<Entreno | null> {
  const payload = construirPayloadApi(datos)
  console.log('[entrenamientos_api] PUT /entrenos/:id payload', id, JSON.stringify(payload, null, 2))

  try {
    const resp = await clienteApi.put(`/entrenos/${id}`, payload)
    console.log('[entrenamientos_api] PUT /entrenos/:id respuesta', id, resp.status, resp.data)

    const entrenoId = resp.data?.entreno_id ?? Number(id)
    const showResp = await clienteApi.get(`/entrenos/${entrenoId}`)
    console.log('[entrenamientos_api] GET /entrenos/:id tras actualizar', entrenoId, showResp.status, showResp.data)
    return mapEntrenoDesdeApi(showResp.data)
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) return null
    console.error('[entrenamientos_api] PUT /entrenos/:id error', error)
    throw new Error(extraerMensajesRespuestaError(error))
  }
}

export async function eliminarEntreno(id: string): Promise<boolean> {
  try {
    const resp = await clienteApi.delete(`/entrenos/${id}`)
    console.log('[entrenamientos_api] DELETE /entrenos/:id respuesta', id, resp.status, resp.data)
    return true
  } catch (error: unknown) {
    const anyErr = error as any
    if (anyErr?.response?.status === 404) return false
    console.error('[entrenamientos_api] DELETE /entrenos/:id error', error)
    throw new Error(extraerMensajesRespuestaError(error))
  }
}

/**
 * Utilidad local legacy/no crítica (fuera del CRUD principal API).
 * Mantiene limpieza de entrenos en localStorage para flujos antiguos de fallback.
 */
export async function borrarEntrenosPorRutina(rutinaId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100))
  entrenos = cargarDesdeStorage()
  entrenos = entrenos.filter((e) => e.rutinaId !== rutinaId)
  guardarEnStorage(entrenos)
}
