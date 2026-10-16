export default defineNuxtRouteMiddleware(() => {
  const authCookie = useCookie("auth-logged-in");

  if (!authCookie.value) {
    return navigateTo("/loginPage");
  }
});
