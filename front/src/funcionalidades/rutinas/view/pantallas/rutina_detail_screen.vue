<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRutinasViewModel } from '../../viewmodel/rutinas_viewmodel'
import BotonPrimario from '@/compartido/ui/BotonPrimario.vue'
import BaseModal from '@/compartido/ui/BaseModal.vue'
import BaseCard from '@/compartido/ui/BaseCard.vue'

const route = useRoute()
const router = useRouter()
const viewModel = useRutinasViewModel()

const id = computed(() => route.params.id as string)
const mostrarModalBorrar = ref(false)

onMounted(() => {
  viewModel.cargarRutinaPorId(id.value)
})

function irARegistrarEntreno() {
  router.push(`/entrenos/nuevo/${id.value}`)
}

function abrirModalBorrar() {
  mostrarModalBorrar.value = true
}

function cerrarModalBorrar() {
  mostrarModalBorrar.value = false
}

async function confirmarBorrar() {
  const ok = await viewModel.borrarRutina(id.value)
  cerrarModalBorrar()
  if (ok) router.push('/rutinas')
}

async function confirmarDuplicar() {
  const nueva = await viewModel.duplicarRutina(id.value)
  if (nueva) router.push(`/rutinas/${nueva.id}`)
}
</script>

<template>
  <div>
    <p v-if="viewModel.cargando" class="text-gray-600">Cargando...</p>
    <p v-else-if="viewModel.error && !viewModel.rutinaActual" class="text-red-600" role="alert">
      {{ viewModel.error }}
    </p>
    <template v-else-if="viewModel.rutinaActual">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">{{ viewModel.rutinaActual.nombre }}</h1>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
            @click="router.push(`/rutinas/${id}/editar`)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
            :disabled="viewModel.cargando"
            @click="confirmarDuplicar"
          >
            Duplicar
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-200 px-4 py-2 text-red-700 hover:bg-red-50 font-medium"
            :disabled="viewModel.cargando"
            @click="abrirModalBorrar"
          >
            Borrar
          </button>
          <BotonPrimario :disabled="viewModel.cargando" @click="irARegistrarEntreno">
            Registrar entreno
          </BotonPrimario>
        </div>
      </div>
      <p v-if="viewModel.error" class="text-red-600 text-sm mb-2" role="alert">
        {{ viewModel.error }}
      </p>

      <BaseCard>
        <template #titulo>
          <span class="font-medium text-gray-800">Ejercicios de la rutina</span>
        </template>
        <template #default>
          <ul class="divide-y divide-gray-200">
            <li
              v-for="ej in viewModel.rutinaActual.ejercicios"
              :key="ej.id"
              class="p-4"
            >
              <p class="font-medium text-gray-800">{{ ej.nombre }}</p>
              <ul class="mt-2 text-sm text-gray-600 space-y-1">
                <li
                  v-for="(s, i) in ej.seriesObjetivo"
                  :key="i"
                >
                  Serie {{ i + 1 }}: {{ s.reps }} reps · {{ s.pesoSugerido }} kg
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </BaseCard>

      <BaseModal :visible="mostrarModalBorrar" @cerrar="cerrarModalBorrar">
        <template #titulo>
          <h2 id="modal-titulo-borrar" class="text-lg font-semibold text-gray-800">Confirmar borrado</h2>
        </template>
        <p class="text-gray-600">
          ¿Borrar esta rutina? También se eliminarán todos los entrenos asociados.
        </p>
        <template #pie>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            @click="cerrarModalBorrar"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            :disabled="viewModel.cargando"
            @click="confirmarBorrar"
          >
            Borrar rutina
          </button>
        </template>
      </BaseModal>
    </template>
    <p v-else class="text-gray-500">Rutina no encontrada.</p>
  </div>
</template>
