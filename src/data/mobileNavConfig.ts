export const MOBILE_NAV_CONFIG = {
  position: 'fixed bottom-0 left-0 right-0',
  styling: 'bg-white border-t shadow-lg z-50',
  activeColor: 'text-green-600',
  inactiveColor: 'text-gray-500'
};

export const MOBILE_NAV_ITEMS = [
  { href: '/platform/feed', label: 'Home', icon: '🏠' },
  { href: '/platform/discussions', label: 'Forum', icon: '💬' },
  { href: '/platform/shorts', label: 'Shorts', icon: '🎬' },
  { href: '/platform/projects', label: 'Projects', icon: '🔬' },
  { href: '/platform/explore', label: 'Explore', icon: '🔍' },
];

export const MOBILE_NAV_PROFILE = null; // Profile removed - accessible via ProfileDropdown

export const MOBILE_NAV_LABELS = {
  ariaLabel: 'Mobile Navigation'
};

// Utility function for active state
export const getMobileNavItemClass = (isActive: boolean) => 
  `flex flex-col items-center py-1 px-3 rounded-lg transition ${
    isActive ? MOBILE_NAV_CONFIG.activeColor : MOBILE_NAV_CONFIG.inactiveColor
  }`;
