<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useRutinasViewModel } from '../../viewmodel/rutinas_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import type { Rutina } from '../../model/entidades'

const viewModel = useRutinasViewModel()

/** Opciones de orden: A-Z, Z-A, más recientes primero. */
type OrdenRutinas = 'az' | 'za' | 'recientes'

const textoBusqueda = ref('')
const orden = ref<OrdenRutinas>('az')

onMounted(() => {
  viewModel.cargarRutinas()
})

/** Lista filtrada y ordenada sin mutar el array del store (copia). */
const rutinasFiltradasYOrdenadas = computed(() => {
  const lista = [...viewModel.rutinasLista] as Rutina[]
  const texto = textoBusqueda.value.trim().toLowerCase()
  let resultado = texto
    ? lista.filter((r) => r.nombre.toLowerCase().includes(texto))
    : lista
  // Ordenar sobre la copia
  if (orden.value === 'az') {
    resultado = resultado.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  } else if (orden.value === 'za') {
    resultado = resultado.slice().sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'))
  } else {
    resultado = resultado.slice().sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }
  return resultado
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Rutinas</h1>
      <RouterLink to="/rutinas/nueva">
        <BotonPrimario>Nueva rutina</BotonPrimario>
      </RouterLink>
    </div>

    <!-- Fila: buscador + orden (solo si hay datos) -->
    <div
      v-if="!viewModel.cargando && !viewModel.error && viewModel.rutinasLista.length > 0"
      class="flex flex-wrap items-center gap-3 mb-4"
    >
      <input
        v-model="textoBusqueda"
        type="search"
        placeholder="Buscar por nombre..."
        class="rounded-lg border border-gray-300 px-3 py-2 w-56 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <select
        v-model="orden"
        class="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="recientes">Más recientes primero</option>
      </select>
    </div>

    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error" class="text-red-600">{{ viewModel.error }}</p>
    <div v-else-if="viewModel.rutinasLista.length === 0" class="rounded-xl bg-white p-6 shadow text-center text-gray-500">
      No hay rutinas. Crea una para empezar.
    </div>
    <div v-else-if="rutinasFiltradasYOrdenadas.length === 0" class="rounded-xl bg-white p-6 shadow text-center text-gray-500">
      No hay rutinas que coincidan con la búsqueda.
    </div>
    <ul v-else class="space-y-3">
      <li
        v-for="r in rutinasFiltradasYOrdenadas"
        :key="r.id"
        class="rounded-xl bg-white shadow p-4 hover:shadow-md transition"
      >
        <RouterLink :to="`/rutinas/${r.id}`" class="block">
          <span class="font-medium text-gray-800">{{ r.nombre }}</span>
          <span class="text-sm text-gray-500 ml-2">{{ r.ejercicios.length }} ejercicios</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
