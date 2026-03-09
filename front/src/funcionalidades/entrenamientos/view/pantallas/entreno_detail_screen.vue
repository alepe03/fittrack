<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEntrenamientosViewModel } from '../../viewmodel/entrenamientos_viewmodel'

const route = useRoute()
const viewModel = useEntrenamientosViewModel()

const id = computed(() => route.params.id as string)

onMounted(() => {
  viewModel.cargarEntrenoPorId(id.value)
})

function formatearFecha(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div>
    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error" class="text-red-600">{{ viewModel.error }}</p>
    <template v-else-if="viewModel.entrenoActual">
      <h1 class="text-2xl font-bold text-gray-800">{{ viewModel.entrenoActual.nombreRutina }}</h1>
      <p class="text-gray-600 mb-6">{{ formatearFecha(viewModel.entrenoActual.fechaISO) }}</p>

      <div class="rounded-xl bg-white shadow overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="item in viewModel.entrenoActual.items"
            :key="item.ejercicioId"
            class="p-4"
          >
            <p class="font-medium text-gray-800">{{ item.nombre }}</p>
            <ul class="mt-2 text-sm text-gray-600 space-y-1">
              <li
                v-for="(s, i) in item.series"
                :key="i"
              >
                Serie {{ i + 1 }}: {{ s.reps }} reps · {{ s.peso }} kg
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
    <p v-else class="text-gray-500">Entreno no encontrado.</p>
  </div>
</template>
