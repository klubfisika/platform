import { component$ } from '@builder.io/qwik';
import { 
  MOBILE_NAV_CONFIG,
  MOBILE_NAV_ITEMS,
  MOBILE_NAV_LABELS,
  getMobileNavItemClass
} from '~/data/mobileNavConfig';

interface Props {
  activeNav?: string;
}

export default component$<Props>(({ activeNav }) => {
  return (
    <nav 
      class={`lg:hidden ${MOBILE_NAV_CONFIG.position} ${MOBILE_NAV_CONFIG.styling} ${MOBILE_NAV_CONFIG.safeAreaPadding}`} 
      aria-label={MOBILE_NAV_LABELS.ariaLabel}
      style="padding-bottom: env(safe-area-inset-bottom, 1rem);"
    >
      <div class="flex justify-around items-center py-2">
        {MOBILE_NAV_ITEMS.map(item => (
          <a 
            key={item.href}
            href={item.href} 
            class={getMobileNavItemClass(activeNav === item.href)}
          >
            <span class="text-xl transition-transform duration-200">{item.icon}</span>
            <span class="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
});
