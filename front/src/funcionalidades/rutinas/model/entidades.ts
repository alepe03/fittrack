/**
 * Entidades del módulo rutinas.
 */
export interface SerieObjetivo {
  reps: number
  pesoSugerido: number
}

export interface RutinaEjercicio {
  id: string
  nombre: string
  seriesObjetivo: SerieObjetivo[]
  /** Posición dentro de la rutina (1..n). Para el formulario se puede derivar por índice. */
  orden?: number
}

export interface Rutina {
  id: string
  nombre: string
  descripcion?: string | null
  /** Usado en el listado (no hace falta traer ejercicios completos). */
  ejercicios_count?: number
  ejercicios: RutinaEjercicio[]
  /** Timestamp de creación (Date.now()). Se usa para ordenar "más recientes primero". */
  createdAt?: number
  updatedAt?: number
}
