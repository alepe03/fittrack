<script setup lang="ts">
defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { type: 'button', disabled: false }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
