export const MESSAGE_DROPDOWN_CONFIG = {
  width: 'w-80',
  maxHeight: 'max-h-96',
  scrollHeight: 'max-h-80',
  maxDisplayMessages: 5,
  truncateLength: {
    message: 50,
    subject: 35
  }
};

export const MESSAGE_DROPDOWN_LABELS = {
  title: 'Pesan',
  buttonTitle: 'Pesan',
  markAllRead: 'Tandai Dibaca',
  writeNew: 'Tulis Baru',
  writeNewHref: '/platform/messages/new',
  viewAll: 'Lihat Semua Pesan',
  viewAllHref: '/platform/messages',
  emptyState: 'Belum ada pesan',
  unreadCountMax: '9+'
};

export const MESSAGE_DROPDOWN_STYLES = {
  button: 'p-2 hover:bg-gray-200 rounded-full relative transition',
  icon: 'text-xl',
  badge: 'absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold',
  backdrop: 'fixed inset-0 z-40',
  dropdown: 'absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden',
  header: 'p-4 border-b border-gray-100 flex items-center justify-between',
  headerTitle: 'font-semibold text-gray-900',
  headerActions: 'flex gap-2',
  markAllButton: 'text-sm text-green-600 hover:text-green-700 font-medium',
  writeNewButton: 'text-sm text-blue-600 hover:text-blue-700 font-medium',
  scrollContainer: 'overflow-y-auto',
  emptyState: 'p-8 text-center text-gray-500',
  emptyIcon: 'text-4xl mb-2 block',
  messageItem: 'p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition',
  messageUnread: 'bg-green-50',
  messageContent: 'flex gap-3',
  avatar: 'flex-shrink-0',
  avatarCircle: 'w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm',
  contentContainer: 'flex-1 min-w-0',
  contentHeader: 'flex items-center justify-between',
  senderName: 'text-sm font-medium text-gray-900',
  timeAndStatus: 'flex items-center gap-2',
  time: 'text-xs text-gray-400',
  unreadDot: 'w-2 h-2 bg-green-500 rounded-full',
  subject: 'text-sm font-medium text-gray-700 mt-1',
  message: 'text-sm text-gray-600 mt-1',
  footer: 'p-3 border-t border-gray-100 text-center',
  viewAllLink: 'text-sm text-green-600 hover:text-green-700 font-medium'
};

// Utility functions
export const getUnreadMessageCount = (messages: any[]) => 
  messages.filter(m => !m.read).length;

export const formatUnreadMessageCount = (count: number) => 
  count > 9 ? MESSAGE_DROPDOWN_LABELS.unreadCountMax : count.toString();

export const truncateText = (text: string, maxLength: number): string => 
  text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

export const getMessageItemClass = (isRead: boolean) => 
  `${MESSAGE_DROPDOWN_STYLES.messageItem} ${!isRead ? MESSAGE_DROPDOWN_STYLES.messageUnread : ''}`;
