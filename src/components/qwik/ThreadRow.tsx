import { component$ } from '@builder.io/qwik';
import { 
  THREAD_CONFIG, 
  THREAD_BADGES, 
  THREAD_LABELS,
  getThreadBgClass,
  getRankColor,
  getTypeInfo
} from '~/data/threadConfig';

export interface Thread {
  id: string;
  title: string;
  type?: 'ask' | 'share' | 'tutorial' | 'debat' | 'proyek' | 'megathread';
  excerpt?: string;
  author: {
    name: string;
    avatar?: string;
    rank?: string;
    posts?: number;
  };
  tags?: string[];
  replyCount: number;
  lastActivity: string;
  lastReplyBy?: string;
  cendol: number;
  bata: number;
  isSticky?: boolean;
  isHot?: boolean;
  isSolved?: boolean;
  isLocked?: boolean;
  lockReason?: string;
  lockedAt?: string;
  category?: string;
}

interface Props {
  thread: Thread;
}

export default component$<Props>(({ thread }) => {
  return (
    <a 
      href={`/discussions/${thread.id}`}
      class={`grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-50 hover:bg-gray-50/80 transition cursor-pointer ${getThreadBgClass(thread)}`}
    >
      {/* Topic */}
      <div class="col-span-6">
        {/* Badges Row */}
        <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {thread.isSticky && (
            <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${THREAD_BADGES.sticky.color}`}>
              {THREAD_BADGES.sticky.label}
            </span>
          )}
          {thread.isHot && (
            <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${THREAD_BADGES.hot.color}`}>
              {THREAD_BADGES.hot.label}
            </span>
          )}
          {getTypeInfo(thread.type) && (
            <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeInfo(thread.type)!.color}`}>
              {getTypeInfo(thread.type)!.label}
            </span>
          )}
          {thread.isSolved && (
            <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${THREAD_BADGES.solved.color}`}>
              {THREAD_BADGES.solved.label}
            </span>
          )}
          {thread.isLocked && (
            <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${THREAD_BADGES.locked.color}`}>
              {THREAD_BADGES.locked.label}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 class="font-semibold text-gray-800 hover:text-green-600 transition line-clamp-1">
          {thread.title}
        </h3>
        
        {/* Excerpt */}
        {thread.excerpt && (
          <p class="text-sm text-gray-500 mt-1 line-clamp-1">{thread.excerpt}</p>
        )}
        
        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div class="flex gap-1.5 mt-2">
            {thread.tags.slice(0, THREAD_CONFIG.maxTagsDisplay).map(tag => (
              <button 
                key={tag} 
                class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full hover:bg-green-100 hover:text-green-600 transition"
                onClick$={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Dispatch custom event to parent
                  const event = new CustomEvent('tag-filter', { detail: tag });
                  document.dispatchEvent(event);
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Author */}
      <div class="col-span-2 flex flex-col items-center justify-center">
        <div class={`w-9 h-9 ${THREAD_CONFIG.avatarFallbackBg} rounded-full flex items-center justify-center text-white text-sm font-bold mb-1`}>
          {thread.author.avatar || thread.author.name[0]?.toUpperCase()}
        </div>
        <div class="text-sm font-medium text-gray-700 truncate max-w-full">{thread.author.name}</div>
        {thread.author.rank && (
          <div class={`text-xs ${getRankColor(thread.author.rank)}`}>{thread.author.rank}</div>
        )}
      </div>
      
      {/* Stats - Cendol/Bata & Reply */}
      <div class="col-span-2 flex flex-col items-center justify-center gap-1">
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-0.5 text-sm">
            <span>🥒</span>
            <span class="text-green-600 font-medium">{thread.cendol}</span>
          </span>
          {thread.bata > 0 && (
            <span class="flex items-center gap-0.5 text-sm">
              <span>🧱</span>
              <span class="text-red-500 font-medium">{thread.bata}</span>
            </span>
          )}
        </div>
        <div class="text-xs text-gray-400">{thread.replyCount} {THREAD_LABELS.replies}</div>
      </div>
      
      {/* Last Activity */}
      <div class="col-span-2 flex flex-col items-center justify-center text-center">
        <div class="text-sm text-gray-600">{thread.lastActivity}</div>
        {thread.lastReplyBy && (
          <div class="text-xs text-gray-400">{THREAD_LABELS.lastReplyBy}{thread.lastReplyBy}</div>
        )}
      </div>
    </a>
  );
});
