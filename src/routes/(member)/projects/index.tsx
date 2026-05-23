import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { desc, eq } from "drizzle-orm";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

export const useProjectsData = routeLoader$(async () => {
  try {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.projects.id,
        title: schema.projects.title,
        description: schema.projects.description,
        status: schema.projects.status,
        tags: schema.projects.tags,
        starsCount: schema.projects.starsCount,
        createdAt: schema.projects.createdAt,
        authorName: schema.user.name,
      })
      .from(schema.projects)
      .leftJoin(schema.user, eq(schema.projects.ownerId, schema.user.id))
      .orderBy(desc(schema.projects.createdAt));

    return rows;
  } catch (err) {
    console.error("Gagal memuat proyek dari database:", err);
    return [];
  }
});

export default component$(() => {
  const projects = useProjectsData();

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
      case "in progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatStatus = (status: string) => {
    if (status.toLowerCase() === "in_progress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <PlatformLayout title="Proyek" activeNav="/projects">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">🔬 Proyek Komunitas</h1>
        <a
          href="/projects/new"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          + Proyek Baru
        </a>
      </div>

      {projects.value.length === 0 ? (
        <div class="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🔬
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Belum ada proyek kolaboratif
          </h3>
          <p class="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Mulai riset baru atau bagikan eksperimen mandiri Anda untuk mengajak
            anggota komunitas lainnya berkolaborasi!
          </p>
          <a
            href="/projects/new"
            class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm inline-block"
          >
            + Buat Proyek Pertama
          </a>
        </div>
      ) : (
        <div class="grid md:grid-cols-3 gap-4">
          {projects.value.map((p) => {
            const tagList = p.tags
              ? p.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [];

            return (
              <div
                class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                key={p.id}
              >
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span
                      class={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(p.status)}`}
                    >
                      {formatStatus(p.status)}
                    </span>
                    <span class="text-sm text-gray-400">⭐ {p.starsCount}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p class="text-sm text-gray-600 mb-3 line-clamp-3">
                    {p.description}
                  </p>
                </div>
                <div>
                  <div class="flex gap-1 flex-wrap mb-3">
                    {tagList.map((t: string) => (
                      <span
                        class="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                        key={t}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div class="text-xs text-gray-400">
                    oleh {p.authorName || "Anggota KF"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Proyek" };
