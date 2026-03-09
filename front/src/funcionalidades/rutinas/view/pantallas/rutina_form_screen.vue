<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRutinasViewModel } from '../../viewmodel/rutinas_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import type { RutinaEjercicio } from '../../model/entidades'

const router = useRouter()
const route = useRoute()
const viewModel = useRutinasViewModel()

const idEditar = computed(() => (route.params.id as string) || '')
const esEdicion = computed(() => !!idEditar.value)

const nombreRutina = ref('')
const ejercicios = ref<RutinaEjercicio[]>([])
const errorValidacion = ref('')

function generarId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function agregarEjercicio() {
  ejercicios.value.push({
    id: generarId(),
    nombre: '',
    seriesObjetivo: [],
  })
}

function quitarEjercicio(idx: number) {
  ejercicios.value.splice(idx, 1)
}

function agregarSerieObjetivo(ejercicioIdx: number) {
  const ej = ejercicios.value[ejercicioIdx]
  if (ej) ej.seriesObjetivo.push({ reps: 10, pesoSugerido: 0 })
}

function quitarSerieObjetivo(ejercicioIdx: number, serieIdx: number) {
  const ej = ejercicios.value[ejercicioIdx]
  if (ej) ej.seriesObjetivo.splice(serieIdx, 1)
}

/** Rellena el formulario con los datos de la rutina actual (modo editar). */
function rellenarFormularioDesdeRutina() {
  const r = viewModel.rutinaActual
  if (!r) return
  nombreRutina.value = r.nombre
  ejercicios.value = r.ejercicios.map((ej) => ({
    id: ej.id,
    nombre: ej.nombre,
    seriesObjetivo: ej.seriesObjetivo.map((s) => ({ reps: s.reps, pesoSugerido: s.pesoSugerido })),
  }))
}

onMounted(async () => {
  if (esEdicion.value) {
    await viewModel.cargarRutinaPorId(idEditar.value)
    rellenarFormularioDesdeRutina()
  }
})

async function guardar() {
  errorValidacion.value = ''
  const nombre = nombreRutina.value.trim()
  if (!nombre) {
    errorValidacion.value = 'El nombre de la rutina es obligatorio.'
    return
  }
  const lista = ejercicios.value.filter((e) => e.nombre.trim() !== '')
  if (lista.length === 0) {
    errorValidacion.value = 'Añade al menos un ejercicio con nombre.'
    return
  }
  const conSeries = lista.map((e) => ({
    ...e,
    seriesObjetivo: e.seriesObjetivo.length ? e.seriesObjetivo : [{ reps: 0, pesoSugerido: 0 }],
  }))

  if (esEdicion.value) {
    const actualizada = await viewModel.actualizarRutina({
      id: idEditar.value,
      nombre,
      ejercicios: conSeries,
    })
    if (actualizada) router.push(`/rutinas/${actualizada.id}`)
  } else {
    const rutina = await viewModel.crearRutina({ nombre, ejercicios: conSeries })
    if (rutina) router.push(`/rutinas/${rutina.id}`)
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      {{ esEdicion ? 'Editar rutina' : 'Nueva rutina' }}
    </h1>

    <div class="rounded-xl bg-white shadow p-6 space-y-4">
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre de la rutina *</label>
        <input
          id="nombre"
          v-model="nombreRutina"
          type="text"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Ej: Piernas lunes"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Ejercicios</span>
          <button
            type="button"
            class="text-sm text-blue-600 hover:underline"
            @click="agregarEjercicio"
          >
            + Añadir ejercicio
          </button>
        </div>

        <div
          v-for="(ej, idx) in ejercicios"
          :key="ej.id"
          class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
        >
          <div class="flex gap-2 mb-2">
            <input
              v-model="ej.nombre"
              type="text"
              class="flex-1 rounded border border-gray-300 px-3 py-2"
              placeholder="Nombre del ejercicio"
            />
            <button
              type="button"
              class="text-red-600 hover:underline text-sm"
              @click="quitarEjercicio(idx)"
            >
              Quitar
            </button>
          </div>
          <div class="ml-2">
            <span class="text-xs text-gray-600 block mb-1">Series objetivo (reps / peso sugerido)</span>
            <button
              type="button"
              class="text-xs text-blue-600 hover:underline mb-2"
              @click="agregarSerieObjetivo(idx)"
            >
              + Añadir serie
            </button>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(serie, sIdx) in ej.seriesObjetivo"
                :key="sIdx"
                class="flex items-center gap-1 bg-white rounded border px-2 py-1"
              >
                <input
                  v-model.number="serie.reps"
                  type="number"
                  min="0"
                  class="w-14 rounded border border-gray-300 px-1 py-0.5 text-sm"
                />
                <span class="text-gray-500">reps</span>
                <input
                  v-model.number="serie.pesoSugerido"
                  type="number"
                  min="0"
                  step="0.5"
                  class="w-14 rounded border border-gray-300 px-1 py-0.5 text-sm"
                />
                <span class="text-gray-500">kg</span>
                <button
                  type="button"
                  class="text-red-500 text-xs"
                  @click="quitarSerieObjetivo(idx, sIdx)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="errorValidacion" class="text-red-600 text-sm">{{ errorValidacion }}</p>
      <p v-if="viewModel.error" class="text-red-600 text-sm">{{ viewModel.error }}</p>

      <div class="flex gap-3 pt-2">
        <BotonPrimario :disabled="viewModel.cargando" @click="guardar">Guardar rutina</BotonPrimario>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          @click="esEdicion ? router.push(`/rutinas/${idEditar}`) : router.push('/rutinas')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
