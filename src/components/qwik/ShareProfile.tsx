import { component$, useSignal } from '@builder.io/qwik';

interface Props {
  username: string;
}

export const ShareProfile = component$<Props>(({ username }) => {
  const copied = useSignal(false);

  return (
    <div class="space-y-3">
      <div class="bg-white/20 rounded-lg px-3 py-2 text-sm font-mono break-all">
        klubfisika.github.io/{username}
      </div>
      <button 
        onClick$={() => {
          navigator.clipboard.writeText(`klubfisika.github.io/${username}`);
          copied.value = true;
          setTimeout(() => copied.value = false, 2000);
        }}
        class="w-full bg-white text-green-600 py-2 rounded-lg font-medium hover:bg-green-50 transition"
      >
        {copied.value ? '✓ Copied!' : 'Copy Link'}
      </button>
    </div>
  );
});
