<template>
  <div class="mainCategoryPage">
    <Transition name="slide-side">
      <div v-if="isSidebarOpen" class="mobileSidebar">
        <categories-menu />
      </div>
    </Transition>
    <div
      v-if="isSidebarOpen"
      class="sidebarOverlay"
      @click="closeSidebar"
    ></div>
    <div class="categoryMenu">
      <categories-menu />
    </div>
    <div class="cardMenu">
      <div class="switch_buttons">
        <PickUp
          ref="pickUpRef"
          title="Pick - Up"
          class="pick-up"
          :class="{ switched: isSwitched }"
          :data="rentalStore.pickup"
          :style="pickUpStyle"
          @update:date="(newDate) => (rentalStore.pickup.date = newDate)"
          @update:time="(newTime) => (rentalStore.pickup.time = newTime)"
          @update:location="(val) => (rentalStore.pickup.location = val)"
        />

        <SwitchButton
          class="switch"
          @click="switchToggle"
          :class="{ rotated: isSwitched }"
          :active="isSwitched"
        />
        <PickUp
          ref="dropOffRef"
          title="Drop - Off"
          class="drop-off"
          :class="{ switched: isSwitched }"
          :data="rentalStore.dropoff"
          :style="dropOffStyle"
          @update:date="(newDate) => (rentalStore.dropoff.date = newDate)"
          @update:time="(newTime) => (rentalStore.dropoff.time = newTime)"
          @update:location="(val) => (rentalStore.dropoff.location = val)"
        />
      </div>
      <h1 class="visually-hidden">Car catalog</h1>
      <div class="cards">
        <template v-if="filteredProducts.length > 0">
          <ResponsiveCard
            v-for="product in filteredProducts.slice(0, visibleLimit)"
            :key="product.id"
            :product="product"
          />
        </template>
        <div v-else class="emptyState">
          <p>No cars found matching your filters.</p>
          <button type="button" class="resetFilters" @click="resetFilters">
            Reset filters
          </button>
        </div>
      </div>
      <div class="buttonsMainPage">
        <ButtonRental
          :label="buttonLabel"
          class="buttonAll"
          @click="showMoreCars"
        />
        <p class="allCar">{{ filteredProducts.length }} Car</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PickUp from "~/components/Pick-up.vue";
import ResponsiveCard from "~/components/ResponsiveCard.vue";
import ButtonRental from "~/components/Button-rental.vue";
import CategoriesMenu from "~/components/categoriesMenu.vue";
import { ref, computed, onMounted, nextTick, watch } from "vue";

definePageMeta({
  isSpecialHeader: true,
});

useSeoMeta({
  title: "Car catalog — filter by type, capacity and price",
  description:
    "Browse all MORENT cars: filter by type, number of seats and daily price.",
});

const { screenWidth } = useScreenWidth();
const { filteredProducts, resetFilters } = useCarFilters();
const { isSidebarOpen, closeSidebar } = useSidebarScrollLock();
const rentalStore = useRentalStore();
const {
  pickUpRef,
  dropOffRef,
  isSwitched,
  calculateDistance,
  switchToggle,
  pickUpStyle,
  dropOffStyle,
} = useSwapAnimation();

onMounted(() => nextTick(calculateDistance));
watch(screenWidth, () => nextTick(calculateDistance));

// Кнопка «показать ещё»
const baseCount = computed<number>(() => (screenWidth.value >= 1440 ? 9 : 12));
const extraCarsCount = ref<number>(0);

const visibleLimit = computed<number>(
  () => baseCount.value + extraCarsCount.value,
);

// при смене фильтров начинаем с первой «страницы»
watch(filteredProducts, () => (extraCarsCount.value = 0));

const isAllShown = computed<boolean>(
  () => visibleLimit.value >= filteredProducts.value.length,
);

const buttonLabel = computed<string>(() =>
  isAllShown.value ? "Show Start" : "Show More Car",
);

const showMoreCars = (): void => {
  extraCarsCount.value = isAllShown.value ? 0 : extraCarsCount.value + 9;
};
</script>

<style scoped>
.mainCategoryPage {
  max-width: 1440px;
  background-color: var(--backgroundpages);
  display: flex;
  flex-direction: row;
  justify-content: start;
  overflow-x: hidden;

  @media (min-width: 1440px) and (max-width: 1439px) {
    border-top: 1px var(--borderColor) solid;
  }
  @media (min-width: 1px) and (max-width: 1439px) {
    width: 100%;
  }
  .categoryMenu {
    display: none;
    align-items: stretch;
    @media (min-width: 1280px) {
      display: flex;
      padding-top: 2px;
    }
  }
  .cardMenu {
    overflow-x: hidden;
    @media (min-width: 1px) and (max-width: 1439px) {
      gap: 2rem;
    }
    .switch_buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 2rem;
      gap: 2.75rem;
      flex-direction: row;
      @media (min-width: 1px) and (max-width: 1439px) {
        flex-direction: column;
        padding: 2rem 1.5rem;
        justify-content: start;
        align-items: center;
      }
      .pick-up,
      .drop-off {
        position: relative;
        transition: transform 1s cubic-bezier(0.65, 0, 0.35, 1);
      }

      .switch {
        position: absolute;
        top: 50%;
        left: 52.2%;
        transform: translate(-50%, -50%);
        z-index: 5;
        transition: all 1s ease;

        @media (min-width: 375px) and (max-width: 1439px) {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .switch.rotated {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding-left: 2rem;
      padding-right: 2rem;
      padding-bottom: 4rem;
      gap: 2rem;
      @media (min-width: 1px) and (max-width: 1439px) {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-bottom: 3rem;
        gap: 1.25rem;
      }
    }
  }
  .buttonsMainPage {
    display: flex;
    align-items: center;
    justify-content: end;
    padding-right: 2rem;
    gap: 18.125rem;
    padding-bottom: 4rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      align-self: start;
      gap: 3rem;

      .allCar {
        text-wrap: nowrap;
      }
    }
    .allCar {
      color: var(--secondary-300);
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
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
.emptyState {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--secondary-300);
}
.resetFilters {
  color: var(--primary-500);
  text-decoration: underline;
  font-weight: 600;
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
