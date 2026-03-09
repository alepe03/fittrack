<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'

const router = useRouter()
const viewModelAuth = useAutenticacionViewModel()

function salir() {
  viewModelAuth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <nav class="flex gap-4">
          <RouterLink
            to="/rutinas"
            class="text-gray-700 hover:text-blue-600 font-medium"
            active-class="text-blue-600"
          >
            Rutinas
          </RouterLink>
          <RouterLink
            to="/entrenos"
            class="text-gray-700 hover:text-blue-600 font-medium"
            active-class="text-blue-600"
          >
            Entrenos
          </RouterLink>
        </nav>
        <button
          v-if="viewModelAuth.estaLogueado"
          type="button"
          class="text-sm text-gray-600 hover:text-red-600"
          @click="salir"
        >
          Salir
        </button>
      </div>
    </header>
    <main class="max-w-3xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
