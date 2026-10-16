# MORENT — сервис аренды автомобилей

Учебный фронтенд-проект на **Nuxt 4 / Vue 3 / TypeScript / Pinia**: каталог из 120 машин с фильтрами и поиском, страница машины с отзывами, оформление аренды, личный кабинет с картой Яндекса и графиком.

> ⚠️ **Это демо без бэкенда.**
> - Регистрация и вход работают на `localStorage` (хранится только SHA-256 хеш пароля) и cookie — это не настоящая авторизация.
> - Оплата имитируется: данные карты никуда не отправляются и не логируются.
> - Отзывы, избранное и даты аренды сохраняются в `localStorage` браузера.

## Стек

Nuxt 4 (SSR) · Vue 3 Composition API (`<script setup>`) · TypeScript · Pinia + `pinia-plugin-persistedstate` · flatpickr · IMask · Chart.js · Yandex Maps (`vue-yandex-maps`)

## Запуск

```bash
npm install
cp .env.example .env   # впишите ключ Яндекс.Карт (необязательно: без него показывается статичная картинка)
npm run dev            # http://localhost:3000
```

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер |
| `npm run build` / `npm run preview` | продакшн-сборка и предпросмотр |
| `npm run typecheck` | проверка типов (`vue-tsc`) |

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `NUXT_PUBLIC_YANDEX_MAPS_APIKEY` | ключ JS API Яндекс.Карт. Он публичный по природе — ограничьте его по HTTP Referrer в кабинете разработчика |
| `NUXT_PUBLIC_SITE_URL` | адрес сайта для `sitemap.xml` и `robots.txt` |

## Структура

```
app/
  composables/   useScreenWidth, useSidebar, useCarFilters, useSwapAnimation
  stores/        favorites, rental, payment, reviews, toast (Pinia)
  utils/auth.ts  демо-авторизация (localStorage)
  pages/         /, /categoryCarRent, /detailCarRent/[id], /paymentCarRent/[id], /loginPage, /adminCarRent
data/            products.ts (каталог), cities.ts
server/routes/   sitemap.xml, robots.txt
```

## Известные ограничения

- Картинки большинства машин подгружаются с внешнего сайта (`pngimg.com`) — для продакшна их стоит скачать в `public/` и оптимизировать.
- Описание машины, рейтинг («500+ Reviewer») и транзакции в кабинете — заглушки.
