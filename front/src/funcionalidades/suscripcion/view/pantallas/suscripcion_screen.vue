<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAutenticacionViewModel } from '@/funcionalidades/autenticacion/viewmodel/autenticacion_viewmodel'
import { usePlanFeatures } from '@/compartido/composables/usePlanFeatures'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import UpgradePremiumModal from '../componentes/upgrade_premium_modal.vue'
import type { UpgradeSimuladoResponse } from '../../data/suscripcion_api'
import { cancelarSuscripcionPremium } from '../../data/suscripcion_api'
import { extraerMensajesRespuestaError } from '@/nucleo/red/extraer_mensajes_error'

const auth = useAutenticacionViewModel()
const { isPremium, plan } = usePlanFeatures()
const mostrarModalUpgrade = ref(false)
const mensajeExito = ref<string | null>(null)
const mensajeAviso = ref<string | null>(null)
const comprobante = ref<UpgradeSimuladoResponse['receipt'] | null>(null)
const cancelandoPremium = ref(false)

const planActualTexto = computed(() => (isPremium.value ? 'Premium' : 'Free'))

const fechaComprobanteTexto = computed(() => {
  if (!comprobante.value) return ''
  const date = new Date(comprobante.value.issued_at)
  if (Number.isNaN(date.getTime())) return comprobante.value.issued_at
  return date.toLocaleString('es-ES')
})

async function onUpgradeCompletado(response: UpgradeSimuladoResponse) {
  comprobante.value = response.receipt
  mensajeAviso.value = null
  try {
    await auth.refrescarSesion()
  } catch {
    mensajeAviso.value = 'El pago simulado se completó, pero no se pudo refrescar la sesión automáticamente.'
  }
  mensajeExito.value = 'Tu plan se ha actualizado a Premium.'
  mostrarModalUpgrade.value = false
}

async function cancelarPremium() {
  if (!window.confirm('¿Seguro que quieres cancelar tu plan Premium y volver a Free?')) return
  cancelandoPremium.value = true
  mensajeAviso.value = null
  try {
    await cancelarSuscripcionPremium()
    comprobante.value = null
    mensajeExito.value = 'Tu suscripción Premium se ha cancelado. Ahora tienes plan Free.'
    try {
      await auth.refrescarSesion()
    } catch {
      mensajeAviso.value = 'La cancelación se aplicó, pero no se pudo refrescar la sesión automáticamente.'
    }
  } catch (e: unknown) {
    mensajeAviso.value = extraerMensajesRespuestaError(e)
  } finally {
    cancelandoPremium.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="rounded-xl bg-white shadow p-4 sm:p-6">
      <h1 class="text-2xl font-bold text-gray-800">Suscripción</h1>
      <p class="mt-2 text-gray-600">
        Plan actual:
        <span class="font-semibold text-gray-800">{{ planActualTexto }}</span>
      </p>
      <p v-if="mensajeExito" class="mt-3 text-sm text-emerald-700" role="status">
        {{ mensajeExito }}
      </p>
      <p v-if="mensajeAviso" class="mt-2 text-sm text-amber-700" role="alert">
        {{ mensajeAviso }}
      </p>
    </header>

    <section class="rounded-xl bg-white shadow p-4 sm:p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Comparativa de planes</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-3 py-2 font-semibold text-gray-700">Funcionalidad</th>
              <th class="text-left px-3 py-2 font-semibold text-gray-700">Free</th>
              <th class="text-left px-3 py-2 font-semibold text-gray-700">Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-200">
              <td class="px-3 py-2">Rutinas</td>
              <td class="px-3 py-2">Hasta 3</td>
              <td class="px-3 py-2">Ilimitadas</td>
            </tr>
            <tr class="border-t border-gray-200">
              <td class="px-3 py-2">RPE / RIR</td>
              <td class="px-3 py-2">No disponible</td>
              <td class="px-3 py-2">Disponible</td>
            </tr>
            <tr class="border-t border-gray-200">
              <td class="px-3 py-2">Tiempo de descanso</td>
              <td class="px-3 py-2">No disponible</td>
              <td class="px-3 py-2">Disponible</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="plan === 'free'" class="mt-5">
        <BotonPrimario class="w-full sm:w-auto" @click="mostrarModalUpgrade = true">
          Hazte Premium
        </BotonPrimario>
      </div>
      <div v-else class="mt-5">
        <button
          type="button"
          class="w-full sm:w-auto rounded border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          :disabled="cancelandoPremium"
          @click="cancelarPremium"
        >
          {{ cancelandoPremium ? 'Cancelando...' : 'Cancelar Premium' }}
        </button>
      </div>
    </section>

    <section v-if="comprobante" class="rounded-xl bg-white shadow p-4 sm:p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">Comprobante de pago simulado</h2>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt class="text-gray-500">ID comprobante</dt>
          <dd class="font-medium text-gray-800 break-all">{{ comprobante.receipt_id }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Fecha</dt>
          <dd class="font-medium text-gray-800">{{ fechaComprobanteTexto }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Plan</dt>
          <dd class="font-medium text-gray-800">{{ comprobante.plan }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Estado</dt>
          <dd class="font-medium text-gray-800">{{ comprobante.status }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Importe</dt>
          <dd class="font-medium text-gray-800">{{ comprobante.amount }} {{ comprobante.currency }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Email</dt>
          <dd class="font-medium text-gray-800">{{ comprobante.user_email }}</dd>
        </div>
        <div v-if="comprobante.card_last4">
          <dt class="text-gray-500">Tarjeta</dt>
          <dd class="font-medium text-gray-800">**** {{ comprobante.card_last4 }}</dd>
        </div>
      </dl>
    </section>

    <UpgradePremiumModal
      :visible="mostrarModalUpgrade"
      @close="mostrarModalUpgrade = false"
      @upgraded="onUpgradeCompletado"
    />
  </div>
</template>
