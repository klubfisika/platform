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
    window.location.href = `/messages/${message.from.username}`;
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
          {/* Backdrop - dark on mobile, transparent on desktop */}
          <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent" onClick$={closeDropdown}></div>
          
          {/* Desktop dropdown */}
          <div class={`hidden sm:block ${MESSAGE_DROPDOWN_STYLES.dropdown} ${MESSAGE_DROPDOWN_CONFIG.width} ${MESSAGE_DROPDOWN_CONFIG.maxHeight}`}>
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

          {/* Mobile bottom sheet */}
          <div class="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300" style="padding-bottom: env(safe-area-inset-bottom, 2rem);">
            {/* Grabber bar */}
            <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
            
            {/* Header */}
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-900">{MESSAGE_DROPDOWN_LABELS.title}</h3>
              <div class="flex gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick$={markAllRead}
                    class="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {MESSAGE_DROPDOWN_LABELS.markAllRead}
                  </button>
                )}
                <a 
                  href={MESSAGE_DROPDOWN_LABELS.writeNewHref}
                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick$={closeDropdown}
                >
                  {MESSAGE_DROPDOWN_LABELS.writeNew}
                </a>
              </div>
            </div>

            {/* Scrollable content */}
            <div class="flex-1 overflow-y-auto px-4 py-2">
              {messages.value.length === 0 ? (
                <div class="py-12 text-center text-gray-500">
                  <span class="text-4xl mb-2 block">💬</span>
                  <p>{MESSAGE_DROPDOWN_LABELS.emptyState}</p>
                </div>
              ) : (
                messages.value.slice(0, MESSAGE_DROPDOWN_CONFIG.maxDisplayMessages).map((message) => (
                  <div
                    key={message.id}
                    onClick$={() => handleMessageClick(message)}
                    class={`flex gap-3 px-4 py-4 rounded-xl transition active:bg-gray-100 ${!message.read ? 'bg-green-50' : ''}`}
                  >
                    {/* Avatar */}
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {message.from.avatar}
                      </div>
                    </div>

                    {/* Content */}
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <p class="text-sm font-medium text-gray-900">
                          {message.from.displayName}
                        </p>
                        <div class="flex items-center gap-2">
                          <p class="text-xs text-gray-400">{message.time}</p>
                          {!message.read && (
                            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      {message.subject && (
                        <p class="text-sm font-medium text-gray-700 mb-1">
                          {truncateText(message.subject, MESSAGE_DROPDOWN_CONFIG.truncateLength.subject)}
                        </p>
                      )}
                      
                      <p class="text-sm text-gray-600 line-clamp-2">
                        {truncateText(message.message, MESSAGE_DROPDOWN_CONFIG.truncateLength.message)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div class="px-4 py-3 border-t border-gray-100 text-center flex-shrink-0">
              <a 
                href={MESSAGE_DROPDOWN_LABELS.viewAllHref}
                class="text-sm text-green-600 hover:text-green-700 font-medium"
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
