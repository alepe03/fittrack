import { computed, onBeforeUnmount, ref } from 'vue'

type EstadoCronometro = 'listo' | 'corriendo' | 'pausado'

export function useCronometroSesion() {
  const inicioMs = ref<number>(0)
  const acumuladoSegundos = ref(0)
  const estado = ref<EstadoCronometro>('listo')
  const ticker = ref<number | null>(null)

  function limpiarTicker() {
    if (ticker.value != null) {
      window.clearInterval(ticker.value)
      ticker.value = null
    }
  }

  function iniciar() {
    if (estado.value === 'corriendo') return
    estado.value = 'corriendo'
    inicioMs.value = Date.now() - acumuladoSegundos.value * 1000
    limpiarTicker()
    ticker.value = window.setInterval(() => {
      if (!inicioMs.value) return
      acumuladoSegundos.value = Math.floor((Date.now() - inicioMs.value) / 1000)
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
    acumuladoSegundos.value = 0
    inicioMs.value = 0
    estado.value = 'listo'
  }

  function detener() {
    limpiarTicker()
    estado.value = 'pausado'
  }

  function formatear(segundos: number): string {
    const h = Math.floor(segundos / 3600)
    const m = Math.floor((segundos % 3600) / 60)
    const s = segundos % 60
    const mm = String(m).padStart(2, '0')
    const ss = String(s).padStart(2, '0')
    if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`
    return `${mm}:${ss}`
  }

  const duracionFormateada = computed(() => formatear(acumuladoSegundos.value))

  onBeforeUnmount(() => {
    limpiarTicker()
  })

  return {
    estado,
    duracionSegundos: acumuladoSegundos,
    duracionFormateada,
    iniciar,
    pausar,
    reanudar,
    detener,
    reiniciar,
    formatear,
  }
}
