<template>
  <div class="rentalMain">
    <div class="rentalTop">
      <div class="text">
        <h4>Rental Info</h4>
        <p>Please select your rental date</p>
      </div>
      <div class="rentalSteps">Step 2 of 4</div>
    </div>
    <div class="rentalCenter">
      <div class="pickUpRental">
        <div class="topPickUpRental">
          <div class="circleBlueRental"></div>
          <h4>Pick-up</h4>
        </div>
        <div class="mainPickUpRental">
          <div class="firstRentalColumn">
            <div class="locationsRental">
              <p>Locations</p>
              <div class="locationRentalInput">
                <select
                  v-model="rentalStore.pickup.location"
                  class="custom-select"
                  ref="pickupLocationSelect"
                  aria-label="Pick-up location"
                >
                  <option value="" disabled selected>Select your city</option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
                <button type="button" aria-label="Open field" @click="pickupLocationSelect?.focus()">
                  <ArrowDown />
                </button>
              </div>
            </div>
            <div class="timeRental">
              <p>Time</p>
              <div class="timeRentalInput">
                <input
                  ref="pickupTimeInput"
                  aria-label="Pick-up time"
                  v-model="rentalStore.pickup.time"
                  type="text"
                  placeholder="Select your time"
                  class="custom-select"
                />
                <button type="button" aria-label="Open field" @click="pickupTimeInput?.focus()"><ArrowDown /></button>
              </div>
            </div>
          </div>
          <div class="SecondRentalColumn">
            <div class="dateRental">
              <p>Date</p>
              <div class="dateRentalInput">
                <input
                  ref="pickupDateInput"
                  aria-label="Pick-up date"
                  v-model="rentalStore.pickup.date"
                  type="text"
                  placeholder="Select your date"
                  class="custom-select"
                />
                <button type="button" aria-label="Open field" @click="pickupDateInput?.focus()"><ArrowDown /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rentalCenter">
      <div class="dropOffRental">
        <div class="topDropOffRental">
          <div class="circleBlueRental"></div>
          <h4>Drop-Off</h4>
        </div>
        <div class="mainDropOffRental">
          <div class="firstRentalColumn">
            <div class="locationsRental">
              <p>Locations</p>
              <div class="locationRentalInput">
                <select
                  v-model="rentalStore.dropoff.location"
                  class="custom-select"
                  ref="dropoffLocationSelect"
                  aria-label="Drop-off location"
                >
                  <option value="" disabled selected>Select your city</option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
                <button type="button" aria-label="Open field" @click="dropoffLocationSelect?.focus()">
                  <ArrowDown />
                </button>
              </div>
            </div>
            <div class="timeRental">
              <p>Time</p>
              <div class="timeRentalInput">
                <input
                  ref="dropoffTimeInput"
                  aria-label="Drop-off time"
                  v-model="rentalStore.dropoff.time"
                  type="text"
                  placeholder="Select your time"
                  class="custom-select"
                />
                <button type="button" aria-label="Open field" @click="dropoffTimeInput?.focus()"><ArrowDown /></button>
              </div>
            </div>
          </div>
          <div class="SecondRentalColumn">
            <div class="dateRental">
              <p>Date</p>
              <div class="dateRentalInput">
                <input
                  ref="dropoffDateInput"
                  aria-label="Drop-off date"
                  v-model="rentalStore.dropoff.date"
                  type="text"
                  placeholder="Select your date"
                  class="custom-select"
                />
                <button type="button" aria-label="Open field" @click="dropoffDateInput?.focus()"><ArrowDown /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ArrowDown from "../../icons/arrow-down.vue";
import { useRentalStore } from "@/stores/rental";
import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import { cities } from "~~/data/cities";
import "flatpickr/dist/flatpickr.css";

const rentalStore = useRentalStore();
const pickupDateInput = ref<HTMLInputElement | null>(null);
const dropoffDateInput = ref<HTMLInputElement | null>(null);
const pickupTimeInput = ref<HTMLInputElement | null>(null);
const dropoffTimeInput = ref<HTMLInputElement | null>(null);
const pickupLocationSelect = ref<HTMLSelectElement | null>(null);
const dropoffLocationSelect = ref<HTMLSelectElement | null>(null);


const pickers: Instance[] = [];

onBeforeUnmount(() => pickers.forEach((fp) => fp.destroy()));

onMounted(() => {
  const dateCfg = { dateFormat: "d M Y", disableMobile: true };
  const timeCfg = {
    noCalendar: true,
    enableTime: true,
    dateFormat: "H:i",
    time_24hr: true,
    disableMobile: true,
  };

  if (pickupDateInput.value) {
    pickers.push(flatpickr(pickupDateInput.value, {
      ...dateCfg,
      defaultDate: rentalStore.pickup.date,
      onChange: (selectedDates, dateStr) => {
        rentalStore.pickup.date = dateStr;
      },
    }));
  }

  if (dropoffDateInput.value) {
    pickers.push(flatpickr(dropoffDateInput.value, {
      ...dateCfg,
      defaultDate: rentalStore.dropoff.date,
      onChange: (selectedDates, dateStr) => {
        rentalStore.dropoff.date = dateStr;
      },
    }));
  }

  if (pickupTimeInput.value) {
    pickers.push(flatpickr(pickupTimeInput.value, {
      ...timeCfg,
      defaultDate: rentalStore.pickup.time,
      onChange: (selectedDates, dateStr) => {
        rentalStore.pickup.time = dateStr;
      },
    }));
  }

  if (dropoffTimeInput.value) {
    pickers.push(flatpickr(dropoffTimeInput.value, {
      ...timeCfg,
      defaultDate: rentalStore.dropoff.time,
      onChange: (selectedDates, dateStr) => {
        rentalStore.dropoff.time = dateStr;
      },
    }));
  }
});
</script>

<style>
.rentalMain {
  background-color: var(--primary-0);
  border-radius: 10px;
  .rentalTop {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 2rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      padding: 1rem 1rem 1.5rem;
    }
    .text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      h4 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--secondary-500);
        @media (min-width: 1px) and (max-width: 1439px) {
          font-size: 1rem;
        }
      }
      p {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--secondary-300);
        @media (min-width: 1px) and (max-width: 1439px) {
          font-size: 0.75rem;
        }
      }
    }
    .rentalSteps {
      display: flex;
      padding-top: 1.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--secondary-300);
      @media (min-width: 1px) and (max-width: 1439px) {
        font-size: 0.75rem;
      }
    }
  }
  .rentalCenter {
    .pickUpRental,
    .dropOffRental {
      .topPickUpRental,
      .topDropOffRental {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding-left: 1.5rem;
        padding-bottom: 1.5rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          padding-left: 1rem;
          padding-bottom: 1.25rem;
        }
        h4 {
          margin: 0;
        }
        .circleBlueRental {
          width: 0.5rem;
          height: 0.5rem;
          background: var(--primary-500);
          border-radius: 50%;
          outline: 4px solid rgba(53, 99, 233, 0.3);
          margin-top: -0.1rem;
          animation: breatheBlue 2.2s ease-in-out infinite;
        }
      }
      .mainPickUpRental,
      .mainDropOffRental {
        display: flex;
        flex-direction: row;
        @media (min-width: 1px) and (max-width: 1439px) {
          flex-direction: column;
        }
        .firstRentalColumn,
        .SecondRentalColumn {
          display: flex;
          flex-direction: column;
          padding-left: 1.5rem;
          gap: 1.5rem;
          padding-right: 2rem;
          flex: 1;
          @media (min-width: 1px) and (max-width: 1439px) {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        .locationsRental,
        .timeRental,
        .dateRental {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 2rem;
          @media (min-width: 1px) and (max-width: 1439px) {
            gap: 0.75rem;
            padding-bottom: 1.25rem;
          }
          p {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
            color: var(--secondary-500);
            @media (min-width: 1px) and (max-width: 1439px) {
              font-size: 0.875rem;
            }
          }
        }
      }
    }
  }
}

.locationRentalInput,
.timeRentalInput,
.dateRentalInput {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--backgroundpages);
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
  width: 100%;
  max-width: 386px;

  @media (min-width: 1px) and (max-width: 1439px) {
    max-width: 295px;
  }

  &:focus-within {
    border-color: var(--primary-500);
    background-color: var(--primary-0);
  }

  .custom-select {
    width: 100%;
    border: 0;
    background: transparent;
    color: var(--secondary-300);
    padding: 1rem 0 1rem 2rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;

    @media (min-width: 1px) and (max-width: 1439px) {
      padding-left: 1rem;
      font-size: 0.75rem;
    }
  }

  .custom-select::-ms-expand {
    display: none;
  }

  button {
    background-color: transparent;
    padding: 0 1.25rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    flex-shrink: 0;
  }
}

@keyframes breatheBlue {
  0% {
    transform: scale(1);
    outline-color: rgba(53, 99, 233, 0.3);
  }
  50% {
    transform: scale(1.25);
    outline-color: rgba(53, 99, 233, 0.1);
  }
  100% {
    transform: scale(1);
    outline-color: rgba(53, 99, 233, 0.3);
  }
}
</style>
