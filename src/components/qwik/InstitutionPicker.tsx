import { component$, useSignal, useVisibleTask$, type QRL } from "@builder.io/qwik";
import { fetchInstitutions, searchInstitutions } from "~/lib/datasets";

interface Props {
  value: string;
  onChange$: QRL<(value: string) => void>;
  placeholder?: string;
}

export default component$<Props>(({ value, onChange$, placeholder }) => {
  const query = useSignal(value || "");
  const institutions = useSignal<string[]>([]);
  const suggestions = useSignal<string[]>([]);
  const isOpen = useSignal(false);
  const isLoading = useSignal(true);

  useVisibleTask$(async () => {
    institutions.value = await fetchInstitutions();
    isLoading.value = false;
  });

  return (
    <div class="relative">
      <input
        type="text"
        value={query.value}
        onInput$={async (_e, target) => {
          const val = target.value;
          query.value = val;
          await onChange$(val);
          suggestions.value = searchInstitutions(val, institutions.value);
          isOpen.value = suggestions.value.length > 0;
        }}
        onFocus$={() => {
          if (query.value && institutions.value.length > 0) {
            suggestions.value = searchInstitutions(query.value, institutions.value);
            isOpen.value = suggestions.value.length > 0;
          }
        }}
        onBlur$={() => setTimeout(() => { isOpen.value = false; }, 200)}
        placeholder={placeholder || "Cari institusi..."}
        class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        autocomplete="off"
      />

      {isLoading.value && (
        <div class="absolute right-3 top-3.5">
          <div class="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isOpen.value && suggestions.value.length > 0 && (
        <div class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {suggestions.value.map((inst) => (
            <button
              key={inst}
              type="button"
              onClick$={async () => {
                query.value = inst;
                await onChange$(inst);
                suggestions.value = [];
                isOpen.value = false;
              }}
              class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition first:rounded-t-xl last:rounded-b-xl"
            >
              {inst}
            </button>
          ))}
          <div class="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
            Data dari{" "}
            <a
              href="https://klubfisika.github.io/datasets/"
              target="_blank"
              class="text-green-600 hover:underline"
            >
              KF13 Open Datasets
            </a>
          </div>
        </div>
      )}
    </div>
  );
});
