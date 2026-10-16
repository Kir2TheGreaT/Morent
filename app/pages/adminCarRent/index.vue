<template>
  <div class="accountMainPage">
    <h1 class="visually-hidden">Account dashboard</h1>
    <Transition name="slide-side">
      <div v-if="isSidebarOpen" class="mobileSidebar">
        <AccDashboard />
      </div>
    </Transition>
    <div
      v-if="isSidebarOpen"
      class="sidebarOverlay"
      @click="closeSidebar"
    ></div>
    <div class="accountDashBoard">
      <AccDashboard />
    </div>
    <div class="leftsideAccount">
      <ClientOnly>
        <ProjectMap />
        <PaymentAccountData />
      </ClientOnly>
    </div>
    <div class="rightsideAccount">
      <AccountStat class="accountStatisticWidget" />
      <RecentTransaction class="recentTransactionWidget" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AccDashboard from "~/components/accountPage/accDashboard.vue";
import ProjectMap from "~/components/accountPage/project-map.vue";
import PaymentAccountData from "~/components/accountPage/paymentAccountData.vue";
import RecentTransaction from "~/components/accountPage/recentTransaction.vue";
import AccountStat from "~/components/accountPage/accountStat.vue";

definePageMeta({
  hideFooter: true,
  isSpecialHeader: true,
  middleware: "auth",
});

useSeoMeta({
  title: "Account",
  robots: "noindex, nofollow",
});

const { isSidebarOpen, closeSidebar } = useSidebarScrollLock();
</script>

<style>
.accountMainPage {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  @media (min-width: 1px) and (max-width: 800px) {
    flex-direction: column;
  }
  .accountDashBoard {
    padding-top: 0.2rem;
    @media (min-width: 1px) and (max-width: 950px) {
      display: none;
    }
  }
  .leftsideAccount {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
  .rightsideAccount {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    @media (min-width: 1440px) {
      .accountStatisticWidget {
        margin-top: 2rem;
      }
    }
  }
  .mobileSidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    background-color: var(--primary-0);
    z-index: var(--z-drawer);
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .sidebarOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.4);
    z-index: var(--z-overlay);
  }
}
.slide-side-enter-active,
.slide-side-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-side-enter-from,
.slide-side-leave-to {
  transform: translateX(-100%);
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
