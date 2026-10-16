import { computed, reactive, ref } from "vue";

type ComponentWithEl = { $el?: HTMLElement } | HTMLElement | null;

const resolveEl = (target: ComponentWithEl): HTMLElement | null => {
  if (!target) return null;
  return "$el" in target ? (target.$el ?? null) : (target as HTMLElement);
};

/** Анимация обмена местами двух виджетов Pick-Up / Drop-Off. */
export function useSwapAnimation() {
  const pickUpRef = ref<ComponentWithEl>(null);
  const dropOffRef = ref<ComponentWithEl>(null);
  const isSwitched = ref(false);
  const dist = reactive({ x: 0, y: 0 });

  const calculateDistance = (): void => {
    const el1 = resolveEl(pickUpRef.value);
    const el2 = resolveEl(dropOffRef.value);
    if (el1 && el2) {
      dist.x = el2.offsetLeft - el1.offsetLeft;
      dist.y = el2.offsetTop - el1.offsetTop;
    }
  };

  const switchToggle = (): void => {
    calculateDistance();
    isSwitched.value = !isSwitched.value;
  };

  const pickUpStyle = computed<Record<string, string>>(() => ({
    transform: isSwitched.value
      ? `translate(${dist.x}px, ${dist.y}px)`
      : "none",
  }));

  const dropOffStyle = computed<Record<string, string>>(() => ({
    transform: isSwitched.value
      ? `translate(${-dist.x}px, ${-dist.y}px)`
      : "none",
  }));

  return {
    pickUpRef,
    dropOffRef,
    isSwitched,
    calculateDistance,
    switchToggle,
    pickUpStyle,
    dropOffStyle,
  };
}
