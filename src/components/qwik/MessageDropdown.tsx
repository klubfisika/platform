import { component$, useSignal, $ } from '@builder.io/qwik';
import { mockMessages, markAllMessagesAsRead } from '~/data/mockMessages';
import {
  MESSAGE_DROPDOWN_CONFIG,
  MESSAGE_DROPDOWN_LABELS,
  MESSAGE_DROPDOWN_STYLES,
  getUnreadMessageCount,
  formatUnreadMessageCount,
  truncateText,
  getMessageItemClass
} from '~/data/messageDropdownConfig';

export default component$(() => {
  const isOpen = useSignal(false);
  const messages = useSignal([...mockMessages]);

  const unreadCount = getUnreadMessageCount(messages.value);

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  const markAllRead = $(() => {
    messages.value = messages.value.map(m => ({ ...m, read: true }));
    markAllMessagesAsRead();
  });

  const handleMessageClick = $((message: any) => {
    if (!message.read) {
      messages.value = messages.value.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      );
    }
    // Navigate to conversation
    window.location.href = `/platform/messages/${message.from.username}`;
    closeDropdown();
  });

  return (
    <div class="relative">
      <button 
        onClick$={toggleDropdown}
        class={MESSAGE_DROPDOWN_STYLES.button}
        title={MESSAGE_DROPDOWN_LABELS.buttonTitle}
      >
        <span class={MESSAGE_DROPDOWN_STYLES.icon}>💬</span>
        {unreadCount > 0 && (
          <span class={MESSAGE_DROPDOWN_STYLES.badge}>
            {formatUnreadMessageCount(unreadCount)}
          </span>
        )}
      </button>

      {isOpen.value && (
        <>
          <div class={MESSAGE_DROPDOWN_STYLES.backdrop} onClick$={closeDropdown}></div>
          <div class={`${MESSAGE_DROPDOWN_STYLES.dropdown} ${MESSAGE_DROPDOWN_CONFIG.width} ${MESSAGE_DROPDOWN_CONFIG.maxHeight}`}>
            {/* Header */}
            <div class={MESSAGE_DROPDOWN_STYLES.header}>
              <h3 class={MESSAGE_DROPDOWN_STYLES.headerTitle}>{MESSAGE_DROPDOWN_LABELS.title}</h3>
              <div class={MESSAGE_DROPDOWN_STYLES.headerActions}>
                {unreadCount > 0 && (
                  <button 
                    onClick$={markAllRead}
                    class={MESSAGE_DROPDOWN_STYLES.markAllButton}
                  >
                    {MESSAGE_DROPDOWN_LABELS.markAllRead}
                  </button>
                )}
                <a 
                  href={MESSAGE_DROPDOWN_LABELS.writeNewHref}
                  class={MESSAGE_DROPDOWN_STYLES.writeNewButton}
                  onClick$={closeDropdown}
                >
                  {MESSAGE_DROPDOWN_LABELS.writeNew}
                </a>
              </div>
            </div>

            {/* Messages List */}
            <div class={`${MESSAGE_DROPDOWN_STYLES.scrollContainer} ${MESSAGE_DROPDOWN_CONFIG.scrollHeight}`}>
              {messages.value.length === 0 ? (
                <div class={MESSAGE_DROPDOWN_STYLES.emptyState}>
                  <span class={MESSAGE_DROPDOWN_STYLES.emptyIcon}>💬</span>
                  <p>{MESSAGE_DROPDOWN_LABELS.emptyState}</p>
                </div>
              ) : (
                messages.value.slice(0, MESSAGE_DROPDOWN_CONFIG.maxDisplayMessages).map((message) => (
                  <div
                    key={message.id}
                    onClick$={() => handleMessageClick(message)}
                    class={getMessageItemClass(message.read)}
                  >
                    <div class={MESSAGE_DROPDOWN_STYLES.messageContent}>
                      {/* Avatar */}
                      <div class={MESSAGE_DROPDOWN_STYLES.avatar}>
                        <div class={MESSAGE_DROPDOWN_STYLES.avatarCircle}>
                          {message.from.avatar}
                        </div>
                      </div>

                      {/* Content */}
                      <div class={MESSAGE_DROPDOWN_STYLES.contentContainer}>
                        <div class={MESSAGE_DROPDOWN_STYLES.contentHeader}>
                          <p class={MESSAGE_DROPDOWN_STYLES.senderName}>
                            {message.from.displayName}
                          </p>
                          <div class={MESSAGE_DROPDOWN_STYLES.timeAndStatus}>
                            <p class={MESSAGE_DROPDOWN_STYLES.time}>{message.time}</p>
                            {!message.read && (
                              <div class={MESSAGE_DROPDOWN_STYLES.unreadDot}></div>
                            )}
                          </div>
                        </div>
                        
                        {message.subject && (
                          <p class={MESSAGE_DROPDOWN_STYLES.subject}>
                            {truncateText(message.subject, MESSAGE_DROPDOWN_CONFIG.truncateLength.subject)}
                          </p>
                        )}
                        
                        <p class={MESSAGE_DROPDOWN_STYLES.message}>
                          {truncateText(message.message, MESSAGE_DROPDOWN_CONFIG.truncateLength.message)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div class={MESSAGE_DROPDOWN_STYLES.footer}>
              <a 
                href={MESSAGE_DROPDOWN_LABELS.viewAllHref}
                class={MESSAGE_DROPDOWN_STYLES.viewAllLink}
                onClick$={closeDropdown}
              >
                {MESSAGE_DROPDOWN_LABELS.viewAll}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
