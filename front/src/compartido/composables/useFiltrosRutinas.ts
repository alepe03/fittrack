/**
 * Composable para filtrar y ordenar la lista de rutinas.
 * Encapsula la lógica de búsqueda por texto y orden (A-Z, Z-A, recientes).
 */
import { type Ref, computed } from 'vue'
import type { Rutina } from '@/funcionalidades/rutinas/model/entidades'

export type OrdenRutinas = 'az' | 'za' | 'recientes'

export function useFiltrosRutinas(
  rutinas: Ref<Rutina[]>,
  textoBusqueda: Ref<string>,
  orden: Ref<OrdenRutinas>
) {
  const rutinasFiltradasYOrdenadas = computed(() => {
    const lista = [...rutinas.value]
    const texto = textoBusqueda.value.trim().toLowerCase()
    let resultado = texto
      ? lista.filter((r) => r.nombre.toLowerCase().includes(texto))
      : lista
    if (orden.value === 'az') {
      resultado = resultado.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    } else if (orden.value === 'za') {
      resultado = resultado.slice().sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'))
    } else {
      resultado = resultado.slice().sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    }
    return resultado
  })

  return { rutinasFiltradasYOrdenadas }
}
