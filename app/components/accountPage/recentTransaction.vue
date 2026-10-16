<template>
  <div class="mainRecentTransactionPage">
    <div class="topRecentTransaction">
      <h2 class="sectionTitle">Recent Transaction</h2>
      <NuxtLink class="viewAllBtn" to="/categoryCarRent">View All</NuxtLink>
    </div>

    <div class="autoCardsRecentTransaction">
      <div v-for="car in recentCars" :key="car.id" class="transactionCard">
        <div class="carInfoSide">
          <div class="carImageWrapper">
            <img :src="car.image" alt="" class="carThumb" loading="lazy" />
          </div>
          <div class="carDetails">
            <h3 class="carName">{{ car.name }}</h3>
            <p class="carCategory">{{ car.category }}</p>
          </div>
        </div>

        <div class="priceSide">
          <p class="transactionDate">20 July</p>
          <p class="carPrice">${{ car.price.toFixed(2) }}</p>
        </div>
      </div>
      <div class="borderRecentTransactionsCarCards"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { products } from "~~/data/products";

// Демо-данные: «последние транзакции» — первые четыре машины каталога.
const recentCars = products.slice(0, 4);
</script>

<style scoped>
.mainRecentTransactionPage {
  background-color: var(--primary-0);
  border-radius: 10px;
  .topRecentTransaction {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 2rem;
    padding-top: 1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    @media (min-width: 1px) and (max-width: 1280px) {
      padding-bottom: 1.5rem;
      padding-top: 1rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .sectionTitle {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--secondary-500);
      margin: 0;
      @media (min-width: 1px) and (max-width: 1280px) {
        font-size: 1rem;
      }
    }
    .viewAllBtn {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-500);
      text-decoration: none;
      line-height: 200%;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .autoCardsRecentTransaction {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .transactionCard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    @media (min-width: 1px) and (max-width: 1280px) {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    &:last-child {
      border-bottom: none;
      padding-bottom: 1.5rem;
      @media (min-width: 1px) and (max-width: 1280px) {
        padding-bottom: 1rem;
      }
    }
    .carInfoSide {
      display: flex;
      align-items: center;
      gap: 1rem;
      .carImageWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        .carThumb {
          object-fit: contain;
          width: 132px;
          height: 70px;
          @media (min-width: 1px) and (max-width: 1280px) {
            width: 76px;
            height: 44px;
          }
        }
      }

      .carName {
        font-size: 1rem;
        font-weight: 700;
        color: var(--secondary-500);
        margin: 0;
        @media (min-width: 1px) and (max-width: 1280px) {
          font-size: 0.875rem;
        }
      }

      .carCategory {
        font-size: 0.75rem;
        color: #90a3bf;
        margin: 0;
        padding-top: 0.5rem;
      }
    }

    .priceSide {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      text-align: right;
      gap: 0.5rem;

      .transactionDate {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-300);
        margin: 0;
      }

      .carPrice {
        font-size: 1rem;
        font-weight: 700;
        color: var(--secondary-500);
        margin: 0;
      }
    }
    .borderRecentTransactionsCarCards {
      border: 1px solid var(--secondary-300);
    }
  }
}
</style>
