import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getThreadDetail } from "~/data/mockThreadDetails";

export default component$(() => {
  const loc = useLocation();
  const id = loc.params.id;
  const thread = getThreadDetail(id);
  const user = useAuth();

  useVisibleTask$(() => {
    if (!user.value) window.location.replace("/login");
  });

  if (!thread) {
    return (
      <PlatformLayout title="Thread Tidak Ditemukan" activeNav="/discussions">
        <div class="text-center py-12"><p class="text-gray-500">Thread tidak ditemukan.</p><a href="/discussions" class="text-green-600 hover:underline mt-4 inline-block">Kembali ke Forum</a></div>
      </PlatformLayout>
    );
  }

  const typeConfig: Record<string, { label: string; color: string }> = {
    ask: { label: "ASK", color: "bg-blue-100 text-blue-700" },
    share: { label: "SHARE", color: "bg-green-100 text-green-700" },
    tutorial: { label: "TUTORIAL", color: "bg-purple-100 text-purple-700" },
    debat: { label: "DEBAT", color: "bg-orange-100 text-orange-700" },
    megathread: { label: "MEGATHREAD", color: "bg-red-100 text-red-700" },
  };
  const typeInfo = typeConfig[thread.type || "share"] || typeConfig.share;
  const rankColors: Record<string, string> = { "Newbie": "text-gray-500", "Kaskuser": "text-blue-600", "Aktivis": "text-green-600", "Kaskus Holic": "text-purple-600", "Kaskus Addict": "text-orange-600", "Kaskus Maniac": "text-red-600", "Kaskus Geek": "text-amber-600" };

  return (
    <PlatformLayout title={thread.title} activeNav="/discussions">
      <div class="text-sm text-gray-400 ml-2 mb-2">
        <a href="/discussions" class="hover:text-green-600 transition">Forum</a>
        <span class="mx-2">›</span>
        <a href={`/discussions?cat=${thread.category}`} class="hover:text-green-600 transition capitalize">{thread.category}</a>
      </div>

      <article class={`bg-white rounded-2xl shadow-sm overflow-hidden mb-4 ${thread.isLocked ? "border-2 border-red-200" : ""}`}>
        <div class="p-5 flex items-start gap-3">
          <a href={`/u/${thread.author.name}`}>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">{thread.author.name.charAt(0).toUpperCase()}</div>
          </a>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <a href={`/u/${thread.author.name}`} class="font-semibold text-gray-900 hover:underline">{thread.author.name}</a>
              <span class={`text-sm font-medium ${rankColors[thread.author.rank ?? ''] || "text-gray-500"}`}>{thread.author.rank}</span>
              <span class="text-gray-400">·</span>
              <span class="text-gray-500 text-sm">{thread.lastActivity}</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
              {thread.isLocked && <span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">🔒 Locked</span>}
            </div>
          </div>
        </div>

        <div class="px-6 pb-3">
          <h1 class="text-xl font-bold text-gray-900">{thread.title}</h1>
          {thread.tags && <div class="flex gap-2 mt-2 flex-wrap">{thread.tags.map((tag: string) => <a href={`/discussions?tag=${tag}`} class="text-sm text-green-600 hover:underline" key={tag}>#{tag}</a>)}</div>}
        </div>

        <div class="px-6 pb-6">
          <div class="text-gray-800 leading-relaxed">{thread.content}</div>
          {thread.signature && <div class="mt-6 pt-4 border-t border-dashed border-gray-200 text-sm text-gray-500 italic"><p>{thread.signature}</p></div>}
        </div>

        <div class="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-1">
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-green-50 text-gray-600 hover:text-green-600"><span>🍵</span><span class="font-medium">{thread.cendol}</span></button>
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-red-50 text-gray-600 hover:text-red-500"><span>🧱</span><span class="font-medium">{thread.bata || 0}</span></button>
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-gray-100 text-gray-600"><span>💬</span><span class="font-medium">{thread.replies?.length || 0}</span></button>
          </div>
          <span class="text-sm text-gray-500">👁️ 2,341 views</span>
        </div>
      </article>

      {thread.replies?.length > 0 && (
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div class="p-4 border-b border-gray-100"><h2 class="font-bold text-gray-900">{thread.replies.length} Balasan</h2></div>
          {thread.replies.slice(0, 5).map((reply: any, i: number) => (
            <div class="border-b border-gray-50 p-5" key={i}>
              <div class="flex gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">{reply.author.name.charAt(0).toUpperCase()}</div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-gray-900 text-sm">{reply.author.name}</span>
                    <span class="text-xs text-gray-500">· {reply.createdAt}</span>
                  </div>
                  <div class="mt-2 text-gray-800">{reply.content}</div>
                  <div class="flex items-center gap-3 mt-3">
                    <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition"><span>🍵</span><span class="font-medium">{reply.cendol || 0}</span></button>
                    <button class="text-sm text-gray-500 hover:text-gray-700 transition">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div class="flex gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">U</div>
          <div class="flex-1">
            <textarea placeholder="Tulis balasan..." class="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" rows={3}></textarea>
            <div class="flex items-center justify-between mt-2">
              <button type="button" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition">😀</button>
              <button class="px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition">Kirim</button>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Thread Detail" };
