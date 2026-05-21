import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  const user = useAuth();
  const userName = useSignal("");

  useVisibleTask$(() => {
    if (!user.value) {
      window.location.replace("/login");
      return;
    }
    userName.value = (user.value.name || "M")[0].toUpperCase();
  });

  return (
    <PlatformLayout activeNav="/feed">
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div class="flex gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
            {userName.value || "?"}
          </div>
          <button class="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-500 transition">
            Apa yang sedang kamu pikirkan atau kerjakan?
          </button>
        </div>
        <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-600">
            <span>📸</span> Foto/Video
          </button>
          <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-600">
            <span>🔬</span> Proyek
          </button>
          <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-600">
            <span>❓</span> Tanya
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div class="flex-shrink-0 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">➕</div>
            </div>
            <span class="text-xs mt-1 block">Tambah</span>
          </div>
          <div class="flex-shrink-0 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-0.5">
              <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xl">🏆</div>
            </div>
            <span class="text-xs mt-1 block">OSN 2026</span>
          </div>
          <div class="flex-shrink-0 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
              <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xl">🔬</div>
            </div>
            <span class="text-xs mt-1 block">Lab DIY</span>
          </div>
          <div class="flex-shrink-0 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 p-0.5">
              <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xl">💡</div>
            </div>
            <span class="text-xs mt-1 block">Tips</span>
          </div>
          <div class="flex-shrink-0 text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5">
              <div class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xl">📚</div>
            </div>
            <span class="text-xs mt-1 block">Belajar</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <article class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-4">
            <div class="flex items-start gap-3">
              <a href="/u/budi_fisika">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
              </a>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <a href="/u/budi_fisika" class="font-bold hover:underline">Budi Santoso</a>
                  <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Kaskus Holic</span>
                </div>
                <div class="text-xs text-gray-500">2 jam lalu · 🔬 Proyek</div>
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-full">⋯</button>
            </div>
            <div class="mt-3">
              <p class="text-gray-800">Akhirnya berhasil bikin <strong>Interferometer Michelson</strong> dari barang bekas! 🎉 Total biaya cuma 50rb. Siapa yang mau tutorial lengkapnya?</p>
              <div class="flex gap-2 mt-2">
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">#diy</span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">#optik</span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">#eksperimen</span>
              </div>
            </div>
          </div>
          <div class="bg-gray-100">
            <img src="https://placehold.co/600x400/e2e8f0/64748b?text=📸+Interferometer+DIY" alt="Project" class="w-full" />
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span>🥒 89 cendol</span>
              <span>67 komentar · 12 share</span>
            </div>
            <div class="flex border-t pt-3">
              <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-green-50 rounded-lg text-gray-600 hover:text-green-600 transition">
                <span class="text-lg">🥒</span> Cendol
              </button>
              <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-600">
                <span class="text-lg">💬</span> Komentar
              </button>
              <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-600">
                <span class="text-lg">↗️</span> Share
              </button>
            </div>
          </div>
        </article>

        <article class="bg-white rounded-2xl shadow-sm p-4">
          <div class="flex items-start gap-3">
            <a href="/u/ahmad_osn">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
            </a>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <a href="/u/ahmad_osn" class="font-bold hover:underline">Ahmad Rizki</a>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Newbie</span>
                <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">SMA</span>
              </div>
              <div class="text-xs text-gray-500">5 jam lalu · ❓ Pertanyaan</div>
            </div>
          </div>
          <div class="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
            <p class="font-medium text-gray-800">Gan, ada yang tau cara ngitung momen inersia benda yang bentuknya gak beraturan? Lagi persiapan OSN nih 🙏</p>
          </div>
          <div class="mt-3 flex items-center gap-4 text-sm">
            <span class="text-green-600 font-medium">✓ 3 jawaban</span>
            <span class="text-gray-500">🥒 23 cendol</span>
          </div>
          <div class="mt-3 p-3 bg-gray-50 rounded-xl">
            <div class="flex items-start gap-2">
              <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
              <div class="flex-1">
                <span class="font-medium text-sm">siti_quantum</span>
                <p class="text-sm text-gray-600 mt-1">Bisa pake metode pendulum fisika atau water displacement. Untuk OSN biasanya...</p>
                <button class="text-green-600 text-sm font-medium mt-1">Baca selengkapnya →</button>
              </div>
            </div>
          </div>
          <div class="flex border-t mt-3 pt-3">
            <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-green-50 rounded-lg text-gray-600 hover:text-green-600 transition">
              <span>🥒</span> Cendol
            </button>
            <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <span>💬</span> Jawab
            </button>
            <button class="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <span>🔖</span> Simpan
            </button>
          </div>
        </article>

        <article class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-sm p-4 border border-yellow-200">
          <div class="flex items-center gap-2 text-yellow-700 font-medium mb-3">
            <span class="text-xl">🏆</span> Pencapaian Baru!
          </div>
          <div class="flex items-start gap-3">
            <a href="/u/siti_quantum">
              <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
            </a>
            <div class="flex-1">
              <a href="/u/siti_quantum" class="font-bold hover:underline">Siti Nurhaliza</a>
              <p class="text-gray-700 mt-1">Baru saja mencapai rank <strong class="text-orange-600">Kaskus Addict</strong>! 🎉</p>
              <p class="text-sm text-gray-500 mt-2">312 posts · 567 cendol · 8 proyek</p>
            </div>
          </div>
          <div class="flex gap-2 mt-3">
            <button class="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 rounded-lg font-medium transition">🎉 Selamat!</button>
            <button class="px-4 bg-white hover:bg-gray-50 text-gray-600 py-2 rounded-lg border border-gray-200 transition">Lihat Profil</button>
          </div>
        </article>

        <article class="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-red-500">
          <div class="flex items-center gap-2 text-red-600 font-medium text-sm mb-3">
            <span>🔥</span> Hot Thread
          </div>
          <a href="/discussions/thread" class="block group">
            <h3 class="font-bold text-lg group-hover:text-green-600 transition">[MEGATHREAD] Persiapan OSN Fisika 2026 - Tips, Materi, dan Diskusi</h3>
            <p class="text-gray-600 mt-2 line-clamp-2">Thread ini untuk diskusi persiapan OSN Fisika. Share tips, materi, dan tanya jawab seputar olimpiade fisika...</p>
          </a>
          <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>🥒 127</span>
            <span>💬 234 komentar</span>
            <span>👁️ 2.3k views</span>
          </div>
          <div class="flex gap-2 mt-3">
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#osn</span>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#olimpiade</span>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">#tips</span>
          </div>
        </article>

        <div class="text-center py-4">
          <button class="bg-white hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-full shadow-sm font-medium transition">
            Muat lebih banyak...
          </button>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Feed",
};
