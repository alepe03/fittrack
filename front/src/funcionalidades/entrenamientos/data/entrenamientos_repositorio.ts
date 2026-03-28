/**
 * Repositorio de entrenamientos: delega en entrenamientos_api (crear/detalle API + listado local).
 */
import * as entrenamientosApi from './entrenamientos_api'
import type { Entreno, EntrenoItem, SerieReal } from '../model/entidades'

export const entrenamientosRepositorio = {
  async listar(): Promise<Entreno[]> {
    return entrenamientosApi.listarEntrenos()
  },
  async obtenerPorId(id: string): Promise<Entreno | null> {
    return entrenamientosApi.obtenerEntrenoPorId(id)
  },
  async crear(datos: Omit<Entreno, 'id'>): Promise<Entreno> {
    return entrenamientosApi.crearEntreno(datos)
  },
  async actualizar(id: string, datos: Omit<Entreno, 'id'>): Promise<Entreno | null> {
    return entrenamientosApi.actualizarEntreno(id, datos)
  },
  async eliminar(id: string): Promise<boolean> {
    return entrenamientosApi.eliminarEntreno(id)
  },
  async borrarPorRutinaId(rutinaId: string): Promise<void> {
    return entrenamientosApi.borrarEntrenosPorRutina(rutinaId)
  },
}

export type { Entreno, EntrenoItem, SerieReal }
