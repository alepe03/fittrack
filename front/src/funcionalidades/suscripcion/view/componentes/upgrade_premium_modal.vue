<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '@/compartido/ui/BaseModal.vue'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import { upgradeSimulado, type UpgradeSimuladoResponse } from '../../data/suscripcion_api'
import { extraerMensajesRespuestaError } from '@/nucleo/red/extraer_mensajes_error'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'upgraded', payload: UpgradeSimuladoResponse): void
}>()

const cardholderName = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const cardNumberFormatted = computed({
  get: () => cardNumber.value,
  set: (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim()
  },
})

const expiryFormatted = computed({
  get: () => expiry.value,
  set: (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) {
      expiry.value = digits
      return
    }
    expiry.value = `${digits.slice(0, 2)}/${digits.slice(2)}`
  },
})

const cvvFormatted = computed({
  get: () => cvv.value,
  set: (raw: string) => {
    cvv.value = raw.replace(/\D/g, '').slice(0, 4)
  },
})

function resetForm() {
  cardholderName.value = ''
  cardNumber.value = ''
  expiry.value = ''
  cvv.value = ''
  error.value = null
  loading.value = false
}

function cerrar() {
  resetForm()
  emit('close')
}

function validacionBasica(): string | null {
  if (!cardholderName.value.trim()) return 'El nombre del titular es obligatorio.'
  if (cardNumber.value.replace(/\s/g, '').length < 13) return 'La tarjeta no tiene un formato válido.'
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) return 'La caducidad debe tener formato MM/YY.'
  if (!/^\d{3,4}$/.test(cvv.value)) return 'El CVV debe tener 3 o 4 dígitos.'
  return null
}

async function confirmarUpgrade() {
  error.value = validacionBasica()
  if (error.value) return

  loading.value = true
  try {
    const response = await upgradeSimulado({
      cardholder_name: cardholderName.value.trim(),
      card_number: cardNumber.value.replace(/\s/g, ''),
      expiry: expiry.value,
      cvv: cvv.value,
    })
    emit('upgraded', response)
    cerrar()
  } catch (e: unknown) {
    error.value = extraerMensajesRespuestaError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <BaseModal
    :visible="props.visible"
    @cerrar="cerrar"
  >
    <template #titulo>
      <h2 class="text-lg font-semibold text-gray-800">Hazte Premium</h2>
    </template>

    <div class="space-y-3">
      <p class="text-sm text-gray-600">
        Simulación de pago. No se realizará ningún cobro real.
      </p>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del titular</label>
        <input
          v-model="cardholderName"
          type="text"
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          placeholder="Nombre y apellidos"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tarjeta</label>
        <input
          v-model="cardNumberFormatted"
          type="text"
          inputmode="numeric"
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          placeholder="1234 5678 9012 3456"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Caducidad</label>
          <input
            v-model="expiryFormatted"
            type="text"
            inputmode="numeric"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder="MM/YY"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            v-model="cvvFormatted"
            type="text"
            inputmode="numeric"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder="123"
          />
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

      <div class="flex flex-col sm:flex-row gap-2 pt-1">
        <BotonPrimario :disabled="loading" class="w-full sm:w-auto" @click="confirmarUpgrade">
          {{ loading ? 'Procesando...' : 'Confirmar upgrade' }}
        </BotonPrimario>
        <button
          type="button"
          class="w-full sm:w-auto rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          @click="cerrar"
        >
          Cancelar
        </button>
      </div>
    </div>
  </BaseModal>
</template>
