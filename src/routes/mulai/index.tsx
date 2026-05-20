import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  useVisibleTask$(() => {
    if (localStorage.getItem("kf13-member")) window.location.replace("/feed");
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div class="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🚀</div>
          <h1 class="text-3xl font-bold text-gray-900">Selamat Datang!</h1>
          <p class="text-gray-500 mt-2">Platform komunitas Klub Fisika Indonesia</p>
        </div>

        <form class="space-y-4" preventdefault:submit onSubmit$={() => {}}>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama</label><input type="text" id="mulai-name" class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nama lengkap" required /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" id="mulai-email" class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="email@example.com" required /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Institusi</label><input type="text" id="mulai-institution" class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="SMA/Universitas" /></div>
          <button type="button" id="mulai-submit" class="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition" onClick$={() => {
            const nameInput = document.getElementById("mulai-name") as HTMLInputElement;
            const emailInput = document.getElementById("mulai-email") as HTMLInputElement;
            const instInput = document.getElementById("mulai-institution") as HTMLInputElement;
            const name = nameInput?.value;
            const email = emailInput?.value;
            if (name && email) {
              localStorage.setItem("kf13-member", JSON.stringify({ name, email, institution: instInput?.value || "", posts: 0, cendol: 0, bata: 0, projects: 0 }));
              window.location.replace("/feed");
            }
          }}>
            Masuk ke Platform
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-400">
          <p>Atau lanjutkan ke <a href="/onboarding" class="text-green-600 hover:underline">pendaftaran lengkap</a></p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = { title: "Selamat Datang" };
