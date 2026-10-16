<template>
  <div class="add" :style="backgroundStyle">
    <div class="container">
      <div class="text">
        <h2>{{ label }}</h2>
        <p>{{ descriptionAddsCar }}</p>
        <NuxtLink
          v-if="randomPicCar"
          :to="`/detailCarRent/${randomPicCar.id}`"
          custom
          v-slot="{ navigate }"
        >
          <ButtonRental
            class="adds-button"
            label="Rental Car"
            :alternate="second"
            @click="navigate"
          />
        </NuxtLink>
      </div>
      <div class="car">
        <img
          v-if="randomPicCar"
          :src="randomPicCar.image"
          :alt="randomPicCar.name"
          fetchpriority="high"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ButtonRental from "./Button-rental.vue";
import { products } from "~~/data/products";

const props = defineProps<{
  second?: boolean;
  label: string;
  descriptionAddsCar: string;
}>();

const backgroundStyle = computed(() => ({
  backgroundImage: props.second
    ? 'url("/backgroundCards/BG.png")'
    : 'url("/backgroundCards/BG2.png")',
}));

const allowedImages = [
  "/cars/Koenigsegg.png",
  "/cars/NissanGT-R.png",
  "/cars/Rolls-Royce.png",
];
const candidates = products.filter((p) => allowedImages.includes(p.image));

// useState: случайный выбор делается один раз на сервере и переиспользуется на клиенте,
// поэтому картинка есть уже в SSR-HTML (нет скачка LCP/CLS и расхождения при гидрации).
const randomPicCar = useState(`hero-car-${props.second ? 2 : 1}`, () => {
  const pool = candidates.length ? candidates : products;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
});
</script>

<style>
.add {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--information-500);
  position: relative;
  border-radius: 0.625rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  margin-bottom: 2rem;
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    .text {
      display: flex;
      flex-direction: column;
      padding: 1rem 0 1rem 1rem;
      color: var(--primary-0);

      h2 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }

      p {
        font-size: 0.725rem;
        font-weight: 500;
        padding-right: 5.9375rem;
        letter-spacing: 0;
        line-height: 160%;
      }
    }

    .car {
      padding-left: 3.4rem;

      img {
        max-height: 150px;
        max-width: 350px;
      }
    }

    .rounds {
      position: absolute;
      top: 15%;
    }

    .roundsBig {
      display: none;
    }
  }
}

@media (min-width: 565px) and (max-width: 1439px) {
  .add {
    margin-top: 1rem;
    .container {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      position: relative;

      .roundsBig {
        display: none;
      }

      .text {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        p {
          margin-right: 0;
        }
      }

      .rounds {
        position: absolute;
        right: 15%;
        top: 20%;
      }
    }
  }
}

@media (min-width: 1440px) {
  .add {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
    max-width: 640px;
    max-height: 360px;
    &:nth-child(2) {
      background-color: var(--primary-500);
    }

    .container {
      position: relative;

      &.adds-button {
        padding-left: 1.5rem;
        margin: 0;
      }

      .text {
        gap: 1rem;
        display: flex;
        padding-top: 1.5rem;
        padding-left: 1.5rem;
        padding-right: 19.5rem;
        padding-bottom: 0;

        h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
        }

        p {
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 160%;
          margin-right: 0;
          padding-right: 0;
          margin-bottom: 0;
          margin-top: 0;
        }
      }

      .car {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 0;

        img {
          max-height: 116px;
          max-width: 406px;
        }
      }

      .rounds {
        display: none;
      }

      .roundsBig {
        display: flex;
        position: absolute;
        top: -14%;
        object-fit: contain;
      }
    }
  }
}
</style>
