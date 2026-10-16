import { products } from "../../data/products";

// Минимальный sitemap без сторонних модулей: главная, каталог и страницы машин.
export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");

  const urls = [
    "/",
    "/categoryCarRent",
    ...products.map((p) => `/detailCarRent/${p.id}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`).join("\n")}
</urlset>`;

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return body;
});
