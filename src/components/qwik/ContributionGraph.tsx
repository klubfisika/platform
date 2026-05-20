import { component$ } from '@builder.io/qwik';

interface Props {
  contributions: number;
}

export const ContributionGraph = component$<Props>(({ contributions }) => {
  // Pre-generate deterministic data based on contributions
  const graphData = Array.from({ length: 48 }, (_, i) => 
    ((contributions + i * 7) % 10)
  );

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-12 gap-1.5 p-4 bg-gray-50 rounded-xl min-h-[120px]">
        {graphData.map((count, i) => (
          <div
            key={i}
            class={`w-full aspect-square rounded transition hover:scale-110 cursor-pointer shadow-sm ${
              count > 7 ? 'bg-green-500 hover:bg-green-600' : 
              count > 4 ? 'bg-green-300 hover:bg-green-400' : 
              count > 1 ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title={`${count} contributions`}
          />
        ))}
      </div>
      <p class="text-sm text-gray-500 font-medium">{contributions} kontribusi dalam 12 bulan terakhir</p>
    </div>
  );
});
