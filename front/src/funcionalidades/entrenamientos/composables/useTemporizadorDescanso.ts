import { computed, onBeforeUnmount, ref } from 'vue'

type EstadoDescanso = 'listo' | 'corriendo' | 'pausado' | 'terminado'

export function useTemporizadorDescanso(segundosIniciales = 90) {
  const duracionSegundos = ref(segundosIniciales)
  const restanteSegundos = ref(segundosIniciales)
  const estado = ref<EstadoDescanso>('listo')
  const ticker = ref<number | null>(null)

  function limpiarTicker() {
    if (ticker.value != null) {
      window.clearInterval(ticker.value)
      ticker.value = null
    }
  }

  function formatear(segundos: number): string {
    const m = Math.floor(segundos / 60)
    const s = segundos % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function establecerDuracion(segundos: number) {
    const normalizado = Math.max(10, Math.min(600, Math.floor(segundos)))
    duracionSegundos.value = normalizado
    if (estado.value === 'listo' || estado.value === 'terminado') {
      restanteSegundos.value = normalizado
    }
  }

  function iniciar() {
    if (estado.value === 'corriendo') return
    if (restanteSegundos.value <= 0) {
      restanteSegundos.value = duracionSegundos.value
    }
    estado.value = 'corriendo'
    limpiarTicker()
    ticker.value = window.setInterval(() => {
      restanteSegundos.value -= 1
      if (restanteSegundos.value <= 0) {
        restanteSegundos.value = 0
        estado.value = 'terminado'
        limpiarTicker()
      }
    }, 1000)
  }

  function pausar() {
    if (estado.value !== 'corriendo') return
    limpiarTicker()
    estado.value = 'pausado'
  }

  function reanudar() {
    if (estado.value !== 'pausado') return
    iniciar()
  }

  function reiniciar() {
    limpiarTicker()
    restanteSegundos.value = duracionSegundos.value
    estado.value = 'listo'
  }

  const restanteFormateado = computed(() => formatear(restanteSegundos.value))

  onBeforeUnmount(() => {
    limpiarTicker()
  })

  return {
    estado,
    duracionSegundos,
    restanteSegundos,
    restanteFormateado,
    establecerDuracion,
    iniciar,
    pausar,
    reanudar,
    reiniciar,
    formatear,
  }
}
