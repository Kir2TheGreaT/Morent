<template>
  <header class="header" @click="handleHeaderClick">
    <div class="main-header">
      <button
        v-if="isSpecial"
        type="button"
        aria-label="Toggle menu"
        :aria-expanded="isSidebarOpen"
        @click.stop="toggleSidebar()"
      >
        <menu-icon class="menu-icon" />
      </button>
      <NuxtLink to="/" class="Logo" aria-label="MORENT — home">MORENT</NuxtLink>

      <div class="headerImage">
        <div class="headerIcons">
          <button
            type="button"
            class="favorite-nav-btn"
            :class="{
              'is-active': favoritesStore.count > 0,
              'is-visible': favoritesStore.count > 0 || isDesktop,
            }"
            :aria-label="`Favorites (${favoritesStore.count})`"
            :aria-expanded="isFavoritesOpen"
            @click.stop="isFavoritesOpen = !isFavoritesOpen"
            ref="favoritesButton"
          >
            <span class="icon-wrap">
              <heart_bold class="heart-icon" />
              <span v-if="favoritesStore.count > 0" class="badge">
                {{ favoritesStore.count }}
              </span>
            </span>
          </button>
          <favorites-dropdown
            :is-open="isFavoritesOpen"
            @close="isFavoritesOpen = false"
            :anchor="favoritesButton"
          />
          <button
            type="button"
            class="notificationButton"
            aria-label="Notifications"
            :class="{ 'is-visible': hasNotifications || isDesktop }"
          >
            <notification />
          </button>
          <button
            type="button"
            class="settingsButton"
            aria-label="Account settings"
            :class="{ 'is-visible': hasSettingsAlert || isDesktop }"
            @click="goToAccount"
          >
            <settings2 />
          </button>
        </div>
        <button
          type="button"
          class="headerImageButton"
          :aria-label="isAuthenticated ? 'Open account' : 'Log in'"
          @click="goToAccount"
        >
          <img :src="userAvatar" alt="" />
        </button>
      </div>

      <div class="finder">
        <div class="search" ref="searchContainer">
          <icon-search
            class="search-icon"
            @click="focusSearch"
            style="cursor: pointer"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search something here"
            aria-label="Search cars"
            v-model="searchQuery"
            ref="searchInput"
          />

          <Teleport to="body">
            <Transition name="slide-fade">
              <div
                v-if="searchQuery.length > 0 && isDropdownVisible"
                class="search-dropdown-portal"
                :style="dropdownStyle"
                ref="dropdownRef"
              >
                <button
                  v-for="product in filteredProducts"
                  :key="product.id"
                  type="button"
                  class="search-item"
                  @click="openProduct(product.id)"
                >
                  <img
                    :src="product.image"
                    alt=""
                    class="search-item-img"
                    loading="lazy"
                  />
                  <span class="search-item-info">
                    <span class="search-item-name">{{ product.name }}</span>
                    <span class="search-item-category">{{
                      product.category
                    }}</span>
                  </span>
                  <span class="search-item-price">{{ product.price }}</span>
                </button>

                <div
                  v-if="filteredProducts.length === 0"
                  class="search-no-results"
                >
                  No cars found
                </div>
              </div>
            </Transition>
          </Teleport>
        </div>
        <NuxtLink
          to="/categoryCarRent"
          class="settingsIcon"
          aria-label="Filters and categories"
        >
          <linear-filter class="settings-icon" />
        </NuxtLink>
      </div>
    </div>
    <div v-if="screenWidth >= 1440" class="header-car-container">
      <img
        ref="carImage"
        src="/cars/Koenigsegg.png"
        alt=""
        class="koenigsegg-car"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import IconSearch from "~/components/icons/headerIcons/icon-search.vue";
import LinearFilter from "~/components/icons/headerIcons/linear-filter.vue";
import Settings2 from "~/components/icons/headerIcons/settings2.vue";
import Notification from "~/components/icons/headerIcons/notification.vue";
import Heart_bold from "~/components/icons/cardsIcons/heart_bold.vue";
import MenuIcon from "~/components/icons/headerIcons/menu-icon.vue";
import FavoritesDropdown from "./FavoritesDropdown.vue";
import { useFavorites } from "~/stores/favorites";
import { products } from "~~/data/products";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const router = useRouter();
const route = useRoute();

// авторизация
const isAuthenticated = useCookie<boolean | string | null>("auth-logged-in");

const goToAccount = (): void => {
  router.push(isAuthenticated.value ? "/adminCarRent" : "/loginPage");
};

const userAvatar = computed<string>(() =>
  isAuthenticated.value ? "/noImage.webp" : "/Image.svg",
);

// изменение хэдера на определённых страницах
const isSpecial = computed<boolean>(() => route.meta.isSpecialHeader === true);

const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar();

const handleHeaderClick = (): void => {
  if (isSidebarOpen.value) closeSidebar();
};

// избранное
const favoritesStore = useFavorites();
const isFavoritesOpen = ref<boolean>(false);
const favoritesButton = ref<HTMLElement | null>(null);

// ширина экрана
const { screenWidth } = useScreenWidth();
const isDesktop = computed<boolean>(() => screenWidth.value >= 950);

// кнопки при наличии контента на мобильной версии
const hasNotifications = ref<boolean>(false);
const hasSettingsAlert = ref<boolean>(false);

// поиск в заголовке
const searchQuery = ref<string>("");
const searchInput = ref<HTMLInputElement | null>(null);
const searchContainer = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const isDropdownVisible = ref<boolean>(false);

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query),
  );
});

const focusSearch = (): void => searchInput.value?.focus();

const dropdownStyle = ref({ top: "0px", left: "0px", width: "0px" });

const updateDropdownPosition = (): void => {
  if (!searchContainer.value) return;
  const rect = searchContainer.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + window.scrollY + 8}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
  };
};

const closeSearch = (): void => {
  isDropdownVisible.value = false;
};

const openProduct = (id: number): void => {
  router.push(`/detailCarRent/${id}`);
  searchQuery.value = "";
};

const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as Node;
  if (
    !searchContainer.value?.contains(target) &&
    !dropdownRef.value?.contains(target)
  ) {
    closeSearch();
  }
};

watch(searchQuery, (value: string) => {
  isDropdownVisible.value = value.length > 0;
  if (value.length > 0) {
    nextTick(updateDropdownPosition);
  }
});

// машинка в хедере: двигаем через rAF и прямую запись transform,
// чтобы не перерисовывать компонент на каждый mousemove
const carImage = ref<HTMLElement | null>(null);
const carWidth = 300;
let rafId = 0;

const handleMouseMove = (event: MouseEvent): void => {
  if (!carImage.value || rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    if (!carImage.value) return;
    const ratio = event.clientX / window.innerWidth;
    carImage.value.style.transform = `translateX(${ratio * (window.innerWidth - carWidth)}px)`;
  });
};

const onScroll = (): void => {
  updateDropdownPosition();
  closeSearch();
};

onMounted(() => {
  window.addEventListener("resize", updateDropdownPosition);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("click", handleClickOutside);
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateDropdownPosition);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("mousemove", handleMouseMove);
  cancelAnimationFrame(rafId);
});
</script>

<style>
.header {
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: var(--primary-0);
  overflow-x: hidden;
  .main-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 2rem;
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    @media (min-width: 1440px) {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      padding-left: 3.75rem;
      padding-right: 2rem;
      justify-content: start;
    }
    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      @media (min-width: 950px) {
        display: none;
      }
    }
    .Logo {
      margin: 0;
      font-weight: bold;
      color: var(--primary-500);
      font-size: 1.5rem;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
        transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @media (min-width: 1440px) {
        font-size: 2rem;
      }
      @media (min-width: 950px) and (max-width: 1439px) {
        padding-right: 1rem;
      }
    }

    .headerImage {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      @media (min-width: 950px) {
        gap: 1rem;
        order: 3;
        padding-right: 1.5rem;
      }
      @media (min-width: 1440px) {
        gap: 1.25rem;
      }
      .headerIcons {
        display: flex;

        @media (min-width: 1440px) {
          gap: 1.25rem;
        }
        @media (min-width: 950px) {
          display: flex;
          gap: 1rem;
          .favorite-nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background: transparent;
            padding: 0;
            cursor: pointer;
            border: 1px solid var(--secondary-200);
            border-radius: 99%;
            width: 44px;
            height: 44px;
            transition: all 0.5s ease;
            &:hover {
              transform: scale(1.2);
              transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .icon-wrap {
              display: inline-grid;
              place-items: center;

              .heart-icon {
                width: 24px;
                height: 24px;
                color: var(--secondary-400);
                transition: color 0.5s ease;
                grid-area: 1 / 1;
              }
            }
            &.is-active {
              background-color: var(--primary-500);
              border-color: var(--primary-500);

              .heart-icon {
                color: var(--primary-0);
              }
              .badge {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
            }
            .badge {
              position: absolute;
              top: -8px;
              right: -3px;

              width: 18px;
              height: 18px;
              background-color: var(--error-500);
              color: var(--primary-0);

              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;

              font-size: 0.7rem;
              font-weight: 700;
              line-height: 1;
              pointer-events: none;
              z-index: 2;
            }
            .icon-container {
              color: var(--secondary-400);
              width: 24px;
              height: 24px;
            }
          }

          img {
            width: 1.75rem;
            height: 1.75rem;
          }
          .notificationButton {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            cursor: pointer;
            border: 1px solid var(--secondary-200);
            border-radius: 99%;
            &:hover {
              transform: scale(1.2);
              transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .icon-container {
              width: 24px;
              height: 24px;
            }
          }
          .settingsButton {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            cursor: pointer;
            border: 1px solid var(--secondary-200);
            border-radius: 99%;
            &:hover {
              transform: scale(1.2);
              transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .icon-container {
              width: 24px;
              height: 24px;
            }
          }
        }
        .favorite-nav-btn {
          &.is-active {
            @media (min-width: 1px) and (max-width: 1280px) {
              .icon-wrap {
                display: flex;
                flex-direction: row;
                align-items: center;
                .badge {
                  display: none;
                }
              }
            }
          }
        }
      }
      .headerImageButton {
        border: none;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          transform: scale(1.2);
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        img {
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          max-width: 28px;
          max-height: 28px;
          @media (min-width: 1440px) {
            max-width: 44px;
            max-height: 44px;
          }
        }
      }
    }
    .finder {
      display: flex;
      flex-direction: row;
      position: relative;
      align-items: center;
      padding-bottom: 2rem;
      padding-top: 2rem;
      justify-content: space-between;
      @media (min-width: 1440px) {
        padding-bottom: 0;
        padding-top: 0;
        padding-left: 4rem;
        margin-right: auto;
      }
      @media (min-width: 950px) and (max-width: 1439px) {
        padding-right: 1rem;
      }
      .search {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 1px solid rgba(195, 212, 233, 0.4);
        border-radius: 10px;
        margin-right: 1rem;

        @media (min-width: 1440px) {
          margin-right: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: 0;
        }
        .search-results {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background-color: var(--primary-0);
          border: 1px solid rgba(195, 212, 233, 0.4);
          border-radius: 10px;
          box-shadow: 0px 10px 30px rgba(2, 9, 20, 0.1);
          z-index: 100;
          max-height: 400px;
          overflow-y: auto;

          .search-item {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            gap: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
            border-bottom: 1px solid rgba(195, 212, 233, 0.1);

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background-color: var(--secondary-100);
            }

            .search-item-img {
              width: 60px;
              height: auto;
              object-fit: contain;
            }

            .search-item-info {
              display: flex;
              flex-direction: column;
              flex: 1;

              .search-item-name {
                font-weight: 700;
                color: var(--secondary-500);
                font-size: 0.875rem;
              }

              .search-item-category {
                font-size: 0.75rem;
                color: var(--secondary-400);
              }
            }

            .search-item-price {
              font-weight: 700;
              font-size: 0.875rem;
              color: var(--secondary-500);
              &::before {
                content: "$";
              }
            }
          }

          .search-no-results {
            padding: 1.5rem;
            text-align: center;
            color: var(--secondary-400);
            font-size: 0.875rem;
          }
        }
        .search-icon {
          color: var(--secondary-400);
          max-width: 24px;
          max-height: 24px;
          padding-left: 1.5rem;
        }
        input {
          height: 46px;
          color: var(--secondary-400);
          background-color: var(--primary-0);
          font-weight: 500;
          font-size: 0.875rem;
          border: none;
          padding-left: 0.5rem;
          padding-right: 2rem;
          @media (min-width: 1440px) {
            padding-right: 14.688rem;
          }
        }
      }
      .settingsIcon {
        width: 48px;
        height: 48px;
        border: 1px solid rgba(195, 212, 233, 0.4);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        @media (min-width: 1440px) {
          border-left: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          width: 49px;
          height: 49px;
        }
        .icon-container {
          max-width: 24px;
          max-height: 24px;
        }
      }
    }
  }
}
.search-dropdown-portal {
  position: absolute;
  z-index: 1000;
  background-color: var(--primary-0);
  border-radius: 10px;
  border: 1px solid rgba(195, 212, 233, 0.4);
  box-shadow: 0px 10px 30px rgba(2, 9, 20, 0.1);
  max-height: 400px;
  overflow-y: auto;
  border-top: none;

  padding: 10px 0;

  max-height: 400px;
  overflow-y: auto;
  overflow-x: visible;
  border-top: none;

  .search-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    gap: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
    border-bottom: 1px solid rgba(195, 212, 233, 0.1);
    background-color: var(--primary-0);

    position: relative;
    z-index: 1;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    border-bottom: 1px solid rgba(195, 212, 233, 0.1);
    margin: 0 4px;
    border-radius: 12px;
    &:hover {
      z-index: 10;
      transform: scale(1.08);
      background-color: var(--primary-0);

      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border-color: transparent;
    }

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: var(--secondary-100);
    }

    .search-item-img {
      width: 60px;
      height: auto;
      object-fit: contain;
      &:hover {
        transform: scale(1.1) rotate(-3deg);
      }
    }

    .search-item-info {
      display: flex;
      flex-direction: column;
      flex: 1;

      .search-item-name {
        font-weight: 700;
        color: var(--secondary-500);
        font-size: 0.875rem;
      }

      .search-item-category {
        font-size: 0.75rem;
        color: var(--secondary-400);
      }
    }

    .search-item-price {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--secondary-500);
      &::before {
        content: "$";
      }
    }
  }

  .search-no-results {
    padding: 1.5rem;
    text-align: center;
    color: var(--secondary-400);
    font-size: 0.875rem;
  }
}

.header-car-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  height: 25px;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;

  .koenigsegg-car {
    height: 100%;
    width: auto;
    will-change: transform;
    transition: transform 0.15s ease-out;
  }
}
.notificationButton svg {
  width: 24px;
  height: 24px;
  color: var(--secondary-400);
}

.settingsButton svg {
  width: 24px;
  height: 24px;
  color: var(--secondary-400);
}

.notificationButton .icon-container {
  width: 24px;
  height: 24px;
}

.settingsButton .icon-container {
  width: 24px;
  height: 24px;
}
.notificationButton,
.settingsButton,
.favorite-nav-btn {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.notificationButton.is-visible,
.settingsButton.is-visible,
.favorite-nav-btn.is-visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.search-dropdown-portal::-webkit-scrollbar {
  width: 6px;
}
.search-dropdown-portal::-webkit-scrollbar-track {
  background: transparent;
}
.search-dropdown-portal::-webkit-scrollbar-thumb {
  background-color: rgba(195, 212, 233, 0.5);
  border-radius: 10px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.Logo {
  display: inline-block;
  text-decoration: none;
}
button.search-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
}
a.settingsIcon {
  display: inline-flex;
  text-decoration: none;
  color: inherit;
}
</style>
