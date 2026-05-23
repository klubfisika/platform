import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";

export const useIndexRedirect = routeLoader$(async (event) => {
  const user = await event.resolveValue(useAuth);
  if (user) {
    throw event.redirect(302, "/feed");
  } else {
    throw event.redirect(302, "/mulai");
  }
});

export default component$(() => {
  return (
    <div id="splash" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="animate-pulse text-6xl mb-4">🚀</div>
        <p class="text-lg text-gray-600">Memuat platform...</p>
      </div>
    </div>
  );
});

export const head = {
  title: "KF13 Community Platform",
  meta: [
    {
      name: "description",
      content:
        "Platform komunitas Klub Fisika Indonesia - Research, inovasi, dan kolaborasi ilmiah",
    },
  ],
};
