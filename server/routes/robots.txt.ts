export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");

  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return [
    "User-agent: *",
    "Disallow: /adminCarRent",
    "Disallow: /loginPage",
    "Disallow: /paymentCarRent/",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
});
