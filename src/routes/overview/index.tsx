import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  const userName = useSignal("Member");
  const posts = useSignal(0);
  const cendol = useSignal(0);
  const projects = useSignal(0);
  const reputation = useSignal(0);
  const rankTitle = useSignal("Kaskuser");
  const rankPosts = useSignal("0 posts");
  const rankProgress = useSignal(10);
  const rankNext = useSignal("50 posts lagi ke Kaskus Addict");

  useVisibleTask$(() => {
    const member = localStorage.getItem("kf13-member");
    if (!member) {
      window.location.replace("/mulai");
      return;
    }
    const user = JSON.parse(member);
    userName.value = user.name?.split(" ")[0] || "Member";
    posts.value = user.posts || 0;
    cendol.value = user.cendol || 0;
    projects.value = user.projects || 0;
    reputation.value = (user.cendol || 0) - (user.bata || 0);
    rankPosts.value = `${user.posts || 0} posts`;
    const progress = Math.min(((user.posts || 0) / 50) * 100, 100);
    rankProgress.value = progress;
  });

  return (
    <PlatformLayout activeNav="/overview">
      <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white mb-6">
        <h1 class="text-2xl font-bold mb-2">Selamat datang kembali! 👋</h1>
        <p class="text-green-100">Lihat perkembangan aktivitasmu, {userName.value}</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">📝</div>
          <div class="text-2xl font-bold text-gray-900 mb-1">{posts.value}</div>
          <div class="text-xs text-gray-500">Total Posts</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">🥒</div>
          <div class="text-2xl font-bold text-green-600 mb-1">{cendol.value}</div>
          <div class="text-xs text-gray-500">Cendol</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">🔬</div>
          <div class="text-2xl font-bold text-blue-600 mb-1">{projects.value}</div>
          <div class="text-xs text-gray-500">Proyek</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">⭐</div>
          <div class="text-2xl font-bold text-orange-500 mb-1">{reputation.value}</div>
          <div class="text-xs text-gray-500">Reputasi</div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">📊</span> Aktivitas Mingguan
            </h2>
            <div class="h-40 flex items-end justify-between gap-3 px-2">
              {["30%", "50%", "70%", "45%", "90%", "25%", "15%"].map((h, i) => (
                <div class="flex-1 flex flex-col items-center gap-2" key={i}>
                  <div class={`w-full rounded-t ${["bg-green-200", "bg-green-300", "bg-green-400", "bg-green-300", "bg-green-500", "bg-green-200", "bg-green-100"][i]}`} style={{ height: h }}></div>
                  <span class="text-xs text-gray-500">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">🕐</span> Aktivitas Terbaru
            </h2>
            <div class="space-y-4">
              <div class="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">🥒</div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-1">Kamu mendapat <strong class="text-green-600">+5 cendol</strong> dari postingan</p>
                  <p class="text-xs text-gray-400">2 jam lalu</p>
                </div>
              </div>
              <div class="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">💬</div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-1"><strong>Siti</strong> membalas diskusimu</p>
                  <p class="text-xs text-gray-400">5 jam lalu</p>
                </div>
              </div>
              <div class="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">👥</div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-1"><strong>Ahmad</strong> mulai mengikutimu</p>
                  <p class="text-xs text-gray-400">1 hari lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">⚡</span> Aksi Cepat
            </h2>
            <div class="space-y-3">
              <a href="/feed" class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition">
                <span class="text-lg">📰</span>
                <span class="text-sm font-medium">Lihat Feed</span>
              </a>
              <a href="/projects/new" class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition">
                <span class="text-lg">🔬</span>
                <span class="text-sm font-medium">Buat Proyek Baru</span>
              </a>
              <a href="/discussions" class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition">
                <span class="text-lg">💬</span>
                <span class="text-sm font-medium">Mulai Diskusi</span>
              </a>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">🏆</span> Rank Progress
            </h2>
            <div class="text-center py-4">
              <div class="text-4xl mb-3">⭐</div>
              <div class="font-bold text-gray-900 mb-1">{rankTitle.value}</div>
              <div class="text-sm text-gray-500">{rankPosts.value}</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div class="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full" style={{ width: `${rankProgress.value}%` }}></div>
            </div>
            <p class="text-xs text-gray-500 mt-3 text-center">{rankNext.value}</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">🎯</span> Target Minggu Ini
            </h2>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Post 3 konten</span>
                  <span class="text-green-600 font-medium">2/3</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 66%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Bantu 5 diskusi</span>
                  <span class="text-orange-500 font-medium">1/5</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-orange-400 h-2 rounded-full" style="width: 20%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Overview",
};
