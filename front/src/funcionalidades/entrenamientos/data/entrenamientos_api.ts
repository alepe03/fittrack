/**
 * Entrenamientos: listado, creación y detalle vía API Laravel; localStorage solo como fallback del listado y para actualizar/borrar locales.
 */
import type { Entreno, SerieReal } from '../model/entidades'
import { clienteApi } from '@/nucleo/red/cliente_api'

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

function extraerMensajeError(error: unknown): string {
  if (typeof error === 'object' && error) {
    const anyErr = error as any
    if (anyErr?.response?.data?.message) return String(anyErr.response.data.message)
    if (typeof anyErr?.response?.data === 'object' && anyErr.response.data?.errors) {
      return JSON.stringify(anyErr.response.data.errors)
    }
    if (anyErr?.message) return String(anyErr.message)
  }
  return 'Error en la operación'
}

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
      throw new Error('GET /entrenos: se esperaba un array JSON.')
    }
    return resp.data.map((row: any) => mapEntrenoDesdeApi(row))
  } catch (error: unknown) {
    console.error('[entrenamientos_api] GET /entrenos error', error)
    entrenos = cargarDesdeStorage()
    if (entrenos.length > 0) {
      console.warn('[entrenamientos_api] GET /entrenos: usando fallback localStorage')
      return [...entrenos].sort((a, b) => (b.fechaISO > a.fechaISO ? 1 : -1))
    }
    throw new Error(extraerMensajeError(error))
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
    throw new Error(extraerMensajeError(error))
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
      throw new Error('Respuesta del servidor sin entreno_id')
    }

    const showResp = await clienteApi.get(`/entrenos/${entrenoId}`)
    console.log('[entrenamientos_api] GET /entrenos/:id tras crear', entrenoId, showResp.status, showResp.data)

    const entreno = mapEntrenoDesdeApi(showResp.data)
    return entreno
  } catch (error: unknown) {
    console.error('[entrenamientos_api] POST /entrenos error', error)
    throw new Error(extraerMensajeError(error))
  }
}

export async function actualizarEntreno(id: string, datos: Omit<Entreno, 'id'>): Promise<Entreno | null> {
  await new Promise((r) => setTimeout(r, 200))
  entrenos = cargarDesdeStorage()
  const idx = entrenos.findIndex((e) => e.id === id)
  if (idx === -1) return null
  const actualizado: Entreno = {
    ...datos,
    id,
  }
  entrenos[idx] = actualizado
  guardarEnStorage(entrenos)
  return { ...actualizado }
}

export async function eliminarEntreno(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 150))
  entrenos = cargarDesdeStorage()
  const idx = entrenos.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entrenos.splice(idx, 1)
  guardarEnStorage(entrenos)
  return true
}

/** Borra todos los entrenos asociados a una rutina y persiste en localStorage. */
export async function borrarEntrenosPorRutina(rutinaId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100))
  entrenos = cargarDesdeStorage()
  entrenos = entrenos.filter((e) => e.rutinaId !== rutinaId)
  guardarEnStorage(entrenos)
}
