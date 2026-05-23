import { component$, useSignal, $ } from "@builder.io/qwik";

const createOptions = [
  {
    href: "/feed?compose=true",
    label: "Buat Post",
    icon: "📝",
    desc: "Bagikan pemikiran atau pertanyaan",
  },
  {
    href: "/projects/new",
    label: "Buat Project",
    icon: "🔬",
    desc: "Mulai proyek sains baru",
  },
  {
    href: "/discussions/new",
    label: "Buat Diskusi",
    icon: "💬",
    desc: "Mulai thread diskusi",
  },
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
          {/* Backdrop - dark on mobile, transparent on desktop */}
          <div
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent"
            onClick$={closeDropdown}
          />

          {/* Desktop dropdown */}
          <div class="hidden sm:block absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {createOptions.map((option) => (
              <a
                key={option.href}
                href={option.href}
                class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                onClick$={closeDropdown}
              >
                <span class="text-xl">{option.icon}</span>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {option.label}
                  </p>
                  <p class="text-xs text-gray-500">{option.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile bottom sheet */}
          <div
            class="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 py-4 pb-8 border-t border-gray-100 animate-in slide-in-from-bottom duration-300"
            style="padding-bottom: env(safe-area-inset-bottom, 2rem);"
          >
            {/* Grabber bar */}
            <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div class="px-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                Buat Baru
              </h3>
              {createOptions.map((option) => (
                <a
                  key={option.href}
                  href={option.href}
                  class="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 rounded-xl transition active:bg-gray-100"
                  onClick$={closeDropdown}
                >
                  <span class="text-2xl">{option.icon}</span>
                  <div>
                    <p class="text-base font-medium text-gray-900">
                      {option.label}
                    </p>
                    <p class="text-sm text-gray-500">{option.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});
