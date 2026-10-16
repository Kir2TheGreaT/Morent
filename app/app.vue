<template>
  <Transition name="fade">
    <PreloaderPage v-if="isLoading" />
  </Transition>
  <TheToast />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

// Тема ставится инлайн-скриптом в <head> до первого рендера — без мигания светлой темой.
useHead({
  script: [
    {
      innerHTML: `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`,
    },
  ],
});

// Прелоадер показываем на короткое время, а не фиксированные 3 секунды.
const isLoading = ref(true);
let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  timer = setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

onBeforeUnmount(() => clearTimeout(timer));
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
