export interface Message {
  id: string;
  from: {
    username: string;
    displayName: string;
    avatar: string;
  };
  to: {
    username: string;
    displayName: string;
  };
  subject?: string;
  message: string;
  time: string;
  read: boolean;
  isReply?: boolean;
  parentId?: string;
}

export interface Conversation {
  id: string;
  participants: {
    username: string;
    displayName: string;
    avatar: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export const mockMessages: Message[] = [
  {
    id: 'm1',
    from: { username: 'ahmad_fisika', displayName: 'Ahmad Fisika', avatar: 'A' },
    to: { username: 'current_user', displayName: 'You' },
    subject: 'Tentang Eksperimen Interferometer',
    message: 'Gan, boleh tanya detail setup interferometer kamu? Ane pengen coba bikin juga nih.',
    time: '10 menit lalu',
    read: false
  },
  {
    id: 'm2', 
    from: { username: 'quantum_master', displayName: 'Dr. Ahmad Quantum', avatar: 'Q' },
    to: { username: 'current_user', displayName: 'You' },
    subject: 'Kolaborasi Riset',
    message: 'Halo! Ane tertarik dengan thread kamu tentang Schrödinger. Mau diskusi lebih lanjut?',
    time: '1 jam lalu',
    read: false
  },
  {
    id: 'm3',
    from: { username: 'newbie_phy', displayName: 'Sari Fisika', avatar: 'S' },
    to: { username: 'current_user', displayName: 'You' },
    message: 'Makasih banyak gan udah bantuin di thread momentum angular! 🙏',
    time: '2 jam lalu',
    read: true
  },
  {
    id: 'm4',
    from: { username: 'maker_indo', displayName: 'Maker Indonesia', avatar: 'M' },
    to: { username: 'current_user', displayName: 'You' },
    subject: 'Project Kolaborasi',
    message: 'Gan, ane lagi bikin spektrometer DIY. Mau join project bareng?',
    time: '1 hari lalu',
    read: true
  },
  {
    id: 'm5',
    from: { username: 'guru_fisika', displayName: 'Pak Guru', avatar: 'G' },
    to: { username: 'current_user', displayName: 'You' },
    subject: 'Undangan Webinar',
    message: 'Ada webinar OSN preparation minggu depan. Mau jadi speaker?',
    time: '2 hari lalu',
    read: true
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: [
      { username: 'ahmad_fisika', displayName: 'Ahmad Fisika', avatar: 'A' },
      { username: 'current_user', displayName: 'You', avatar: 'U' }
    ],
    lastMessage: mockMessages[0],
    unreadCount: 1,
    messages: [mockMessages[0]]
  },
  {
    id: 'c2', 
    participants: [
      { username: 'quantum_master', displayName: 'Dr. Ahmad Quantum', avatar: 'Q' },
      { username: 'current_user', displayName: 'You', avatar: 'U' }
    ],
    lastMessage: mockMessages[1],
    unreadCount: 1,
    messages: [mockMessages[1]]
  },
  {
    id: 'c3',
    participants: [
      { username: 'newbie_phy', displayName: 'Sari Fisika', avatar: 'S' },
      { username: 'current_user', displayName: 'You', avatar: 'U' }
    ],
    lastMessage: mockMessages[2],
    unreadCount: 0,
    messages: [mockMessages[2]]
  }
];

// Helper functions
export const getUnreadMessageCount = (): number => {
  return mockMessages.filter(m => !m.read).length;
};

export const markMessageAsRead = (id: string): void => {
  const message = mockMessages.find(m => m.id === id);
  if (message) {
    message.read = true;
  }
};

export const markAllMessagesAsRead = (): void => {
  mockMessages.forEach(m => m.read = true);
};

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find(c => c.id === id);
};

export const getMessagesByConversation = (conversationId: string): Message[] => {
  const conversation = getConversationById(conversationId);
  return conversation?.messages || [];
};
