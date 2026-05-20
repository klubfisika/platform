export const THREAD_CONFIG = {
  maxTagsDisplay: 4,
  avatarFallbackBg: 'bg-gradient-to-br from-green-500 to-teal-500'
};

export const THREAD_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  ask: { label: 'ASK', color: 'bg-blue-100 text-blue-700' },
  share: { label: 'SHARE', color: 'bg-green-100 text-green-700' },
  tutorial: { label: 'TUTORIAL', color: 'bg-purple-100 text-purple-700' },
  debat: { label: 'DEBAT', color: 'bg-orange-100 text-orange-700' },
  proyek: { label: 'PROYEK', color: 'bg-red-100 text-red-700' },
  megathread: { label: 'MEGATHREAD', color: 'bg-amber-100 text-amber-700' },
};

export const RANK_CONFIG: Record<string, string> = {
  'Newbie': 'text-gray-500',
  'Kaskuser': 'text-blue-600',
  'Aktivis': 'text-green-600',
  'Kaskus Holic': 'text-purple-600',
  'Kaskus Addict': 'text-orange-600',
  'Kaskus Maniac': 'text-red-600',
  'Kaskus Geek': 'text-amber-600',
};

export const THREAD_BADGES = {
  sticky: { label: '📌 Sticky', color: 'bg-amber-500 text-white' },
  hot: { label: '🔥 Hot', color: 'bg-red-500 text-white' },
  solved: { label: '✓ Solved', color: 'bg-green-100 text-green-700' },
  locked: { label: '🔒 Locked', color: 'bg-gray-200 text-gray-600' }
};

export const THREAD_LABELS = {
  replies: 'balasan',
  lastReplyBy: 'oleh @'
};

// Optimized utility functions
export const getThreadBgClass = (thread: { isSticky?: boolean; cendol: number; bata: number }) => {
  if (thread.isSticky) return 'bg-amber-50/50';
  if ((thread.cendol - thread.bata) < 0) return 'bg-red-50/30';
  return '';
};

export const getRankColor = (rank?: string) => 
  rank ? RANK_CONFIG[rank] || 'text-gray-500' : 'text-gray-500';

export const getTypeInfo = (type?: string) => 
  type ? THREAD_TYPE_CONFIG[type] : null;
