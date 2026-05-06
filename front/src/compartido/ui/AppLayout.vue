<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'

const router = useRouter()
const viewModelAuth = useAutenticacionViewModel()
const menuAbierto = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const menuButtonRef = ref<HTMLButtonElement | null>(null)
const menuCuentaPanelId = useId()

function alternarMenu() {
  menuAbierto.value = !menuAbierto.value
}

function cerrarMenu() {
  menuAbierto.value = false
}

function navegarAPerfil() {
  cerrarMenu()
  router.push('/perfil')
}

function manejarClickFuera(event: MouseEvent) {
  if (!menuAbierto.value) return
  const target = event.target as Node | null
  if (!target) return
  if (menuRef.value?.contains(target) || menuButtonRef.value?.contains(target)) return
  cerrarMenu()
}

function manejarEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (!menuAbierto.value) return
  cerrarMenu()
  menuButtonRef.value?.focus()
}

async function salir() {
  cerrarMenu()
  await viewModelAuth.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('mousedown', manejarClickFuera)
  document.addEventListener('keydown', manejarEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', manejarClickFuera)
  document.removeEventListener('keydown', manejarEscape)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <nav class="w-full sm:w-auto flex flex-wrap items-center gap-3 sm:gap-4">
          <RouterLink
            to="/rutinas"
            class="text-gray-700 hover:text-blue-600 font-medium px-1 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            active-class="text-blue-600"
          >
            Rutinas
          </RouterLink>
          <RouterLink
            to="/entrenos"
            class="text-gray-700 hover:text-blue-600 font-medium px-1 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            active-class="text-blue-600"
          >
            Entrenos
          </RouterLink>
          <RouterLink
            to="/suscripcion"
            class="text-gray-700 hover:text-blue-600 font-medium px-1 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
            active-class="text-blue-600"
          >
            Suscripción
          </RouterLink>
        </nav>
        <div v-if="viewModelAuth.estaLogueado" class="relative w-full sm:w-auto">
          <button
            ref="menuButtonRef"
            type="button"
            class="w-full sm:w-auto text-sm text-gray-700 hover:text-blue-600 border border-gray-300 sm:border-0 rounded-lg sm:rounded px-3 py-2 sm:p-0 text-left sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            :aria-expanded="menuAbierto"
            :aria-controls="menuAbierto ? menuCuentaPanelId : undefined"
            @click="alternarMenu"
          >
            {{ viewModelAuth.usuario?.name ?? 'Mi cuenta' }}
          </button>

          <div
            v-if="menuAbierto"
            :id="menuCuentaPanelId"
            ref="menuRef"
            class="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-full sm:pt-2 w-full sm:w-52 z-20"
          >
            <div class="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                @click="navegarAPerfil"
              >
                Mi perfil
              </button>
              <button
                type="button"
                class="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                @click="salir"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
