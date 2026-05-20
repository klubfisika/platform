export const NOTIFICATION_DROPDOWN_CONFIG = {
  width: 'w-80',
  maxHeight: 'max-h-96',
  scrollHeight: 'max-h-80',
  animation: 'animate-in fade-in slide-in-from-top-2 duration-200'
};

export const NOTIFICATION_DROPDOWN_LABELS = {
  title: 'Notifikasi',
  buttonTitle: 'Notifikasi',
  markAllRead: 'Tandai Semua Dibaca',
  viewAll: 'Lihat Semua Notifikasi',
  viewAllHref: '/platform/notifications',
  emptyState: 'Belum ada notifikasi',
  unreadCountMax: '9+'
};

export const NOTIFICATION_DROPDOWN_STYLES = {
  button: 'p-2 hover:bg-gray-200 rounded-full relative transition',
  icon: 'text-xl',
  badge: 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold',
  backdrop: 'fixed inset-0 z-40',
  dropdown: 'absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden',
  header: 'p-4 border-b border-gray-100 flex items-center justify-between',
  headerTitle: 'font-semibold text-gray-900',
  markAllButton: 'text-sm text-green-600 hover:text-green-700 font-medium',
  scrollContainer: 'overflow-y-auto',
  emptyState: 'p-8 text-center text-gray-500',
  emptyIcon: 'text-4xl mb-2 block',
  notificationItem: 'p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition',
  notificationUnread: 'bg-blue-50',
  notificationContent: 'flex gap-3',
  avatarContainer: 'flex-shrink-0',
  avatarUser: 'w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm',
  avatarSystem: 'w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg',
  contentContainer: 'flex-1 min-w-0',
  contentHeader: 'flex items-start gap-2',
  contentBody: 'flex-1',
  title: 'text-sm font-medium text-gray-900 mb-1',
  message: 'text-sm text-gray-600 line-clamp-2',
  time: 'text-xs text-gray-400 mt-1',
  unreadDot: 'w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1',
  footer: 'p-3 border-t border-gray-100 text-center',
  viewAllLink: 'text-sm text-green-600 hover:text-green-700 font-medium'
};

// Utility functions
export const getUnreadCount = (notifications: any[]) => 
  notifications.filter(n => !n.read).length;

export const formatUnreadCount = (count: number) => 
  count > 9 ? NOTIFICATION_DROPDOWN_LABELS.unreadCountMax : count.toString();

export const getNotificationItemClass = (isRead: boolean) => 
  `${NOTIFICATION_DROPDOWN_STYLES.notificationItem} ${!isRead ? NOTIFICATION_DROPDOWN_STYLES.notificationUnread : ''}`;
