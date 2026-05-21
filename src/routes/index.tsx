import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  useVisibleTask$(() => {
    if (document.cookie.includes("kf13-session")) {
      window.location.replace("/feed");
    } else {
      window.location.replace("/mulai");
    }
  });

  return (
    <div id="splash" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="animate-pulse text-6xl mb-4">🚀</div>
        <p class="text-lg text-gray-600">Memuat platform...</p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "KF13 Community Platform",
  meta: [
    {
      name: "description",
      content: "Platform komunitas Klub Fisika Indonesia - Research, inovasi, dan kolaborasi ilmiah",
    },
  ],
};
