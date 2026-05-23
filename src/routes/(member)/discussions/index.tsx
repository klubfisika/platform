import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";
import DiscussionList from "~/components/qwik/DiscussionList";
import { getDb, schema } from "~/lib/db";
import { desc, eq, ne, sql } from "drizzle-orm";
import type { Thread } from "~/components/qwik/ThreadRow";

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

export const useDiscussionsLoader = routeLoader$(async () => {
  try {
    const db = getDb();

    // Subquery untuk menghitung balasan komentar per postingan
    const commentsCountSub = db
      .select({
        postId: schema.comments.postId,
        count: sql<number>`count(${schema.comments.id})::int`.as("count"),
      })
      .from(schema.comments)
      .groupBy(schema.comments.postId)
      .as("comments_count_sub");

    const rows = await db
      .select({
        id: schema.posts.id,
        authorId: schema.posts.authorId,
        authorName: schema.user.name,
        type: schema.posts.type,
        title: schema.posts.title,
        category: schema.posts.category,
        content: schema.posts.content,
        tags: schema.posts.tags,
        cendolCount: schema.posts.cendolCount,
        bataCount: schema.posts.bataCount,
        createdAt: schema.posts.createdAt,
        updatedAt: schema.posts.updatedAt,
        replyCount: sql<number>`COALESCE(${commentsCountSub.count}, 0)`.as(
          "reply_count",
        ),
      })
      .from(schema.posts)
      .leftJoin(schema.user, eq(schema.posts.authorId, schema.user.id))
      .leftJoin(commentsCountSub, eq(schema.posts.id, commentsCountSub.postId))
      .where(ne(schema.posts.type, "status")) // Kecualikan pembaruan status feed cepat
      .orderBy(desc(schema.posts.createdAt));

    // Petakan data baris database riil ke format Antarmuka Thread
    const threads: Thread[] = rows.map((row) => ({
      id: String(row.id),
      title: row.title || "Utas Tanpa Judul",
      type: (row.type as any) || "ask",
      excerpt: row.content
        ? row.content.slice(0, 160) + (row.content.length > 160 ? "..." : "")
        : "",
      author: {
        name: row.authorName || "Anggota KF",
        rank:
          (row.cendolCount || 0) > 50
            ? "Kaskus Geek"
            : (row.cendolCount || 0) > 20
              ? "Kaskus Holic"
              : "Newbie",
        posts: 10,
      },
      tags: row.tags
        ? row.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      replyCount: row.replyCount || 0,
      cendol: row.cendolCount || 0,
      bata: row.bataCount || 0,
      category: row.category || "lounge",
      lastActivity: formatTimeAgo(row.createdAt),
      lastReplyBy: row.authorName || "Anggota KF",
      isSticky: false,
      isHot: (row.replyCount || 0) > 15 || (row.cendolCount || 0) > 15,
    }));

    return threads;
  } catch (err) {
    console.error("Gagal mengambil data diskusi:", err);
    return [];
  }
});

export default component$(() => {
  const discussions = useDiscussionsLoader();

  return (
    <PlatformLayout title="Diskusi" activeNav="/discussions">
      <DiscussionList initialThreads={discussions.value} />
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Diskusi",
};
