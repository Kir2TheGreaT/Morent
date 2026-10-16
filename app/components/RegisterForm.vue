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

    <h1 class="form-title">Регистрация</h1>
    <p class="form-subtitle">Создайте аккаунт в MORENT</p>

    <form @submit.prevent="handleRegister" class="form-body">
      <div class="input-group">
        <label for="reg-email">Email</label>
        <div class="password-input-wrapper">
          <input
            id="reg-email"
            type="email"
            v-model="email"
            placeholder="Введите ваш email"
            class="email-input"
            autocomplete="email"
            required
          />
        </div>
      </div>

      <div class="input-group">
        <label for="reg-password">Пароль</label>
        <div class="password-input-wrapper">
          <input
            id="reg-password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Придумайте пароль"
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="eye-btn"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
            :aria-pressed="showPassword"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              ></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="input-group">
        <label for="reg-confirm">Повторите пароль</label>
        <div class="password-input-wrapper">
          <input
            id="reg-confirm"
            :type="showPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Повторите пароль"
            autocomplete="new-password"
            required
          />
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? "Регистрация…" : "Зарегистрироваться" }}
      </button>

      <p class="switch-text">
        Уже есть аккаунт?
        <button
          type="button"
          class="switch-link"
          @click="$emit('switch-to-login')"
        >
          Войти
        </button>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToastStore } from "@/stores/toast";

const toastStore = useToastStore();

const email = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const showPassword = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const emit = defineEmits<{
  (e: "switch-to-login"): void;
}>();

const handleRegister = async (): Promise<void> => {
  if (isSubmitting.value) return;

  const normalizedEmail = email.value.trim().toLowerCase();

  if (!normalizedEmail) {
    toastStore.addToast("Введите Email", "warning");
    return;
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    toastStore.addToast("Пожалуйста, введите корректный Email", "error");
    return;
  }

  if (!password.value) {
    toastStore.addToast("Введите пароль", "warning");
    return;
  }

  if (password.value.length < MIN_PASSWORD_LENGTH) {
    toastStore.addToast("Пароль должен быть не менее 4 символов", "warning");
    return;
  }

  if (password.value !== confirmPassword.value) {
    toastStore.addToast("Пароли не совпадают", "error");
    return;
  }

  const users = readUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    toastStore.addToast(
      "Пользователь с таким Email уже зарегистрирован",
      "error",
    );
    return;
  }

  isSubmitting.value = true;
  try {
    users.push({
      email: normalizedEmail,
      passwordHash: await hashPassword(normalizedEmail, password.value),
      createdAt: Date.now(),
    });
    writeUsers(users);

    toastStore.addToast(
      "Регистрация прошла успешно 🎉 Теперь войдите в аккаунт",
      "success",
    );

    emit("switch-to-login");
  } catch (e) {
    console.error(e);
    toastStore.addToast("Ошибка при сохранении пользователя", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-form-container {
  position: relative;
  background-color: var(--primary-0);
  border-radius: 10px;
  padding: 1.5rem;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 0px 10px 30px rgba(2, 9, 20, 0.05);
  border: 1px solid rgba(195, 212, 233, 0.4);

  @media (min-width: 1440px) {
    padding: 2.5rem;
    max-width: 480px;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: var(--secondary-400);
    cursor: pointer;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
    &:hover {
      color: var(--error-500);
      transform: rotate(90deg);
    }
  }

  .form-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--secondary-500);
    margin-bottom: 0.5rem;
    text-align: center;
    @media (min-width: 1440px) {
      font-size: 1.5rem;
    }
  }

  .form-subtitle {
    font-size: 0.75rem;
    color: var(--secondary-300);
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 500;
    @media (min-width: 1440px) {
      font-size: 0.875rem;
    }
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--secondary-500);
        padding-left: 0.25rem;
      }
      .password-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        input {
          padding-right: 3rem;
        }

        .eye-btn {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: var(--secondary-400);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;

          &:hover {
            color: var(--primary-500);
          }
        }
      }

      input {
        width: 100%;
        height: 48px;
        background-color: var(--backgroundpages);
        border: 1px solid rgba(195, 212, 233, 0.4);
        border-radius: 10px;
        padding: 0 1rem;
        font-size: 0.875rem;
        color: var(--secondary-500);
        transition: border-color 0.3s ease;

        &::placeholder {
          color: var(--secondary-300);
        }
        &:focus {
          outline: none;
          border-color: var(--primary-500);
        }
      }
    }

    .submit-btn {
      margin-top: 1rem;
      height: 48px;
      background-color: var(--primary-500);
      color: var(--primary-0);
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition:
        background-color 0.3s ease,
        transform 0.2s active;

      &:hover {
        background-color: #264ac6;
      }
      &:active {
        transform: scale(0.98);
      }
    }
  }

  .switch-text {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--secondary-400);
    @media (min-width: 1440px) {
      font-size: 0.875rem;
    }

    .switch-link {
      color: var(--primary-500);
      font-weight: 700;
      cursor: pointer;
      margin-left: 0.5rem;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.close-btn {
  text-decoration: none;
}
</style>
