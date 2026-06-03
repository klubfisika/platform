import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";

export const useRedirect = routeLoader$((event) => {
  throw event.redirect(302, "/feed");
});

export default component$(() => {
  useRedirect();
  return <div class="p-6 text-gray-500">Redirecting...</div>;
});

export const head: DocumentHead = { title: "Redirecting…" };
