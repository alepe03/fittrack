/**
 * Composable para persistir el entrenamiento en curso en sessionStorage.
 * Si el usuario recarga la página, no pierde los datos del formulario.
 * Se usa sessionStorage porque el entrenamiento en curso debe persistir en recargas
 * pero no entre sesiones completas (al cerrar pestaña/navegador se limpia).
 */
import type { EntrenoItem } from '@/funcionalidades/entrenamientos/model/entidades'

const CLAVE = 'fittrack_entreno_en_curso'

export interface EntrenoEnCurso {
  rutinaId: string
  nombreRutina: string
  items: EntrenoItem[]
}

export function useEntrenamientoEnCurso() {
  function obtener(): EntrenoEnCurso | null {
    try {
      const raw = sessionStorage.getItem(CLAVE)
      if (!raw) return null
      const data = JSON.parse(raw) as EntrenoEnCurso
      if (!data.rutinaId || !data.items || !Array.isArray(data.items)) return null
      return data
    } catch {
      return null
    }
  }

  function guardar(datos: EntrenoEnCurso): void {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch {
      /* ignorar */
    }
  }

  function limpiar(): void {
    try {
      sessionStorage.removeItem(CLAVE)
    } catch {
      /* ignorar */
    }
  }

  return { obtener, guardar, limpiar }
}
