import { component$, useSignal, $, type QRL } from "@builder.io/qwik";

interface Props {
  placeholder?: string;
  onSearch?: QRL<(query: string) => void>;
}

export default component$<Props>(
  ({ placeholder = "Cari diskusi, proyek, atau member...", onSearch }) => {
    const query = useSignal("");

    const handleSearch = $(() => {
      if (onSearch) {
        onSearch(query.value);
      } else {
        window.location.href = `/explore?q=${encodeURIComponent(query.value)}`;
      }
    });

    const handleInput = $((e: Event) => {
      query.value = (e.target as HTMLInputElement).value;
    });

    return (
      <form
        onSubmit$={handleSearch}
        preventdefault:submit
        class="relative w-full"
      >
        <input
          type="text"
          placeholder={placeholder}
          value={query.value}
          onInput$={handleInput}
          class="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-green-500 border-0 transition"
        />
        <span class="absolute left-2.5 top-1.5 text-gray-400">🔍</span>
      </form>
    );
  },
);
