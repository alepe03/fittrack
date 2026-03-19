<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAutenticacionViewModel } from '../../viewmodel/autenticacion_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'

const router = useRouter()
const viewModel = useAutenticacionViewModel()

const form = reactive({ email: '', password: '' })
const enviado = ref(false)

async function enviar() {
  enviado.value = true
  const ok = await viewModel.login({ email: form.email, password: form.password })
  if (ok) {
    router.push('/rutinas')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md rounded-xl bg-white shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Iniciar sesión</h1>

      <form @submit.prevent="enviar" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="admin@demo.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••"
          />
        </div>
        <p v-if="enviado && viewModel.error" class="text-sm text-red-600" role="alert">
          {{ viewModel.error }}
        </p>
        <BotonPrimario type="submit" :disabled="viewModel.cargando" class="w-full">
          {{ viewModel.cargando ? 'Entrando...' : 'Entrar' }}
        </BotonPrimario>
      </form>

      <p class="mt-4 text-xs text-gray-500 text-center">
        Demo: admin@demo.com / 1234
      </p>
    </div>
  </div>
</template>
