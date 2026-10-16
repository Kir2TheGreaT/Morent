<template>
  <div class="dashboardMain">
    <div class="dashboardMainMenu">
      <h5>MAIN MENU</h5>
      <div class="dashBoardMenuItems active">
        <Home></Home>
        <h6>Dashboard</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Car></Car>
        <h6>Car Rent</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Chart></Chart>
        <h6>Insight</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Change></Change>
        <h6>Reimburse</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Message></Message>
        <h6>Messages</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Calendar></Calendar>
        <h6>Calendar</h6>
      </div>
    </div>
    <div class="dashboardPreferences">
      <h5>P R E F E R E N C E S</h5>
      <div class="dashBoardMenuItems">
        <Settings></Settings>
        <h6>Settings</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Info></Info>
        <h6>Help & Center</h6>
      </div>
      <div class="dashBoardMenuItems">
        <Case></Case>
        <h6>Dark Mode</h6>
        <div class="theme-toggle-container">
          <button
            type="button"
            class="theme"
            aria-label="Dark mode"
            :aria-pressed="isDarkMode"
            @click="toggleTheme(isDarkMode ? 'light' : 'dark')"
          >
            <div class="slider-bg" :class="{ 'is-dark': isDarkMode }"></div>

            <Sun :class="{ 'icon-active': !isDarkMode }" />
            <Moon :class="{ 'icon-active': isDarkMode }" />
          </button>
        </div>
      </div>
    </div>
    <div
      class="logOutAccount"
      role="button"
      tabindex="0"
      @click="handleLogout"
      @keydown.enter="handleLogout"
      @keydown.space.prevent="handleLogout"
    >
      <LogOut></LogOut>
      <h6>Log Out</h6>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Calendar from "../icons/accountIcons/calendar.vue";
import Car from "../icons/accountIcons/car.vue";
import Case from "../icons/accountIcons/case.vue";
import Change from "../icons/accountIcons/change.vue";
import Chart from "../icons/accountIcons/chart.vue";
import Home from "../icons/accountIcons/home.vue";
import Info from "../icons/accountIcons/info.vue";
import LogOut from "../icons/accountIcons/logOut.vue";
import Message from "../icons/accountIcons/message.vue";
import Settings from "../icons/accountIcons/settings.vue";
import Moon from "../icons/theme/moon.vue";
import Sun from "../icons/theme/sun.vue";

import { ref, onMounted } from "vue";

const isDarkMode = ref(false);
onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
});

const saveTheme = (mode: "light" | "dark"): void => {
  try {
    localStorage.setItem("theme", mode);
  } catch {
    /* localStorage недоступен (приватный режим) — тема просто не запомнится */
  }
};

const toggleTheme = (mode: "light" | "dark") => {
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
    saveTheme("dark");
    isDarkMode.value = true;
  } else {
    document.documentElement.classList.remove("dark");
    saveTheme("light");
    isDarkMode.value = false;
  }
};
// Выход
const router = useRouter();
const authCookie = useCookie<string | null>("auth-logged-in");
const handleLogout = () => {
  authCookie.value = null;
  router.push("/");
};
</script>

<style>
.dashboardMain {
  display: flex;
  flex-direction: column;
  gap: 3.75rem;
  background-color: var(--primary-0);
  padding: 2.25rem 2rem;

  .dashboardMainMenu,
  .dashboardPreferences {
    h5 {
      color: rgba(148, 167, 203, 0.4);
      font-weight: 600;
      font-size: 0.75rem;
      margin: 0;
      padding-bottom: 2.625rem;
      display: flex;
      align-items: start;
    }

    .dashBoardMenuItems {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      cursor: pointer;
      position: relative;
      transition: all 0.5s ease;
      border-radius: 10px;
      margin-bottom: 0.5rem;
      &:hover {
        transform: scale(1.2);
        transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      &.active {
        background-color: var(--primary-500);
        margin-left: -1rem;
        margin-right: -1rem;
        padding-left: 2rem;

        h6 {
          color: var(--primary-0);
        }
        svg {
          color: var(--primary-0);
        }
      }

      h6 {
        font-weight: 500;
        font-size: 1rem;
        margin: 0;
        color: var(--secondary-300);
      }

      svg {
        width: 24px;
        height: 24px;
        color: var(--secondary-300);
      }

      .theme {
        display: flex;
        align-items: center;
        padding: 0;
        position: relative;
        width: 68px;
        height: 34px;
        margin-left: auto;
        background-color: var(--backgroundpages);
        border-radius: 50px;
        border: none;
        overflow: hidden;
        cursor: pointer;

        .slider-bg {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 28px;
          height: 28px;
          background-color: var(--primary-500);
          border-radius: 50%;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          &.is-dark {
            transform: translateX(34px);
          }
        }
        .icon-container {
          z-index: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s ease;
          color: var(--secondary-300);
          svg {
            width: 16px;
            height: 16px;
            padding: 9px;
            fill: currentColor;
            path {
              stroke: currentColor;
            }
          }

          &.icon-active {
            color: var(--primary-0);
            svg {
              fill: var(--primary-0);
              path {
                stroke: var(--primary-0);
              }
            }
          }
        }
      }
    }
  }

  .logOutAccount {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding-top: 4.25rem;
    padding-bottom: 3.125rem;
    &:hover {
      transform: scale(1.2);
      transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    }

    svg {
      width: 24px;
      height: 24px;
      color: var(--secondary-300);
    }

    h6 {
      color: var(--secondary-300);
      font-weight: 500;
      font-size: 1rem;
      margin: 0;
    }
  }
}
</style>
