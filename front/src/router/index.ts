import { createRouter, createWebHistory } from 'vue-router'
import { obtenerToken } from '@/nucleo/almacenamiento/storage'

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
      path: '/entrenos/:id',
      name: 'entreno-detail',
      component: () => import('@/funcionalidades/entrenamientos/view/pantallas/entreno_detail_screen.vue'),
    },
    { path: '/', redirect: '/rutinas' },
  ],
})

router.beforeEach((to, _from, next) => {
  const token = obtenerToken()
  if (to.meta.publica) {
    next()
    return
  }
  if (!token) {
    next('/login')
    return
  }
  next()
})

export default router
