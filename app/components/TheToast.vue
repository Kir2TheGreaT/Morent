<template>
  <div class="toast-wrapper" role="status" aria-live="polite">
    <TransitionGroup name="list">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast-card"
        :class="toast.type"
      >
        <span class="message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { useToastStore } from "@/stores/toast";
const toastStore = useToastStore();
</script>

<style>
.toast-wrapper {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast-card {
  padding: 16px 24px;
  border-radius: 10px;
  color: var(--primary-0);
  font-weight: 500;
  min-width: 280px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.success {
  background-color: #7cffcb;
  color: #1a253c;
}
.error {
  background-color: #ed3f3f;
}
.warning {
  background-color: #ffc107;
  color: #1a253c;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
