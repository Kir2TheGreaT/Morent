<template>
  <div class="mainDetailPage" v-if="product">
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
      <CategoriesMenu />
    </div>
    <div class="secondHalfPage">
      <div class="carDetailCard">
        <div class="imageDetails">
          <ImagesBlockDetails :product="product" />
        </div>
        <DetailCard :product="product" />
      </div>
      <div class="reviews"><Reviews :car-id="product.id" /></div>
      <div class="caregoryDetailCards">
        <h2>Recent Car</h2>
        <NuxtLink to="/categoryCarRent">View All</NuxtLink>
      </div>
      <div class="recentCar">
        <template v-if="recentProducts.length > 0">
          <ResponsiveCard
            v-for="item in recentProducts"
            :key="item.id"
            :product="item"
          />
        </template>
        <div v-else class="emptyState">
          <p>No cars found matching your filters.</p>
        </div>
      </div>
      <div class="caregoryDetailCards">
        <h2>Recommendation Car</h2>
        <NuxtLink to="/categoryCarRent">View All</NuxtLink>
      </div>
      <div class="recommendationCar">
        <template v-if="recommendationProducts.length > 0">
          <ResponsiveCard
            v-for="item in recommendationProducts"
            :key="item.id"
            :product="item"
          />
        </template>
        <div v-else class="emptyState">
          <p>No cars found matching your filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DetailCard from "~/components/detailPage/detailCard.vue";
import ResponsiveCard from "~/components/ResponsiveCard.vue";
import Reviews from "~/components/detailPage/reviews.vue";
import ImagesBlockDetails from "~/components/detailPage/imagesBlockDetails.vue";
import CategoriesMenu from "~/components/categoriesMenu.vue";
import { products } from "~~/data/products";
import type { Product } from "~~/data/products";
import { computed } from "vue";

definePageMeta({
  isSpecialHeader: true,
});

const route = useRoute();
const productId = computed<number>(() => Number(route.params.id));

const product = computed<Product | undefined>(() =>
  products.find((p) => p.id === productId.value),
);

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Car not found",
    fatal: true,
  });
}

useSeoMeta({
  title: () => `${product.value?.name ?? "Car"} — rent from $${product.value?.price.toFixed(2)}/day`,
  description: () =>
    `Rent ${product.value?.name} (${product.value?.category}, ${product.value?.seats} seats) at $${product.value?.price.toFixed(2)} per day.`,
  ogImage: () => product.value?.image,
});

const { screenWidth } = useScreenWidth();
const { filteredProducts } = useCarFilters();
const { isSidebarOpen, closeSidebar } = useSidebarScrollLock();

const cardsLimit = computed<number>(() => (screenWidth.value >= 1440 ? 3 : 12));

const otherProducts = computed<Product[]>(() =>
  filteredProducts.value.filter((p) => p.id !== productId.value),
);

const recentProducts = computed<Product[]>(() =>
  otherProducts.value.slice(0, cardsLimit.value),
);

// другая выборка, чтобы блоки не дублировали друг друга
const recommendationProducts = computed<Product[]>(() =>
  otherProducts.value.slice(cardsLimit.value, cardsLimit.value * 2),
);
</script>

<style scoped>
.mainDetailPage {
  display: flex;
  flex-direction: row;

  .categoryMenu {
    display: flex;
    align-items: stretch;
    @media (min-width: 1px) and (max-width: 1280px) {
      display: none;
    }
  }
  .secondHalfPage {
    display: flex;
    flex-direction: column;
    .carDetailCard {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      padding-left: 2rem;
      padding-right: 2rem;
      padding-top: 2rem;
      @media (min-width: 1px) and (max-width: 1000px) {
        display: flex;
        flex-direction: column;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .imageDetails {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
    }
    .caregoryDetailCards {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      padding: 2rem 2rem 1rem;
      @media (min-width: 1px) and (max-width: 1000px) {
        padding-right: 1.5rem;
        padding-left: 1.5rem;
        padding-bottom: 1.25rem;
      }
      h2 {
        margin: 0;
        color: var(--secondary-300);
        font-size: 1rem;
        font-weight: 600;
      }
      a {
        color: var(--primary-500);
        font-size: 1rem;
        font-weight: 600;
      }
    }
    .recentCar {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding-left: 2rem;
      padding-right: 2rem;
      gap: 2rem;
      @media (min-width: 1px) and (max-width: 1000px) {
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        overscroll-behavior-x: contain;
        width: 320px;
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
    .recommendationCar {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding-left: 2rem;
      padding-right: 2rem;
      gap: 2rem;
      padding-bottom: 2rem;
      @media (min-width: 1px) and (max-width: 1000px) {
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        overscroll-behavior-x: contain;
        padding-left: 1rem;
        padding-right: 1rem;
        width: 320px;
      }
    }
    .reviews {
      padding: 2rem;
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
</style>
