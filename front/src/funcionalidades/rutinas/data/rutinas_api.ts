/**
 * API mock de rutinas: datos en memoria + persistencia en localStorage.
 */
import type { Rutina } from '../model/entidades'

const CLAVE_STORAGE = 'gym_rutinas'

function generarId(): string {
  return Math.random().toString(36).slice(2, 12)
}

function cargarDesdeStorage(): Rutina[] {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE)
    if (raw) {
      const parsed = JSON.parse(raw) as Rutina[]
      return Array.isArray(parsed) ? parsed : []
    }
  } catch {
    // ignorar
  }
  return []
}

function guardarEnStorage(rutinas: Rutina[]): void {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(rutinas))
}

let rutinas: Rutina[] = cargarDesdeStorage()

export async function listarRutinas(): Promise<Rutina[]> {
  await new Promise((r) => setTimeout(r, 200))
  rutinas = cargarDesdeStorage()
  return [...rutinas]
}

export async function obtenerRutinaPorId(id: string): Promise<Rutina | null> {
  await new Promise((r) => setTimeout(r, 150))
  rutinas = cargarDesdeStorage()
  return rutinas.find((r) => r.id === id) ?? null
}

export async function crearRutina(rutina: Omit<Rutina, 'id'>): Promise<Rutina> {
  await new Promise((r) => setTimeout(r, 200))
  rutinas = cargarDesdeStorage()
  const nueva: Rutina = {
    ...rutina,
    id: generarId(),
    createdAt: Date.now(),
  }
  rutinas.push(nueva)
  guardarEnStorage(rutinas)
  return { ...nueva }
}

export async function actualizarRutina(id: string, datos: Partial<Rutina>): Promise<Rutina | null> {
  await new Promise((r) => setTimeout(r, 200))
  rutinas = cargarDesdeStorage()
  const idx = rutinas.findIndex((r) => r.id === id)
  if (idx === -1) return null
  const actual = rutinas[idx]!
  const actualizada: Rutina = {
    id: actual.id,
    nombre: datos.nombre ?? actual.nombre,
    ejercicios: datos.ejercicios ?? actual.ejercicios,
    createdAt: actual.createdAt ?? Date.now(), // al editar no se cambia
  }
  rutinas[idx] = actualizada
  guardarEnStorage(rutinas)
  return { ...actualizada }
}

/** Actualiza una rutina completa por su id (array + localStorage). */
export async function actualizarRutinaCompleta(rutina: Rutina): Promise<Rutina | null> {
  return actualizarRutina(rutina.id, { nombre: rutina.nombre, ejercicios: rutina.ejercicios })
}

export async function eliminarRutina(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 150))
  rutinas = cargarDesdeStorage()
  const idx = rutinas.findIndex((r) => r.id === id)
  if (idx === -1) return false
  rutinas.splice(idx, 1)
  guardarEnStorage(rutinas)
  return true
}

/** Genera un id único (crypto.randomUUID si existe, si no Date.now). */
function generarIdUnico(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return String(Date.now())
}

/**
 * Duplica una rutina: nuevo id (crypto.randomUUID o Date.now), nombre "<nombre> (copia)",
 * ejercicios y series clonados en profundidad (nuevos ids en ejercicios).
 */
export async function duplicarRutina(idOrigen: string): Promise<Rutina | null> {
  await new Promise((r) => setTimeout(r, 200))
  rutinas = cargarDesdeStorage()
  const origen = rutinas.find((r) => r.id === idOrigen) ?? null
  if (!origen) return null
  const ejerciciosClonados = origen.ejercicios.map((ej) => ({
    id: generarId(),
    nombre: ej.nombre,
    seriesObjetivo: ej.seriesObjetivo.map((s) => ({ reps: s.reps, pesoSugerido: s.pesoSugerido })),
  }))
  const nueva: Rutina = {
    id: generarIdUnico(),
    nombre: `${origen.nombre} (copia)`,
    ejercicios: ejerciciosClonados,
    createdAt: Date.now(),
  }
  rutinas.push(nueva)
  guardarEnStorage(rutinas)
  return { ...nueva }
}
