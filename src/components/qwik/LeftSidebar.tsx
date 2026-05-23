import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import {
  LEFT_SIDEBAR_CONFIG,
  LEFT_SIDEBAR_NAV_ITEMS,
  LEFT_SIDEBAR_TRENDING_TOPICS,
  LEFT_SIDEBAR_LABELS,
  LEFT_SIDEBAR_STYLES,
  getSidebarState,
  setSidebarState,
  getNavItemClass,
} from "~/data/leftSidebarConfig";

interface Props {
  activeNav?: string;
}

export default component$<Props>(({ activeNav }) => {
  const isMinimized = useSignal(false);

  useTask$(() => {
    isMinimized.value = getSidebarState();
  });

  const toggleSidebar = $(() => {
    isMinimized.value = !isMinimized.value;
    setSidebarState(isMinimized.value);
  });

  return (
    <aside
      class={`${LEFT_SIDEBAR_CONFIG.position} ${LEFT_SIDEBAR_CONFIG.styling} ${
        isMinimized.value
          ? LEFT_SIDEBAR_CONFIG.width.minimized
          : LEFT_SIDEBAR_CONFIG.width.expanded
      }`}
    >
      {/* Main Nav */}
      <div
        class={`${LEFT_SIDEBAR_STYLES.container} ${isMinimized.value ? LEFT_SIDEBAR_STYLES.containerMinimized : ""}`}
      >
        <nav class={LEFT_SIDEBAR_STYLES.nav}>
          {LEFT_SIDEBAR_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              class={getNavItemClass(
                activeNav === item.href,
                isMinimized.value,
              )}
              title={isMinimized.value ? item.label : undefined}
            >
              <span
                class={
                  isMinimized.value
                    ? LEFT_SIDEBAR_STYLES.iconMinimized
                    : LEFT_SIDEBAR_STYLES.iconExpanded
                }
              >
                {item.icon}
              </span>
              {!isMinimized.value && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {!isMinimized.value && (
          <>
            <hr class={LEFT_SIDEBAR_STYLES.separator} />

            <div class={LEFT_SIDEBAR_STYLES.trendingHeader}>
              {LEFT_SIDEBAR_LABELS.trending}
            </div>
            <div class={LEFT_SIDEBAR_STYLES.trendingContainer}>
              {LEFT_SIDEBAR_TRENDING_TOPICS.map((topic) => (
                <a
                  key={topic}
                  href="#"
                  class={LEFT_SIDEBAR_STYLES.trendingItem}
                >
                  {topic}
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div
        class={`${LEFT_SIDEBAR_STYLES.bottomSection} ${isMinimized.value ? LEFT_SIDEBAR_STYLES.bottomSectionMinimized : ""}`}
      >
        {!isMinimized.value && (
          <a href="/" class={LEFT_SIDEBAR_STYLES.backLink}>
            <span>🌐</span> {LEFT_SIDEBAR_LABELS.backToWebsite}
          </a>
        )}

        {isMinimized.value && (
          <a
            href="/"
            class={LEFT_SIDEBAR_STYLES.backLinkMinimized}
            title={LEFT_SIDEBAR_LABELS.backToWebsite}
          >
            <span>🌐</span>
          </a>
        )}

        {/* Toggle Button */}
        <button
          onClick$={toggleSidebar}
          class={`${LEFT_SIDEBAR_STYLES.toggleButton} ${
            isMinimized.value
              ? LEFT_SIDEBAR_STYLES.toggleButtonMinimized
              : LEFT_SIDEBAR_STYLES.toggleButtonExpanded
          }`}
          title={
            isMinimized.value
              ? LEFT_SIDEBAR_LABELS.expandTitle
              : LEFT_SIDEBAR_LABELS.minimizeTitle
          }
        >
          <span
            class={`${LEFT_SIDEBAR_STYLES.toggleIcon} ${isMinimized.value ? LEFT_SIDEBAR_STYLES.toggleIconRotated : ""}`}
          >
            «
          </span>
          {!isMinimized.value && <span>{LEFT_SIDEBAR_LABELS.minimize}</span>}
        </button>
      </div>
    </aside>
  );
});
