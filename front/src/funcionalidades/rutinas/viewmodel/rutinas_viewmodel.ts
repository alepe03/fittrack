/**
 * ViewModel de rutinas: acciones que usan las vistas (listar, obtener, crear, etc.).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rutinasRepositorio } from '../data/rutinas_repositorio'
import { estadoInicial } from './rutinas_estado'
import type { Rutina, RutinaEjercicio } from '../model/entidades'

export const useRutinasViewModel = defineStore('rutinas', () => {
  const cargando = ref(estadoInicial.cargando)
  const error = ref<string | null>(estadoInicial.error)
  const rutinas = ref<Rutina[]>(estadoInicial.rutinas)
  const rutinaActual = ref<Rutina | null>(estadoInicial.rutinaActual)

  const rutinasLista = computed(() => rutinas.value)

  async function cargarRutinas(): Promise<void> {
    cargando.value = true
    error.value = null
    try {
      rutinas.value = await rutinasRepositorio.listar()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar rutinas'
    } finally {
      cargando.value = false
    }
  }

  async function cargarRutinaPorId(id: string): Promise<void> {
    cargando.value = true
    error.value = null
    rutinaActual.value = null
    try {
      rutinaActual.value = await rutinasRepositorio.obtenerPorId(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar rutina'
    } finally {
      cargando.value = false
    }
  }

  async function crearRutina(datos: { nombre: string; ejercicios: RutinaEjercicio[] }): Promise<Rutina | null> {
    cargando.value = true
    error.value = null
    try {
      const nueva = await rutinasRepositorio.crear(datos)
      rutinas.value = await rutinasRepositorio.listar()
      return nueva
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear rutina'
      return null
    } finally {
      cargando.value = false
    }
  }

  async function actualizarRutina(rutina: Rutina): Promise<Rutina | null> {
    cargando.value = true
    error.value = null
    try {
      const actualizada = await rutinasRepositorio.actualizarRutina(rutina)
      if (actualizada) rutinas.value = await rutinasRepositorio.listar()
      return actualizada
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar rutina'
      return null
    } finally {
      cargando.value = false
    }
  }

  /** Borra la rutina y sus entrenos asociados. Devuelve true si ok. */
  async function borrarRutina(id: string): Promise<boolean> {
    cargando.value = true
    error.value = null
    try {
      const ok = await rutinasRepositorio.borrarRutina(id)
      if (ok) rutinas.value = await rutinasRepositorio.listar()
      return ok
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al borrar rutina'
      return false
    } finally {
      cargando.value = false
    }
  }

  /** Duplica la rutina (nuevo id, nombre "(copia)", ejercicios clonados). Devuelve la nueva rutina. */
  async function duplicarRutina(id: string): Promise<Rutina | null> {
    cargando.value = true
    error.value = null
    try {
      const nueva = await rutinasRepositorio.duplicarRutina(id)
      if (nueva) rutinas.value = await rutinasRepositorio.listar()
      return nueva
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al duplicar rutina'
      return null
    } finally {
      cargando.value = false
    }
  }

  function limpiarRutinaActual(): void {
    rutinaActual.value = null
  }

  return {
    cargando,
    error,
    rutinasLista,
    rutinaActual,
    cargarRutinas,
    cargarRutinaPorId,
    crearRutina,
    actualizarRutina,
    borrarRutina,
    duplicarRutina,
    limpiarRutinaActual,
  }
})
