<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRutinasViewModel } from '../../viewmodel/rutinas_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'

const route = useRoute()
const router = useRouter()
const viewModel = useRutinasViewModel()

const id = computed(() => route.params.id as string)

onMounted(() => {
  viewModel.cargarRutinaPorId(id.value)
})

function irARegistrarEntreno() {
  router.push(`/entrenos/nuevo/${id.value}`)
}

async function confirmarBorrar() {
  const mensaje = '¿Borrar esta rutina? También se eliminarán todos los entrenos asociados.'
  if (!window.confirm(mensaje)) return
  const ok = await viewModel.borrarRutina(id.value)
  if (ok) router.push('/rutinas')
}

async function confirmarDuplicar() {
  const nueva = await viewModel.duplicarRutina(id.value)
  if (nueva) router.push(`/rutinas/${nueva.id}`)
}
</script>

<template>
  <div>
    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error && !viewModel.rutinaActual" class="text-red-600">{{ viewModel.error }}</p>
    <template v-else-if="viewModel.rutinaActual">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">{{ viewModel.rutinaActual.nombre }}</h1>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
            @click="router.push(`/rutinas/${id}/editar`)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
            :disabled="viewModel.cargando"
            @click="confirmarDuplicar"
          >
            Duplicar
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-200 px-4 py-2 text-red-700 hover:bg-red-50 font-medium"
            :disabled="viewModel.cargando"
            @click="confirmarBorrar"
          >
            Borrar
          </button>
          <BotonPrimario :disabled="viewModel.cargando" @click="irARegistrarEntreno">
            Registrar entreno
          </BotonPrimario>
        </div>
      </div>
      <p v-if="viewModel.error" class="text-red-600 text-sm mb-2">{{ viewModel.error }}</p>

      <div class="rounded-xl bg-white shadow overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="ej in viewModel.rutinaActual.ejercicios"
            :key="ej.id"
            class="p-4"
          >
            <p class="font-medium text-gray-800">{{ ej.nombre }}</p>
            <ul class="mt-2 text-sm text-gray-600 space-y-1">
              <li
                v-for="(s, i) in ej.seriesObjetivo"
                :key="i"
              >
                Serie {{ i + 1 }}: {{ s.reps }} reps · {{ s.pesoSugerido }} kg
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
    <p v-else class="text-gray-500">Rutina no encontrada.</p>
  </div>
</template>
