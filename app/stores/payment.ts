import { defineStore } from "pinia";

export interface Billing {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export const PROMO_CODE = "CAR10";
export const PROMO_DISCOUNT = 0.1;

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    billing: {
      name: "",
      phone: "",
      address: "",
      city: "",
    } as Billing,
    payment: {
      method: "card" as "card" | "paypal" | "bitcoin",
      cardNumber: "",
      cardHolder: "",
      expirationDate: "",
      cvc: "",
    },
    isDiscountApplied: false,
  }),

  actions: {
    setBillingField(field: keyof Billing, value: string) {
      this.billing[field] = value;
    },
    resetCheckout() {
      this.$reset();
    },
  },
});
