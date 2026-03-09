/**
 * ViewModel de entrenamientos: acciones que usan las vistas (listar, obtener, crear).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { entrenamientosRepositorio } from '../data/entrenamientos_repositorio'
import { estadoInicial } from './entrenamientos_estado'
import type { Entreno } from '../model/entidades'

export const useEntrenamientosViewModel = defineStore('entrenamientos', () => {
  const cargando = ref(estadoInicial.cargando)
  const error = ref<string | null>(estadoInicial.error)
  const entrenos = ref<Entreno[]>(estadoInicial.entrenos)
  const entrenoActual = ref<Entreno | null>(estadoInicial.entrenoActual)

  const entrenosLista = computed(() => entrenos.value)

  async function cargarEntrenos(): Promise<void> {
    cargando.value = true
    error.value = null
    try {
      entrenos.value = await entrenamientosRepositorio.listar()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar entrenos'
    } finally {
      cargando.value = false
    }
  }

  async function cargarEntrenoPorId(id: string): Promise<void> {
    cargando.value = true
    error.value = null
    entrenoActual.value = null
    try {
      entrenoActual.value = await entrenamientosRepositorio.obtenerPorId(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar entreno'
    } finally {
      cargando.value = false
    }
  }

  async function crearEntreno(datos: Omit<Entreno, 'id'>): Promise<Entreno | null> {
    cargando.value = true
    error.value = null
    try {
      const nuevo = await entrenamientosRepositorio.crear(datos)
      entrenos.value = await entrenamientosRepositorio.listar()
      return nuevo
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al guardar entreno'
      return null
    } finally {
      cargando.value = false
    }
  }

  function limpiarEntrenoActual(): void {
    entrenoActual.value = null
  }

  return {
    cargando,
    error,
    entrenosLista,
    entrenoActual,
    cargarEntrenos,
    cargarEntrenoPorId,
    crearEntreno,
    limpiarEntrenoActual,
  }
})
