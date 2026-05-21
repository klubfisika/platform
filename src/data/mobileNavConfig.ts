export const MOBILE_NAV_CONFIG = {
  position: 'fixed bottom-0 left-0 right-0',
  styling: 'bg-white/80 backdrop-blur-md border-t border-gray-200/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50',
  activeColor: 'text-green-600',
  inactiveColor: 'text-gray-500',
  safeAreaPadding: 'pb-4 sm:pb-2'
};

export const MOBILE_NAV_ITEMS = [
  { href: '/feed', label: 'Home', icon: '🏠' },
  { href: '/discussions', label: 'Forum', icon: '💬' },
  { href: '/competitions', label: 'Kompetisi', icon: '🏆' },
  { href: '/shorts', label: 'Shorts', icon: '🎬' },
  { href: '/projects', label: 'Projects', icon: '🔬' },
];

export const MOBILE_NAV_PROFILE = null; // Profile removed - accessible via ProfileDropdown

export const MOBILE_NAV_LABELS = {
  ariaLabel: 'Mobile Navigation'
};

// Utility function for active state with native-style scaling
export const getMobileNavItemClass = (isActive: boolean) => 
  `flex flex-col items-center py-1.5 px-4 rounded-xl transition-all duration-200 ${
    isActive 
      ? `${MOBILE_NAV_CONFIG.activeColor} scale-105` 
      : `${MOBILE_NAV_CONFIG.inactiveColor} active:scale-95`
  }`;
