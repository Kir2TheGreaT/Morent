<template>
  <div class="layout">
    <Header class="header" />
    <main class="content">
      <slot />
    </main>
    <Footer class="footerLayout" v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script lang="ts" setup>
import Footer from "~/components/Footer.vue";
import Header from "~/components/Header.vue";

provideSidebar();
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
}

.content {
  margin: 0 auto;
  background-color: var(--backgroundpages);
  @media (min-width: 1440px) {
    max-width: 1410px;
  }
}

.header {
  top: 0;
  z-index: var(--z-header);

  width: 100%;
  max-width: 1410px;

  margin-left: auto;
  margin-right: auto;

  left: 0;
  right: 0;
  @media (min-width: 1440px) {
    border-bottom: 1px var(--borderColor) solid;
  }
}
.footerLayout {
  max-width: 1410px;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
