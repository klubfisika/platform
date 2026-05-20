import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  useVisibleTask$(() => {
    const member = localStorage.getItem("kf13-member");
    if (member) {
      setTimeout(() => window.location.replace("/feed"), 800);
    } else {
      setTimeout(() => window.location.replace("/mulai"), 800);
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
