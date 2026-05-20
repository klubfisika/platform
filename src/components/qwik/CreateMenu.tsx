import { component$, useSignal, $ } from '@builder.io/qwik';

const createOptions = [
  { href: '/platform/feed?compose=true', label: 'Buat Post', icon: '📝', desc: 'Bagikan pemikiran atau pertanyaan' },
  { href: '/platform/projects/new', label: 'Buat Project', icon: '🔬', desc: 'Mulai proyek sains baru' },
  { href: '/platform/discussions/new', label: 'Buat Diskusi', icon: '💬', desc: 'Mulai thread diskusi' },
];

export default component$(() => {
  const isOpen = useSignal(false);

  const toggleDropdown = $(() => {
    isOpen.value = !isOpen.value;
  });

  const closeDropdown = $(() => {
    isOpen.value = false;
  });

  return (
    <div class="relative">
      <button 
        onClick$={toggleDropdown}
        class="hidden sm:flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition"
      >
        ✨ Buat
      </button>

      {/* Mobile button */}
      <button 
        onClick$={toggleDropdown}
        class="sm:hidden p-2 hover:bg-gray-200 rounded-full transition"
        title="Buat"
      >
        <span class="text-xl">✨</span>
      </button>

      {isOpen.value && (
        <>
          <div class="fixed inset-0 z-40" onClick$={closeDropdown} />
          
          <div class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            {createOptions.map(option => (
              <a
                key={option.href}
                href={option.href}
                class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                onClick$={closeDropdown}
              >
                <span class="text-xl">{option.icon}</span>
                <div>
                  <p class="text-sm font-medium text-gray-900">{option.label}</p>
                  <p class="text-xs text-gray-500">{option.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
