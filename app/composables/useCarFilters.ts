import { computed } from "vue";
import { products } from "~~/data/products";

export interface Filters {
  types: string[];
  capacities: number[];
  price: number;
}

export const MAX_PRICE = 200;

/**
 * Состояние фильтров общее для десктопного и мобильного меню:
 * useState хранит его вне компонента, поэтому открытие/закрытие сайдбара фильтры не сбрасывает.
 */
export function useCarFilters(stateKey = "car-filters") {
  const filters = useState<Filters>(stateKey, () => ({
    types: [],
    capacities: [],
    price: MAX_PRICE,
  }));

  const filteredProducts = computed(() =>
    products.filter((car) => {
      const f = filters.value;
      return (
        car.price <= f.price &&
        (f.types.length === 0 || f.types.includes(car.category)) &&
        (f.capacities.length === 0 || f.capacities.includes(car.seats))
      );
    }),
  );

  const resetFilters = (): void => {
    filters.value = { types: [], capacities: [], price: MAX_PRICE };
  };

  return { filters, filteredProducts, resetFilters };
}
