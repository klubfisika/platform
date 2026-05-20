import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <aside class="hidden xl:block w-72 flex-shrink-0 py-4 pr-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div class="space-y-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <h3 class="font-bold text-sm text-gray-500 uppercase mb-3">🔥 Aktif Sekarang</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">budi_fisika</div>
                <div class="text-xs text-green-500">● Online</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">siti_quantum</div>
                <div class="text-xs text-green-500">● Online</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">ahmad_osn</div>
                <div class="text-xs text-gray-400">● 5m lalu</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 shadow-sm text-white">
          <h3 class="font-bold mb-2">🚀 Mulai Proyek</h3>
          <p class="text-sm opacity-90 mb-3">Punya ide eksperimen atau riset? Ajak komunitas berkolaborasi!</p>
          <a href="/projects/new" class="block text-center bg-white text-green-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-50 transition">
            Buat Proyek Baru
          </a>
        </div>

        <Slot />
      </div>
    </aside>
  );
});
