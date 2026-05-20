import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";
import ScienceShorts from "~/components/qwik/ScienceShorts";

export default component$(() => {
  useVisibleTask$(() => { if (!localStorage.getItem("kf13-member")) window.location.replace("/mulai"); });
  return (
    <PlatformLayout title="Science Shorts" activeNav="/shorts">
      <div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">🎬 Science Shorts</h1><p class="text-gray-500 mt-1">Video pendek seputar sains dan eksperimen</p></div>
      <ScienceShorts />
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Science Shorts" };
