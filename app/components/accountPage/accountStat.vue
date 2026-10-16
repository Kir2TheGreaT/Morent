<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { products, type Product } from "~~/data/products";
import { computed } from "vue";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const categoryColors: Record<string, string> = {
  Sport: "#0D3559",
  SUV: "#175D9C",
  Sedan: "#2185DE",
  Hatchback: "#63A9E8",
  Electric: "#A6CEF2",
  Truck: "#54A6FF",
};

const stats = computed(() => {
  const counts: Record<string, number> = {};

  products.forEach((product: Product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });

  return Object.keys(counts)
    .map((key) => ({
      name: key,
      count: counts[key] ?? 0,
      color: categoryColors[key] || "#CBD5E1",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

const totalCount = computed(() => {
  return stats.value.reduce((acc, item) => acc + item.count, 0);
});

const chartData = computed(() => ({
  labels: stats.value.map((s) => s.name),
  datasets: [
    {
      data: stats.value.map((s) => s.count),
      backgroundColor: stats.value.map((s) => s.color),
      borderWidth: 0,
      borderRadius: 10,
      spacing: 6,
      cutout: "80%",
      hoverOffset: 15,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: `70%`,
  plugins: {
    legend: { display: false },
  },
  layout: {
    padding: 20,
  },
};
</script>

<template>
  <div class="mainChartPage">
    <div class="headerChart">
      <div class="nameChartContainer">Top 5 Car Rental</div>
      <button type="button" class="moreBtn" aria-label="More options">•••</button>
    </div>
    <div class="centerChart">
      <div class="chartContainer">
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          aria-label="Rentals by car category"
        />
        <div class="center">
          <p class="totalValue">{{ totalCount }}</p>
          <p class="label">Rental Car</p>
        </div>
      </div>
      <div class="legendChart">
        <div v-for="item in stats" :key="item.name" class="legendItem">
          <div class="legendInfo">
            <span class="dot" :style="{ backgroundColor: item.color }"></span>
            <span class="carName">{{ item.name }}</span>
          </div>
          <span class="carValue">{{ item.count.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mainChartPage {
  display: flex;
  flex-direction: column;
  background-color: var(--primary-0);
  border-radius: 10px;
  .headerChart {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    @media (min-width: 1px) and (max-width: 1280px) {
      padding-top: 1rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .nameChartContainer {
      color: var(--secondary-500);
      font-weight: bold;
      font-size: 1.25rem;
      @media (min-width: 1px) and (max-width: 1280px) {
        font-size: 1rem;
      }
    }
    .moreBtn {
      background: none;
      border: none;
      color: var(--secondary-300);
      cursor: pointer;
    }
  }

  .centerChart {
    display: flex;
    flex-direction: row;
    @media (min-width: 1px) and (max-width: 1280px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .chartContainer {
      position: relative;
      height: 220px;
      width: 220px;
      padding-top: 2rem;
      padding-bottom: 1.5rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      @media (min-width: 1px) and (max-width: 1280px) {
        padding-top: 1.5rem;
      }
    }
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
      p {
        margin: 0;
      }
      .totalValue {
        color: var(--secondary-500);
        font-weight: bold;
        font-size: 1.5rem;
      }
      .label {
        color: var(--secondary-300);
        font-weight: 500;
        font-size: 0.875rem;
      }
    }

    .legendChart {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 2rem;
      padding-bottom: 1.5rem;
      justify-content: space-between;
      @media (min-width: 1px) and (max-width: 1280px) {
        padding-right: 1rem;
        padding-left: 1rem;
        padding-top: 1.5rem;
        padding-bottom: 1rem;
      }
    }

    .legendItem {
      display: flex;
      justify-content: space-between;
      width: 232px;
      .legendInfo {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .carName {
          color: var(--secondary-300);
          font-weight: 500;
          font-size: 0.875rem;
        }
      }
      .carValue {
        color: var(--secondary-500);
        font-weight: 600;
        font-size: 0.875rem;
        padding-right: 1.5rem;
        @media (min-width: 1px) and (max-width: 1280px) {
          padding-right: 0;
        }
      }
    }
  }
}
</style>
