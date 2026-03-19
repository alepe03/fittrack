<script setup lang="ts">
/**
 * Modal base con slots: titulo, contenido (default) y pie (acciones).
 * Cumplimiento criterio DEW: uso de slots.
 */
defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  cerrar: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      @click.self="emit('cerrar')"
    >
      <div
        class="rounded-xl bg-white shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
        aria-labelledby="modal-titulo-borrar"
        @click.stop
      >
        <div v-if="$slots.titulo" class="px-4 py-3 border-b border-gray-200">
          <slot name="titulo" />
        </div>
        <div class="px-4 py-3 overflow-auto flex-1">
          <slot />
        </div>
        <div v-if="$slots.pie" class="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
          <slot name="pie" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
