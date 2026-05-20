export const LEFT_SIDEBAR_CONFIG = {
  width: {
    expanded: 'w-64',
    minimized: 'w-16'
  },
  position: 'hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100vh-3.5rem)]',
  styling: 'bg-gray-50 border-r border-gray-100 z-10 transition-all duration-300',
  storageKey: 'sidebar-minimized'
};

export const LEFT_SIDEBAR_NAV_ITEMS = [
  { href: '/platform/feed', label: 'Home', icon: '🏠' },
  { href: '/platform/discussions', label: 'Forum', icon: '💬' },
  { href: '/platform/projects', label: 'Projects', icon: '🔬' },
  { href: '/platform/shorts', label: 'Shorts', icon: '🎬' },
  { href: '/platform/explore', label: 'Explore', icon: '🔍' },
];

export const LEFT_SIDEBAR_TRENDING_TOPICS = [
  '#osn-fisika-2026',
  '#diy-eksperimen', 
  '#quantum-computing',
  '#arduino-physics',
];

export const LEFT_SIDEBAR_LABELS = {
  trending: 'Trending',
  backToWebsite: 'Kembali ke Website',
  minimize: 'Minimize',
  expandTitle: 'Expand sidebar',
  minimizeTitle: 'Minimize sidebar'
};

export const LEFT_SIDEBAR_STYLES = {
  container: 'flex-1 p-3',
  containerMinimized: 'px-2',
  nav: 'space-y-1',
  navItem: 'flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition',
  navItemMinimized: 'justify-center px-0',
  navItemExpanded: 'px-3',
  navItemActive: 'bg-green-100 text-green-700',
  navItemInactive: 'text-gray-700 hover:bg-gray-200',
  iconExpanded: 'text-lg',
  iconMinimized: 'text-xl',
  separator: 'my-4 border-gray-100',
  trendingHeader: 'px-3 text-xs font-semibold text-gray-400 uppercase mb-2',
  trendingContainer: 'space-y-0.5',
  trendingItem: 'block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg truncate',
  bottomSection: 'border-t border-gray-100 p-3',
  bottomSectionMinimized: 'px-2',
  backLink: 'flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-lg transition',
  backLinkMinimized: 'flex justify-center py-2 text-gray-500 hover:bg-gray-200 rounded-lg transition',
  toggleButton: 'mt-2 w-full flex items-center gap-2 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-lg transition',
  toggleButtonMinimized: 'justify-center',
  toggleButtonExpanded: 'px-3',
  toggleIcon: 'transition-transform duration-300',
  toggleIconRotated: 'rotate-180'
};

// Utility functions
export const getSidebarState = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LEFT_SIDEBAR_CONFIG.storageKey) === 'true';
};

export const setSidebarState = (minimized: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEFT_SIDEBAR_CONFIG.storageKey, String(minimized));
  window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: minimized }));
};

export const getNavItemClass = (isActive: boolean, isMinimized: boolean) => {
  const baseClass = LEFT_SIDEBAR_STYLES.navItem;
  const sizeClass = isMinimized ? LEFT_SIDEBAR_STYLES.navItemMinimized : LEFT_SIDEBAR_STYLES.navItemExpanded;
  const stateClass = isActive ? LEFT_SIDEBAR_STYLES.navItemActive : LEFT_SIDEBAR_STYLES.navItemInactive;
  return `${baseClass} ${sizeClass} ${stateClass}`;
};
