import { computed, type Ref } from 'vue'
import type { Rutina, SerieObjetivo } from '@/funcionalidades/rutinas/model/entidades'
import type { EntrenoItem, SerieReal } from '../model/entidades'

interface ResumenEntreno {
  totalEjercicios: number
  totalSeries: number
  seriesCompletadas: number
  porcentajeCompletado: number
  volumenTotal: number
  totalPR: number
}

function objetivoSerie(
  rutina: Rutina | null,
  ejercicioId: string,
  serieIdx: number
): SerieObjetivo | null {
  if (!rutina) return null
  const ejercicio = rutina.ejercicios.find((e) => e.id === ejercicioId)
  if (!ejercicio) return null
  return ejercicio.seriesObjetivo[serieIdx] ?? null
}

function calcularPR(serie: SerieReal, objetivo: SerieObjetivo | null): boolean {
  if (!objetivo) return false
  if (serie.peso > objetivo.pesoSugerido) return true
  return serie.peso === objetivo.pesoSugerido && serie.reps > objetivo.reps
}

function calcularComparativaObjetivo(
  serie: SerieReal,
  objetivo: SerieObjetivo | null
): 'superado' | 'cumplido' | 'por_debajo' {
  if (!objetivo) return 'por_debajo'
  const cumpleReps = serie.reps >= objetivo.reps
  const cumplePeso = serie.peso >= objetivo.pesoSugerido
  if (cumpleReps && cumplePeso) {
    if (serie.reps > objetivo.reps || serie.peso > objetivo.pesoSugerido) return 'superado'
    return 'cumplido'
  }
  return 'por_debajo'
}

export function useMetricasEntreno(items: Ref<EntrenoItem[]>, rutinaActual: Ref<Rutina | null>) {
  function esSeriePR(ejercicioId: string, serieIdx: number, serie: SerieReal): boolean {
    return calcularPR(serie, objetivoSerie(rutinaActual.value, ejercicioId, serieIdx))
  }

  function compararConObjetivo(
    ejercicioId: string,
    serieIdx: number,
    serie: SerieReal
  ): 'superado' | 'cumplido' | 'por_debajo' {
    return calcularComparativaObjetivo(serie, objetivoSerie(rutinaActual.value, ejercicioId, serieIdx))
  }

  const resumen = computed<ResumenEntreno>(() => {
    const totalEjercicios = items.value.length
    let totalSeries = 0
    let seriesCompletadas = 0
    let volumenTotal = 0
    let totalPR = 0

    for (const item of items.value) {
      for (const [serieIdx, serie] of item.series.entries()) {
        totalSeries += 1
        if (serie.completada) {
          seriesCompletadas += 1
          volumenTotal += serie.reps * serie.peso
        }
        if (esSeriePR(item.ejercicioId, serieIdx, serie)) {
          totalPR += 1
        }
      }
    }

    const porcentajeCompletado = totalSeries > 0 ? Math.round((seriesCompletadas / totalSeries) * 100) : 0
    return {
      totalEjercicios,
      totalSeries,
      seriesCompletadas,
      porcentajeCompletado,
      volumenTotal,
      totalPR,
    }
  })

  const itemsConPR = computed<EntrenoItem[]>(() =>
    items.value.map((item) => ({
      ...item,
      series: item.series.map((serie, serieIdx) => ({
        ...serie,
        esPR: esSeriePR(item.ejercicioId, serieIdx, serie),
        comparativaObjetivo: compararConObjetivo(item.ejercicioId, serieIdx, serie),
      })),
    }))
  )

  return { resumen, esSeriePR, compararConObjetivo, itemsConPR }
}
