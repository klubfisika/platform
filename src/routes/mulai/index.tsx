import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div class="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div class="text-6xl mb-6">🚀</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-3">KF13 Platform</h1>
        <p class="text-gray-500 mb-8">
          Platform komunitas Klub Fisika Indonesia
        </p>

        <div class="space-y-3">
          <a
            href="/login"
            class="block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Masuk
          </a>
          <a
            href="/register"
            class="block w-full py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            Daftar Sekarang
          </a>
        </div>

        <div class="mt-8 text-sm text-gray-400">
          <p>Research • Inovasi • Kolaborasi</p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "KF13 Platform",
  meta: [
    {
      name: "description",
      content: "Platform komunitas Klub Fisika Indonesia",
    },
  ],
};
