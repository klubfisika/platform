import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  const user = useAuth();
  useVisibleTask$(() => { if (!user.value) window.location.replace("/login"); });

  return (
    <PlatformLayout title="Proyek Baru" activeNav="/projects">
      <div class="text-sm text-gray-400 mb-4"><a href="/projects" class="hover:text-green-600 transition">Proyek</a><span class="mx-2">›</span><span>Buat Proyek Baru</span></div>
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6"><h1 class="text-2xl font-bold">Buat Proyek Baru</h1><p class="text-sm opacity-90 mt-1">Ajak komunitas berkolaborasi dalam eksperimen atau riset</p></div>
        <form class="p-6 space-y-5">
          <div><label class="block text-sm font-medium text-gray-700 mb-2">Judul Proyek</label><input type="text" class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Contoh: Membangun Spektrometer Sederhana" required /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label><select class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option>Eksperimen</option><option>Riset</option><option>DIY</option><option>Software</option></select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label><textarea class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows={5} placeholder="Jelaskan proyek dan tujuan..." required></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-2">Tags</label><input type="text" class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="fisika, optik, diy" /></div>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <a href="/projects" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition">Batal</a>
            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Buat Proyek</button>
          </div>
        </form>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Proyek Baru" };
