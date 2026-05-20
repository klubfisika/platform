import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  return (
    <PlatformLayout title="Design System" activeNav="">
      <div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">🎨 Design System KF13</h1><p class="text-gray-500 mt-1">Komponen dan panduan desain platform</p></div>
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h2 class="font-bold text-lg mb-4">Warna</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{ color: "bg-green-500", label: "Primary Green", hex: "#22c55e" }, { color: "bg-teal-500", label: "Secondary Teal", hex: "#14b8a6" }, { color: "bg-blue-500", label: "Accent Blue", hex: "#3b82f6" }, { color: "bg-orange-500", label: "Warning Orange", hex: "#f97316" }].map((c, i) => (
              <div key={i}><div class={`${c.color} h-16 rounded-xl mb-2`}></div><div class="text-sm font-medium">{c.label}</div><div class="text-xs text-gray-500">{c.hex}</div></div>
            ))}
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h2 class="font-bold text-lg mb-4">Tombol</h2>
          <div class="flex flex-wrap gap-4">
            <button class="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">Primary</button>
            <button class="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Secondary</button>
            <button class="px-6 py-2 border-2 border-green-600 text-green-600 rounded-xl font-bold hover:bg-green-50 transition">Outline</button>
            <button class="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition">Danger</button>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h2 class="font-bold text-lg mb-4">Card</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100"><div class="text-2xl mb-2">📊</div><h3 class="font-bold">Default Card</h3><p class="text-sm text-gray-500">Deskripsi card</p></div>
            <div class="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white"><div class="text-2xl mb-2">🚀</div><h3 class="font-bold">Gradient Card</h3><p class="text-sm opacity-90">Deskripsi card</p></div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Design System" };
