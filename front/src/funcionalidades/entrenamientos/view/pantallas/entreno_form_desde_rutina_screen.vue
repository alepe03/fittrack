<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRutinasViewModel } from '@/funcionalidades/rutinas/viewmodel/rutinas_viewmodel'
import { useEntrenamientosViewModel } from '../../viewmodel/entrenamientos_viewmodel'
import { useEntrenamientoEnCurso } from '@/compartido/composables/useEntrenamientoEnCurso'
import { useMetricasEntreno } from '../../composables/useMetricasEntreno'
import { useCronometroSesion } from '../../composables/useCronometroSesion'
import { useTemporizadorDescanso } from '../../composables/useTemporizadorDescanso'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import type { EntrenoItem, SerieReal } from '../../model/entidades'

const route = useRoute()
const router = useRouter()
const viewModelRutinas = useRutinasViewModel()
const viewModelEntrenos = useEntrenamientosViewModel()
const { obtener: obtenerEnCurso, guardar: guardarEnCurso, limpiar: limpiarEnCurso } = useEntrenamientoEnCurso()

const rutinaId = computed(() => route.params.rutinaId as string)
const idEntrenoEdicion = computed(() => route.params.id as string)
const esEdicion = computed(() => route.name === 'entreno-editar')
const items = ref<EntrenoItem[]>([])
const notaGeneral = ref('')
const errorValidacion = ref('')
const { resumen, esSeriePR, compararConObjetivo, itemsConPR } = useMetricasEntreno(items, computed(() => viewModelRutinas.rutinaActual))
const cronometro = useCronometroSesion()
const temporizadorDescanso = useTemporizadorDescanso(90)
const descansoPersonalizadoMin = ref(1.5)
const mostrarFinDescanso = computed(() => temporizadorDescanso.estado.value === 'terminado')
const duracionDescansoMinutos = computed(() => (temporizadorDescanso.duracionSegundos.value / 60).toFixed(1))
const estadoCronometroTexto = computed(() =>
  cronometro.estado.value === 'corriendo'
    ? 'Corriendo'
    : cronometro.estado.value === 'pausado'
      ? 'Pausado'
      : 'Listo'
)
const estadoDescansoTexto = computed(() =>
  temporizadorDescanso.estado.value === 'listo'
    ? 'Listo'
    : temporizadorDescanso.estado.value === 'corriendo'
      ? 'Corriendo'
      : temporizadorDescanso.estado.value === 'pausado'
        ? 'Pausado'
        : 'Terminado'
)
const mensajeNoDisponible = computed(() =>
  esEdicion.value ? 'Entreno no encontrado.' : 'Rutina no encontrada.'
)

onMounted(async () => {
  if (esEdicion.value) {
    await viewModelEntrenos.cargarEntrenoPorId(idEntrenoEdicion.value)
    const entreno = viewModelEntrenos.entrenoActual
    if (!entreno) return
    await viewModelRutinas.cargarRutinaPorId(entreno.rutinaId)
    items.value = entreno.items.map((item) => ({
      ...item,
      series: item.series.map(normalizarSerie),
    }))
    notaGeneral.value = entreno.notaGeneral ?? ''
    if (entreno.descansoSegundosUsado) {
      temporizadorDescanso.establecerDuracion(entreno.descansoSegundosUsado)
      descansoPersonalizadoMin.value = Number((entreno.descansoSegundosUsado / 60).toFixed(1))
    }
    if (entreno.duracionSegundos && entreno.duracionSegundos > 0) {
      cronometro.duracionSegundos.value = entreno.duracionSegundos
      cronometro.pausar()
    }
    return
  }

  await viewModelRutinas.cargarRutinaPorId(rutinaId.value)
  const rutina = viewModelRutinas.rutinaActual
  if (!rutina) return
  const guardado = obtenerEnCurso()
  if (guardado && guardado.rutinaId === rutinaId.value && guardado.items.length > 0) {
    items.value = guardado.items.map((item) => ({
      ...item,
      series: item.series.map(normalizarSerie),
    }))
    notaGeneral.value = guardado.notaGeneral ?? ''
  } else {
    items.value = rutina.ejercicios.map((ej) => ({
      ejercicioId: ej.id,
      nombre: ej.nombre,
      series: ej.seriesObjetivo.map((s) => ({
        reps: s.reps,
        peso: s.pesoSugerido,
        completada: false,
        rir: 2,
        esPR: false,
      })),
    }))
  }
})

watch(items, (val) => {
  if (esEdicion.value) return
  const nombre = viewModelRutinas.rutinaActual?.nombre
  if (rutinaId.value && nombre && val.length > 0) {
    guardarEnCurso({
      rutinaId: rutinaId.value,
      nombreRutina: nombre,
      items: val,
      notaGeneral: notaGeneral.value.trim() || undefined,
    })
  }
}, { deep: true })

watch(notaGeneral, (nota) => {
  if (esEdicion.value) return
  const nombre = viewModelRutinas.rutinaActual?.nombre
  if (!rutinaId.value || !nombre) return
  guardarEnCurso({
    rutinaId: rutinaId.value,
    nombreRutina: nombre,
    items: items.value,
    notaGeneral: nota.trim() || undefined,
  })
})

const nombreRutina = computed(() =>
  esEdicion.value
    ? (viewModelEntrenos.entrenoActual?.nombreRutina ?? viewModelRutinas.rutinaActual?.nombre ?? '')
    : (viewModelRutinas.rutinaActual?.nombre ?? '')
)

function idRepsSerie(ejercicioId: string, serieIdx: number): string {
  return `entreno-${ejercicioId}-serie-${serieIdx}-reps`
}

function idPesoSerie(ejercicioId: string, serieIdx: number): string {
  return `entreno-${ejercicioId}-serie-${serieIdx}-peso`
}

function idRirSerie(ejercicioId: string, serieIdx: number): string {
  return `entreno-${ejercicioId}-serie-${serieIdx}-rir`
}

function idCompletadaSerie(ejercicioId: string, serieIdx: number): string {
  return `entreno-${ejercicioId}-serie-${serieIdx}-completada`
}

function normalizarSerie(serie: Partial<SerieReal>): SerieReal {
  return {
    reps: Number(serie.reps ?? 0),
    peso: Number(serie.peso ?? 0),
    completada: Boolean(serie.completada),
    rir: Number.isFinite(serie.rir) ? Number(serie.rir) : 2,
    esPR: Boolean(serie.esPR),
    comparativaObjetivo: serie.comparativaObjetivo ?? 'por_debajo',
  }
}

function minutosASegundos(minutos: number): number {
  return Math.round(minutos * 60)
}

function aplicarDescansoRapido(minutos: number) {
  descansoPersonalizadoMin.value = minutos
  temporizadorDescanso.establecerDuracion(minutosASegundos(minutos))
}

function aplicarDescansoPersonalizado() {
  temporizadorDescanso.establecerDuracion(minutosASegundos(descansoPersonalizadoMin.value))
}

function iniciarDescansoDesdeSerie() {
  temporizadorDescanso.iniciar()
}

function validar(): boolean {
  for (const item of items.value) {
    for (const s of item.series) {
      if (s.reps < 0 || s.peso < 0) {
        errorValidacion.value = 'Reps y peso deben ser >= 0.'
        return false
      }
      if (s.rir < 0 || s.rir > 5) {
        errorValidacion.value = 'El RIR debe estar entre 0 y 5.'
        return false
      }
    }
  }
  errorValidacion.value = ''
  return true
}

async function guardar() {
  if (!viewModelRutinas.rutinaActual || !validar()) return
  cronometro.detener()
  const payload = {
    fechaISO: new Date().toISOString(),
    rutinaId: viewModelRutinas.rutinaActual.id,
    nombreRutina: viewModelRutinas.rutinaActual.nombre,
    items: itemsConPR.value,
    notaGeneral: notaGeneral.value.trim() || undefined,
    duracionSegundos: cronometro.duracionSegundos.value,
    descansoSegundosUsado: temporizadorDescanso.duracionSegundos.value,
  }
  const entreno = esEdicion.value
    ? await viewModelEntrenos.actualizarEntreno(idEntrenoEdicion.value, payload)
    : await viewModelEntrenos.crearEntreno(payload)
  if (entreno) {
    if (!esEdicion.value) limpiarEnCurso()
    router.push(`/entrenos/${entreno.id}`)
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      {{ esEdicion ? 'Editar entreno' : 'Registrar entreno' }}
    </h1>
    <p class="text-gray-600 mb-6">Rutina: {{ nombreRutina }}</p>

    <p v-if="viewModelRutinas.cargando" class="text-gray-600">Cargando rutina...</p>
    <p v-else-if="!viewModelRutinas.rutinaActual" class="text-red-600">{{ mensajeNoDisponible }}</p>
    <div v-else class="rounded-xl bg-white shadow p-4 sm:p-6 space-y-6">
      <p class="text-xs text-gray-500">
        Introduce reps, peso y RIR por serie. Marca las series completadas para ver progreso y posibles PR.
      </p>
      <section class="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
        <h2 class="text-base font-semibold text-blue-900">Cronómetro general de sesión</h2>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-3xl font-bold text-blue-900 tracking-wide">
            {{ cronometro.duracionFormateada }}
          </p>
          <span class="text-xs rounded-full px-2 py-0.5 w-fit"
            :class="cronometro.estado === 'corriendo' ? 'bg-blue-100 text-blue-800' : cronometro.estado === 'pausado' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'"
          >
            {{ estadoCronometroTexto }}
          </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="rounded border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100" @click="cronometro.iniciar()">
            Iniciar
          </button>
          <button type="button" class="rounded border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100" @click="cronometro.pausar()">
            Pausar
          </button>
          <button type="button" class="rounded border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100" @click="cronometro.reanudar()">
            Reanudar
          </button>
          <button type="button" class="rounded border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100" @click="cronometro.reiniciar()">
            Reiniciar
          </button>
        </div>
        <p class="text-xs text-blue-800">
          Este cronómetro mide la duración total de la sesión de entrenamiento.
        </p>
      </section>

      <section class="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
        <h2 class="text-sm font-semibold text-gray-800">Descanso entre series</h2>
        <p class="text-xs text-gray-600">
          Configura el tiempo de descanso y úsalo entre series.
        </p>
        <div class="rounded-md border border-gray-200 bg-white p-3 space-y-3">
          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="aplicarDescansoRapido(1)">1 min</button>
            <button type="button" class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="aplicarDescansoRapido(1.5)">1,5 min</button>
            <button type="button" class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="aplicarDescansoRapido(2)">2 min</button>
            <button type="button" class="rounded border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100" @click="temporizadorDescanso.iniciar()">Iniciar descanso</button>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div>
              <label for="descanso-personalizado" class="block text-xs font-medium text-gray-600 mb-1">Descanso personalizado (minutos)</label>
              <input
                id="descanso-personalizado"
                v-model.number="descansoPersonalizadoMin"
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                class="w-36 rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <button type="button" class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="aplicarDescansoPersonalizado()">
              Aplicar
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm text-gray-700">
              Descanso: <span class="font-semibold">{{ temporizadorDescanso.restanteFormateado }}</span>
            </p>
            <span class="text-xs rounded-full px-2 py-0.5"
              :class="temporizadorDescanso.estado === 'corriendo'
                ? 'bg-blue-100 text-blue-800'
                : temporizadorDescanso.estado === 'pausado'
                  ? 'bg-amber-100 text-amber-800'
                  : temporizadorDescanso.estado === 'terminado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-700'"
            >
              {{ estadoDescansoTexto }}
            </span>
            <button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="temporizadorDescanso.pausar()">Pausar</button>
            <button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="temporizadorDescanso.reanudar()">Reanudar</button>
            <button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="temporizadorDescanso.reiniciar()">Reiniciar</button>
          </div>
          <p v-if="mostrarFinDescanso" class="text-sm font-medium text-emerald-700" role="status">
            Descanso terminado. Puedes iniciar la siguiente serie.
          </p>
        </div>
      </section>
      <section class="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
        <h2 class="text-sm font-semibold text-blue-900">Progreso del entreno</h2>
        <p class="mt-1 text-sm text-blue-900">
          {{ resumen.seriesCompletadas }} de {{ resumen.totalSeries }} series completadas ({{ resumen.porcentajeCompletado }}%)
        </p>
        <div class="mt-2 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
          <div
            class="h-full bg-blue-600 transition-all"
            :style="{ width: `${resumen.porcentajeCompletado}%` }"
          />
        </div>
      </section>
      <div
        v-for="item in items"
        :key="item.ejercicioId"
        class="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50"
      >
        <p class="font-medium text-gray-800 mb-3">{{ item.nombre }}</p>
        <div class="space-y-2">
          <div
            v-for="(serie, sIdx) in item.series"
            :key="sIdx"
            class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-md px-2 py-2"
            :class="serie.completada ? 'bg-emerald-50 border border-emerald-200' : 'bg-white/60 border border-transparent'"
          >
            <span class="text-sm text-gray-600 w-16">Serie {{ sIdx + 1 }}</span>
            <label :for="idCompletadaSerie(item.ejercicioId, sIdx)" class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                :id="idCompletadaSerie(item.ejercicioId, sIdx)"
                v-model="serie.completada"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Completada
            </label>
            <button
              type="button"
              class="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
              @click="iniciarDescansoDesdeSerie"
            >
              Iniciar descanso
            </button>
            <label :for="idRepsSerie(item.ejercicioId, sIdx)" class="sr-only">
              Repeticiones, {{ item.nombre }}, serie {{ sIdx + 1 }}
            </label>
            <input
              :id="idRepsSerie(item.ejercicioId, sIdx)"
              v-model.number="serie.reps"
              type="number"
              min="0"
              class="w-full sm:w-24 rounded border border-gray-300 px-2 py-2 text-sm"
              placeholder="Reps"
            />
            <label :for="idPesoSerie(item.ejercicioId, sIdx)" class="sr-only">
              Peso en kilos, {{ item.nombre }}, serie {{ sIdx + 1 }}
            </label>
            <input
              :id="idPesoSerie(item.ejercicioId, sIdx)"
              v-model.number="serie.peso"
              type="number"
              min="0"
              step="0.5"
              class="w-full sm:w-24 rounded border border-gray-300 px-2 py-2 text-sm"
              placeholder="Kg"
            />
            <span class="text-sm text-gray-500">kg</span>
            <label :for="idRirSerie(item.ejercicioId, sIdx)" class="sr-only">
              RIR, {{ item.nombre }}, serie {{ sIdx + 1 }}
            </label>
            <select
              :id="idRirSerie(item.ejercicioId, sIdx)"
              v-model.number="serie.rir"
              class="w-full sm:w-20 rounded border border-gray-300 px-2 py-2 text-sm"
            >
              <option :value="0">RIR 0</option>
              <option :value="1">RIR 1</option>
              <option :value="2">RIR 2</option>
              <option :value="3">RIR 3</option>
              <option :value="4">RIR 4</option>
              <option :value="5">RIR 5</option>
            </select>
            <span
              v-if="esSeriePR(item.ejercicioId, sIdx, serie)"
              class="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800"
            >
              PR
            </span>
            <span
              :class="compararConObjetivo(item.ejercicioId, sIdx, serie) === 'superado'
                ? 'bg-emerald-100 text-emerald-800'
                : compararConObjetivo(item.ejercicioId, sIdx, serie) === 'cumplido'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'"
              class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            >
              {{
                compararConObjetivo(item.ejercicioId, sIdx, serie) === 'superado'
                  ? 'Objetivo superado'
                  : compararConObjetivo(item.ejercicioId, sIdx, serie) === 'cumplido'
                    ? 'Objetivo cumplido'
                    : 'Por debajo del objetivo'
              }}
            </span>
          </div>
        </div>
      </div>
      <section class="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
        <label for="nota-entreno" class="text-sm font-semibold text-gray-800">Nota general del entreno</label>
        <textarea
          id="nota-entreno"
          v-model="notaGeneral"
          rows="3"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="Ej: Buenas sensaciones, subir 2,5 kg en press en la próxima sesión."
        />
      </section>
      <section class="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1">
        <h2 class="text-sm font-semibold text-gray-800">Resumen antes de guardar</h2>
        <p class="text-sm text-gray-600">Ejercicios: {{ resumen.totalEjercicios }}</p>
        <p class="text-sm text-gray-600">
          Series completadas: {{ resumen.seriesCompletadas }} / {{ resumen.totalSeries }}
        </p>
        <p class="text-sm text-gray-600">Volumen total completado: {{ resumen.volumenTotal.toFixed(1) }} kg</p>
        <p class="text-sm text-gray-600">PR detectados: {{ resumen.totalPR }}</p>
        <p class="text-sm text-gray-600">Duración sesión: {{ cronometro.duracionFormateada }}</p>
        <p class="text-sm text-gray-600">Descanso configurado: {{ duracionDescansoMinutos }} min</p>
      </section>

      <p v-if="errorValidacion" class="text-red-600 text-sm" role="alert">
        {{ errorValidacion }}
      </p>
      <p v-if="viewModelEntrenos.error" class="text-red-600 text-sm" role="alert">
        {{ viewModelEntrenos.error }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3">
        <BotonPrimario class="w-full sm:w-auto" :disabled="viewModelEntrenos.cargando" @click="guardar">
          {{ viewModelEntrenos.cargando ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Guardar entreno') }}
        </BotonPrimario>
        <button
          type="button"
          class="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 min-h-11"
          @click="esEdicion ? router.push(`/entrenos/${idEntrenoEdicion}`) : router.push(`/rutinas/${rutinaId}`)"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
