/**
 * Estado del módulo rutinas (para Pinia).
 */
import type { Rutina } from '../model/entidades'

export interface RutinasEstado {
  cargando: boolean
  error: string | null
  rutinas: Rutina[]
  rutinaActual: Rutina | null
}

export const estadoInicial: RutinasEstado = {
  cargando: false,
  error: null,
  rutinas: [],
  rutinaActual: null,
}
