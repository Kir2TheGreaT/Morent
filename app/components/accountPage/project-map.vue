<template>
  <div class="mainPageProjectMap">
    <h2 class="topProjectMap">Details Rental</h2>
    <div class="mapBox">
      <!-- Карта монтируется всегда: именно её монтирование запускает загрузку скрипта Яндекса -->
      <YandexMap
        :settings="{ location: { center, zoom } }"
        style="width: 100%; height: 100%"
      >
        <YandexMapDefaultSchemeLayer />
        <YandexMapDefaultFeaturesLayer />
      </YandexMap>
      <!-- Статичная заглушка, пока карта не загрузилась (или если ключ не задан) -->
      <img
        v-if="!yandexMapIsLoaded"
        class="fakeMap"
        src="/maps/Maps.png"
        alt="Map preview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  yandexMapIsLoaded,
} from "vue-yandex-maps";

const center = ref<[number, number]>([37.617644, 55.755819]);
const zoom = ref(10);
</script>

<style>
.mainPageProjectMap {
  display: flex;
  flex-direction: column;
  background-color: var(--primary-0);
  border-radius: 10px;
  .topProjectMap {
    margin: 0;
    padding-left: 1.5rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    color: var(--secondary-500);
    font-weight: bold;
    font-size: 1.25rem;
  }
  .mapBox {
    position: relative;
    height: 272px;
    margin: 0 1.5rem 1.5rem;
    border-radius: 10px;
    overflow: hidden;
    @media (min-width: 1px) and (max-width: 1440px) {
      max-width: 295px;
    }
  }
  .fakeMap {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .yandexProjectMap {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
}
</style>
