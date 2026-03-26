/**
 * Entidades del módulo entrenamientos.
 */
export interface SerieReal {
  reps: number
  peso: number
  completada: boolean
  rir: number
  esPR?: boolean
  comparativaObjetivo?: 'superado' | 'cumplido' | 'por_debajo'
}

export interface EntrenoItem {
  ejercicioId: string
  nombre: string
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
