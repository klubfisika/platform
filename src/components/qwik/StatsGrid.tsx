import { component$ } from '@builder.io/qwik';

interface Stat {
  value: number;
  label: string;
  color: string;
  emoji?: string;
}

interface Props {
  stats: Stat[];
}

export const StatsGrid = component$<Props>(({ stats }) => {
  return (
    <div class="grid grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-100">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          class="text-center hover:bg-gray-50 rounded-xl p-3 transition cursor-pointer group"
        >
          <div class={`text-2xl font-bold text-${stat.color}-600 group-hover:scale-105 transition-transform flex items-center justify-center gap-1`}>
            {stat.emoji && <span class="text-lg">{stat.emoji}</span>} {stat.value}
          </div>
          <div class="text-xs text-gray-500 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
});
