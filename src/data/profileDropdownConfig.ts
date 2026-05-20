export const PROFILE_DROPDOWN_CONFIG = {
  avatarBg: 'bg-gradient-to-br from-green-500 to-teal-500',
  dropdownWidth: 'w-48',
  animation: 'animate-in fade-in slide-in-from-top-2 duration-200'
};

export const PROFILE_DROPDOWN_MENU_ITEMS = [
  { 
    href: '/platform/profile', 
    label: 'Profil Saya', 
    icon: '👤',
    type: 'link' as const
  },
  { 
    href: (username: string) => `/${username}`, 
    label: 'Profil Publik', 
    icon: '🔗',
    type: 'dynamic' as const
  },
  { 
    href: '/platform/overview', 
    label: 'Overview', 
    icon: '📊',
    type: 'link' as const
  }
];

export const PROFILE_DROPDOWN_LABELS = {
  loginButton: 'Masuk',
  loginHref: '/mulai',
  profileMenuAria: 'Profile menu',
  logoutLabel: 'Logout',
  logoutIcon: '🚪'
};

export const PROFILE_DROPDOWN_STYLES = {
  loginButton: 'bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition',
  profileButton: 'flex items-center gap-2 p-1 rounded-full transition hover:ring-2 hover:ring-gray-200',
  avatar: 'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow',
  backdrop: 'fixed inset-0 z-40',
  dropdown: 'absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50',
  userInfo: 'px-4 py-2 border-b border-gray-100',
  userName: 'font-medium text-gray-900 truncate',
  userHandle: 'text-sm text-gray-500',
  menuItem: 'flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition',
  separator: 'my-2 border-gray-100',
  logoutButton: 'w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition text-left'
};

// Utility functions
export const getUserInitial = (name: string) => name[0]?.toUpperCase() || 'M';

export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  const member = localStorage.getItem('kf13-member');
  if (!member) return null;
  
  const userData = JSON.parse(member);
  return {
    name: userData.name || 'Member',
    username: userData.username || userData.name?.toLowerCase().replace(/\s+/g, '_') || 'member'
  };
};
