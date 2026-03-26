<script setup lang="ts">
/**
 * Modal base con slots: titulo, contenido (default) y pie (acciones).
 * Cumplimiento criterio DEW: uso de slots.
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  cerrar: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
let ultimoElementoActivo: HTMLElement | null = null

function obtenerElementosEnfocables(): HTMLElement[] {
  if (!dialogRef.value) return []
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
  )
}

function enfocarPrimerElemento() {
  const enfocables = obtenerElementosEnfocables()
  if (enfocables.length > 0) {
    enfocables[0]?.focus()
    return
  }
  dialogRef.value?.focus()
}

function cerrarModal() {
  emit('cerrar')
}

function alKeydown(event: KeyboardEvent) {
  if (!props.visible) return
  if (event.key === 'Escape') {
    event.preventDefault()
    cerrarModal()
    return
  }
  if (event.key !== 'Tab') return

  const enfocables = obtenerElementosEnfocables()
  if (enfocables.length === 0) {
    event.preventDefault()
    dialogRef.value?.focus()
    return
  }

  const primero = enfocables[0]
  const ultimo = enfocables[enfocables.length - 1]
  const activo = document.activeElement as HTMLElement | null

  if (event.shiftKey && activo === primero) {
    event.preventDefault()
    ultimo?.focus()
  } else if (!event.shiftKey && activo === ultimo) {
    event.preventDefault()
    primero?.focus()
  }
}

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      ultimoElementoActivo = document.activeElement as HTMLElement | null
      await nextTick()
      enfocarPrimerElemento()
      return
    }
    if (ultimoElementoActivo) {
      ultimoElementoActivo.focus()
      ultimoElementoActivo = null
    }
  }
)

onBeforeUnmount(() => {
  if (ultimoElementoActivo) {
    ultimoElementoActivo.focus()
    ultimoElementoActivo = null
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo-borrar"
      aria-describedby="modal-descripcion"
      @click.self="cerrarModal"
      @keydown="alKeydown"
    >
      <div
        ref="dialogRef"
        class="rounded-xl bg-white shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
        tabindex="-1"
        @click.stop
      >
        <div v-if="$slots.titulo" class="px-4 py-3 border-b border-gray-200">
          <slot name="titulo" />
        </div>
        <div id="modal-descripcion" class="px-4 py-3 overflow-auto flex-1">
          <slot />
        </div>
        <div v-if="$slots.pie" class="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
          <slot name="pie" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
