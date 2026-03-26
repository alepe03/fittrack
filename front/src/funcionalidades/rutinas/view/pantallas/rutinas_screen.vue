<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRutinasViewModel } from '../../viewmodel/rutinas_viewmodel'
import { useLocalStorage } from '@/compartido/composables/useLocalStorage'
import { useFiltrosRutinas, type OrdenRutinas } from '@/compartido/composables/useFiltrosRutinas'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import TarjetaRutina from '@/compartido/ui/TarjetaRutina.vue'

const router = useRouter()
const viewModel = useRutinasViewModel()

/** Preferencia de orden persistida en localStorage (criterio DEW). */
const { valor: ordenRef } = useLocalStorage<OrdenRutinas>('fittrack_rutinas_orden', 'az')
const orden = computed({
  get: () => ordenRef.value ?? 'az',
  set: (v: OrdenRutinas) => { ordenRef.value = v },
})

const textoBusqueda = ref('')

const { rutinasFiltradasYOrdenadas } = useFiltrosRutinas(
  computed(() => viewModel.rutinasLista as import('../../model/entidades').Rutina[]),
  textoBusqueda,
  orden
)

onMounted(() => {
  viewModel.cargarRutinas()
})

function irARutina(id: string) {
  router.push(`/rutinas/${id}`)
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Rutinas</h1>
      <BotonPrimario class="w-full sm:w-auto" @click="router.push('/rutinas/nueva')">Nueva rutina</BotonPrimario>
    </div>

    <div
      v-if="!viewModel.cargando && !viewModel.error && viewModel.rutinasLista.length > 0"
      class="rounded-xl bg-white p-3 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 mb-4"
    >
      <label for="rutinas-busqueda" class="sr-only">Buscar rutinas por nombre</label>
      <input
        id="rutinas-busqueda"
        v-model="textoBusqueda"
        type="search"
        placeholder="Buscar por nombre..."
        class="rounded-lg border border-gray-300 px-3 py-2 w-full sm:w-56 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <label for="rutinas-orden" class="sr-only">Ordenar rutinas</label>
      <select
        id="rutinas-orden"
        v-model="orden"
        class="rounded-lg border border-gray-300 px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="recientes">Más recientes primero</option>
      </select>
    </div>

    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error" class="text-red-600" role="alert">{{ viewModel.error }}</p>
    <div v-else-if="viewModel.rutinasLista.length === 0" class="rounded-xl bg-white p-6 shadow text-center text-gray-500">
      No hay rutinas. Crea una para empezar.
    </div>
    <div v-else-if="rutinasFiltradasYOrdenadas.length === 0" class="rounded-xl bg-white p-6 shadow text-center text-gray-500">
      No hay rutinas que coincidan con la búsqueda.
    </div>
    <ul v-else class="space-y-3">
      <li v-for="r in rutinasFiltradasYOrdenadas" :key="r.id">
        <TarjetaRutina :rutina="r" @ver="irARutina" />
      </li>
    </ul>
  </div>
</template>
