import { component$, useSignal, $ } from "@builder.io/qwik";
// Inline notification helper functions (replaced mock import)
const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    cendol: "🍵",
    reply: "💬",
    mention: "📢",
    follow: "👤",
    thread_reply: "🔥",
    quote: "💭",
  };
  return icons[type] ?? "🔔";
};

const getNotificationColor = (type: string): string => {
  const colors: Record<string, string> = {
    cendol: "text-green-600",
    reply: "text-blue-600",
    mention: "text-orange-600",
    follow: "text-purple-600",
    thread_reply: "text-red-600",
    quote: "text-indigo-600",
  };
  return colors[type] ?? "text-gray-600";
};

export default component$(() => {
  const isOpen = useSignal(false);
  const notifications = useSignal<any[]>([]);
  const unreadCount = useSignal(0);
  const isLoading = useSignal(true);

  const loadNotifications = $(async () => {
    if (!isOpen.value) return;
    isLoading.value = true;
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        notifications.value = data.notifications;
        unreadCount.value = data.unreadCount;
      }
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
    isLoading.value = false;
  });

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      loadNotifications();
    }
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  const markAllRead = $(async () => {
    try {
      await fetch("/api/notifications?action=markAllRead", { method: "POST" });
      notifications.value = notifications.value.map((n) => ({
        ...n,
        read: true,
      }));
      unreadCount.value = 0;
    } catch (e) {
      console.error("Failed to mark all read:", e);
    }
  });

  const markAsRead = $(async (id: number) => {
    try {
      await fetch(`/api/notifications?action=markRead&id=${id}`, {
        method: "POST",
      });
      notifications.value = notifications.value.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  });

  const handleNotificationClick = $((notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
    closeDropdown();
  });

  return (
    <div class="relative">
      <button
        onClick$={toggleDropdown}
        class="relative p-2 rounded-full hover:bg-gray-100 transition"
        title="Notifications"
      >
        <span class="text-xl">🔔</span>
        {unreadCount.value > 0 && (
          <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
              <h3 class="font-semibold text-gray-900">Notifikasi</h3>
              {unreadCount.value > 0 && (
                <button
                  onClick$={markAllRead}
                  class="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div class="flex-1 overflow-y-auto">
              {isLoading.value ? (
                <div class="py-12 text-center text-gray-500">
                  <div class="animate-pulse text-4xl mb-2">🔔</div>
                  <p class="text-sm">Memuat...</p>
                </div>
              ) : notifications.value.length === 0 ? (
                <div class="py-12 text-center text-gray-500">
                  <span class="text-4xl mb-2 block">🔔</span>
                  <p class="text-sm">Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.value.map((notification) => (
                  <div
                    key={notification.id}
                    onClick$={() => handleNotificationClick(notification)}
                    class={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!notification.read ? "bg-green-50" : ""}`}
                  >
                    <div class="flex-shrink-0">
                      {notification.fromUserImage ? (
                        <img
                          src={notification.fromUserImage}
                          alt=""
                          class="w-10 h-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {notification.fromUserName?.charAt(0).toUpperCase() ||
                            "S"}
                        </div>
                      )}
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start gap-2">
                        <span
                          class={`text-lg ${getNotificationColor(notification.type)}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900 mb-0.5">
                            {notification.title}
                          </p>
                          <p class="text-xs text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div class="px-4 py-3 border-t border-gray-100 text-center flex-shrink-0">
              <a
                href="/notifications"
                class="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick$={closeDropdown}
              >
                Lihat semua notifikasi
              </a>
            </div>
          </div>

          <div class="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col">
            <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />

            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-900">Notifikasi</h3>
              {unreadCount.value > 0 && (
                <button
                  onClick$={markAllRead}
                  class="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div class="flex-1 overflow-y-auto px-4 py-2">
              {isLoading.value ? (
                <div class="py-12 text-center text-gray-500">
                  <div class="animate-pulse text-4xl mb-2">🔔</div>
                  <p>Memuat...</p>
                </div>
              ) : notifications.value.length === 0 ? (
                <div class="py-12 text-center text-gray-500">
                  <span class="text-4xl mb-2 block">🔔</span>
                  <p>Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.value.map((notification) => (
                  <div
                    key={notification.id}
                    onClick$={() => handleNotificationClick(notification)}
                    class={`flex gap-3 px-4 py-4 rounded-xl transition active:bg-gray-100 ${!notification.read ? "bg-green-50" : ""}`}
                  >
                    <div class="flex-shrink-0">
                      {notification.fromUserImage ? (
                        <img
                          src={notification.fromUserImage}
                          alt=""
                          class="w-12 h-12 rounded-full object-cover"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {notification.fromUserName?.charAt(0).toUpperCase() ||
                            "S"}
                        </div>
                      )}
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start gap-2">
                        <span
                          class={`text-xl ${getNotificationColor(notification.type)}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </p>
                          <p class="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div class="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div class="px-4 py-3 border-t border-gray-100 text-center flex-shrink-0">
              <a
                href="/notifications"
                class="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick$={closeDropdown}
              >
                Lihat semua notifikasi
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
