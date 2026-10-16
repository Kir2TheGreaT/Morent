<template>
  <div class="login-form-container">
    <NuxtLink to="/" class="close-btn" aria-label="На главную" title="На главную">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </NuxtLink>

    <h1 class="form-title">Вход в аккаунт</h1>
    <p class="form-subtitle">Добро пожаловать в MORENT</p>

    <form @submit.prevent="handleLogin" class="form-body">
      <div class="input-group">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          v-model="email"
          placeholder="Введите ваш email"
          autocomplete="email"
          required
        />
      </div>

      <div class="input-group">
        <label for="login-password">Пароль</label>
        <input
          id="login-password"
          type="password"
          v-model="password"
          placeholder="Введите пароль"
          autocomplete="current-password"
          required
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? "Вход…" : "Войти" }}
      </button>

      <p class="switch-text">
        Нет аккаунта?
        <button
          type="button"
          class="switch-link"
          @click="$emit('switch-to-register')"
        >
          Зарегистрироваться
        </button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useToastStore } from "@/stores/toast";

const router = useRouter();
const toastStore = useToastStore();

const email = ref<string>("");
const password = ref<string>("");
const isSubmitting = ref<boolean>(false);

const isAuthenticated = useCookie<string | null>("auth-logged-in", {
  maxAge: 60 * 60 * 24 * 7,
  sameSite: "lax",
});

defineEmits<{
  (e: "switch-to-register"): void;
}>();

let redirectTimer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(redirectTimer));

const handleLogin = async (): Promise<void> => {
  if (isSubmitting.value) return;

  const normalizedEmail = email.value.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    toastStore.addToast("Пожалуйста, введите корректный Email", "error");
    return;
  }

  if (password.value.length < MIN_PASSWORD_LENGTH) {
    toastStore.addToast("Пароль должен быть не менее 4 символов", "warning");
    return;
  }

  isSubmitting.value = true;
  try {
    const passwordHash = await hashPassword(normalizedEmail, password.value);
    const validUser = readUsers().find(
      (u) => u.email === normalizedEmail && u.passwordHash === passwordHash,
    );

    if (!validUser) {
      toastStore.addToast("Неверный email или пароль", "error");
      return;
    }

    isAuthenticated.value = "true";
    toastStore.addToast("Успешный вход!", "success");
    redirectTimer = setTimeout(() => router.push("/adminCarRent"), 500);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.login-form-container {
  position: relative;
  background-color: var(--primary-0, #ffffff);
  border: 1px solid rgba(195, 212, 233, 0.4);
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0px 10px 30px rgba(2, 9, 20, 0.05);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--secondary-400, #90a3bf);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.3s ease,
    transform 0.2s ease;
}

.close-btn:hover {
  color: var(--error-500, #ed3f3f);
  transform: rotate(90deg);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary-500, #1a202c);
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-subtitle {
  font-size: 0.875rem;
  color: var(--secondary-400, #90a3bf);
  margin-bottom: 2rem;
  text-align: center;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--secondary-500, #1a202c);
}

.input-group input {
  height: 46px;
  color: var(--secondary-500, #1a202c);
  background-color: var(--primary-0, #ffffff);
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid rgba(195, 212, 233, 0.4);
  border-radius: 10px;
  padding: 0 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: var(--primary-500, #3563e9);
}

.submit-btn {
  height: 46px;
  background-color: var(--primary-500, #3563e9);
  color: var(--primary-0, #ffffff);
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #264ac6;
}

.submit-btn:active {
  transform: scale(0.98);
}

.switch-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--secondary-400, #90a3bf);
}

.switch-link {
  color: var(--primary-500, #3563e9);
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
}

.switch-link:hover {
  text-decoration: underline;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.close-btn {
  text-decoration: none;
}
</style>
