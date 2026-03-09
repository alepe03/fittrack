<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/compartido/ui/AppLayout.vue'

const route = useRoute()

const usarLayout = computed(() => route.path !== '/login')
</script>

<template>
  <AppLayout v-if="usarLayout">
    <RouterView />
  </AppLayout>
  <RouterView v-else />
</template>
