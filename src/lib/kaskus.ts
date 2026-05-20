// Kaskus-style reputation system
export const RANKS = [
  { min: 0, title: 'Newbie', color: '#6b7280' },
  { min: 10, title: 'Kaskuser', color: '#3b82f6' },
  { min: 50, title: 'Aktivis', color: '#22c55e' },
  { min: 100, title: 'Kaskus Holic', color: '#a855f7' },
  { min: 250, title: 'Kaskus Addict', color: '#f97316' },
  { min: 500, title: 'Kaskus Maniac', color: '#ef4444' },
  { min: 1000, title: 'Kaskus Geek', color: '#ec4899' },
] as const;

export const getRank = (posts: number) => {
  return [...RANKS].reverse().find(r => posts >= r.min) || RANKS[0];
};

// Kaskus emoticons
export const EMOTICONS: Record<string, string> = {
  ':cendol': '🍵',
  ':bata': '🧱', 
  ':ngakak': '🤣',
  ':malu': '😳',
  ':cool': '😎',
  ':bingung': '😕',
  ':marah': '😠',
  ':sedih': '😢',
  ':takut': '😱',
  ':love': '😍',
  ':jempol': '👍',
  ':salaman': '🤝',
  ':pertamax': '🏆',
  ':sundul': '⬆️',
  ':repost': '♻️',
  ':hoax': '🚫',
  ':mantap': '💯',
  ':gas': '🔥',
};

export const parseEmoticons = (text: string): string => {
  let result = text;
  for (const [code, emoji] of Object.entries(EMOTICONS)) {
    result = result.replaceAll(code, emoji);
  }
  return result;
};
