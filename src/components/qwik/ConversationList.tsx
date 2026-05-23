import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface LastMessage {
  content: string | null;
  senderId: string | null;
  read: boolean | null;
}

interface ConversationItem {
  id: number;
  otherParticipant: Participant | null;
  lastMessage: LastMessage;
  lastMessageAt: Date | null;
  unreadCount: number;
  currentUser: {
    id: string;
    name: string;
  };
}

interface ConversationListProps {
  conversations: ConversationItem[];
}

function formatTimeAgo(dateInput: Date | string | null): string {
  if (!dateInput) return "Baru saja";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default component$<ConversationListProps>(({ conversations }) => {
  return (
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          class="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition last:border-b-0"
        >
          <div class="relative w-12 h-12 flex-shrink-0">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
              {conv.otherParticipant?.avatar ||
                conv.otherParticipant?.name?.charAt(0).toUpperCase()}
            </div>
            {conv.unreadCount > 0 && (
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {conv.unreadCount}
              </span>
            )}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-gray-900 truncate">
                {conv.otherParticipant?.name || "Pengguna Tak Dikenal"}
              </span>
              <span class="text-xs text-gray-500 flex-shrink-0">
                {formatTimeAgo(conv.lastMessageAt)}
              </span>
            </div>
            <p class="text-sm text-gray-600 truncate">
              {conv.lastMessage.content || "Tidak ada pesan."}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
});