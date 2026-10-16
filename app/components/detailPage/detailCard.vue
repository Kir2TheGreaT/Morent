<template>
  <div class="detailCard">
    <div class="topDetailCard">
      <div class="topHalfDetail">
        <h1 class="nameDetailCard">{{ product.name }}</h1>
        <div class="ratingDetailCard">
          <Star></Star>
          <Star></Star>
          <Star></Star>
          <Star></Star>
          <Star></Star>
          <p>500+ Reviewer</p>
        </div>
      </div>
      <button
        type="button"
        class="favoriteDetailCard"
        :aria-pressed="isAdded"
        :aria-label="isAdded ? 'Remove from favorites' : 'Add to favorites'"
        @click="toggleFavorite"
      >
        <component
          :is="isAdded ? Heart_bold : Heart_linear"
          class="heart-iconCar"
          :class="{ active: isAdded }"
        >
        </component>
      </button>
    </div>
    <div class="descriptionDetailCard">
      NISMO has become the embodiment of Nissan's outstanding performance,
      inspired by the most unforgiving proving ground, the "race track".
    </div>
    <div class="specificationDetailCard">
      <div class="blockOneSpecification">
        <div class="specificationType">
          <p>Type Car</p>
          <h5>{{ product.category }}</h5>
        </div>
        <div class="specificationType">
          <p>Steering</p>
          <h5>{{ product.drive }}</h5>
        </div>
      </div>
      <div class="blockTwoSpecification">
        <div class="specificationType">
          <p>Capacity</p>
          <h5>{{ product.seats }} Person</h5>
        </div>
        <div class="specificationType">
          <p>Gasoline</p>
          <h5>{{ product.gasoline }}L</h5>
        </div>
      </div>
    </div>
    <div class="priceDetailCard">
      <div class="priceDetail">
        ${{ product.price.toFixed(2) }}/ <span>days</span>
      </div>
      <ButtonRental
        label="Rent Now"
        @click="goSummary"
      ></ButtonRental>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Heart_linear from "../icons/cardsIcons/heart_linear.vue";
import Heart_bold from "~/components/icons/cardsIcons/heart_bold.vue";
import Star from "../icons/star.vue";
import ButtonRental from "../Button-rental.vue";
import { useFavorites } from "~/stores/favorites";
import type { Product } from "~~/data/products";
import { computed } from "vue";

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();
const goSummary = (): void => {
  router.push(`/paymentCarRent/${props.product.id}`);
};

// избранное
const favoriteStore = useFavorites();
const toggleFavorite = (): void => favoriteStore.toggleFavorite(props.product.id);
const isAdded = computed(() => favoriteStore.isFavorite(props.product.id));
</script>

<style>
.detailCard {
  background-color: var(--primary-0);
  border-radius: 10px;
  @media (min-width: 1px) and (max-width: 1000px) {
    max-width: 327px;
  }
  .topDetailCard {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 1.5rem;
    padding-top: 1.5rem;
    padding-right: 1.5rem;
    @media (min-width: 1px) and (max-width: 1000px) {
      padding: 1rem;
    }
    .favoriteDetailCard {
      padding-bottom: 2rem;
      .heart-iconCar {
        width: 16px;
        height: 16px;
        color: var(--secondary-300);
        transition: all 0.5s ease;
        @media (min-width: 1440px) {
          width: 24px;
          height: 24px;
        }
        &.active {
          color: #ed3f3f;
          fill: currentColor;
        }
      }
      &:hover {
        transform: scale(1.2);
        transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @media (min-width: 1440px) {
        display: block;
      }
    }
    .topHalfDetail {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      @media (min-width: 1px) and (max-width: 1000px) {
        gap: 0.375rem;
      }
      .nameDetailCard {
        margin: 0;
        color: var(--secondary-500);
        font-size: 2rem;
        font-weight: 700;
        @media (min-width: 1px) and (max-width: 1000px) {
          font-size: 1.25rem;
        }
      }
      .ratingDetailCard {
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 1;
        p {
          display: flex;
          padding-left: 0.5rem;
          margin: 0;
        }
        .icon-container {
          color: #fbad39;
          @media (min-width: 1px) and (max-width: 1000px) {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
        p {
          color: var(--secondary-300);
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          @media (min-width: 1px) and (max-width: 1000px) {
            font-size: 0.75rem;
          }
        }
      }
    }
    button {
      display: flex;
      align-items: start;
    }
  }
  .descriptionDetailCard {
    color: var(--secondary-400);
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 200%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 2rem;
    @media (min-width: 1px) and (max-width: 1000px) {
      padding: 0 1rem 1rem;
      font-size: 0.75rem;
    }
  }
  .specificationDetailCard {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 2rem;
    padding-bottom: 4.25rem;
    text-wrap: nowrap;
    @media (min-width: 1px) and (max-width: 1000px) {
      padding: 1rem 1rem 2rem;
    }
    .blockOneSpecification {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .specificationType {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        p,
        h5 {
          margin: 0;
        }

        p {
          color: var(--secondary-300);
          font-size: 1.25rem;
          font-weight: 400;
          @media (min-width: 1px) and (max-width: 1000px) {
            font-size: 0.75rem;
          }
        }
        h5 {
          color: var(--secondary-400);
          font-size: 1.25rem;
          font-weight: 600;
          @media (min-width: 1px) and (max-width: 1000px) {
            font-size: 0.75rem;
          }
        }
      }
    }

    .blockTwoSpecification {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: space-between;
      .specificationType {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        p,
        h5 {
          margin: 0;
        }

        p {
          color: var(--secondary-300);
          font-size: 1.25rem;
          font-weight: 400;
          @media (min-width: 1px) and (max-width: 1000px) {
            font-size: 0.75rem;
          }
        }
        h5 {
          color: var(--secondary-400);
          font-size: 1.25rem;
          font-weight: 600;
          @media (min-width: 1px) and (max-width: 1000px) {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
  .priceDetailCard {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
    @media (min-width: 1px) and (max-width: 1000px) {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 1rem;
    }
    .priceDetail {
      color: var(--secondary-500);
      font-size: 1.75rem;
      font-weight: 700;
      @media (min-width: 1px) and (max-width: 1000px) {
        font-size: 1.25rem;
      }
      span {
        color: var(--secondary-300);
        font-size: 1rem;
        font-weight: 700;
        @media (min-width: 1px) and (max-width: 1000px) {
          font-size: 0.75rem;
        }
      }
    }
  }
}
</style>
