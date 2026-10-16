<script setup lang="ts">
import Swap from "~/components/icons/swap.vue";
defineProps<{
  active: boolean;
}>();
</script>

<template>
  <button type="button" class="switch_button" aria-label="Swap pick-up and drop-off" :aria-pressed="active">
    <swap :active="active" />
  </button>
</template>

<style scoped>
.switch_button {
  height: 3.75rem;
  width: 3.75rem;
  background-color: var(--primary-500);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  :hover {
    transform: scale(1.3)
  }
}
</style>
