import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, type RequestHandler } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import ScienceShorts, { type Video } from "~/components/qwik/ScienceShorts";
import { getDb, schema } from "~/lib/db";
import { eq, desc } from "drizzle-orm";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

export const useShortsLoader = routeLoader$(async () => {
  const db = getDb();
  const rows = await db
    .select({
      id: schema.scienceShorts.id,
      title: schema.scienceShorts.title,
      authorName: schema.user.name,
      authorImage: schema.user.image,
      thumbnail: schema.scienceShorts.thumbnail,
      duration: schema.scienceShorts.duration,
      views: schema.scienceShorts.views,
      likes: schema.scienceShorts.likes,
      tags: schema.scienceShorts.tags,
    })
    .from(schema.scienceShorts)
    .leftJoin(schema.user, eq(schema.scienceShorts.authorId, schema.user.id))
    .orderBy(desc(schema.scienceShorts.createdAt));

  const videos: Video[] = rows.map(row => ({
    id: String(row.id),
    title: row.title,
    creator: row.authorName || "Anggota",
    avatar: row.authorImage || row.authorName?.charAt(0).toUpperCase() || 'U',
    thumbnail: row.thumbnail,
    duration: row.duration,
    views: row.views || '0',
    likes: row.likes || 0,
    tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
  }));

  return videos;
});

export default component$(() => {
  const shorts = useShortsLoader();
  return (
    <PlatformLayout title="Science Shorts" activeNav="/shorts">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">🎬 Science Shorts</h1>
        <p class="text-gray-500 mt-1">
          Video pendek seputar sains dan eksperimen
        </p>
      </div>
      <ScienceShorts videos={shorts.value} />
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Science Shorts" };
