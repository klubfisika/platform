import { component$, useSignal, $ } from '@builder.io/qwik';
import { mockNotifications, getNotificationIcon, getNotificationColor, markAllNotificationsAsRead } from '~/data/mockNotifications';
import {
  NOTIFICATION_DROPDOWN_CONFIG,
  NOTIFICATION_DROPDOWN_LABELS,
  NOTIFICATION_DROPDOWN_STYLES,
  getUnreadCount,
  formatUnreadCount,
  getNotificationItemClass
} from '~/data/notificationDropdownConfig';

export default component$(() => {
  const isOpen = useSignal(false);
  const notifications = useSignal([...mockNotifications]);

  const unreadCount = getUnreadCount(notifications.value);

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  const markAllRead = $(() => {
    notifications.value = notifications.value.map(n => ({ ...n, read: true }));
    markAllNotificationsAsRead();
  });

  const markAsRead = $((id: string) => {
    notifications.value = notifications.value.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
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
        class={NOTIFICATION_DROPDOWN_STYLES.button}
        title={NOTIFICATION_DROPDOWN_LABELS.buttonTitle}
      >
        <span class={NOTIFICATION_DROPDOWN_STYLES.icon}>🔔</span>
        {unreadCount > 0 && (
          <span class={NOTIFICATION_DROPDOWN_STYLES.badge}>
            {formatUnreadCount(unreadCount)}
          </span>
        )}
      </button>

      {isOpen.value && (
        <>
          {/* Backdrop - dark on mobile, transparent on desktop */}
          <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent" onClick$={closeDropdown}></div>
          
          {/* Desktop dropdown */}
          <div class={`hidden sm:block ${NOTIFICATION_DROPDOWN_STYLES.dropdown} ${NOTIFICATION_DROPDOWN_CONFIG.width} ${NOTIFICATION_DROPDOWN_CONFIG.maxHeight}`}>
            <div class={NOTIFICATION_DROPDOWN_STYLES.header}>
              <h3 class={NOTIFICATION_DROPDOWN_STYLES.headerTitle}>{NOTIFICATION_DROPDOWN_LABELS.title}</h3>
              {unreadCount > 0 && (
                <button 
                  onClick$={markAllRead}
                  class={NOTIFICATION_DROPDOWN_STYLES.markAllButton}
                >
                  {NOTIFICATION_DROPDOWN_LABELS.markAllRead}
                </button>
              )}
            </div>

            <div class={`${NOTIFICATION_DROPDOWN_STYLES.scrollContainer} ${NOTIFICATION_DROPDOWN_CONFIG.scrollHeight}`}>
              {notifications.value.length === 0 ? (
                <div class={NOTIFICATION_DROPDOWN_STYLES.emptyState}>
                  <span class={NOTIFICATION_DROPDOWN_STYLES.emptyIcon}>🔔</span>
                  <p>{NOTIFICATION_DROPDOWN_LABELS.emptyState}</p>
                </div>
              ) : (
                notifications.value.map((notification) => (
                  <div
                    key={notification.id}
                    onClick$={() => handleNotificationClick(notification)}
                    class={getNotificationItemClass(notification.read)}
                  >
                    <div class={NOTIFICATION_DROPDOWN_STYLES.notificationContent}>
                      <div class={NOTIFICATION_DROPDOWN_STYLES.avatarContainer}>
                        {notification.avatar.length === 1 ? (
                          <div class={NOTIFICATION_DROPDOWN_STYLES.avatarUser}>
                            {notification.avatar}
                          </div>
                        ) : (
                          <div class={NOTIFICATION_DROPDOWN_STYLES.avatarSystem}>
                            {notification.avatar}
                          </div>
                        )}
                      </div>

                      <div class={NOTIFICATION_DROPDOWN_STYLES.contentContainer}>
                        <div class={NOTIFICATION_DROPDOWN_STYLES.contentHeader}>
                          <span class={`text-lg ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div class={NOTIFICATION_DROPDOWN_STYLES.contentBody}>
                            <p class={NOTIFICATION_DROPDOWN_STYLES.title}>
                              {notification.title}
                            </p>
                            <p class={NOTIFICATION_DROPDOWN_STYLES.message}>
                              {notification.message}
                            </p>
                            <p class={NOTIFICATION_DROPDOWN_STYLES.time}>
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div class={NOTIFICATION_DROPDOWN_STYLES.unreadDot}></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div class={NOTIFICATION_DROPDOWN_STYLES.footer}>
              <a 
                href={NOTIFICATION_DROPDOWN_LABELS.viewAllHref}
                class={NOTIFICATION_DROPDOWN_STYLES.viewAllLink}
                onClick$={closeDropdown}
              >
                {NOTIFICATION_DROPDOWN_LABELS.viewAll}
              </a>
            </div>
          </div>

          {/* Mobile bottom sheet */}
          <div class="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300" style="padding-bottom: env(safe-area-inset-bottom, 2rem);">
            {/* Grabber bar */}
            <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
            
            {/* Header */}
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-900">{NOTIFICATION_DROPDOWN_LABELS.title}</h3>
              {unreadCount > 0 && (
                <button 
                  onClick$={markAllRead}
                  class="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {NOTIFICATION_DROPDOWN_LABELS.markAllRead}
                </button>
              )}
            </div>

            {/* Scrollable content */}
            <div class="flex-1 overflow-y-auto px-4 py-2">
              {notifications.value.length === 0 ? (
                <div class="py-12 text-center text-gray-500">
                  <span class="text-4xl mb-2 block">🔔</span>
                  <p>{NOTIFICATION_DROPDOWN_LABELS.emptyState}</p>
                </div>
              ) : (
                notifications.value.map((notification) => (
                  <div
                    key={notification.id}
                    onClick$={() => handleNotificationClick(notification)}
                    class={`flex gap-3 px-4 py-4 rounded-xl transition active:bg-gray-100 ${!notification.read ? 'bg-green-50' : ''}`}
                  >
                    <div class="flex-shrink-0">
                      {notification.avatar.length === 1 ? (
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {notification.avatar}
                        </div>
                      ) : (
                        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          {notification.avatar}
                        </div>
                      )}
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start gap-2">
                        <span class={`text-xl ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </p>
                          <p class="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <p class="text-xs text-gray-400 mt-1">
                            {notification.time}
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

            {/* Footer */}
            <div class="px-4 py-3 border-t border-gray-100 text-center flex-shrink-0">
              <a 
                href={NOTIFICATION_DROPDOWN_LABELS.viewAllHref}
                class="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick$={closeDropdown}
              >
                {NOTIFICATION_DROPDOWN_LABELS.viewAll}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
