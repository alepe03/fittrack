/**
 * API mock de entrenamientos: datos en memoria + persistencia en localStorage.
 */
import type { Entreno } from '../model/entidades'

const CLAVE_STORAGE = 'gym_entrenos'

function generarId(): string {
  return Math.random().toString(36).slice(2, 12)
}

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

export async function listarEntrenos(): Promise<Entreno[]> {
  await new Promise((r) => setTimeout(r, 200))
  entrenos = cargarDesdeStorage()
  return [...entrenos].sort((a, b) => (b.fechaISO > a.fechaISO ? 1 : -1))
}

export async function obtenerEntrenoPorId(id: string): Promise<Entreno | null> {
  await new Promise((r) => setTimeout(r, 150))
  entrenos = cargarDesdeStorage()
  return entrenos.find((e) => e.id === id) ?? null
}

export async function crearEntreno(datos: Omit<Entreno, 'id'>): Promise<Entreno> {
  await new Promise((r) => setTimeout(r, 200))
  entrenos = cargarDesdeStorage()
  const nuevo: Entreno = {
    ...datos,
    id: generarId(),
  }
  entrenos.push(nuevo)
  guardarEnStorage(entrenos)
  return { ...nuevo }
}

/** Borra todos los entrenos asociados a una rutina y persiste en localStorage. */
export async function borrarEntrenosPorRutina(rutinaId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100))
  entrenos = cargarDesdeStorage()
  entrenos = entrenos.filter((e) => e.rutinaId !== rutinaId)
  guardarEnStorage(entrenos)
}
