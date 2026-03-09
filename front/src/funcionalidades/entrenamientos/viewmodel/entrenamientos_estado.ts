/**
 * Estado del módulo entrenamientos (para Pinia).
 */
import type { Entreno } from '../model/entidades'

export interface EntrenamientosEstado {
  cargando: boolean
  error: string | null
  entrenos: Entreno[]
  entrenoActual: Entreno | null
}

export const estadoInicial: EntrenamientosEstado = {
  cargando: false,
  error: null,
  entrenos: [],
  entrenoActual: null,
}
