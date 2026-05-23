import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  Form,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { z } from "zod";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

const threadTypes = [
  {
    id: "ask",
    label: "ASK",
    desc: "Tanya jawab dan diskusi",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "share",
    label: "SHARE",
    desc: "Berbagi pengalaman/hasil",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "tutorial",
    label: "TUTORIAL",
    desc: "Panduan step-by-step",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "debat",
    label: "DEBAT",
    desc: "Diskusi argumentatif",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "proyek",
    label: "PROYEK",
    desc: "Kolaborasi project",
    color: "bg-pink-100 text-pink-700",
  },
];

const categories = [
  { id: "modern", label: "Fisika Modern", icon: "⚛️" },
  { id: "mechanics", label: "Mekanika", icon: "🔧" },
  { id: "olympiad", label: "Olimpiade", icon: "🏆" },
  { id: "career", label: "Karir & Kuliah", icon: "💼" },
  { id: "lounge", label: "Lounge", icon: "🎮" },
];

const createThreadSchema = z.object({
  type: z.string().min(1, "Tipe thread wajib dipilih"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  title: z
    .string()
    .min(5, "Judul thread minimal 5 karakter")
    .max(100, "Judul thread maksimal 100 karakter"),
  content: z.string().min(10, "Konten thread minimal 10 karakter"),
  tags: z.string().optional().default(""),
});

export const useCreateThreadAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user) {
    throw req.redirect(302, "/login");
  }

  const parsed = createThreadSchema.safeParse({
    type: data.type,
    category: data.category,
    title: data.title,
    content: data.content,
    tags: data.tags,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { type, category, title, content, tags } = parsed.data;

  try {
    const db = getDb();
    await db.insert(schema.posts).values({
      authorId: session.user.id,
      type,
      category,
      title,
      content,
      tags,
      cendolCount: 0,
      bataCount: 0,
    });

    throw req.redirect(302, "/discussions");
  } catch (err) {
    if (err instanceof Error && err.constructor.name === "RedirectMessage") {
      throw err;
    }
    console.error("Gagal membuat thread:", err);
    return { success: false, error: "Gagal menyimpan thread ke database." };
  }
});

export default component$(() => {
  const action = useCreateThreadAction();

  return (
    <PlatformLayout title="Buat Thread Baru" activeNav="/discussions">
      <div class="text-sm text-gray-400 mb-4">
        <a href="/discussions" class="hover:text-green-600 transition">
          Forum
        </a>
        <span class="mx-2">›</span>
        <span>Buat Thread Baru</span>
      </div>

      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h1 class="text-2xl font-bold">Buat Thread Baru</h1>
          <p class="text-sm opacity-90 mt-1">
            Bagikan pengetahuan, tanya jawab, atau mulai diskusi
          </p>
        </div>

        {action.value && "error" in action.value && action.value.error && (
          <div class="m-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {action.value.error}
          </div>
        )}

        <Form action={action} class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Tipe Thread
            </label>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              {threadTypes.map((type) => (
                <label class="cursor-pointer" key={type.id}>
                  <input
                    type="radio"
                    name="type"
                    value={type.id}
                    class="sr-only peer"
                    required
                  />
                  <div
                    class={`p-3 rounded-lg border-2 border-gray-200 peer-checked:border-green-500 peer-checked:${type.color} transition text-center h-full flex flex-col justify-center`}
                  >
                    <div class="font-medium text-sm">{type.label}</div>
                    <div class="text-xs text-gray-500 mt-1">{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Kategori
            </label>
            <select
              name="category"
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Pilih kategori...</option>
              {categories.map((cat) => (
                <option
                  value={cat.id}
                  key={cat.id}
                >{`${cat.icon} ${cat.label}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Judul Thread
            </label>
            <input
              type="text"
              name="title"
              placeholder="Tulis judul yang menarik dan deskriptif..."
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={100}
              required
            />
            <div class="text-xs text-gray-400 mt-1">Maksimal 100 karakter</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="fisika, eksperimen, diy (pisahkan dengan koma)"
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div class="text-xs text-gray-400 mt-1">
              Maksimal 5 tags, pisahkan dengan koma
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Konten
            </label>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-2">
                <button
                  type="button"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                  title="Code"
                >
                  💻
                </button>
                <button
                  type="button"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                  title="Math"
                >
                  ∑
                </button>
                <button
                  type="button"
                  class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                  title="Emoticon"
                >
                  😀
                </button>
              </div>
              <textarea
                name="content"
                placeholder="Tulis konten thread... Mendukung Markdown, LaTeX, dan emoticon Kaskus!"
                class="w-full p-4 resize-none focus:outline-none"
                rows={12}
                required
              ></textarea>
            </div>
            <div class="text-xs text-gray-400 mt-2 space-y-1">
              <div>
                <strong>Markdown:</strong> **bold**, *italic*, `code`, ##
                heading
              </div>
              <div>
                <strong>LaTeX:</strong> $$E = mc^2$$, $\alpha + \beta$
              </div>
              <div>
                <strong>Emoticon:</strong> :cendol :bata :mantap :cool
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <a
              href="/discussions"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Batal
            </a>
            <div class="flex gap-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
              >
                Simpan Draft
              </button>
              <button
                type="submit"
                disabled={action.isRunning}
                class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {action.isRunning ? "Memposting..." : "Posting Thread"}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Buat Thread Baru",
};
