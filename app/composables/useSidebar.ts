import { computed, inject, onBeforeUnmount, provide, ref, watch } from "vue";
import type { InjectionKey, Ref } from "vue";

export interface SidebarContext {
  isSidebarOpen: Ref<boolean>;
  toggleSidebar: () => void;
}

const sidebarKey: InjectionKey<SidebarContext> = Symbol("sidebarContext");

/** Вызывается один раз в layout. */
export function provideSidebar(): SidebarContext {
  const isSidebarOpen = ref(false);
  const toggleSidebar = (): void => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  const context = { isSidebarOpen, toggleSidebar };
  provide(sidebarKey, context);
  return context;
}

/** Для потребителей. Если layout не предоставил контекст — работает как закрытый сайдбар. */
export function useSidebar() {
  const context = inject(sidebarKey, null);

  const isSidebarOpen = computed<boolean>(
    () => context?.isSidebarOpen.value ?? false,
  );

  const closeSidebar = (): void => {
    if (context) context.isSidebarOpen.value = false;
  };

  const toggleSidebar = (): void => context?.toggleSidebar();

  return { isSidebarOpen, closeSidebar, toggleSidebar };
}

/** Страницы с выезжающим меню: блокирует скролл body и гарантированно снимает блокировку. */
export function useSidebarScrollLock() {
  const sidebar = useSidebar();

  watch(sidebar.isSidebarOpen, (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  onBeforeUnmount(() => {
    document.body.style.overflow = "";
    sidebar.closeSidebar();
  });

  return sidebar;
}
