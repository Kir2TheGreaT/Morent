<template>
  <div class="confirmationMain">
    <div class="confirmationTop">
      <div class="text">
        <h4>Confirmation</h4>
        <p>
          We are getting to the end. Just few clicks and your rental is ready!
        </p>
      </div>
      <div class="confirmationSteps">Step 4 of 4</div>
    </div>
    <div class="bottomConfirmation">
      <div
        class="bottomConfirmation1"
        role="checkbox"
        tabindex="0"
        :aria-checked="agreements.includes('marketing')"
        @click="toggleOption('marketing')"
        @keydown.enter.prevent="toggleOption('marketing')"
        @keydown.space.prevent="toggleOption('marketing')"
      >
        <div class="nameConfirmation">
          <div class="selection-wrapper">
            <TickSquare
              v-if="agreements.includes('marketing')"
              class="blue-icon"
            />
            <div v-else class="empty-square"></div>
          </div>
          <p>
            I agree with sending an Marketing and newsletter emails. No spam,
            promised!
          </p>
        </div>
      </div>
      <div
        class="bottomConfirmation2"
        role="checkbox"
        tabindex="0"
        :aria-checked="agreements.includes('terms')"
        @click="toggleOption('terms')"
        @keydown.enter.prevent="toggleOption('terms')"
        @keydown.space.prevent="toggleOption('terms')"
      >
        <div class="nameConfirmation">
          <div class="selection-wrapper">
            <TickSquare v-if="agreements.includes('terms')" class="blue-icon" />
            <div v-else class="empty-square"></div>
          </div>
          <p>I agree with our terms and conditions and privacy policy.</p>
        </div>
      </div>
      <div class="footerConfirmation">
        <ButtonRental
          :label="isSubmitting ? 'Processing...' : 'Rent Now'"
          :disabled="isSubmitting"
          @click="handleRentNow"
        ></ButtonRental>
        <img src="/paySystems/ic-security-safety.png" alt="" />
        <h4>All your data are safe</h4>
        <p>
          We are using the most advanced security to provide you the best
          experience ever.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonRental from "../../Button-rental.vue";
import TickSquare from "../../icons/tickSquare.vue";
import { ref } from "vue";
import { usePaymentStore } from "@/stores/payment";
import { useToastStore } from "@/stores/toast";
import { useRentalStore } from "@/stores/rental";

const store = usePaymentStore();
const toast = useToastStore();
const rentalStore = useRentalStore();

const isSubmitting = ref<boolean>(false);
const agreements = ref<AgreementOption[]>([]);

type AgreementOption = "marketing" | "terms";

const toggleOption = (option: AgreementOption): void => {
  const index = agreements.value.indexOf(option);
  if (index === -1) {
    agreements.value.push(option);
  } else {
    agreements.value.splice(index, 1);
  }
};

// Алгоритм Луна: каждую вторую цифру справа удваиваем, если результат > 9 — вычитаем 9
function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function isValidExpiration(date: string): boolean {
  const match = date.match(/^(\d{2})\s?\/\s?(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number("20" + match[2]);

  if (month < 1 || month > 12) return false;

  // карта действует до конца указанного месяца: new Date(year, month) — первое число следующего
  return new Date(year, month) > new Date();
}

function isValidCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

const toDate = (date: string, time: string): Date => new Date(`${date} ${time}`);

const handleRentNow = async (): Promise<void> => {
  if (isSubmitting.value) return;

  const b = store.billing;
  const p = store.payment;
  const r = rentalStore;

  // 1. Проверка личных данных (Шаг 1)
  if (!b.name || !b.phone || !b.city || !b.address) {
    toast.addToast("Ошибка в Шаге 1: Заполните все поля Billing Info", "warning");
    return;
  }

  // 2. Проверка данных аренды (Шаг 2)
  if (!r.pickup.location || !r.pickup.date || !r.pickup.time) {
    toast.addToast(
      "Ошибка в Шаге 2: Укажите данные Pickup (место, дата, время)",
      "warning",
    );
    return;
  }

  if (!r.dropoff.location || !r.dropoff.date || !r.dropoff.time) {
    toast.addToast(
      "Ошибка в Шаге 2: Укажите данные Drop-Off (место, дата, время)",
      "warning",
    );
    return;
  }

  const pickupAt = toDate(r.pickup.date, r.pickup.time);
  const dropoffAt = toDate(r.dropoff.date, r.dropoff.time);
  if (
    !Number.isNaN(pickupAt.getTime()) &&
    !Number.isNaN(dropoffAt.getTime()) &&
    dropoffAt <= pickupAt
  ) {
    toast.addToast(
      "Ошибка в Шаге 2: Drop-Off должен быть позже Pick-Up",
      "error",
    );
    return;
  }

  // 3. Проверка оплаты (Шаг 3)
  if (p.method === "card") {
    if (!p.cardNumber || !p.cardHolder || !p.expirationDate || !p.cvc) {
      toast.addToast("Ошибка в Шаге 3: Заполните данные банковской карты", "warning");
      return;
    }

    if (!isValidCardNumber(p.cardNumber)) {
      toast.addToast("Шаг 3: Неверный номер карты", "error");
      return;
    }

    if (!isValidExpiration(p.expirationDate)) {
      toast.addToast("Шаг 3: Срок действия карты истек или указан неверно", "error");
      return;
    }

    if (!isValidCVC(p.cvc)) {
      toast.addToast("Шаг 3: Некорректный CVC код", "error");
      return;
    }
  }

  // 4. Согласие с условиями (Шаг 4)
  if (!agreements.value.includes("terms")) {
    toast.addToast(
      "Шаг 4: Вы должны принять условия и политику конфиденциальности",
      "warning",
    );
    return;
  }

  isSubmitting.value = true;

  try {
    // Демо: запрос на сервер имитируется. Платёжные данные (номер карты, CVC) никуда не логируются.
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));

    toast.addToast("Бронирование успешно завершено!", "success");
    // Очищаем чувствительные данные формы после «отправки»
    store.resetCheckout();
    agreements.value = [];
  } catch {
    toast.addToast("Произошла ошибка при соединении с сервером", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
.confirmationMain {
  background-color: var(--primary-0);
  border-radius: 10px;
  .confirmationTop {
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
          padding-right: 2.2rem;
        }
      }
    }
    .confirmationSteps {
      display: flex;
      padding-top: 1.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--secondary-300);
      @media (min-width: 1px) and (max-width: 1439px) {
        font-size: 0.75rem;
        text-wrap: nowrap;
      }
    }
  }
  .bottomConfirmation {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
    padding-left: 1.5rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 1.5rem;
      gap: 1.25rem;
    }
    .bottomConfirmation1 {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: var(--backgroundpages);
      border-radius: 10px;
      .nameConfirmation {
        display: flex;
        flex-direction: row;
        gap: 1.25rem;
        align-items: center;
        line-height: 1;
        padding-top: 1rem;
        padding-bottom: 1rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          gap: 1rem;
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
        }
        .selection-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 1.5rem;
          @media (max-width: 1439px) {
            padding-left: 1rem;
          }
        }
        .blue-icon {
          width: 24px;
          height: 24px;
          color: var(--primary-500);
          display: block;
          @media (max-width: 1439px) {
            width: 20px;
            height: 20px;
          }
        }
        .empty-square {
          width: 24px;
          height: 24px;
          border: 1.5px solid var(--secondary-300);
          border-radius: 6px;
          box-sizing: border-box;
          @media (max-width: 1439px) {
            width: 20px;
            height: 20px;
          }
        }
        p {
          margin: 0;
          font-weight: 600;
          font-size: 1rem;
          color: var(--secondary-500);
          @media (min-width: 1px) and (max-width: 1439px) {
            font-size: 0.75rem;
            font-weight: 500;
            line-height: 160%;
          }
        }
      }
    }
    .bottomConfirmation2 {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: var(--backgroundpages);
      border-radius: 10px;
      .nameConfirmation {
        display: flex;
        flex-direction: row;
        gap: 1.25rem;
        align-items: center;
        line-height: 1;
        padding-top: 1rem;
        padding-bottom: 1rem;
        @media (min-width: 1px) and (max-width: 1439px) {
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
          gap: 1rem;
        }
        .selection-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 1.5rem;
          @media (max-width: 1439px) {
            padding-left: 1rem;
          }
        }
        .blue-icon {
          width: 24px;
          height: 24px;
          color: var(--primary-500);
          display: block;
          @media (max-width: 1439px) {
            width: 20px;
            height: 20px;
          }
        }

        .empty-square {
          width: 24px;
          height: 24px;
          border: 1.5px solid var(--secondary-300);
          border-radius: 6px;
          box-sizing: border-box;
          @media (max-width: 1439px) {
            width: 20px;
            height: 20px;
          }
        }
        p {
          margin: 0;
          font-weight: 600;
          font-size: 1rem;
          color: var(--secondary-500);
          @media (min-width: 1px) and (max-width: 1439px) {
            font-size: 0.75rem;
            font-weight: 500;
            line-height: 160%;
          }
        }
      }
    }
  }
  .footerConfirmation {
    display: flex;
    flex-direction: column;
    align-items: start;
    button {
      margin-bottom: 2rem;
    }
    img {
      width: 1.5rem;
      margin-bottom: 1.5rem;
    }
    h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--secondary-500);
      padding-bottom: 0.5rem;
    }
    p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--secondary-300);
      font-weight: 500;
      @media (min-width: 1px) and (max-width: 1439px) {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
