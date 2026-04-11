<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'

const router = useRouter()
const viewModelAuth = useAutenticacionViewModel()

async function salir() {
  await viewModelAuth.logout()
  router.push('/login')
}
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
        </nav>
        <button
          v-if="viewModelAuth.estaLogueado"
          type="button"
          class="w-full sm:w-auto text-sm text-gray-600 hover:text-red-600 border border-gray-300 sm:border-0 rounded-lg sm:rounded px-3 py-2 sm:p-0 text-left sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          @click="salir"
        >
          Salir
        </button>
      </div>
    </header>
    <main class="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
