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
          <div class={NOTIFICATION_DROPDOWN_STYLES.backdrop} onClick$={closeDropdown}></div>
          <div class={`${NOTIFICATION_DROPDOWN_STYLES.dropdown} ${NOTIFICATION_DROPDOWN_CONFIG.width} ${NOTIFICATION_DROPDOWN_CONFIG.maxHeight}`}>
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
        </>
      )}
    </div>
  );
});
