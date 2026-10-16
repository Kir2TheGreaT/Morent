<template>
  <div class="mainPartCategories">
    <div class="typeCategoriesMenu">
      <fieldset class="typeCategory">
        <legend>Type</legend>
        <div class="categoryCarMenu">
          <label
            v-for="item in typeCategories"
            :key="item.type"
            class="categoryItem"
            :class="{ active: filters.types.includes(item.type) }"
          >
            <input
              type="checkbox"
              class="visually-hidden"
              :value="item.type"
              v-model="filters.types"
            />
            <span
              class="checkbox-box"
              :class="{ 'is-active': filters.types.includes(item.type) }"
            >
              <Transition name="scale">
                <TickSquare v-if="filters.types.includes(item.type)" />
              </Transition>
            </span>
            {{ item.type }}
            <span class="quantity">({{ item.count }})</span>
          </label>
        </div>
      </fieldset>
    </div>
    <div class="capasityCategoriesMenu">
      <fieldset class="typeCategory2">
        <legend>Capacity</legend>
        <label
          class="categoryCarMenu2"
          v-for="item in capacityCategories"
          :key="item.seats"
          :class="{ active: filters.capacities.includes(item.seats) }"
        >
          <input
            type="checkbox"
            class="visually-hidden"
            :value="item.seats"
            v-model="filters.capacities"
          />
          <span
            class="checkbox-box"
            :class="{ 'is-active': filters.capacities.includes(item.seats) }"
          >
            <Transition name="scale">
              <TickSquare v-if="filters.capacities.includes(item.seats)" />
            </Transition>
          </span>
          {{ item.seats }} Person
          <span class="quantity">({{ item.count }})</span>
        </label>
      </fieldset>
    </div>
    <div class="priceCategoriesMenu">
      <h2 class="priceTitle">PRICE</h2>
      <div class="priceRange">
        <div class="range-container">
          <div class="range-track"></div>
          <div class="range-progress" :style="{ width: fillWidth + '%' }"></div>
          <input
            type="range"
            min="0"
            :max="MAX_PRICE"
            step="1"
            aria-label="Maximum price per day"
            v-model.number="filters.price"
            class="slider"
          />
        </div>

        <div class="priceValues">
          <span>Max. ${{ filters.price }}.00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { products } from "~~/data/products";
import TickSquare from "./icons/tickSquare.vue";

// Состояние фильтров общее (useState), поэтому десктопное и мобильное меню синхронны
// и не сбрасываются при открытии/закрытии сайдбара.
const { filters } = useCarFilters();

const typeCategories = computed<{ type: string; count: number }[]>(() => {
  const map = new Map<string, number>();
  products.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
  return Array.from(map, ([type, count]) => ({ type, count }));
});

const capacityCategories = computed<{ seats: number; count: number }[]>(() => {
  const map = new Map<number, number>();
  products.forEach((p) => map.set(p.seats, (map.get(p.seats) || 0) + 1));
  return Array.from(map, ([seats, count]) => ({ seats, count })).sort(
    (a, b) => a.seats - b.seats,
  );
});

const fillWidth = computed<number>(() => (filters.value.price / MAX_PRICE) * 100);
</script>

<style scoped>
.mainPartCategories {
  background-color: var(--categoryTheme);
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  background-color: var(--primary-0);
  .typeCategoriesMenu {
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-left: 2rem;
    padding-right: 9.5rem;
    .typeCategory {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;

      h5 {
        margin: 0;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--secondary-300);
      }
      .categoryCarMenu {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--secondary-400);
        line-height: 1;
        .quantity {
          font-weight: 600;
          font-size: 1.25rem;
          color: var(--secondary-300);
        }
        .categoryItem {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;

          .checkbox-box {
            width: 24px;
            height: 24px;
            border: 2px solid var(--secondary-300);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s ease;
            cursor: pointer;
            flex-shrink: 0;
            background-color: transparent;
            overflow: hidden;
          }

          .categoryItem:hover .checkbox-box,
          .categoryCarMenu2:hover .checkbox-box {
            border-color: var(--primary-500);
          }

          .checkbox-box.is-active {
            background-color: var(--primary-500);
            border-color: var(--primary-500);
            color: var(--primary-500);
          }

          .checkbox-box svg {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .capasityCategoriesMenu {
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-left: 2rem;
    padding-right: 9.5rem;
    .typeCategory2 {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;

      h5 {
        margin: 0;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--secondary-300);
      }
      .categoryCarMenu2 {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--secondary-400);
        text-wrap: nowrap;
        .quantity {
          font-weight: 600;
          font-size: 1.25rem;
          color: var(--secondary-300);
        }
        .checkbox-box {
          width: 24px;
          height: 24px;
          border: 2px solid var(--secondary-300);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s ease;
          cursor: pointer;
          flex-shrink: 0;
          background-color: transparent;
          overflow: hidden;
        }

        .categoryItem:hover .checkbox-box,
        .categoryCarMenu2:hover .checkbox-box {
          border-color: var(--primary-500);
        }

        .checkbox-box.is-active {
          background-color: var(--primary-500);
          border-color: var(--primary-500);
          color: var(--primary-500);
        }

        .checkbox-box svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .priceCategoriesMenu {
    display: flex;
    flex-direction: column;
    padding-left: 2rem;

    h5 {
      margin: 0;
      padding-bottom: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-300);
      text-transform: uppercase;
    }

    .priceRange {
      display: flex;
      flex-direction: column;
      max-width: 296px;
      width: 100%;
      padding-bottom: 5rem;

      .range-container {
        position: relative;
        width: 100%;
        height: 12px;
        display: flex;
        align-items: center;

        .range-track {
          position: absolute;
          width: 100%;
          height: 12px;
          background-color: var(--secondary-200);
          border-radius: 10px;
        }

        .range-progress {
          position: absolute;
          height: 12px;
          background-color: var(--primary-500);
          border-radius: 10px;
          pointer-events: none;
        }

        .slider {
          appearance: none;
          width: 100%;
          background: transparent;
          position: relative;
          z-index: 2;
          cursor: pointer;
          margin: 0;

          &:focus {
            outline: none;
          }
          &:hover::-webkit-slider-thumb {
            transform: scale(1.1);
            box-shadow:
              0 0 0 2px var(--primary-500),
              0px 4px 8px rgba(0, 0, 0, 0.15);
          }

          &:active::-webkit-slider-thumb {
            transform: scale(0.95);
            background: #2a52cc;
          }

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: var(--primary-500);
            border: 4px solid #ffffff;
            cursor: pointer;
          }

          &::-webkit-slider-runnable-track {
            background: transparent;
          }
        }
      }
    }

    .priceValues {
      padding-top: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--secondary-400);
      padding-bottom: 2rem;
    }
  }
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}
legend {
  padding: 0;
  margin: 0 0 1.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--secondary-300);
}
.priceTitle {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--secondary-300);
}
.categoryItem,
.categoryCarMenu2 {
  cursor: pointer;
  position: relative;
}
.visually-hidden:focus-visible + .checkbox-box {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>
