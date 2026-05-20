export interface Notification {
  id: string;
  type: 'cendol' | 'reply' | 'mention' | 'follow' | 'thread_reply' | 'quote';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
  link?: string;
  data?: any;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'cendol',
    title: 'Cendol Baru!',
    message: 'ahmad_fisika memberi cendol di thread "Interferometer Michelson"',
    time: '2 menit lalu',
    read: false,
    avatar: 'A',
    link: '/platform/discussions/berhasil-bikin-interferometer-michelson-dari-cermi-f7g8h9i0j1k2',
    data: { threadTitle: 'Interferometer Michelson', username: 'ahmad_fisika' }
  },
  {
    id: 'n2',
    type: 'reply',
    title: 'Balasan Baru',
    message: 'quantum_master membalas thread kamu "Persamaan Schrödinger"',
    time: '15 menit lalu',
    read: false,
    avatar: 'Q',
    link: '/platform/discussions/derivasi-persamaan-schrodinger-dari-prinsip-varias-l3m4n5o6p7q8',
    data: { threadTitle: 'Persamaan Schrödinger', username: 'quantum_master' }
  },
  {
    id: 'n3',
    type: 'mention',
    title: 'Kamu Disebut',
    message: 'newbie_phy menyebut kamu di thread "Momentum Angular"',
    time: '1 jam lalu',
    read: false,
    avatar: 'N',
    link: '/platform/discussions/kenapa-momentum-angular-kekal-tapi-energi-kinetik-r9s0t1u2v3w4',
    data: { threadTitle: 'Momentum Angular', username: 'newbie_phy' }
  },
  {
    id: 'n4',
    type: 'follow',
    title: 'Pengikut Baru',
    message: 'maker_indo mulai mengikuti kamu',
    time: '2 jam lalu',
    read: true,
    avatar: 'M',
    link: '/platform/u/maker_indo',
    data: { username: 'maker_indo' }
  },
  {
    id: 'n5',
    type: 'thread_reply',
    title: 'Thread Populer',
    message: 'Thread kamu "Arduino Sensor" mendapat 10+ balasan baru',
    time: '3 jam lalu',
    read: true,
    avatar: '🔥',
    link: '/platform/discussions/bikin-sensor-suhu-lcd-dengan-arduino-untuk-eksperi-x5y6z7a8b9c0',
    data: { threadTitle: 'Arduino Sensor', replyCount: 12 }
  },
  {
    id: 'n6',
    type: 'quote',
    title: 'Quote Baru',
    message: 'guru_fisika mengutip postingan kamu di thread OSN',
    time: '5 jam lalu',
    read: true,
    avatar: 'G',
    link: '/platform/discussions/pembahasan-soal-osn-fisika-2025-nomor-1-5-p3q4r5s6t7u8',
    data: { threadTitle: 'OSN Fisika 2025', username: 'guru_fisika' }
  },
  {
    id: 'n7',
    type: 'cendol',
    title: 'Cendol Streak!',
    message: 'Kamu mendapat 5+ cendol hari ini! 🎉',
    time: '1 hari lalu',
    read: true,
    avatar: '🥒',
    data: { count: 7, type: 'daily_streak' }
  }
];

// Helper functions
export const getNotificationIcon = (type: string): string => {
  const icons = {
    cendol: '🍵',
    reply: '💬', 
    mention: '📢',
    follow: '👤',
    thread_reply: '🔥',
    quote: '💭'
  };
  return icons[type as keyof typeof icons] || '🔔';
};

export const getNotificationColor = (type: string): string => {
  const colors = {
    cendol: 'text-green-600',
    reply: 'text-blue-600',
    mention: 'text-orange-600', 
    follow: 'text-purple-600',
    thread_reply: 'text-red-600',
    quote: 'text-indigo-600'
  };
  return colors[type as keyof typeof colors] || 'text-gray-600';
};

export const markNotificationAsRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

export const markAllNotificationsAsRead = (): void => {
  mockNotifications.forEach(n => n.read = true);
};

export const getUnreadCount = (): number => {
  return mockNotifications.filter(n => !n.read).length;
};
