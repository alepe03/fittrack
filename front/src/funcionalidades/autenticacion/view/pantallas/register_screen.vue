<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAutenticacionViewModel } from '../../viewmodel/autenticacion_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'

const router = useRouter()
const viewModel = useAutenticacionViewModel()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const enviado = ref(false)

async function enviar() {
  enviado.value = true
  const ok = await viewModel.register({ ...form })
  if (ok) {
    router.push('/rutinas')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md rounded-xl bg-white shadow-lg p-5 sm:p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Crear cuenta</h1>
      <p class="text-sm text-gray-600 mb-4">Regístrate para guardar rutinas y entrenos en tu cuenta.</p>

      <form @submit.prevent="enviar" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo 8 caracteres.</p>
        </div>
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1"
            >Confirmar contraseña</label
          >
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            required
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p v-if="enviado && viewModel.error" class="text-sm text-red-600" role="alert">
          {{ viewModel.error }}
        </p>
        <BotonPrimario type="submit" :disabled="viewModel.cargando" class="w-full min-h-11">
          {{ viewModel.cargando ? 'Creando cuenta...' : 'Registrarse' }}
        </BotonPrimario>
      </form>

      <p class="mt-5 text-sm text-center text-gray-600">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">Iniciar sesión</RouterLink>
      </p>
    </div>
  </div>
</template>
