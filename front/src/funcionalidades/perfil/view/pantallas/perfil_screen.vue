<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'
import { usePerfilViewModel } from '../../viewmodel/perfil_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'

const auth = useAutenticacionViewModel()
const perfil = usePerfilViewModel()

const formDatos = reactive({
  name: '',
  email: '',
})

/** Evita pisar el formulario en refrescos de sesión del mismo usuario; se resetea al cerrar sesión. */
const ultimoUsuarioSincronizadoId = ref<number | null>(null)

watch(
  () => auth.usuario,
  (u) => {
    if (!u) {
      ultimoUsuarioSincronizadoId.value = null
      return
    }
    if (ultimoUsuarioSincronizadoId.value === u.id) return
    formDatos.name = u.name
    formDatos.email = u.email
    ultimoUsuarioSincronizadoId.value = u.id
  },
  { immediate: true }
)

const formPassword = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
})

async function guardarDatosPersonales() {
  const resultado = await perfil.guardarDatosPersonales({
    name: formDatos.name,
    email: formDatos.email,
  })
  if (resultado.ok && resultado.user) {
    auth.actualizarUsuarioSesion(resultado.user)
  }
}

async function guardarPassword() {
  const ok = await perfil.cambiarPassword({ ...formPassword })
  if (!ok) return
  formPassword.current_password = ''
  formPassword.password = ''
  formPassword.password_confirmation = ''
}
</script>

<template>
  <div class="space-y-6">
    <header class="rounded-xl bg-white shadow p-4 sm:p-6">
      <h1 class="text-2xl font-bold text-gray-800">Mi perfil</h1>
      <p class="mt-2 text-sm text-gray-600">Gestiona tus datos de cuenta y tu contraseña.</p>
    </header>

    <section class="rounded-xl bg-white shadow p-4 sm:p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos personales</h2>
      <form class="space-y-4" @submit.prevent="guardarDatosPersonales">
        <div>
          <label for="perfil-name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            id="perfil-name"
            v-model="formDatos.name"
            type="text"
            autocomplete="name"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="perfil.erroresDatos.name" class="mt-1 text-sm text-red-600" role="alert">
            {{ perfil.erroresDatos.name }}
          </p>
        </div>
        <div>
          <label for="perfil-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="perfil-email"
            v-model="formDatos.email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="perfil.erroresDatos.email" class="mt-1 text-sm text-red-600" role="alert">
            {{ perfil.erroresDatos.email }}
          </p>
        </div>

        <p v-if="perfil.errorGeneralDatos" class="text-sm text-red-600" role="alert">
          {{ perfil.errorGeneralDatos }}
        </p>
        <p v-if="perfil.exitoDatos" class="text-sm text-emerald-700" role="status">
          {{ perfil.exitoDatos }}
        </p>

        <BotonPrimario type="submit" :disabled="perfil.guardandoDatos" class="w-full sm:w-auto">
          {{ perfil.guardandoDatos ? 'Guardando...' : 'Guardar datos' }}
        </BotonPrimario>
      </form>
    </section>

    <section class="rounded-xl bg-white shadow p-4 sm:p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Seguridad</h2>
      <form class="space-y-4" @submit.prevent="guardarPassword">
        <div>
          <label for="perfil-current-password" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <input
            id="perfil-current-password"
            v-model="formPassword.current_password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="perfil.erroresPassword.current_password" class="mt-1 text-sm text-red-600" role="alert">
            {{ perfil.erroresPassword.current_password }}
          </p>
        </div>
        <div>
          <label for="perfil-password" class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
          <input
            id="perfil-password"
            v-model="formPassword.password"
            type="password"
            autocomplete="new-password"
            minlength="8"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="perfil.erroresPassword.password" class="mt-1 text-sm text-red-600" role="alert">
            {{ perfil.erroresPassword.password }}
          </p>
        </div>
        <div>
          <label for="perfil-password-confirmation" class="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            id="perfil-password-confirmation"
            v-model="formPassword.password_confirmation"
            type="password"
            autocomplete="new-password"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p
            v-if="perfil.erroresPassword.password_confirmation"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ perfil.erroresPassword.password_confirmation }}
          </p>
        </div>

        <p v-if="perfil.errorGeneralPassword" class="text-sm text-red-600" role="alert">
          {{ perfil.errorGeneralPassword }}
        </p>
        <p v-if="perfil.exitoPassword" class="text-sm text-emerald-700" role="status">
          {{ perfil.exitoPassword }}
        </p>

        <BotonPrimario type="submit" :disabled="perfil.guardandoPassword" class="w-full sm:w-auto">
          {{ perfil.guardandoPassword ? 'Actualizando...' : 'Cambiar contraseña' }}
        </BotonPrimario>
      </form>
    </section>
  </div>
</template>
