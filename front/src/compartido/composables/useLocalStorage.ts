/**
 * Composable para leer y escribir en localStorage de forma reactiva.
 * Útil para preferencias de usuario (orden, tema, etc.).
 */
import { ref, watch } from 'vue'

const CACHE: Record<string, { valor: ReturnType<typeof ref>; guardar: (v: string) => void }> = {}

export function useLocalStorage<T extends string>(
  clave: string,
  valorInicial: T
): { valor: ReturnType<typeof ref<T>>; guardar: (v: T) => void } {
  if (CACHE[clave]) {
    return CACHE[clave] as { valor: ReturnType<typeof ref<T>>; guardar: (v: T) => void }
  }

  const leer = (): T => {
    try {
      const raw = localStorage.getItem(clave)
      if (raw != null) return raw as T
    } catch {
      /* ignorar */
    }
    return valorInicial
  }

  const valor = ref<T>(leer()) as ReturnType<typeof ref<T>>

  function guardar(v: T) {
    valor.value = v
    try {
      localStorage.setItem(clave, v)
    } catch {
      /* ignorar */
    }
  }

  watch(valor, (v) => {
    if (v == null) return
    try {
      localStorage.setItem(clave, v)
    } catch {
      /* ignorar */
    }
  })

  const result = { valor, guardar }
  CACHE[clave] = result as { valor: ReturnType<typeof ref>; guardar: (v: string) => void }
  return result
}
