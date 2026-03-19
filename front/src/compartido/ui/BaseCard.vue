<script setup lang="ts">
/**
 * Componente base con slots para título, contenido y acciones.
 * Cumplimiento criterio DEW: uso de slots.
 */
</script>

<template>
  <div class="rounded-xl bg-white shadow p-4 hover:shadow-md transition">
    <div v-if="$slots.titulo" class="mb-2">
      <slot name="titulo" />
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
    <div v-if="$slots.acciones" class="mt-3 pt-2 border-t border-gray-100">
      <slot name="acciones" />
    </div>
  </div>
</template>
