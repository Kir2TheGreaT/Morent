<template>
  <div class="mainFirstPage">
    <h1 class="visually-hidden">MORENT — car rental</h1>
    <div :class="addsCars">
      <AddCars
        class="firstCard"
        label="The Best Platform for Car Rental"
        descriptionAddsCar="Ease of doing a car rental safely and reliably. Of course at a low price."
      />
      <AddCars
        class="secondCard"
        :second="true"
        label="Easy way to rent a car at a low price"
        descriptionAddsCar="Providing cheap car rental services and safe and comfortable facilities."
      />
    </div>
    <div class="buttons">
      <PickUp
        ref="pickUpRef"
        title="Pick - Up"
        class="pick-up"
        :class="{ switched: isSwitched }"
        :style="pickUpStyle"
        :data="rentalStore.pickup"
        @update:location="(val) => (rentalStore.pickup.location = val)"
        @update:date="(val) => (rentalStore.pickup.date = val)"
        @update:time="(val) => (rentalStore.pickup.time = val)"
      />

      <SwitchButton
        class="switch"
        @click="switchToggle"
        :active="isSwitched"
        :class="{ rotated: isSwitched }"
      />

      <PickUp
        ref="dropOffRef"
        title="Drop - Off"
        class="drop-off"
        :class="{ switched: isSwitched }"
        :style="dropOffStyle"
        :data="rentalStore.dropoff"
        @update:location="(val) => (rentalStore.dropoff.location = val)"
        @update:date="(val) => (rentalStore.dropoff.date = val)"
        @update:time="(val) => (rentalStore.dropoff.time = val)"
      />
    </div>
    <div class="popular_car">
      <h2 class="sectionHeading">Popular Car</h2>
      <NuxtLink class="view-all-link" to="/categoryCarRent">View All</NuxtLink>
    </div>
    <div class="popular_car2">
      <responsive-card
        v-for="product in popularProducts"
        :key="product.id"
        :carousel="isCarouselPopular"
        :maxVisible="popularCount"
        :product="product"
      />
    </div>
    <div class="recommendationText">
      <h2 class="sectionHeading">Recommendation Car</h2>
    </div>
    <div class="recommendationCarCard">
      <responsive-card
        v-for="product in recommendationProducts"
        :key="product.id"
        :maxVisible="maxRecommendationCards"
        :carousel="isCarouselRecommendation"
        :product="product"
      />
    </div>
    <div class="buttonsMainPage">
      <ButtonRental
        :label="buttonLabel"
        class="buttonAll"
        @click="showMoreCars"
      />
      <div class="allCar">{{ products.length }} Car</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, nextTick, watch } from "vue";
import AddCars from "~/components/Add-cars.vue";
import ButtonRental from "~/components/Button-rental.vue";
import { products } from "~~/data/products";
import type { Product } from "~~/data/products";

useSeoMeta({
  title: "Car rental — popular and recommended cars",
  description:
    "Rent a car safely and reliably at a low price: sport cars, SUVs, sedans, hatchbacks and electric vehicles.",
  ogTitle: "MORENT — car rental",
  ogDescription:
    "Ease of doing a car rental safely and reliably. Of course at a low price.",
});

const rentalStore = useRentalStore();
const { screenWidth } = useScreenWidth();
const {
  pickUpRef,
  dropOffRef,
  isSwitched,
  calculateDistance,
  switchToggle,
  pickUpStyle,
  dropOffStyle,
} = useSwapAnimation();

const isWideScreen = computed<boolean>(() => screenWidth.value >= 760);
const addsCars = computed(() => ({
  addsCars: true,
  addsCarsFlex: isWideScreen.value,
}));

// Популярные: на широких экранах 4, иначе 6
const popularCount = computed<number>(() =>
  screenWidth.value >= 1440 ? 4 : 6,
);
const popularProducts = computed<Product[]>(() =>
  products.slice(0, popularCount.value),
);
const isCarouselPopular = computed<boolean>(() => screenWidth.value < 1440);

// Рекомендованные
const maxRecommendationCards = computed<number>(() => {
  if (screenWidth.value >= 1440) return 12;
  if (screenWidth.value >= 1280) return 7;
  if (screenWidth.value >= 768) return 6;
  return 5;
});
const isCarouselRecommendation = computed<boolean>(
  () => screenWidth.value >= 768,
);

const extraCarsCount = ref<number>(0);

const recommendationProducts = computed<Product[]>(() =>
  products.slice(0, maxRecommendationCards.value + extraCarsCount.value),
);

const isAllShown = computed<boolean>(
  () => recommendationProducts.value.length >= products.length,
);

const buttonLabel = computed<string>(() =>
  isAllShown.value ? "Show Start" : "Show More Car",
);

const showMoreCars = (): void => {
  extraCarsCount.value = isAllShown.value ? 0 : extraCarsCount.value + 20;
};

// пересчёт дистанции для анимации обмена виджетов
onMounted(() => nextTick(calculateDistance));
watch(screenWidth, () => nextTick(calculateDistance));
</script>

<style>
.mainFirstPage {
  overflow-x: hidden;
  position: relative;

  @media (min-width: 565px) {
    overflow: hidden;
    position: relative;
  }

  @media (min-width: 1280px) and (max-width: 1439px) {
    position: relative;
  }

  .addsCars {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      180deg,
      var(--primary-0) 0%,
      var(--primary-0) 50%,
      var(--backgroundpages) 50%,
      var(--backgroundpages) 100%
    );

    .secondCard {
      display: none;

      @media (min-width: 760px) {
        display: block;
      }
    }
  }
  .addsCarsFlex {
    @media (min-width: 760px) {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 1rem;
      padding-right: 2rem;
      padding-left: 2rem;
      justify-content: center;
    }

    @media (min-width: 1280px) and (max-width: 1439px) {
      padding-top: 2rem;
      padding-bottom: 2rem;
      background: var(--backgroundpages);
    }

    @media (min-width: 1440px) {
      padding-left: 4rem;
      padding-right: 4rem;
      padding-top: 2rem;
      background: var(--backgroundpages);
    }
  }

  .buttons {
    position: relative;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    @media (min-width: 565px) {
      position: relative;
    }

    @media (min-width: 1280px) and (max-width: 1439px) {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: relative;
      gap: 9.25rem;
    }

    @media (min-width: 1440px) {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      position: relative;
      gap: 9.25rem;
      padding: 2rem 4rem 4rem;
    }

    .pick-up,
    .drop-off {
      position: relative;
      transition: transform 1s cubic-bezier(0.65, 0, 0.35, 1);

      @media (min-width: 1280px) and (max-width: 1439px) {
        position: relative;
        transition: transform 1s cubic-bezier(0.65, 0, 0.35, 1);
      }

      @media (min-width: 1440px) {
        position: relative;
        transition: transform 1s cubic-bezier(0.65, 0, 0.35, 1);
      }
    }

    .pick-up {
      margin-bottom: 2rem;

      @media (min-width: 1280px) and (max-width: 1439px) {
        margin-bottom: 0;
      }

      @media (min-width: 1440px) {
        margin-bottom: 0;
        margin-right: 0;
        margin-left: 0;
      }
    }

    .drop-off {
      @media (min-width: 1440px) {
        margin-bottom: 0;
        margin-right: 0;
        margin-left: 0;
      }
    }

    .switch {
      position: absolute;
      z-index: 5;
      top: 51%;
      left: 50%;
      translate: -50% -50%;

      @media (min-width: 565px) {
        position: absolute;
        z-index: 5;
        top: 58%;
        left: 50%;
        translate: -50% -50%;
      }

      @media (min-width: 1280px) and (max-width: 1439px) {
        position: absolute;
      }

      @media (min-width: 1440px) {
        position: absolute;
        top: 45%;
      }

      .icon-container {
        transition: transform 1s ease;
        display: flex;
      }
    }

    .switch.rotated {
      .icon-container {
        transform: rotate(180deg);
      }
    }
  }

  .popular_car {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 1440px) {
      padding-bottom: 1.25rem;
      padding-right: 4rem;
      padding-left: 4rem;
    }

    .view-all-link {
      cursor: pointer;
      color: var(--primary-500);
      text-decoration: underline;
    }

    .sectionHeading {
      margin: 1.67em 0;
      color: var(--secondary-300);
      font-size: 0.875rem;
      font-weight: 600;

      @media (min-width: 1440px) {
        font-size: 1rem;
      }
    }

  }

  .popular_car2 {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1.25rem;
    overflow-x: scroll;
    padding: 1rem 1.5rem;
    scroll-snap-type: x mandatory;
    width: 320px;
    overscroll-behavior-x: contain;

    @media (min-width: 750px) {
      width: 700px;
    }

    @media (min-width: 950px) {
      width: 900px;
    }

    @media (min-width: 1150px) {
      width: 1100px;
    }

    @media (min-width: 1280px) {
      width: 1230px;
    }

    @media (min-width: 1280px) and (max-width: 1439px) {
      max-width: 1260px;
    }

    @media (min-width: 1440px) {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      padding-left: 4rem;
      padding-right: 4rem;
      padding-bottom: 2rem;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      overflow: hidden;
    }
  }

  .recommendationText {
    padding-left: 1.5rem;
    padding-bottom: 1.25rem;
    padding-top: 2rem;

    @media (min-width: 1440px) {
      padding-left: 4rem;
    }

    .sectionHeading {
      margin: 1em 0;
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--secondary-300);

      @media (min-width: 1440px) {
        font-size: 1rem;
        font-weight: 600;
      }
    }
  }

  .recommendationCarCard {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    @media (min-width: 760px) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }

    @media (min-width: 1280px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1440px) {
      grid-template-columns: repeat(4, 1fr);
      padding-left: 4rem;
      padding-right: 4rem;
    }
  }

  .buttonsMainPage {
    padding-left: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    padding-top: 2rem;
    padding-right: 1.5rem;
    gap: 3rem;

    @media (min-width: 760px) {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    @media (min-width: 1280px) and (max-width: 1439px) {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    @media (min-width: 1440px) {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding-right: 4rem;
      padding-bottom: 4rem;
      padding-top: 4rem;
      padding-left: 3.5rem;
    }

    .buttonAll {
      @media (min-width: 1440px) {
        grid-column: 2;
      }
    }

    .allCar {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--secondary-300);
      text-wrap: nowrap;

      @media (min-width: 1440px) {
        grid-column: 3;
        justify-self: end;
      }
    }
  }
}
</style>
