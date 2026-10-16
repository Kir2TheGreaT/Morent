// ДЕМО-авторизация без бэкенда: пользователи живут в localStorage браузера.
// Пароль не хранится — только SHA-256 хеш с солью (email). Это не заменяет серверную авторизацию.

const USERS_KEY = "morent_users";

export interface StoredUser {
  email: string;
  passwordHash: string;
  createdAt: number;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 4;

export async function hashPassword(
  email: string,
  password: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${email.toLowerCase()}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function readUsers(): StoredUser[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is StoredUser =>
        typeof u?.email === "string" && typeof u?.passwordHash === "string",
    );
  } catch {
    return [];
  }
}

export function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
