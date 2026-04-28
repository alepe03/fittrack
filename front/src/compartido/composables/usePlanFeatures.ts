import { computed } from 'vue'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'

export function usePlanFeatures() {
  const auth = useAutenticacionViewModel()

  const plan = computed(() => auth.usuario?.plan ?? 'free')
  const isPremium = computed(() => plan.value === 'premium')
  const isFree = computed(() => !isPremium.value)

  function canCreateRoutine(actualRoutineCount: number): boolean {
    if (isPremium.value) return true
    return actualRoutineCount < 3
  }

  return {
    plan,
    isPremium,
    isFree,
    canCreateRoutine,
  }
}
