<template>
  <div class="billingMain">
    <div class="billingTop">
      <div class="text">
        <h4>Billing Info</h4>
        <p>Please enter your billing info</p>
      </div>
      <div class="billingSteps">Step 1 of 4</div>
    </div>
    <div class="billingForms">
      <div class="billingFistColumn">
        <div class="billingName">
          <p>Name</p>
          <input
            type="text"
            placeholder="Your Name"
            aria-label="Name"
            autocomplete="name"
            :value="store.billing.name"
            @input="handleInput('name', $event, /[^a-zA-Zа-яА-Я\s]/g)"
          />
        </div>
        <div class="billingAddress">
          <p>Address</p>
          <input
            type="text"
            placeholder="Address"
            aria-label="Address"
            autocomplete="street-address"
            :value="store.billing.address"
            @input="handleInput('address', $event, /[<>{}]/g)"
          />
        </div>
      </div>
      <div class="billingSecondColumn">
        <div class="billingPhone">
          <p>Phone Number</p>
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            aria-label="Phone number"
            autocomplete="tel"
            ref="phoneInput"
          />
        </div>
        <div class="billingLocation">
          <p>Town/City</p>
          <input
            type="text"
            placeholder="Town/City"
            aria-label="Town or city"
            autocomplete="address-level2"
            :value="store.billing.city"
            @input="handleInput('city', $event, /[^a-zA-Zа-яА-Я\s-]/g)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import IMask from "imask";
import { usePaymentStore, type Billing } from "@/stores/payment";

const store = usePaymentStore();

const handleInput = (field: keyof Billing, event: Event, regex: RegExp) => {
  const input = event.target as HTMLInputElement;
  const filteredValue = input.value.replace(regex, "");
  // перезаписываем значение, чтобы запрещённые символы исчезали и из поля
  input.value = filteredValue;
  store.setBillingField(field, filteredValue);
};

const phoneInput = ref<HTMLInputElement | null>(null);

let mask: ReturnType<typeof IMask> | undefined;

onMounted(() => {
  if (!phoneInput.value) return;

  mask = IMask(phoneInput.value, {
    mask: "+{7} (000) 000-00-00",
  });

  if (store.billing.phone) {
    mask.value = store.billing.phone;
  }

  mask.on("accept", () => {
    store.setBillingField("phone", mask!.value);
  });
});

// после сброса формы (успешное бронирование) очищаем и маску телефона
watch(
  () => store.billing.phone,
  (phone) => {
    if (!phone && mask && mask.value) mask.value = "";
  },
);

onBeforeUnmount(() => {
  mask?.destroy();
});
</script>

<style>
.billingMain {
  background-color: var(--primary-0);
  border-radius: 10px;
  .billingTop {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 1.5rem;
    padding-bottom: 2rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 1rem;
      padding-bottom: 1.5rem;
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
    .billingSteps {
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
  .billingForms {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      flex-direction: column;
    }
    .billingFistColumn {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-left: 1.5rem;
      padding-right: 2rem;
      padding-bottom: 1.5rem;
      @media (min-width: 1px) and (max-width: 1439px) {
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 0;
      }
      .billingName {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          gap: 0.75rem;
        }
        p {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--secondary-500);
          @media (min-width: 1px) and (max-width: 1439px) {
            font-size: 0.875rem;
          }
        }
        input {
          background-color: var(--backgroundpages);
          border: 0;
          border-radius: 10px;
          padding-top: 1rem;
          padding-bottom: 1rem;
          padding-left: 2rem;
          width: 386px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--secondary-300);
          @media (min-width: 1px) and (max-width: 1439px) {
            width: auto;
            font-size: 0.75rem;
          }
        }
      }
      .billingAddress {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          gap: 0.75rem;
        }
        p {
          margin: 0;
          font-size: 1rem;
          font-weight: bold;
          color: var(--secondary-500);
          @media (min-width: 1px) and (max-width: 1439px) {
            font-size: 0.875rem;
          }
        }
        input {
          background-color: var(--backgroundpages);
          border: 0;
          border-radius: 10px;
          padding-top: 1rem;
          padding-bottom: 1rem;
          padding-left: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--secondary-300);
          @media (min-width: 1px) and (max-width: 1439px) {
            width: auto;
            font-size: 0.75rem;
          }
        }
      }
    }
    .billingSecondColumn {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-right: 1.5rem;
      @media (min-width: 1px) and (max-width: 1439px) {
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 0;
      }
      .billingPhone {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          gap: 0.75rem;
        }
        p {
          margin: 0;
          font-size: 1rem;
          font-weight: bold;
          color: var(--secondary-500);
          @media (min-width: 1px) and (max-width: 1439px) {
            font-size: 0.875rem;
          }
        }
        input {
          background-color: var(--backgroundpages);
          border: 0;
          border-radius: 10px;
          padding-top: 1rem;
          padding-bottom: 1rem;
          padding-left: 2rem;
          width: 386px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--secondary-300);
          @media (min-width: 1px) and (max-width: 1439px) {
            width: auto;
            font-size: 0.75rem;
          }
        }
      }
      .billingLocation {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          gap: 0.75rem;
        }
        p {
          margin: 0;
          font-size: 1rem;
          font-weight: bold;
          color: var(--secondary-500);
          @media (min-width: 1px) and (max-width: 1439px) {
            font-size: 0.875rem;
          }
        }
        input {
          background-color: var(--backgroundpages);
          border: 0;
          border-radius: 10px;
          padding-top: 1rem;
          padding-bottom: 1rem;
          padding-left: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          @media (min-width: 1px) and (max-width: 1439px) {
            width: auto;
            font-size: 0.75rem;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
}
</style>
