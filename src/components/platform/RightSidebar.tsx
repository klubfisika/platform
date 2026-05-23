import { component$, useContext } from "@builder.io/qwik";
import { SidebarContext } from "~/lib/context";

export default component$(() => {
  const sidebarData = useContext(SidebarContext, null);

  if (!sidebarData) {
    return null;
  }
  
  return (
    <aside class="hidden xl:block w-80 flex-shrink-0 py-4 pr-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden sidebar-scroll">
      <div class="space-y-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="font-bold text-sm text-gray-500 uppercase mb-3">
            📊 Stats KF13
          </h3>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-green-50 rounded-xl">
              <div class="text-lg font-bold text-green-600">
                {sidebarData.stats.totalUsers}
              </div>
              <div class="text-xs text-gray-500">Members</div>
            </div>
            <div class="p-2 bg-blue-50 rounded-xl">
              <div class="text-lg font-bold text-blue-600">
                {sidebarData.stats.totalPosts}
              </div>
              <div class="text-xs text-gray-500">Posts</div>
            </div>
            <div class="p-2 bg-purple-50 rounded-xl">
              <div class="text-lg font-bold text-purple-600">
                {sidebarData.stats.totalDiscussions}
              </div>
              <div class="text-xs text-gray-500">Diskusi</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="font-bold text-sm text-gray-500 uppercase mb-3 flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Aktif Sekarang
          </h3>
          <div class="space-y-3">
            {sidebarData.activeUsers.length > 0 ? (
              sidebarData.activeUsers.map((user: any) => (
                <a
                  key={user.id}
                  href={`/u/${user.username}`}
                  class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition group"
                >
                  <div class="relative">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        width={36}
                        height={36}
                        class="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      class={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900 truncate group-hover:text-green-600 transition">
                      {user.name}
                    </div>
                    <div
                      class={`text-xs ${user.isOnline ? "text-green-500" : "text-gray-400"}`}
                    >
                      ● {user.lastSeen}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div class="text-center py-4 text-sm text-gray-400">
                <span class="text-2xl block mb-1">💤</span>
                Belum ada yang online
              </div>
            )}
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100">
            <a
              href="/explore"
              class="text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-1"
            >
              Lihat semua member →
            </a>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 class="font-bold text-sm text-gray-500 uppercase mb-3 flex items-center gap-2">
            <span class="text-orange-500">🔥</span> Trending
          </h3>
          <div class="space-y-2">
            {sidebarData.trendingTopics.map((topic: any, idx: number) => (
              <a
                key={topic.tag}
                href={`/explore?tag=${topic.tag}`}
                class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition group"
              >
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-gray-400">
                    #{idx + 1}
                  </span>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
                    #{topic.tag}
                  </span>
                </div>
                <span class="text-xs text-gray-400">{topic.count} posts</span>
              </a>
            ))}
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 shadow-sm text-white">
          <h3 class="font-bold mb-3 flex items-center gap-2">
            <span>📅</span> Event Mendatang
          </h3>
          <div class="space-y-3">
            {sidebarData.upcomingEvents.map((event: any) => (
              <div
                key={event.id}
                class="bg-white/10 backdrop-blur rounded-xl p-3 hover:bg-white/20 transition cursor-pointer"
              >
                <div class="flex items-start gap-2">
                  <span class="text-2xl">{event.icon}</span>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm truncate">
                      {event.title}
                    </div>
                    <div class="text-xs text-white/80">{event.date}</div>
                    <div class="text-xs text-white/60 mt-1">
                      👥 {event.participants} peserta
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/competitions"
            class="block text-center bg-white text-purple-600 px-4 py-2 rounded-xl text-sm font-bold mt-3 hover:bg-purple-50 transition"
          >
            Lihat Semua Event
          </a>
        </div>

        {sidebarData.suggestedUsers.length > 0 && (
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 class="font-bold text-sm text-gray-500 uppercase mb-3">
              🌟 Sugesti untuk Kamu
            </h3>
            <div class="space-y-3">
              {sidebarData.suggestedUsers.map((user: any) => (
                <div key={user.id} class="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      class="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </div>
                    <div class="text-xs text-gray-500 truncate">
                      {user.institution}
                    </div>
                  </div>
                  <button class="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-700 transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        <div class="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 shadow-sm text-white">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🚀
            </div>
            <div>
              <h3 class="font-bold text-lg">Mulai Proyek Riset</h3>
              <p class="text-xs text-green-100">Kolaborasi bareng komunitas</p>
            </div>
          </div>
          <p class="text-sm text-green-100 mb-4">
            Punya ide eksperimen atau riset? Ajak ilmuwan muda Indonesia
            berkolaborasi!
          </p>
          <a
            href="/projects/new"
            class="block text-center bg-white text-green-600 px-4 py-3 rounded-xl font-bold hover:bg-green-50 transition"
          >
            + Buat Proyek Baru
          </a>
        </div>

        <div class="px-2 py-4 text-xs text-gray-400 space-y-2">
          <div class="flex flex-wrap gap-x-3 gap-y-1">
            <a href="/about" class="hover:underline">
              Tentang
            </a>
            <a href="/guidelines" class="hover:underline">
              Pedoman
            </a>
            <a href="/privacy" class="hover:underline">
              Privasi
            </a>
            <a href="/terms" class="hover:underline">
              Ketentuan
            </a>
            <a href="/contact" class="hover:underline">
              Kontak
            </a>
          </div>
          <div>© 2026 KF13 Community</div>
        </div>
      </div>
    </aside>
  );
});
