import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  const user = useAuth();
  useVisibleTask$(() => { if (!user.value) window.location.replace("/login"); });

  return (
    <PlatformLayout title="Jelajahi" activeNav="/explore">
      <div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">🔍 Jelajahi</h1><p class="text-gray-500 mt-1">Temukan konten, proyek, dan diskusi menarik</p></div>
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-6"><input type="text" placeholder="Cari diskusi, proyek, atau topik..." class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ icon: "⚛️", label: "Fisika Modern" }, { icon: "🔧", label: "Mekanika" }, { icon: "🏆", label: "Olimpiade" }, { icon: "💼", label: "Karir & Kuliah" }, { icon: "🔬", label: "Eksperimen" }, { icon: "🤖", label: "Robotika" }, { icon: "🌌", label: "Astronomi" }, { icon: "💡", label: "Elektronika" }].map((c, i) => (
          <a href={`/discussions?cat=${c.label.toLowerCase()}`} class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center" key={i}>
            <div class="text-4xl mb-3">{c.icon}</div>
            <div class="font-medium text-gray-800">{c.label}</div>
          </a>
        ))}
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Jelajahi" };
