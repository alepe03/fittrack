<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRutinasViewModel } from '@/funcionalidades/rutinas/viewmodel/rutinas_viewmodel'
import { useEntrenamientosViewModel } from '@/funcionalidades/entrenamientos/viewmodel/entrenamientos_viewmodel'
import { entrenamientosRepositorio } from '@/funcionalidades/entrenamientos/data/entrenamientos_repositorio'
import type { Entreno } from '@/funcionalidades/entrenamientos/model/entidades'
import { formatearFechaConHora } from '@/nucleo/utils/fechas'

const rutinasViewModel = useRutinasViewModel()
const entrenosViewModel = useEntrenamientosViewModel()
const MAX_DETALLES_PROGRESO = 80

const cargandoDetalle = ref(false)
const errorLocal = ref<string | null>(null)
const entrenosDetalle = ref<Entreno[]>([])

const entrenosOrdenados = computed(() =>
  [...entrenosDetalle.value].sort((a, b) => Date.parse(b.fechaISO) - Date.parse(a.fechaISO)),
)
const entrenosCabeceraOrdenados = computed(() =>
  [...entrenosViewModel.entrenosLista].sort((a, b) => Date.parse(b.fechaISO) - Date.parse(a.fechaISO)),
)

const totalEntrenamientos = computed(() => entrenosViewModel.entrenosLista.length)
const totalRutinas = computed(() => rutinasViewModel.rutinasLista.length)

const totalSeriesCompletadas = computed(() => {
  let total = 0
  for (const entreno of entrenosDetalle.value) {
    for (const item of entreno.items) {
      for (const serie of item.series) {
        if (serie.completada) total += 1
      }
    }
  }
  return total
})

const totalPRs = computed(() => {
  let total = 0
  for (const entreno of entrenosDetalle.value) {
    for (const item of entreno.items) {
      for (const serie of item.series) {
        if (serie.esPR === true) total += 1
      }
    }
  }
  return total
})

const ultimoEntreno = computed(() => entrenosOrdenados.value[0] ?? entrenosCabeceraOrdenados.value[0] ?? null)
const sinEntrenamientos = computed(() => totalEntrenamientos.value === 0)
const usaMuestraParcial = computed(() => entrenosViewModel.entrenosLista.length > MAX_DETALLES_PROGRESO)

const ejercicioDestacado = computed(() => {
  const prPorEjercicio = new Map<string, number>()
  const completadasPorEjercicio = new Map<string, number>()

  for (const entreno of entrenosDetalle.value) {
    for (const item of entreno.items) {
      for (const serie of item.series) {
        if (serie.esPR === true) {
          prPorEjercicio.set(item.nombre, (prPorEjercicio.get(item.nombre) ?? 0) + 1)
        }
        if (serie.completada) {
          completadasPorEjercicio.set(item.nombre, (completadasPorEjercicio.get(item.nombre) ?? 0) + 1)
        }
      }
    }
  }

  const mejorPR = [...prPorEjercicio.entries()].sort((a, b) => b[1] - a[1])[0]
  if (mejorPR) return `${mejorPR[0]} (${mejorPR[1]} PRs)`

  const mejorCompletadas = [...completadasPorEjercicio.entries()].sort((a, b) => b[1] - a[1])[0]
  if (mejorCompletadas) return `${mejorCompletadas[0]} (${mejorCompletadas[1]} series completadas)`

  return 'Sin datos todavía'
})

const mejorLogroReciente = computed(() => {
  for (const entreno of entrenosOrdenados.value) {
    const prSeries: Array<{ ejercicio: string; serieIdx: number; reps: number; peso: number }> = []
    for (const item of entreno.items) {
      item.series.forEach((serie, idx) => {
        if (serie.esPR === true) {
          prSeries.push({
            ejercicio: item.nombre,
            serieIdx: idx + 1,
            reps: serie.reps,
            peso: serie.peso,
          })
        }
      })
    }

    if (prSeries.length > 0) {
      const principal = prSeries[0]
      if (!principal) continue
      const extras = prSeries.length - 1
      return {
        titulo: `PR en ${principal.ejercicio} — ${principal.peso} kg x ${principal.reps} reps (Serie ${principal.serieIdx})`,
        subtitulo: `Entreno: ${entreno.nombreRutina} · ${formatearFechaConHora(entreno.fechaISO)}${extras > 0 ? ` · +${extras} PRs más` : ''}`,
      }
    }
  }

  if (ultimoEntreno.value) {
    return {
      titulo: `Último entreno: ${ultimoEntreno.value.nombreRutina}`,
      subtitulo: formatearFechaConHora(ultimoEntreno.value.fechaISO),
    }
  }

  return {
    titulo: 'Aún no hay entrenamientos para mostrar logros.',
    subtitulo: '',
  }
})

const diasEntrenadosUltimos30 = computed(() => {
  const limite = Date.now() - (30 * 24 * 60 * 60 * 1000)
  const dias = new Set<string>()
  for (const entreno of entrenosDetalle.value) {
    const t = Date.parse(entreno.fechaISO)
    if (Number.isFinite(t) && t >= limite) {
      dias.add(entreno.fechaISO.slice(0, 10))
    }
  }
  return dias.size
})

const rachaSimple = computed(() => {
  const diasUnicos = [...new Set(entrenosDetalle.value.map((e) => e.fechaISO.slice(0, 10)))]
    .map((d) => Date.parse(`${d}T00:00:00`))
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a)

  if (diasUnicos.length === 0) return 0
  let racha = 1
  for (let i = 1; i < diasUnicos.length; i += 1) {
    const diaAnterior = diasUnicos[i - 1]
    const diaActual = diasUnicos[i]
    if (diaAnterior === undefined || diaActual === undefined) break
    const diffDias = Math.round((diaAnterior - diaActual) / (24 * 60 * 60 * 1000))
    if (diffDias === 1) racha += 1
    else break
  }
  return racha
})

const logros = computed(() => [
  {
    nombre: 'Primer paso',
    descripcion: 'Completaste tu primer entrenamiento',
    desbloqueado: totalEntrenamientos.value >= 1,
  },
  {
    nombre: 'Constante',
    descripcion: 'Has registrado 5 entrenamientos',
    desbloqueado: totalEntrenamientos.value >= 5,
  },
  {
    nombre: 'En racha',
    descripcion: 'Has entrenado varios días recientemente',
    desbloqueado: rachaSimple.value >= 3 || diasEntrenadosUltimos30.value >= 3,
  },
  {
    nombre: 'Primera marca personal',
    descripcion: 'Conseguiste tu primer PR',
    desbloqueado: totalPRs.value >= 1,
  },
  {
    nombre: 'Superación',
    descripcion: 'Has conseguido 5 marcas personales',
    desbloqueado: totalPRs.value >= 5,
  },
  {
    nombre: 'Planificador',
    descripcion: 'Has creado varias rutinas',
    desbloqueado: totalRutinas.value >= 3,
  },
])

onMounted(async () => {
  errorLocal.value = null
  cargandoDetalle.value = true
  try {
    await Promise.all([
      rutinasViewModel.cargarRutinas(),
      entrenosViewModel.cargarEntrenos(),
    ])

    const ids = entrenosCabeceraOrdenados.value.slice(0, MAX_DETALLES_PROGRESO).map((e) => e.id)
    if (ids.length === 0) {
      entrenosDetalle.value = []
      return
    }
    const detalles = await Promise.allSettled(ids.map((id) => entrenamientosRepositorio.obtenerPorId(id)))
    entrenosDetalle.value = detalles
      .filter((r): r is PromiseFulfilledResult<Entreno | null> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((e): e is Entreno => e !== null)
  } catch (e) {
    errorLocal.value = e instanceof Error ? e.message : 'No se pudo cargar el progreso.'
  } finally {
    cargandoDetalle.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800">Mi progreso</h1>
    <p class="text-gray-600 mt-1 mb-6">Resumen de tu evolución y constancia</p>

    <p v-if="cargandoDetalle" class="text-gray-600">Cargando progreso...</p>
    <p v-else-if="errorLocal" class="text-red-600" role="alert">{{ errorLocal }}</p>
    <section
      v-else-if="sinEntrenamientos"
      class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
    >
      <h2 class="text-base font-semibold text-gray-800">Aún no hay progreso registrado</h2>
      <p class="mt-2 text-sm text-gray-600">
        Cuando completes tus primeros entrenamientos verás aquí tu evolución, PRs y constancia.
      </p>
    </section>
    <template v-else>
      <p v-if="usaMuestraParcial" class="mb-3 text-xs text-gray-500">
        Algunas métricas avanzadas se calculan sobre los {{ MAX_DETALLES_PROGRESO }} entrenamientos más recientes para mantener una carga ágil.
      </p>
      <section class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
        <h2 class="text-sm font-semibold text-emerald-900">Mejor logro reciente</h2>
        <p class="mt-1 text-sm font-semibold text-emerald-900">{{ mejorLogroReciente.titulo }}</p>
        <p v-if="mejorLogroReciente.subtitulo" class="mt-1 text-xs text-emerald-800">{{ mejorLogroReciente.subtitulo }}</p>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <article class="rounded-xl bg-white p-4 shadow border border-gray-100">
          <p class="text-xs text-gray-500">Entrenamientos realizados</p>
          <p class="mt-1 text-2xl font-bold text-gray-800">{{ totalEntrenamientos }}</p>
        </article>
        <article class="rounded-xl bg-white p-4 shadow border border-gray-100">
          <p class="text-xs text-gray-500">Rutinas creadas</p>
          <p class="mt-1 text-2xl font-bold text-gray-800">{{ totalRutinas }}</p>
        </article>
        <article class="rounded-xl bg-white p-4 shadow border border-gray-100">
          <p class="text-xs text-gray-500">Series completadas</p>
          <p class="mt-1 text-2xl font-bold text-gray-800">{{ totalSeriesCompletadas }}</p>
        </article>
        <article class="rounded-xl bg-white p-4 shadow border border-gray-100">
          <p class="text-xs text-gray-500">PRs conseguidos</p>
          <p class="mt-1 text-2xl font-bold text-gray-800">{{ totalPRs }}</p>
        </article>
        <article class="rounded-xl bg-white p-4 shadow border border-gray-100">
          <p class="text-xs text-gray-500">Último entrenamiento</p>
          <p class="mt-1 text-sm font-semibold text-gray-800">
            {{ ultimoEntreno ? `${ultimoEntreno.nombreRutina} · ${formatearFechaConHora(ultimoEntreno.fechaISO)}` : 'Sin entrenamientos' }}
          </p>
        </article>
        <article class="rounded-xl bg-white p-4 shadow border border-gray-100">
          <p class="text-xs text-gray-500">Ejercicio destacado</p>
          <p class="mt-1 text-sm font-semibold text-gray-800">{{ ejercicioDestacado }}</p>
        </article>
      </section>

      <section class="mt-4 rounded-xl bg-white p-4 shadow border border-gray-100">
        <h2 class="text-sm font-semibold text-gray-800">Constancia</h2>
        <p class="mt-1 text-sm text-gray-700">
          Días entrenados en últimos 30 días: <span class="font-semibold">{{ diasEntrenadosUltimos30 }}</span>
        </p>
        <p class="text-sm text-gray-700">
          Racha simple actual: <span class="font-semibold">{{ rachaSimple }} días consecutivos</span>
        </p>
      </section>
    </template>

    <section v-if="!cargandoDetalle && !errorLocal" class="mt-4">
      <h2 class="text-lg font-semibold text-gray-800">Logros</h2>
      <p class="text-sm text-gray-600 mt-1 mb-3">Insignias desbloqueadas según tu actividad</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <article
          v-for="logro in logros"
          :key="logro.nombre"
          class="rounded-xl border p-3 transition"
          :class="logro.desbloqueado
            ? 'bg-emerald-50 border-emerald-200 shadow-sm'
            : 'bg-gray-50 border-gray-200 opacity-75'"
        >
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-800">{{ logro.nombre }}</h3>
            <span
              class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
              :class="logro.desbloqueado ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'"
            >
              {{ logro.desbloqueado ? 'Desbloqueado' : 'Pendiente' }}
            </span>
          </div>
          <p class="mt-1 text-xs text-gray-600">{{ logro.descripcion }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
