<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="favorites-dropdown"
        ref="dropdownRef"
        :style="dropdownStyle"
      >
        <div class="dropdown-header">
          <h3>Favorites ({{ favoritesProducts.length }})</h3>
          <button class="close-btn" type="button" aria-label="Close favorites" @click="$emit('close')">
            <Close />
          </button>
        </div>

        <div v-if="favoritesProducts.length > 0" class="dropdown-list">
          <div
            v-for="item in favoritesProducts"
            :key="item.id"
            class="dropdown-item"
          >
            <div class="item-main" @click="goSummary(item.id)">
              <img :src="item.image" :alt="item.name" loading="lazy" />
              <div class="item-info">
                <p class="name">{{ item.name }}</p>
                <p class="price">${{ item.price.toFixed(2) }}/day</p>
              </div>
            </div>
            <button class="trash-btn" type="button" :aria-label="`Remove ${item.name} from favorites`" @click.stop="removeItem(item.id)">
              <Trash />
            </button>
          </div>
          <div class="actions">
            <span v-if="totalPrice > 0" class="total-badge"
              >${{ totalPrice.toFixed(2) }}</span
            >
            <button
              type="button"
              class="clear-all"
              :class="{ 'is-confirming': isConfirming }"
              @click="handleClearAll"
            >
              <span v-if="!isConfirming">Clear All</span>
              <span v-else>Are you sure?</span>
            </button>
          </div>
        </div>
        <div v-else class="empty-favorites">
          <p>Your list is empty!</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { useFavorites } from "~/stores/favorites";
import { products } from "~~/data/products";
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import Close from "./icons/accountIcons/favoritesIcons/close.vue";
import Trash from "./icons/accountIcons/favoritesIcons/trash.vue";

const props = defineProps<{
  isOpen: boolean;
  anchor: HTMLElement | null;
}>();

const emit = defineEmits<{ (e: "close"): void }>();
const router = useRouter();

const goSummary = (id: number) => {
  router.push(`/paymentCarRent/${id}`);
};

const dropdownRef = ref<HTMLElement | null>(null);
const favoritesCar = useFavorites();

const favoritesProducts = computed(() => {
  return products.filter((product) =>
    favoritesCar.favoritesIds.includes(product.id),
  );
});

const totalPrice = computed(() => {
  return favoritesProducts.value.reduce((sum, item) => sum + item.price, 0);
});

const removeItem = (id: number) => {
  favoritesCar.toggleFavorite(id);
};

const isConfirming = ref(false);
let confirmTimer: ReturnType<typeof setTimeout> | null = null;

const handleClearAll = () => {
  if (!isConfirming.value) {
    isConfirming.value = true;

    confirmTimer = setTimeout(() => {
      isConfirming.value = false;
    }, 3000);
  } else {
    favoritesCar.favoritesIds = [];
    isConfirming.value = false;

    if (confirmTimer) {
      clearTimeout(confirmTimer);
      confirmTimer = null;
    }
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  // Клик по кнопке-якорю обрабатывает она сама (toggle), иначе список закроется и тут же откроется снова.
  if (
    props.isOpen &&
    dropdownRef.value &&
    !dropdownRef.value.contains(target) &&
    !props.anchor?.contains(target)
  ) {
    emit("close");
  }
};

const handleScroll = () => {
  if (props.isOpen) {
    emit("close");
  }
};

const dropdownStyle = ref({
  top: "0px",
  left: "0px",
});

const updatePosition = () => {
  if (!props.isOpen || !props.anchor) return;

  const dropdownWidth = 325;
  const padding = 16;

  const rect = props.anchor.getBoundingClientRect();

  let left = rect.right - dropdownWidth;

  if (left < padding) left = padding;

  if (left + dropdownWidth > window.innerWidth - padding) {
    left = window.innerWidth - dropdownWidth - padding;
  }

  dropdownStyle.value = {
    top: `${rect.bottom + window.scrollY + 8}px`,
    left: `${left}px`,
  };
};

onMounted(() => {
  window.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", updatePosition);
});

onUnmounted(() => {
  window.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", updatePosition);

  if (confirmTimer) {
    clearTimeout(confirmTimer);
  }
});

watch(
  () => props.isOpen,
  async (val) => {
    if (val) {
      await nextTick();
      updatePosition();
    }
  },
);
</script>

<style scoped>
.favorites-dropdown {
  position: fixed;
  width: 300px;
  background-color: var(--primary-0);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 1rem;
  border: 1px solid rgba(195, 212, 233, 0.4);

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--secondary-500);
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      color: var(--secondary-400);

      &:hover {
        color: var(--error-500);
      }
    }
  }

  .dropdown-list {
    max-height: 345px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .dropdown-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(195, 212, 233, 0.1);

      &:last-child {
        border-bottom: none;
      }

      img {
        width: 60px;
        height: 40px;
        object-fit: contain;
        transition: transform 0.3s ease;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--secondary-500);
          margin: 0;
        }

        .price {
          font-size: 0.75rem;
          color: #ed3f3f;
          font-weight: 700;
          margin: 0;
        }
      }

      .trash-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        color: var(--secondary-300);
        display: flex;
        align-items: center;

        &:hover {
          color: #ed3f3f;
        }
      }
      .item-main {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-grow: 1;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background-color: rgba(195, 212, 233, 0.1);
          border-radius: 10px;

          img {
            transform: scale(1.05);
          }

          .item-info {
            transform: translateX(4px);
          }
        }
      }
    }
    .actions {
      padding-top: 1rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 0.5rem;
      span {
        font-size: 1rem;
        font-weight: bold;
      }
      .clear-all {
        width: 100%;
        padding: 0.6rem;
        background: none;
        border: 1px dashed var(--secondary-300);
        border-radius: 8px;
        color: var(--secondary-400);
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          background: var(--error-700);
          border-color: var(--success-500);
          color: var(--warning-500);
        }
      }
    }
  }

  .empty-favorites {
    text-align: center;
    padding: 2rem 0;

    p {
      color: var(--secondary-300);
      font-size: 0.875rem;
      margin: 0;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
