// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      htmlAttrs: { lang: "en" },
      titleTemplate: "%s | MORENT",
      title: "Car rental",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "MORENT — rent a car safely and reliably at a low price. Sport cars, SUVs, sedans and electric vehicles.",
        },
        { property: "og:site_name", content: "MORENT" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  },
  css: ["./app/assets/css/main.css", "./app/assets/css/theme.css"],

  modules: [
    "@nuxt/fonts",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "vue-yandex-maps/nuxt",
  ],

  // Ключ задаётся через NUXT_PUBLIC_YANDEX_MAPS_APIKEY в .env (см. .env.example).
  // Скрипт карт грузится только при монтировании компонента карты.
  yandexMaps: {
    // непустая заглушка: модуль падает на пустом ключе; реальный ключ подставляется из env в рантайме
    apikey: "YANDEX_MAPS_API_KEY_NOT_SET",
    lang: "ru_RU",
    version: "v3",
    initializeOn: "onComponentMount",
  },

  runtimeConfig: {
    public: {
      siteUrl: "http://localhost:3000",
    },
  },

  fonts: {
    defaults: {
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["cyrillic-ext", "cyrillic", "latin-ext", "latin"],
    },
    families: [
      {
        name: "Plus Jakarta Sans",
        provider: "google",
      },
    ],
  },
});
