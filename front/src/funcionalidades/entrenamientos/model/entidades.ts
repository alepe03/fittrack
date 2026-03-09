/**
 * Entidades del módulo entrenamientos.
 */
export interface SerieReal {
  reps: number
  peso: number
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
}
