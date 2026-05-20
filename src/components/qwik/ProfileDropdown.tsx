import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import {
  PROFILE_DROPDOWN_CONFIG,
  PROFILE_DROPDOWN_MENU_ITEMS,
  PROFILE_DROPDOWN_LABELS,
  PROFILE_DROPDOWN_STYLES,
  getUserInitial,
  getUserData
} from '~/data/profileDropdownConfig';

export default component$(() => {
  const isOpen = useSignal(false);
  const user = useSignal<{ name: string; username: string } | null>(null);
  
  useVisibleTask$(() => {
    user.value = getUserData();
  });

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  const logout = $(() => {
    localStorage.removeItem('kf13-member');
    window.location.href = PROFILE_DROPDOWN_LABELS.loginHref;
  });

  // Show login button if no user
  if (!user.value) {
    return (
      <a href={PROFILE_DROPDOWN_LABELS.loginHref} class={PROFILE_DROPDOWN_STYLES.loginButton}>
        {PROFILE_DROPDOWN_LABELS.loginButton}
      </a>
    );
  }

  return (
    <div class="relative">
      <button 
        onClick$={toggleDropdown}
        class={PROFILE_DROPDOWN_STYLES.profileButton}
        aria-label={PROFILE_DROPDOWN_LABELS.profileMenuAria}
      >
        <div class={`${PROFILE_DROPDOWN_STYLES.avatar} ${PROFILE_DROPDOWN_CONFIG.avatarBg}`}>
          {getUserInitial(user.value.name)}
        </div>
      </button>
      
      {isOpen.value && (
        <>
          {/* Backdrop */}
          <div 
            class={PROFILE_DROPDOWN_STYLES.backdrop}
            onClick$={closeDropdown}
          />
          
          {/* Dropdown */}
          <div class={`${PROFILE_DROPDOWN_STYLES.dropdown} ${PROFILE_DROPDOWN_CONFIG.dropdownWidth} ${PROFILE_DROPDOWN_CONFIG.animation}`}>
            <div class={PROFILE_DROPDOWN_STYLES.userInfo}>
              <div class={PROFILE_DROPDOWN_STYLES.userName}>{user.value.name}</div>
              <div class={PROFILE_DROPDOWN_STYLES.userHandle}>@{user.value.username}</div>
            </div>
            
            {PROFILE_DROPDOWN_MENU_ITEMS.map(item => (
              <a 
                key={item.label}
                href={item.type === 'dynamic' ? item.href(user.value!.username) : item.href}
                class={PROFILE_DROPDOWN_STYLES.menuItem}
                onClick$={closeDropdown}
              >
                <span>{item.icon}</span> {item.label}
              </a>
            ))}
            
            <hr class={PROFILE_DROPDOWN_STYLES.separator} />
            
            <button 
              onClick$={logout}
              class={PROFILE_DROPDOWN_STYLES.logoutButton}
            >
              <span>{PROFILE_DROPDOWN_LABELS.logoutIcon}</span> {PROFILE_DROPDOWN_LABELS.logoutLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
});
