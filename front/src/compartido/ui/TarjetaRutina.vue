<script setup lang="ts">
/**
 * Tarjeta de rutina: muestra nombre y cantidad de ejercicios.
 * Comunicación padre-hijo: props (rutina) y emit (ver).
 */
import type { Rutina } from '@/funcionalidades/rutinas/model/entidades'
import BaseCard from '@/compartido/ui/BaseCard.vue'

const props = defineProps<{
  rutina: Rutina
}>()

const emit = defineEmits<{
  ver: [id: string]
}>()

function verDetalle() {
  emit('ver', props.rutina.id)
}
</script>

<template>
  <BaseCard>
    <template #titulo>
      <button
        type="button"
        class="text-left w-full rounded font-medium text-gray-800 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        @click="verDetalle"
      >
        {{ rutina.nombre }}
      </button>
    </template>
    <template #default>
      <span class="text-sm text-gray-500">{{ rutina.ejercicios_count ?? rutina.ejercicios.length }} ejercicios</span>
    </template>
  </BaseCard>
</template>

