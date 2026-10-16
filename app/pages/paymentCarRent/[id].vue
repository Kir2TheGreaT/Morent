<template>
  <div class="paymentMainPage">
    <h1 class="visually-hidden">Checkout</h1>
    <div class="paymentData">
      <Billing class="billingPayment" />
      <RentalInfo class="rentalPayment" />
      <PaymentMethod class="paymentPayments" />
      <Confirmation class="confirmationPayment" />
    </div>
    <div class="cardPaymentData" v-if="product">
      <RentalSummary :product="product" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Billing from "~/components/paymentPage/paymentSteps/billing.vue";
import Confirmation from "~/components/paymentPage/paymentSteps/confirmation.vue";
import PaymentMethod from "~/components/paymentPage/paymentSteps/paymentMethod.vue";
import RentalInfo from "~/components/paymentPage/paymentSteps/rentalInfo.vue";
import RentalSummary from "~/components/paymentPage/rentalSummary.vue";
import { products } from "~~/data/products";

const route = useRoute();
const productId = computed(() => Number(route.params.id));
const product = computed(() => products.find((p) => p.id === productId.value));

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Car not found",
    fatal: true,
  });
}

useSeoMeta({
  title: () => `Checkout — ${product.value?.name ?? "car"}`,
  robots: "noindex, nofollow",
});
</script>

<style>
.paymentMainPage {
  max-width: 1440px;
  background-color: var(--backgroundpages);
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  @media (min-width: 1px) and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 1280px) and (max-width: 1439px) {
    flex-direction: row-reverse;
  }
  .paymentData {
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      display: flex;
      order: 2;
      padding-top: 0;
      padding-bottom: 0;
    }
    @media (min-width: 1280px) and (max-width: 1439px) {
      padding-bottom: 2rem;
      padding-top: 2rem;
    }
    .billingPayment {
      margin-bottom: 2rem;
      @media (min-width: 1px) and (max-width: 1439px) {
        margin-left: 1.5rem;
      }
    }
    .rentalPayment {
      margin-bottom: 2rem;
      @media (min-width: 1px) and (max-width: 1439px) {
        margin-left: 1.5rem;
      }
    }
    .paymentPayments {
      margin-bottom: 2rem;
      @media (min-width: 1px) and (max-width: 1439px) {
        margin-left: 1.5rem;
      }
    }
    .confirmationPayment {
      @media (min-width: 1px) and (max-width: 1439px) {
        margin-left: 1.5rem;
      }
    }
  }
  .cardPaymentData {
    padding-top: 2rem;
    @media (min-width: 1px) and (max-width: 1439px) {
      display: flex;
      order: 1;
      padding: 2rem 1.5rem;
    }
  }
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
