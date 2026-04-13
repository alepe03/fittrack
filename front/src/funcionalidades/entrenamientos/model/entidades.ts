/**
 * Entidades del módulo entrenamientos.
 */
export interface SerieReal {
  /** Orden de la serie dentro del ejercicio (1..n). */
  orden?: number
  reps: number
  peso: number
  completada: boolean
  /** Solo UI por ahora; se deriva a RIR para persistencia. */
  rpe?: number | null
  /** null = sin RIR indicado (válido para POST /api/entrenos). */
  rir: number | null
  esPR?: boolean
  /** Alineado con backend Laravel; null si no hay referencia. */
  comparativaObjetivo?: 'superado' | 'cumplido' | 'debajo' | null
}

export interface EntrenoItem {
  /** Clave estable para la UI (id del ejercicio de rutina o del ítem guardado). */
  ejercicioId: string
  nombre: string
  /** Orden del ejercicio dentro del entreno. */
  orden?: number
  /** FK opcional al ejercicio plantilla de la rutina. */
  rutinaEjercicioId?: number | null
  series: SerieReal[]
}

export interface Entreno {
  id: string
  fechaISO: string
  rutinaId: string
  nombreRutina: string
  items: EntrenoItem[]
  notaGeneral?: string
  duracionSegundos?: number
  descansoSegundosUsado?: number
}
