import { getActivePinia } from 'pinia'
import router from '@/router'
import { clienteApi } from '@/nucleo/red/cliente_api'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'

/**
 * Respuestas 401: limpia sesión local y envía al login si la ruta no es pública.
 */
export function configurarManejo401ClienteApi(): void {
  clienteApi.interceptors.response.use(
    (r) => r,
    async (error) => {
      if (error?.response?.status === 401) {
        const pinia = getActivePinia()
        if (pinia) {
          useAutenticacionViewModel(pinia).limpiarSesionLocal()
        }
        const ruta = router.currentRoute.value
        if (!ruta.meta.publica) {
          await router.replace({ path: '/login' })
        }
      }
      return Promise.reject(error)
    },
  )
}
