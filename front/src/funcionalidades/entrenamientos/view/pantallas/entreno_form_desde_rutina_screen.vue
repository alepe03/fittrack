<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRutinasViewModel } from '@/funcionalidades/rutinas/viewmodel/rutinas_viewmodel'
import { useEntrenamientosViewModel } from '../../viewmodel/entrenamientos_viewmodel'
import { useEntrenamientoEnCurso } from '@/compartido/composables/useEntrenamientoEnCurso'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import type { EntrenoItem } from '../../model/entidades'

const route = useRoute()
const router = useRouter()
const viewModelRutinas = useRutinasViewModel()
const viewModelEntrenos = useEntrenamientosViewModel()
const { obtener: obtenerEnCurso, guardar: guardarEnCurso, limpiar: limpiarEnCurso } = useEntrenamientoEnCurso()

const rutinaId = computed(() => route.params.rutinaId as string)
const items = ref<EntrenoItem[]>([])
const errorValidacion = ref('')

onMounted(async () => {
  await viewModelRutinas.cargarRutinaPorId(rutinaId.value)
  const rutina = viewModelRutinas.rutinaActual
  if (rutina) {
    const guardado = obtenerEnCurso()
    if (guardado && guardado.rutinaId === rutinaId.value && guardado.items.length > 0) {
      items.value = guardado.items
    } else {
      items.value = rutina.ejercicios.map((ej) => ({
        ejercicioId: ej.id,
        nombre: ej.nombre,
        series: ej.seriesObjetivo.map((s) => ({ reps: s.reps, peso: s.pesoSugerido })),
      }))
    }
  }
})

watch(items, (val) => {
  const nombre = viewModelRutinas.rutinaActual?.nombre
  if (rutinaId.value && nombre && val.length > 0) {
    guardarEnCurso({ rutinaId: rutinaId.value, nombreRutina: nombre, items: val })
  }
}, { deep: true })

const nombreRutina = computed(() => viewModelRutinas.rutinaActual?.nombre ?? '')

function validar(): boolean {
  for (const item of items.value) {
    for (const s of item.series) {
      if (s.reps < 0 || s.peso < 0) {
        errorValidacion.value = 'Reps y peso deben ser >= 0.'
        return false
      }
    }
  }
  errorValidacion.value = ''
  return true
}

async function guardar() {
  if (!viewModelRutinas.rutinaActual || !validar()) return
  const payload = {
    fechaISO: new Date().toISOString(),
    rutinaId: viewModelRutinas.rutinaActual.id,
    nombreRutina: viewModelRutinas.rutinaActual.nombre,
    items: items.value,
  }
  const entreno = await viewModelEntrenos.crearEntreno(payload)
  if (entreno) {
    limpiarEnCurso()
    router.push(`/entrenos/${entreno.id}`)
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Registrar entreno</h1>
    <p class="text-gray-600 mb-6">Rutina: {{ nombreRutina }}</p>

    <p v-if="viewModelRutinas.cargando" class="text-gray-600">Cargando rutina...</p>
    <p v-else-if="!viewModelRutinas.rutinaActual" class="text-red-600">Rutina no encontrada.</p>
    <div v-else class="rounded-xl bg-white shadow p-6 space-y-6">
      <div
        v-for="item in items"
        :key="item.ejercicioId"
        class="border border-gray-200 rounded-lg p-4 bg-gray-50"
      >
        <p class="font-medium text-gray-800 mb-3">{{ item.nombre }}</p>
        <div class="space-y-2">
          <div
            v-for="(serie, sIdx) in item.series"
            :key="sIdx"
            class="flex items-center gap-3"
          >
            <span class="text-sm text-gray-600 w-16">Serie {{ sIdx + 1 }}</span>
            <input
              v-model.number="serie.reps"
              type="number"
              min="0"
              class="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Reps"
            />
            <input
              v-model.number="serie.peso"
              type="number"
              min="0"
              step="0.5"
              class="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Kg"
            />
            <span class="text-sm text-gray-500">kg</span>
          </div>
        </div>
      </div>

      <p v-if="errorValidacion" class="text-red-600 text-sm" role="alert">
        {{ errorValidacion }}
      </p>
      <p v-if="viewModelEntrenos.error" class="text-red-600 text-sm" role="alert">
        {{ viewModelEntrenos.error }}
      </p>

      <div class="flex gap-3">
        <BotonPrimario :disabled="viewModelEntrenos.cargando" @click="guardar">Guardar entreno</BotonPrimario>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          @click="router.push(`/rutinas/${rutinaId}`)"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
