// Profile page constants and utilities
export const LEVEL_COLORS: Record<string, string> = {
  'SMP': 'bg-blue-100 text-blue-700',
  'SMA': 'bg-green-100 text-green-700', 
  'Universitas': 'bg-purple-100 text-purple-700',
  'S2/S3': 'bg-orange-100 text-orange-700',
  'Profesional': 'bg-red-100 text-red-700',
};

export const STATUS_COLORS: Record<string, string> = {
  'open': 'text-green-600',
  'completed': 'text-gray-500',
  'in-progress': 'text-yellow-600',
};

export function createStatsArray(user: any) {
  return [
    { value: user.posts || 0, label: 'Posts', color: 'gray' },
    { value: user.cendol || 0, label: 'Cendol', color: 'green', emoji: '🥒' },
    { value: user.projects || 0, label: 'Proyek', color: 'blue' },
    { value: user.contributions || 0, label: 'Kontribusi', color: 'purple' },
    { value: (user.cendol || 0) - (user.bata || 0), label: 'Reputasi', color: 'orange' },
  ];
}
