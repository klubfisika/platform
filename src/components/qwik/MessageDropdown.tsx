import { component$, useSignal, $ } from "@builder.io/qwik";

export default component$(() => {
  const isOpen = useSignal(false);
  const conversations = useSignal<any[]>([]);
  const unreadCount = useSignal(0);
  const isLoading = useSignal(true);

  const loadMessages = $(async () => {
    if (!isOpen.value) return;
    isLoading.value = true;
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.conversations) {
        conversations.value = data.conversations;
        unreadCount.value = data.unreadCount;
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    }
    isLoading.value = false;
  });

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      loadMessages();
    }
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  const handleConversationClick = $((conv: any) => {
    window.location.href = `/messages/${conv.otherUserId}`;
    closeDropdown();
  });

  return (
    <div class="relative">
      <button
        onClick$={toggleDropdown}
        class="relative p-2 rounded-full hover:bg-gray-100 transition"
        title="Messages"
      >
        <span class="text-xl">💬</span>
        {unreadCount.value > 0 && (
          <span class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount.value > 9 ? "9+" : unreadCount.value}
          </span>
        )}
      </button>

      {isOpen.value && (
        <>
          <div
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent"
            onClick$={closeDropdown}
          ></div>

          <div class="hidden sm:block absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-hidden flex flex-col">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 class="font-semibold text-gray-900">Pesan</h3>
              <a
                href="/messages/new"
                class="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                + Pesan baru
              </a>
            </div>

            <div class="flex-1 overflow-y-auto">
              {isLoading.value ? (
                <div class="py-12 text-center text-gray-500">
                  <div class="animate-pulse text-4xl mb-2">💬</div>
                  <p class="text-sm">Memuat...</p>
                </div>
              ) : conversations.value.length === 0 ? (
                <div class="py-12 text-center text-gray-500">
                  <span class="text-4xl mb-2 block">💬</span>
                  <p class="text-sm">Tidak ada pesan</p>
                  <a
                    href="/messages/new"
                    class="text-sm text-green-600 hover:text-green-700 font-medium mt-2 inline-block"
                  >
                    Mulai percakapan
                  </a>
                </div>
              ) : (
                conversations.value.map((conv) => (
                  <div
                    key={conv.id}
                    onClick$={() => handleConversationClick(conv)}
                    class={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${conv.unreadCount > 0 ? "bg-blue-50" : ""}`}
                  >
                    <div class="flex-shrink-0">
                      {conv.otherUserImage ? (
                        <img
                          src={conv.otherUserImage}
                          alt=""
                          class="w-10 h-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {conv.otherUserName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-0.5">
                        <p class="text-sm font-semibold text-gray-900 truncate">
                          {conv.otherUserName}
                        </p>
                        {conv.lastMessageAt && (
                          <span class="text-xs text-gray-400">
                            {formatTimeAgo(conv.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p class="text-xs text-gray-500 truncate">
                        {conv.lastMessage || "Belum ada pesan"}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <div class="flex-shrink-0 self-center">
                        <span class="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div class="px-4 py-3 border-t border-gray-100 text-center flex-shrink-0">
              <a
                href="/messages"
                class="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick$={closeDropdown}
              >
                Lihat semua pesan
              </a>
            </div>
          </div>

          <div class="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col">
            <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-900">Pesan</h3>
              <a
                href="/messages/new"
                class="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                + Baru
              </a>
            </div>

            <div class="flex-1 overflow-y-auto px-4 py-2">
              {isLoading.value ? (
                <div class="py-12 text-center text-gray-500">
                  <div class="animate-pulse text-4xl mb-2">💬</div>
                  <p>Memuat...</p>
                </div>
              ) : conversations.value.length === 0 ? (
                <div class="py-12 text-center text-gray-500">
                  <span class="text-4xl mb-2 block">💬</span>
                  <p>Tidak ada pesan</p>
                  <a
                    href="/messages/new"
                    class="text-sm text-green-600 hover:text-green-700 font-medium mt-2 inline-block"
                  >
                    Mulai percakapan
                  </a>
                </div>
              ) : (
                conversations.value.map((conv) => (
                  <div
                    key={conv.id}
                    onClick$={() => handleConversationClick(conv)}
                    class={`flex gap-3 px-4 py-4 rounded-xl transition active:bg-gray-100 ${conv.unreadCount > 0 ? "bg-blue-50" : ""}`}
                  >
                    <div class="flex-shrink-0">
                      {conv.otherUserImage ? (
                        <img
                          src={conv.otherUserImage}
                          alt=""
                          class="w-12 h-12 rounded-full object-cover"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {conv.otherUserName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <p class="text-sm font-semibold text-gray-900 truncate">
                          {conv.otherUserName}
                        </p>
                        {conv.lastMessageAt && (
                          <span class="text-xs text-gray-400">
                            {formatTimeAgo(conv.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p class="text-sm text-gray-500 truncate">
                        {conv.lastMessage || "Belum ada pesan"}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span class="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div class="px-4 py-3 border-t border-gray-100 text-center flex-shrink-0">
              <a
                href="/messages"
                class="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick$={closeDropdown}
              >
                Lihat semua pesan
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "Baru";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j`;
  return `${Math.floor(hours / 24)}h`;
}
