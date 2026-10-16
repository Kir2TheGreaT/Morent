<template>
  <div class="login-page">
    <Transition name="fade" mode="out-in">
      <AuthLoginForm
        v-if="currentView === 'login'"
        @switch-to-register="currentView = 'register'"
      />
      <AuthRegisterForm v-else @switch-to-login="currentView = 'login'" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthLoginForm from "~/components/LoginForm.vue";
import AuthRegisterForm from "~/components/RegisterForm.vue";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Login",
  robots: "noindex, nofollow",
});

const currentView = ref<"login" | "register">("login");
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 2rem 1.5rem;
  background-color: var(--primary-0);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
