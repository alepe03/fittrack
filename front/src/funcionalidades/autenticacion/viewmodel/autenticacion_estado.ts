/**
 * Estado del módulo autenticación (para Pinia).
 */
export interface AutenticacionEstado {
  cargando: boolean
  error: string | null
}

export const estadoInicial: AutenticacionEstado = {
  cargando: false,
  error: null,
}
