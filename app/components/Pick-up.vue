<template>
  <div class="pickupWidget">
    <div class="pickUp">
      <div class="circleBlue"></div>
      <h2 class="widgetTitle">{{ title }}</h2>
    </div>
    <div class="setTime">
      <div class="location side" ref="locationRef">
        <p>Locations</p>
        <div class="text" @click="toggleLocation">
          <p>{{ data.location || "Select your city" }}</p>
          <button
            type="button"
            class="arrowButton"
            aria-label="Select city"
            :aria-expanded="isLocationOpen"
          >
            <ArrowDown :class="{ rotated: isLocationOpen }" />
          </button>
        </div>
        <Transition name="fade">
          <ul v-if="isLocationOpen" class="cityList">
            <li
              v-for="city in cities"
              :key="city"
              @click.stop="selectCity(city)"
              :class="{ active: data.location === city }"
            >
              {{ city }}
            </li>
          </ul>
        </Transition>
      </div>

      <div class="border"></div>

      <div class="date">
        <p>Date</p>
        <div class="text" @click="openDatePicker">
          <flat-pickr
            ref="datePickerRef"
            v-model="localDate"
            :config="dateConfig"
            class="flatpickr-custom-input"
            placeholder="Select date"
            :aria-label="`${title} date`"
          />
          <button type="button" class="arrowButton" aria-label="Open calendar">
            <ArrowDown />
          </button>
        </div>
      </div>

      <div class="border"></div>

      <div class="time side">
        <p>Time</p>
        <div class="text" @click="openTimePicker">
          <flat-pickr
            ref="timePickerRef"
            v-model="localTime"
            :config="timeConfig"
            class="flatpickr-custom-input"
            placeholder="Select time"
            :aria-label="`${title} time`"
          />
          <button type="button" class="arrowButton" aria-label="Open time picker">
            <ArrowDown />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import ArrowDown from "./icons/arrow-down.vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { cities } from "~~/data/cities";

interface RentalData {
  location: string;
  date: string;
  time: string;
}

const props = defineProps<{
  title: string;
  data: RentalData;
}>();

const emit = defineEmits<{
  (e: "update:date", value: string): void;
  (e: "update:time", value: string): void;
  (e: "update:location", value: string): void;
}>();

const isLocationOpen = ref<boolean>(false);
const locationRef = ref<HTMLElement | null>(null);

const toggleLocation = (): void => {
  isLocationOpen.value = !isLocationOpen.value;
};

const selectCity = (city: string): void => {
  emit("update:location", city);
  isLocationOpen.value = false;
};

const handleClickOutside = (event: MouseEvent): void => {
  if (locationRef.value && !locationRef.value.contains(event.target as Node)) {
    isLocationOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));

const localDate = ref<string>(props.data.date);
const localTime = ref<string>(props.data.time);

// Значения из store (например, восстановленные из localStorage) попадают в локальные поля.
watch(
  () => props.data.date,
  (value) => (localDate.value = value),
);
watch(
  () => props.data.time,
  (value) => (localTime.value = value),
);

watch(localDate, (newDate: string) => {
  if (newDate !== props.data.date) emit("update:date", newDate);
});

watch(localTime, (newTime: string) => {
  if (newTime !== props.data.time) emit("update:time", newTime);
});

type FlatpickrInstance = { fp?: { open: () => void } } | null;

const datePickerRef = ref<FlatpickrInstance>(null);
const timePickerRef = ref<FlatpickrInstance>(null);

const openDatePicker = (): void => datePickerRef.value?.fp?.open();
const openTimePicker = (): void => timePickerRef.value?.fp?.open();

const dateConfig = {
  dateFormat: "d M Y",
  minDate: "today",
  disableMobile: true,
};

const timeConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true,
  disableMobile: true,
};
</script>

<style>
.pickupWidget {
  background-color: var(--primary-0);
  border-radius: 10px;

  .pickUp {
    display: flex;
    position: relative;
    gap: 0.5rem;
    flex-direction: row;
    align-items: center;
    background-color: var(--primary-0);
    border-radius: 10px;
    padding-bottom: 1.5rem;
    padding-left: 1rem;
    padding-top: 1rem;

    .widgetTitle {
      font-size: 1rem;
      font-weight: 600;
      color: var(--secondary-500);
      margin: 0;
    }

    .circleBlue {
      width: 0.5rem;
      height: 0.5rem;
      background: var(--primary-500);
      border-radius: 50%;
      outline: 4px solid rgba(53, 99, 233, 0.3);
      margin-top: -0.25rem;
      animation: breatheBlue 2.2s ease-in-out infinite;
    }
  }

  .setTime {
    gap: 0.9rem;
    display: flex;
    flex-direction: row;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    .border {
      border-right: 1px solid rgba(195, 212, 233, 0.4);
      align-self: stretch;
    }

    .location {
      gap: 0.5rem;

      p {
        font-size: 1rem;
        font-weight: 700;
        color: var(--secondary-500);
      }

      .text {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        gap: 0.5rem;

        .icon-container {
          display: flex;
          align-items: center;
        }
        p {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--secondary-300);
          margin: 0;
        }
      }
    }

    .date {
      gap: 0.5rem;
      p {
        font-size: 1rem;
        font-weight: 700;
        color: var(--secondary-500);
      }

      .text {
        gap: 0.25rem;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;

        p {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--secondary-300);
          margin: 0;
          text-wrap: nowrap;
        }
      }
    }

    .time {
      gap: 0.5rem;

      p {
        font-size: 1rem;
        font-weight: 700;
        color: var(--secondary-500);
      }

      .text {
        gap: 0.25rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        align-items: center;
        .icon-container {
          display: flex;
          align-items: center;
        }

        p {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--secondary-300);
          margin: 0;
        }
      }
    }
  }
}

@media (min-width: 545px) and (max-width: 1439px) {
  .setTime {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 1440px) {
  .pickupWidget {
    .pickUp {
      padding-top: 1.5rem;
      padding-left: 1.5rem;
      padding-bottom: 1.375rem;
    }
    .setTime {
      gap: 3rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 1.5rem;
      .location {
        &.side {
          padding-left: 0.75rem;
        }
        p {
          margin-top: 0;
          margin-bottom: 0;
        }
      }
      .date {
        p {
          margin-top: 0;
          margin-bottom: 0;
        }
      }
      .time {
        &.side {
          padding-right: 0.75rem;
        }
        p {
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    }
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
.flatpickr-custom-input {
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--secondary-300);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  width: 68px;
  white-space: nowrap;
}

.flatpickr-custom-input::placeholder {
  color: var(--secondary-300);
  opacity: 1;
}
.location {
  position: relative;
  cursor: pointer;
}

.cityList {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background: var(--primary-0);
  border: 1px solid var(--borderColor);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 999;
  list-style: none;
  padding: 0.5rem 0;

  max-height: 200px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: var(--primary-500) transparent;
}

.cityList::-webkit-scrollbar {
  width: 6px;
}
.cityList::-webkit-scrollbar-thumb {
  background-color: var(--primary-500);
  border-radius: 10px;
}

.cityList li {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--secondary-500);
  cursor: pointer;
}

.cityList li:hover {
  background: var(--backgroundpages);
}
.cityList li.active {
  color: var(--primary-500);
  font-weight: 600;
}

.arrowButton {
  transition: transform 0.3s ease;
}
.arrowButton.rotated {
  transform: rotate(180deg);
}
</style>
