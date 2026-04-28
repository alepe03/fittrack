import { createRouter, createWebHistory } from 'vue-router'
import { obtenerToken } from '@/nucleo/almacenamiento/storage'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/funcionalidades/autenticacion/view/pantallas/login_screen.vue'),
      meta: { publica: true },
    },
    {
      path: '/registro',
      name: 'register',
      component: () => import('@/funcionalidades/autenticacion/view/pantallas/register_screen.vue'),
      meta: { publica: true },
    },
    {
      path: '/rutinas',
      name: 'rutinas',
      component: () => import('@/funcionalidades/rutinas/view/pantallas/rutinas_screen.vue'),
    },
    {
      path: '/rutinas/nueva',
      name: 'rutina-nueva',
      component: () => import('@/funcionalidades/rutinas/view/pantallas/rutina_form_screen.vue'),
    },
    {
      path: '/rutinas/:id/editar',
      name: 'rutina-editar',
      component: () => import('@/funcionalidades/rutinas/view/pantallas/rutina_form_screen.vue'),
    },
    {
      path: '/rutinas/:id',
      name: 'rutina-detail',
      component: () => import('@/funcionalidades/rutinas/view/pantallas/rutina_detail_screen.vue'),
    },
    {
      path: '/entrenos',
      name: 'entrenos',
      component: () => import('@/funcionalidades/entrenamientos/view/pantallas/entrenos_screen.vue'),
    },
    {
      path: '/entrenos/nuevo/:rutinaId',
      name: 'entreno-nuevo',
      component: () => import('@/funcionalidades/entrenamientos/view/pantallas/entreno_form_desde_rutina_screen.vue'),
    },
    {
      path: '/entrenos/:id/editar',
      name: 'entreno-editar',
      component: () => import('@/funcionalidades/entrenamientos/view/pantallas/entreno_form_desde_rutina_screen.vue'),
    },
    {
      path: '/entrenos/:id',
      name: 'entreno-detail',
      component: () => import('@/funcionalidades/entrenamientos/view/pantallas/entreno_detail_screen.vue'),
    },
    {
      path: '/suscripcion',
      name: 'suscripcion',
      component: () => import('@/funcionalidades/suscripcion/view/pantallas/suscripcion_screen.vue'),
    },
    { path: '/', redirect: '/rutinas' },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const auth = useAutenticacionViewModel()
  const token = obtenerToken()

  if (to.meta.publica) {
    if (token && (to.name === 'login' || to.name === 'register')) {
      try {
        await auth.asegurarSesion()
        next({ path: '/rutinas' })
        return
      } catch {
        auth.limpiarSesionLocal()
      }
    }
    next()
    return
  }

  if (!token) {
    next({ path: '/login' })
    return
  }

  try {
    await auth.asegurarSesion()
    next()
  } catch {
    auth.limpiarSesionLocal()
    next({ path: '/login' })
  }
})

export default router
