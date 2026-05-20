export const FORUM_CONFIG = {
  title: 'Forum Diskusi Fisika',
  subtitle: 'Pair of Minds, Pair of Hands',
  itemsPerPage: 5,
  hotThreadThresholds: {
    cendol: 50,
    replies: 20
  },
  timeMultipliers: {
    menit: 1,
    jam: 60,
    hari: 1440
  }
};

export const SUBFORUMS = [
  { id: 'all', label: 'Semua', icon: '🏠' },
  { id: 'modern', label: 'Fisika Modern', icon: '⚛️' },
  { id: 'mechanics', label: 'Mekanika', icon: '🔧' },
  { id: 'olympiad', label: 'Olimpiade', icon: '🏆' },
  { id: 'career', label: 'Karir & Kuliah', icon: '💼' },
  { id: 'lounge', label: 'Lounge', icon: '🎮' },
];

export const FORUM_LABELS = {
  createThread: '+ Buat Thread',
  activeFilter: 'Filter aktif:',
  removeFilter: 'Hapus Filter',
  sortBy: 'Urutkan:',
  searchPlaceholder: 'Cari thread...',
  tableHeaders: {
    topic: 'Topik',
    author: 'Penulis', 
    engagement: '🥒 / 💬',
    activity: 'Aktivitas'
  },
  sortOptions: {
    latest: 'Terbaru',
    popular: 'Terpopuler',
    replies: 'Paling Dibalas'
  },
  emptyStates: {
    noThreadsWithTag: (tag: string) => `Tidak ada thread dengan tag "${tag}"`,
    noThreadsInCategory: 'Belum ada thread di kategori ini'
  },
  pagination: {
    showing: (start: number, end: number, total: number) => 
      `Menampilkan ${start}-${end} dari ${total} thread`
  }
};

// Mock stats - in real app this would come from API
export const getForumStats = () => ({
  onlineUsers: 23,
  totalThreads: 1234,
  totalReplies: 5678
});
