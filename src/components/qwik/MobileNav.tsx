import { component$ } from '@builder.io/qwik';
import { 
  MOBILE_NAV_CONFIG,
  MOBILE_NAV_ITEMS,
  MOBILE_NAV_PROFILE,
  MOBILE_NAV_LABELS,
  getMobileNavItemClass
} from '~/data/mobileNavConfig';

interface Props {
  activeNav?: string;
}

export default component$<Props>(({ activeNav }) => {
  return (
    <nav class={`lg:hidden ${MOBILE_NAV_CONFIG.position} ${MOBILE_NAV_CONFIG.styling}`} aria-label={MOBILE_NAV_LABELS.ariaLabel}>
      <div class="flex justify-around py-2">
        {MOBILE_NAV_ITEMS.map(item => (
          <a 
            key={item.href}
            href={item.href} 
            class={getMobileNavItemClass(activeNav === item.href)}
          >
            <span class="text-xl">{item.icon}</span>
            <span class="text-xs mt-0.5">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
});
