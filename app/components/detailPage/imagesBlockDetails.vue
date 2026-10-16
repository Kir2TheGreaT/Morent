<template>
  <div
    class="car-promo-card"
    :style="{
      backgroundImage:
        activePreview === 'car'
          ? 'url(/backgroundCards/BG.png)'
          : `url(/cars/inside/${activePreview}.png)`,
    }"
  >
    <div class="contentCar" v-if="activePreview === 'car'">
      <h2>{{ product.category }} car with the best design and acceleration</h2>
      <p>
        Safety and comfort while driving a futuristic and elegant sports car
      </p>
    </div>
    <div class="backgroundCar">
      <img
        v-if="activePreview === 'car'"
        :src="product.image"
        :alt="product.name"
        class="main-image"
        fetchpriority="high"
      />
    </div>
  </div>
  <div class="previewsCar">
    <button
      type="button"
      class="previewImg firstPreviewImg"
      :class="{ active: activePreview === 'car' }"
      :aria-pressed="activePreview === 'car'"
      aria-label="Show car exterior"
      @click="activePreview = 'car'"
    >
      <img :src="product.image" alt="" class="previewCarImage" />
    </button>
    <button
      v-for="view in interiorViews"
      :key="view.id"
      type="button"
      class="previewImg"
      :class="{ active: activePreview === view.id }"
      :aria-pressed="activePreview === view.id"
      :aria-label="view.label"
      :style="{ backgroundImage: `url('/cars/inside/${view.id}.png')` }"
      @click="activePreview = view.id"
    ></button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Product } from "~~/data/products";

defineProps<{
  product: Product;
}>();

const interiorViews = [
  { id: "view2", label: "Show interior view 1" },
  { id: "view3", label: "Show interior view 2" },
];

const activePreview = ref<string>("car");
</script>

<style>
.car-promo-card {
  max-width: 492px;
  max-height: 360px;
  min-height: 360px;
  border-radius: 10px;
  background-color: var(--primary-500);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease;
  @media (min-width: 1px) and (max-width: 1000px) {
    min-height: 232px;
    max-width: 327px;
  }
}
.backgroundCar {
  display: flex;
  justify-content: center;
  padding-bottom: 1.5rem;
  padding-top: 2rem;
  @media (min-width: 1px) and (max-width: 1000px) {
    padding-top: 0;
    padding-bottom: 1.25rem;
  }
  .main-image {
    max-width: 380px;
    max-height: 120px;
    object-fit: contain;
  }
}
.contentCar {
  position: relative;
  padding: 1.5rem 6rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  color: var(--primary-0);
  gap: 1rem;
  @media (min-width: 1px) and (max-width: 1000px) {
    padding: 1rem 4.5rem 3.375rem 1rem;
  }
  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.1;
    @media (min-width: 1px) and (max-width: 1000px) {
      font-size: 1rem;
    }
  }
  p {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    padding-right: 0.5rem;
    @media (min-width: 1px) and (max-width: 1000px) {
      font-size: 0.75rem;
      padding-right: 1.5rem;
    }
  }
}
.previewsCar {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  max-width: 492px;
  @media (min-width: 1px) and (max-width: 1000px) {
    max-width: 327px;
  }
  .firstPreviewImg {
    background-color: var(--primary-500);
    background-image: url("/backgroundCards/BG.png");
  }
  .previewCarImage {
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 1;
  }
  .previewImg {
    width: 160px;
    height: 124px;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    object-fit: contain;
    border: 2px solid transparent;
    @media (min-width: 1px) and (max-width: 1000px) {
      width: 96px;
      height: 64px;
    }
  }
  .previewImg.active {
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px var(--primary-500);
  }
  .previewImg:hover {
    box-shadow:
      0 0 0 8px #ffffff,
      0 0 0 9px #007bff;
  }
}
</style>
