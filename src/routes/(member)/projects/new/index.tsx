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

const createProjectSchema = z.object({
  title: z.string().min(3, "Judul proyek minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  tags: z.string().optional().default(""),
});

export const useCreateProjectAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user) {
    throw req.redirect(302, "/login");
  }

  const parsed = createProjectSchema.safeParse({
    title: data.title,
    category: data.category,
    description: data.description,
    tags: data.tags,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { title, category, description, tags } = parsed.data;
  const allTags = [
    category,
    ...tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  ].join(", ");

  try {
    const db = getDb();
    await db.insert(schema.projects).values({
      ownerId: session.user.id,
      title,
      description,
      status: "open",
      tags: allTags,
      starsCount: 0,
    });

    throw req.redirect(302, "/projects");
  } catch (err) {
    if (err instanceof Error && err.constructor.name === "RedirectMessage") {
      throw err;
    }
    console.error("Gagal membuat proyek:", err);
    return { success: false, error: "Gagal menyimpan proyek ke database." };
  }
});

export default component$(() => {
  const action = useCreateProjectAction();

  return (
    <PlatformLayout title="Proyek Baru" activeNav="/projects">
      <div class="text-sm text-gray-400 mb-4">
        <a href="/projects" class="hover:text-green-600 transition">
          Proyek
        </a>
        <span class="mx-2">›</span>
        <span>Buat Proyek Baru</span>
      </div>
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h1 class="text-2xl font-bold">Buat Proyek Baru</h1>
          <p class="text-sm opacity-90 mt-1">
            Ajak komunitas berkolaborasi dalam eksperimen atau riset
          </p>
        </div>

        {action.value && "error" in action.value && action.value.error && (
          <div class="m-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {action.value.error}
          </div>
        )}

        <Form action={action} class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Judul Proyek
            </label>
            <input
              type="text"
              name="title"
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Contoh: Membangun Spektrometer Sederhana"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              name="category"
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Eksperimen">Eksperimen</option>
              <option value="Riset">Riset</option>
              <option value="DIY">DIY</option>
              <option value="Software">Software</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={5}
              placeholder="Jelaskan proyek dan tujuan..."
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="fisika, optik, diy"
            />
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <a
              href="/projects"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Batal
            </a>
            <button
              type="submit"
              disabled={action.isRunning}
              class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {action.isRunning ? "Memproses..." : "Buat Proyek"}
            </button>
          </div>
        </Form>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Proyek Baru" };
