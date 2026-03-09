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
}

export interface Rutina {
  id: string
  nombre: string
  ejercicios: RutinaEjercicio[]
  /** Timestamp de creación (Date.now()). Se usa para ordenar "más recientes primero". */
  createdAt?: number
}
