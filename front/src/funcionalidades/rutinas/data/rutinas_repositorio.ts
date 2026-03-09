/**
 * Repositorio de rutinas: delega en rutinas_api (mock).
 * El borrado en cascada (rutina + entrenos asociados) lo hace borrarRutina.
 */
import * as rutinasApi from './rutinas_api'
import { entrenamientosRepositorio } from '@/funcionalidades/entrenamientos/data/entrenamientos_repositorio'
import type { Rutina, RutinaEjercicio, SerieObjetivo } from '../model/entidades'

export const rutinasRepositorio = {
  async listar(): Promise<Rutina[]> {
    return rutinasApi.listarRutinas()
  },
  async obtenerPorId(id: string): Promise<Rutina | null> {
    return rutinasApi.obtenerRutinaPorId(id)
  },
  async crear(datos: { nombre: string; ejercicios: RutinaEjercicio[] }): Promise<Rutina> {
    return rutinasApi.crearRutina(datos)
  },
  async actualizar(id: string, datos: Partial<Rutina>): Promise<Rutina | null> {
    return rutinasApi.actualizarRutina(id, datos)
  },
  async actualizarRutina(rutina: Rutina): Promise<Rutina | null> {
    return rutinasApi.actualizarRutinaCompleta(rutina)
  },
  async eliminar(id: string): Promise<boolean> {
    return rutinasApi.eliminarRutina(id)
  },
  /** Borra la rutina y todos los entrenos asociados (cascada). */
  async borrarRutina(id: string): Promise<boolean> {
    await entrenamientosRepositorio.borrarPorRutinaId(id)
    return rutinasApi.eliminarRutina(id)
  },
  async duplicarRutina(id: string): Promise<Rutina | null> {
    return rutinasApi.duplicarRutina(id)
  },
}

export type { Rutina, RutinaEjercicio, SerieObjetivo }
