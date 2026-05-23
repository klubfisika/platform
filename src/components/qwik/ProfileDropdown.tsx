import { component$, useSignal, $ } from "@builder.io/qwik";
import { useAuth } from "~/lib/auth";
import {
  PROFILE_DROPDOWN_CONFIG,
  PROFILE_DROPDOWN_MENU_ITEMS,
  PROFILE_DROPDOWN_LABELS,
  PROFILE_DROPDOWN_STYLES,
  getUserInitial,
} from "~/data/profileDropdownConfig";

export default component$(() => {
  const isOpen = useSignal(false);
  const user = useAuth();

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  const logout = $(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      console.error("Logout failed");
    }
    window.location.href = "/login";
  });

  if (!user.value) {
    return (
      <a
        href={PROFILE_DROPDOWN_LABELS.loginHref}
        class={PROFILE_DROPDOWN_STYLES.loginButton}
      >
        {PROFILE_DROPDOWN_LABELS.loginButton}
      </a>
    );
  }

  const username =
    user.value.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") || "member";

  return (
    <div class="relative">
      <button
        onClick$={toggleDropdown}
        class={PROFILE_DROPDOWN_STYLES.profileButton}
        aria-label={PROFILE_DROPDOWN_LABELS.profileMenuAria}
      >
        <div
          class={`${PROFILE_DROPDOWN_STYLES.avatar} ${PROFILE_DROPDOWN_CONFIG.avatarBg}`}
        >
          {getUserInitial(user.value.name)}
        </div>
      </button>

      {isOpen.value && (
        <>
          {/* Backdrop - dark on mobile, transparent on desktop */}
          <div
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent"
            onClick$={closeDropdown}
          />

          {/* Desktop dropdown */}
          <div
            class={`hidden sm:block ${PROFILE_DROPDOWN_STYLES.dropdown} ${PROFILE_DROPDOWN_CONFIG.dropdownWidth} ${PROFILE_DROPDOWN_CONFIG.animation}`}
          >
            <div class={PROFILE_DROPDOWN_STYLES.userInfo}>
              <div class={PROFILE_DROPDOWN_STYLES.userName}>
                {user.value.name}
              </div>
              <div class={PROFILE_DROPDOWN_STYLES.userHandle}>@{username}</div>
            </div>

            {PROFILE_DROPDOWN_MENU_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.type === "dynamic" ? item.href(username) : item.href}
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
              <span>{PROFILE_DROPDOWN_LABELS.logoutIcon}</span>{" "}
              {PROFILE_DROPDOWN_LABELS.logoutLabel}
            </button>
          </div>

          {/* Mobile bottom sheet */}
          <div
            class="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 py-4 pb-8 border-t border-gray-100 animate-in slide-in-from-bottom duration-300"
            style="padding-bottom: env(safe-area-inset-bottom, 2rem);"
          >
            {/* Grabber bar */}
            <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div class="px-4">
              {/* User info header */}
              <div class="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                <div
                  class={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow ${PROFILE_DROPDOWN_CONFIG.avatarBg}`}
                >
                  {getUserInitial(user.value.name)}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{user.value.name}</p>
                  <p class="text-sm text-gray-500">@{username}</p>
                </div>
              </div>

              {/* Menu items */}
              {PROFILE_DROPDOWN_MENU_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={
                    item.type === "dynamic" ? item.href(username) : item.href
                  }
                  class="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 rounded-xl transition active:bg-gray-100"
                  onClick$={closeDropdown}
                >
                  <span class="text-xl">{item.icon}</span>
                  <span class="text-base font-medium text-gray-900">
                    {item.label}
                  </span>
                </a>
              ))}

              <hr class="my-2 border-gray-100" />

              <button
                onClick$={logout}
                class="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-50 rounded-xl transition active:bg-red-100 text-red-600"
              >
                <span class="text-xl">
                  {PROFILE_DROPDOWN_LABELS.logoutIcon}
                </span>
                <span class="text-base font-medium">
                  {PROFILE_DROPDOWN_LABELS.logoutLabel}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
