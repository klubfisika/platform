import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  Form,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth, useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getPosts, createPost, addLike } from "~/lib/db";
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

export const useFeedLoader = routeLoader$(async () => {
  try {
    return await getPosts(20);
  } catch (err) {
    console.error("Gagal memuat feed:", err);
    return [];
  }
});

const createPostSchema = z.object({
  content: z.string().min(3, "Postingan minimal 3 karakter"),
});

export const useCreatePostAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user) {
    throw req.redirect(302, "/login");
  }

  const parsed = createPostSchema.safeParse({ content: data.content });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await createPost(session.user.id, parsed.data.content);
    return { success: true };
  } catch (err) {
    console.error("Gagal membuat status di feed:", err);
    return { success: false, error: "Gagal memposting status." };
  }
});

export const useCendolAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user) {
    throw req.redirect(302, "/login");
  }

  const postId = parseInt(data.postId as string, 10);
  if (isNaN(postId)) return { success: false };

  try {
    await addLike(postId);
    return { success: true };
  } catch (err) {
    console.error("Gagal menyukai postingan:", err);
    return { success: false };
  }
});

export default component$(() => {
  const user = useAuth();
  const posts = useFeedLoader();
  const createPostAction = useCreatePostAction();
  const cendolAction = useCendolAction();

  return (
    <PlatformLayout activeNav="/feed">
      {/* Quick Status Creator */}
      <Form
        action={createPostAction}
        class="bg-white rounded-2xl p-4 shadow-sm mb-4"
      >
        <div class="flex gap-3 items-start">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {(user.value?.name || "M")[0].toUpperCase()}
          </div>
          <div class="flex-1">
            <textarea
              name="content"
              rows={2}
              placeholder="Apa yang sedang kamu pikirkan atau kerjakan di dunia fisika hari ini?"
              class="w-full bg-gray-50 border border-gray-100 hover:bg-gray-150 rounded-xl px-4 py-2.5 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition resize-none text-sm"
              required
            ></textarea>
            {createPostAction.value &&
              "error" in createPostAction.value &&
              createPostAction.value.error && (
                <div class="text-xs text-red-500 mt-1 font-medium">
                  {createPostAction.value.error}
                </div>
              )}
            <div class="flex gap-2 justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div class="flex gap-2">
                <a
                  href="/discussions/new"
                  class="flex items-center gap-1.5 py-1.5 px-3 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 transition"
                >
                  <span>❓</span> Tanya Utas
                </a>
                <a
                  href="/projects/new"
                  class="flex items-center gap-1.5 py-1.5 px-3 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-600 transition"
                >
                  <span>🔬</span> Proyek Baru
                </a>
              </div>
              <button
                type="submit"
                disabled={createPostAction.isRunning}
                class="px-5 py-1.5 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                {createPostAction.isRunning ? "Memposting..." : "Posting"}
              </button>
            </div>
          </div>
        </div>
      </Form>

      {/* Topics/Stories Carousel */}
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div class="flex-shrink-0 text-center cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                ➕
              </div>
            </div>
            <span class="text-xs mt-1 block">Tambah</span>
          </div>
          <div class="flex-shrink-0 text-center cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                🏆
              </div>
            </div>
            <span class="text-xs mt-1 block">OSN 2026</span>
          </div>
          <div class="flex-shrink-0 text-center cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                🔬
              </div>
            </div>
            <span class="text-xs mt-1 block">Lab DIY</span>
          </div>
          <div class="flex-shrink-0 text-center cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                💡
              </div>
            </div>
            <span class="text-xs mt-1 block">Tips</span>
          </div>
          <div class="flex-shrink-0 text-center cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                📚
              </div>
            </div>
            <span class="text-xs mt-1 block">Belajar</span>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div class="space-y-4">
        {/* Premium Banner: Achievement */}
        <article class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-sm p-4 border border-yellow-200">
          <div class="flex items-center gap-2 text-yellow-700 font-medium mb-3">
            <span class="text-xl">🏆</span> Pencapaian Baru!
          </div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <div class="flex-1">
              <span class="font-bold text-gray-800">Siti Nurhaliza</span>
              <p class="text-gray-700 mt-1">
                Baru saja mencapai rank{" "}
                <strong class="text-orange-600">Kaskus Addict</strong>! 🎉
              </p>
              <p class="text-sm text-gray-500 mt-2">
                312 posts · 567 cendol · 8 proyek
              </p>
            </div>
          </div>
        </article>

        {/* Database Posts */}
        {posts.value.length === 0 ? (
          <div class="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            <span class="text-4xl block mb-3">🔭</span>
            <h4 class="font-semibold text-gray-900 mb-1">Feed masih sunyi</h4>
            <p class="text-sm text-gray-500 max-w-xs mx-auto">
              Jadilah yang pertama untuk membagikan riset, ide, atau pembaruan
              status Anda!
            </p>
          </div>
        ) : (
          posts.value.map((post) => {
            const authorInit = (post.authorName || "KF")[0].toUpperCase();
            return (
              <article
                class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 p-5 flex flex-col justify-between"
                key={post.id}
              >
                <div>
                  <div class="flex items-start gap-3 justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {authorInit}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-gray-900 text-sm">
                            {post.authorName || "Anggota KF"}
                          </span>
                          <span class="text-xs bg-gray-150 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                            {post.type || "kiriman"}
                          </span>
                        </div>
                        <div class="text-xs text-gray-400 mt-0.5">
                          {formatTimeAgo(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    <button class="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                      ⋯
                    </button>
                  </div>
                  <div class="mt-3">
                    {post.title && (
                      <h3 class="font-bold text-gray-900 mb-1.5 hover:text-green-600 transition">
                        <a href={`/discussions/${post.id}`}>{post.title}</a>
                      </h3>
                    )}
                    <p class="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                      {post.content}
                    </p>
                    {post.content.includes("Interferometer") && (
                      <div class="mt-3 -mx-5 overflow-hidden bg-gray-100 border-t border-b border-gray-100">
                        <img
                          src="https://placehold.co/600x400/e2e8f0/64748b?text=📸+Interferometer+DIY"
                          alt="Project Image"
                          width={600}
                          height={400}
                          class="w-full object-cover"
                        />
                      </div>
                    )}
                    {post.tags && (
                      <div class="flex gap-2 mt-2 flex-wrap">
                        {post.tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                              key={tag}
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                  <Form action={cendolAction}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      class="flex items-center gap-1.5 py-1.5 px-3.5 hover:bg-green-50 rounded-lg text-gray-600 hover:text-green-600 transition font-bold"
                    >
                      <span>🥒</span> {post.cendolCount || 0} Cendol
                    </button>
                  </Form>
                  <a
                    href={`/discussions/${post.id}`}
                    class="flex items-center gap-1.5 py-1.5 px-3.5 hover:bg-gray-100 rounded-lg text-gray-600 transition font-bold"
                  >
                    <span>💬</span> Diskusi / Balasan
                  </a>
                </div>
              </article>
            );
          })
        )}

                {/* Hot Thread Card */}
        <article class="group relative bg-zinc-900 rounded-2xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-rose-500/10 pointer-events-none"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div class="relative p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-sm tracking-widest uppercase font-mono text-orange-400/80">🔥 Trending</span>
              <span class="w-1 h-1 rounded-full bg-orange-500/40"></span>
              <span class="text-xs text-zinc-500">#1 di komunitas</span>
            </div>
            <a href="/discussions/1" class="block">
              <h3 class="font-bold text-xl text-zinc-100 leading-snug group-hover:text-orange-400 transition-colors">
                [MEGATHREAD] Persiapan OSN Fisika 2026 — Tips, Materi, dan Diskusi
              </h3>
              <p class="text-zinc-400 mt-3 line-clamp-2 leading-relaxed text-sm">
                Thread ini untuk diskusi persiapan OSN Fisika. Share tips, materi,
                dan tanya jawab seputar olimpiade fisika...
              </p>
            </a>
            <div class="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <div class="flex items-center gap-6 text-sm">
                <span class="flex items-center gap-1.5 text-zinc-400">
                  <span>🥒</span>
                  <span class="text-zinc-200 font-semibold">156</span>
                </span>
                <span class="flex items-center gap-1.5 text-zinc-400">
                  <span>💬</span>
                  <span class="text-zinc-200 font-semibold">234</span>
                </span>
                <span class="flex items-center gap-1.5 text-zinc-400">
                  <span>👁️</span>
                  <span class="text-zinc-200 font-semibold">2.3k</span>
                </span>
              </div>
              <div class="flex gap-1.5">
                <span class="text-[10px] text-zinc-300 bg-white/10 px-2.5 py-1 rounded font-mono tracking-wide">osn</span>
                <span class="text-[10px] text-zinc-300 bg-white/10 px-2.5 py-1 rounded font-mono tracking-wide">olimpiade</span>
                <span class="text-[10px] text-zinc-300 bg-white/10 px-2.5 py-1 rounded font-mono tracking-wide">tips</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Feed",
};
