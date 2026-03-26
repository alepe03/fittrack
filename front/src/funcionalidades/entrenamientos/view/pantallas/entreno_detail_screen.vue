<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEntrenamientosViewModel } from '../../viewmodel/entrenamientos_viewmodel'
import { formatearFechaConHora } from '@/nucleo/utils/fechas'
import BaseModal from '@/compartido/ui/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const viewModel = useEntrenamientosViewModel()

const id = computed(() => route.params.id as string)
const mostrarModalBorrar = ref(false)

function formatearDuracion(segundos: number | undefined): string {
  if (!segundos || segundos <= 0) return '00:00'
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`
  return `${mm}:${ss}`
}

const resumen = computed(() => {
  const entreno = viewModel.entrenoActual
  if (!entreno) {
    return {
      totalEjercicios: 0,
      totalSeries: 0,
      seriesCompletadas: 0,
      volumenTotal: 0,
      totalPR: 0,
    }
  }

  let totalSeries = 0
  let seriesCompletadas = 0
  let volumenTotal = 0
  let totalPR = 0
  for (const item of entreno.items) {
    for (const serie of item.series) {
      totalSeries += 1
      if (serie.completada) {
        seriesCompletadas += 1
        volumenTotal += serie.reps * serie.peso
      }
      if (serie.esPR) totalPR += 1
    }
  }
  return {
    totalEjercicios: entreno.items.length,
    totalSeries,
    seriesCompletadas,
    volumenTotal,
    totalPR,
  }
})

onMounted(() => {
  viewModel.cargarEntrenoPorId(id.value)
})

function abrirModalBorrar() {
  mostrarModalBorrar.value = true
}

function cerrarModalBorrar() {
  mostrarModalBorrar.value = false
}

async function confirmarBorrar() {
  const ok = await viewModel.borrarEntreno(id.value)
  cerrarModalBorrar()
  if (ok) router.push('/entrenos')
}
</script>

<template>
  <div>
    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error" class="text-red-600" role="alert">
      {{ viewModel.error }}
    </p>
    <template v-else-if="viewModel.entrenoActual">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ viewModel.entrenoActual.nombreRutina }}</h1>
          <p class="text-gray-600">{{ formatearFechaConHora(viewModel.entrenoActual.fechaISO) }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
            @click="router.push(`/entrenos/${id}/editar`)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-200 px-4 py-2 text-red-700 hover:bg-red-50 font-medium"
            :disabled="viewModel.cargando"
            @click="abrirModalBorrar"
          >
            Borrar
          </button>
        </div>
      </div>
      <div class="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h2 class="text-sm font-semibold text-gray-800 mb-2">Resumen final del entreno</h2>
        <p class="text-sm text-gray-600">Ejercicios: {{ resumen.totalEjercicios }}</p>
        <p class="text-sm text-gray-600">Series completadas: {{ resumen.seriesCompletadas }} / {{ resumen.totalSeries }}</p>
        <p class="text-sm text-gray-600">Volumen total completado: {{ resumen.volumenTotal.toFixed(1) }} kg</p>
        <p class="text-sm text-gray-600">PR detectados: {{ resumen.totalPR }}</p>
        <p class="text-sm text-gray-600">Duración total: {{ formatearDuracion(viewModel.entrenoActual.duracionSegundos) }}</p>
        <p v-if="viewModel.entrenoActual.descansoSegundosUsado" class="text-sm text-gray-600">
          Descanso configurado: {{ formatearDuracion(viewModel.entrenoActual.descansoSegundosUsado) }}
        </p>
      </div>
      <div
        v-if="viewModel.entrenoActual.notaGeneral && viewModel.entrenoActual.notaGeneral.trim()"
        class="mb-6 rounded-xl border border-gray-200 bg-white p-4"
      >
        <h2 class="text-sm font-semibold text-gray-800 mb-2">Nota general del entreno</h2>
        <p class="text-sm text-gray-700 whitespace-pre-line">{{ viewModel.entrenoActual.notaGeneral }}</p>
      </div>

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
                class="flex flex-wrap items-center gap-2"
              >
                <span>Serie {{ i + 1 }}: {{ s.reps }} reps · {{ s.peso }} kg · RIR {{ s.rir ?? 2 }}</span>
                <span
                  :class="s.completada ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'"
                  class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  {{ s.completada ? 'Completada' : 'Pendiente' }}
                </span>
                <span
                  v-if="s.esPR"
                  class="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                >
                  PR
                </span>
                <span
                  v-if="s.comparativaObjetivo"
                  :class="s.comparativaObjetivo === 'superado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : s.comparativaObjetivo === 'cumplido'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'"
                  class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  {{
                    s.comparativaObjetivo === 'superado'
                      ? 'Objetivo superado'
                      : s.comparativaObjetivo === 'cumplido'
                        ? 'Objetivo cumplido'
                        : 'Por debajo del objetivo'
                  }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <BaseModal :visible="mostrarModalBorrar" @cerrar="cerrarModalBorrar">
        <template #titulo>
          <h2 id="modal-titulo-borrar" class="text-lg font-semibold text-gray-800">Confirmar borrado</h2>
        </template>
        <p class="text-gray-600">
          ¿Borrar este entreno? Esta acción no se puede deshacer.
        </p>
        <template #pie>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="cerrarModalBorrar"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            :disabled="viewModel.cargando"
            @click="confirmarBorrar"
          >
            Borrar entreno
          </button>
        </template>
      </BaseModal>
    </template>
    <p v-else class="text-gray-500">Entreno no encontrado.</p>
  </div>
</template>
