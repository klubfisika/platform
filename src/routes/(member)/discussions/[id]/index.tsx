import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  Form,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
// Removed mock thread detail import; data fetched from DB
import { getDb, schema } from "~/lib/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

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

export const useThreadDetailLoader = routeLoader$(async (event) => {
  const id = event.params.id;
  const postId = parseInt(id, 10);

  // If postId is not a number, treat as invalid and return null
  if (isNaN(postId)) {
    return null;
  }

  try {
    const db = getDb();
    const [row] = await db
      .select({
        id: schema.posts.id,
        title: schema.posts.title,
        content: schema.posts.content,
        type: schema.posts.type,
        category: schema.posts.category,
        cendolCount: schema.posts.cendolCount,
        bataCount: schema.posts.bataCount,
        createdAt: schema.posts.createdAt,
        authorName: schema.user.name,
        authorRank: schema.user.level,
        tags: schema.posts.tags,
      })
      .from(schema.posts)
      .leftJoin(schema.user, eq(schema.posts.authorId, schema.user.id))
      .where(eq(schema.posts.id, postId))
      .limit(1);

    if (!row) return null;

    const commentsRows = await db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        createdAt: schema.comments.createdAt,
        authorName: schema.user.name,
      })
      .from(schema.comments)
      .leftJoin(schema.user, eq(schema.comments.authorId, schema.user.id))
      .where(eq(schema.comments.postId, postId))
      .orderBy(desc(schema.comments.createdAt));

    return {
      isMock: false,
      data: {
        id: String(row.id),
        title: row.title || "Utas Tanpa Judul",
        content: row.content,
        type: row.type || "ask",
        category: row.category || "lounge",
        cendol: row.cendolCount || 0,
        bata: row.bataCount || 0,
        lastActivity: formatTimeAgo(row.createdAt),
        author: {
          name: row.authorName || "Anggota KF",
          rank: row.authorRank || "Newbie",
        },
        tags: row.tags
          ? row.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        replies: commentsRows.map((c) => ({
          author: { name: c.authorName || "Anggota KF" },
          content: c.content,
          createdAt: formatTimeAgo(c.createdAt),
          cendol: 0,
        })),
        isLocked: false,
        signature: "physics is life",
      },
    };
  } catch (err) {
    console.error("Gagal memuat detail thread:", err);
    return null;
  }
});

const addCommentSchema = z.object({
  content: z.string().min(2, "Balasan minimal 2 karakter"),
});

export const useAddCommentAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user) {
    throw req.redirect(302, "/login");
  }

  const parsed = addCommentSchema.safeParse({ content: data.content });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const postId = parseInt(req.params.id, 10);
  if (isNaN(postId)) {
    return { success: false, error: "Thread tidak valid untuk dibalas." };
  }

  try {
    const db = getDb();
    await db.insert(schema.comments).values({
      postId,
      authorId: session.user.id,
      content: parsed.data.content,
    });

    return { success: true };
  } catch (err) {
    console.error("Gagal menyimpan komentar:", err);
    return { success: false, error: "Gagal menyimpan komentar ke database." };
  }
});

export default component$(() => {
  const loader = useThreadDetailLoader();
  const action = useAddCommentAction();

  if (!loader.value) {
    return (
      <PlatformLayout title="Thread Tidak Ditemukan" activeNav="/discussions">
        <div class="text-center py-12">
          <p class="text-gray-500">Thread tidak ditemukan.</p>
          <a
            href="/discussions"
            class="text-green-600 hover:underline mt-4 inline-block"
          >
            Kembali ke Forum
          </a>
        </div>
      </PlatformLayout>
    );
  }

  const thread = loader.value.data;

  const typeConfig: Record<string, { label: string; color: string }> = {
    ask: { label: "ASK", color: "bg-blue-100 text-blue-700" },
    share: { label: "SHARE", color: "bg-green-100 text-green-700" },
    tutorial: { label: "TUTORIAL", color: "bg-purple-100 text-purple-700" },
    debat: { label: "DEBAT", color: "bg-orange-100 text-orange-700" },
    proyek: { label: "PROYEK", color: "bg-pink-100 text-pink-700" },
    megathread: { label: "MEGATHREAD", color: "bg-red-100 text-red-700" },
  };

  const typeInfo = typeConfig[thread.type || "share"] || typeConfig.share;
  const rankColors: Record<string, string> = {
    Newbie: "text-gray-500",
    Kaskuser: "text-blue-600",
    Aktivis: "text-green-600",
    "Kaskus Holic": "text-purple-600",
    "Kaskus Addict": "text-orange-600",
    "Kaskus Maniac": "text-red-600",
    "Kaskus Geek": "text-amber-600",
  };

  return (
    <PlatformLayout title={thread.title} activeNav="/discussions">
      <div class="text-sm text-gray-400 ml-2 mb-2">
        <a href="/discussions" class="hover:text-green-600 transition">
          Forum
        </a>
        <span class="mx-2">›</span>
        <a
          href={`/discussions?tab=${thread.category}`}
          class="hover:text-green-600 transition capitalize"
        >
          {thread.category}
        </a>
      </div>

      <article
        class={`bg-white rounded-2xl shadow-sm overflow-hidden mb-4 ${thread.isLocked ? "border-2 border-red-200" : ""}`}
      >
        <div class="p-5 flex items-start gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {thread.author.name.charAt(0).toUpperCase()}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-gray-900">
                {thread.author.name}
              </span>
              <span
                class={`text-sm font-medium ${rankColors[thread.author.rank ?? ""] || "text-gray-500"}`}
              >
                {thread.author.rank}
              </span>
              <span class="text-gray-400">·</span>
              <span class="text-gray-500 text-sm">{thread.lastActivity}</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span
                class={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}
              >
                {typeInfo.label}
              </span>
              {thread.isLocked && (
                <span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  🔒 Locked
                </span>
              )}
            </div>
          </div>
        </div>

        <div class="px-6 pb-3">
          <h1 class="text-xl font-bold text-gray-900">{thread.title}</h1>
          {thread.tags && thread.tags.length > 0 && (
            <div class="flex gap-2 mt-2 flex-wrap">
              {thread.tags.map((tag: string) => (
                <a
                  href={`/discussions?tag=${tag}`}
                  class="text-sm text-green-600 hover:underline"
                  key={tag}
                >
                  #{tag}
                </a>
              ))}
            </div>
          )}
        </div>

        <div class="px-6 pb-6">
          <div class="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </div>
          {thread.signature && (
            <div class="mt-6 pt-4 border-t border-dashed border-gray-200 text-sm text-gray-500 italic">
              <p>{thread.signature}</p>
            </div>
          )}
        </div>

        <div class="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-1">
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-green-50 text-gray-600 hover:text-green-600">
              <span>🍵</span>
              <span class="font-medium">{thread.cendol}</span>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-red-50 text-gray-600 hover:text-red-500">
              <span>🧱</span>
              <span class="font-medium">{thread.bata}</span>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-gray-100 text-gray-600">
              <span>💬</span>
              <span class="font-medium">{thread.replies.length}</span>
            </button>
          </div>
          <span class="text-sm text-gray-500">👁️ 2,341 views</span>
        </div>
      </article>

      {thread.replies.length > 0 && (
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <div class="p-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-900">
              {thread.replies.length} Balasan
            </h2>
          </div>
          {thread.replies.map((reply: any, i: number) => (
            <div class="border-b border-gray-50 p-5" key={i}>
              <div class="flex gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {reply.author.name.charAt(0).toUpperCase()}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-gray-900 text-sm">
                      {reply.author.name}
                    </span>
                    <span class="text-xs text-gray-500">
                      · {reply.createdAt}
                    </span>
                  </div>
                  <div class="mt-2 text-gray-800 whitespace-pre-wrap">
                    {reply.content}
                  </div>
                  <div class="flex items-center gap-3 mt-3">
                    <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition">
                      <span>🍵</span>
                      <span class="font-medium">{reply.cendol || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loader.value.isMock && (
        <Form action={action} class="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div class="flex gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              U
            </div>
            <div class="flex-1">
              {action.value &&
                "error" in action.value &&
                action.value.error && (
                  <div class="mb-2 p-2 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs font-semibold">
                    {action.value.error}
                  </div>
                )}
              {action.value && action.value.success && (
                <div class="mb-2 p-2 bg-green-50 border border-green-150 text-green-600 rounded-xl text-xs font-semibold">
                  Balasan berhasil dikirim!
                </div>
              )}
              <textarea
                name="content"
                placeholder="Tulis balasan..."
                class="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                required
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <button
                  type="button"
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
                >
                  😀
                </button>
                <button
                  type="submit"
                  disabled={action.isRunning}
                  class="px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {action.isRunning ? "Kirim..." : "Kirim"}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Thread Detail" };
