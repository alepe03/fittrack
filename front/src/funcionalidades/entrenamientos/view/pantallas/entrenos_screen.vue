<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useEntrenamientosViewModel } from '../../viewmodel/entrenamientos_viewmodel'

const viewModel = useEntrenamientosViewModel()

onMounted(() => {
  viewModel.cargarEntrenos()
})

function formatearFecha(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Entrenos</h1>

    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error" class="text-red-600">{{ viewModel.error }}</p>
    <div v-else-if="viewModel.entrenosLista.length === 0" class="rounded-xl bg-white p-6 shadow text-center text-gray-500">
      No hay entrenos registrados. Crea una rutina y luego "Registrar entreno" desde su detalle.
    </div>
    <ul v-else class="space-y-3">
      <li
        v-for="e in viewModel.entrenosLista"
        :key="e.id"
        class="rounded-xl bg-white shadow p-4 hover:shadow-md transition"
      >
        <RouterLink :to="`/entrenos/${e.id}`" class="block">
          <span class="font-medium text-gray-800">{{ e.nombreRutina }}</span>
          <span class="text-sm text-gray-500 ml-2">{{ formatearFecha(e.fechaISO) }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
