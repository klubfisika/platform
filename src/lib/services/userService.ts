// Service layer for user‑related data fetching
import { getDb, schema } from "~/lib/db";
import { desc, sql, eq } from "drizzle-orm";

type ActiveUser = {
  id: string;
  name: string | null;
  image: string | null;
  username: string;
  isOnline: boolean;
  lastSeen: string;
};

type TrendingTopic = { tag: string; count: number };

type SuggestedUser = {
  id: string;
  name: string | null;
  image: string | null;
  username: string;
  bio: string;
  institution: string;
  postsCount: number;
  cendolCount: number;
};

type PlatformStats = {
  totalUsers: number;
  totalPosts: number;
  totalDiscussions: number;
};

type UpcomingEvent = {
  id: number;
  title: string;
  date: string;
  type: string;
  icon: string;
  participants: number;
};

function formatTimeAgo(date: Date | null | undefined): string {
  if (!date) return "Baru saja";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  return `${Math.floor(hours / 24)}h lalu`;
}

export async function getActiveUsers(): Promise<ActiveUser[]> {
  const db = getDb();
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const sessions = await db
    .select({ userId: schema.session.userId, updatedAt: schema.session.updatedAt })
    .from(schema.session)
    .where(sql`${schema.session.updatedAt} > ${fiveMinutesAgo}`)
    .orderBy(desc(schema.session.updatedAt));

  const uniqueUserIds = [...new Set(sessions.map((s) => s.userId))].slice(0, 5);
  if (uniqueUserIds.length === 0) return [];

  const users = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      image: schema.user.image,
      username: schema.profiles.username,
    })
    .from(schema.user)
    .leftJoin(schema.profiles, eq(schema.user.id, schema.profiles.userId))
    .where(sql`${schema.user.id} IN ${uniqueUserIds}`);

  const sessionMap = new Map(sessions.map((s) => [s.userId, s.updatedAt]));
  return users.map((u) => {
    const lastActive = sessionMap.get(u.id);
    const isOnline = lastActive && now.getTime() - new Date(lastActive).getTime() < 5 * 60 * 1000;
    const lastSeen = isOnline ? "Online" : formatTimeAgo(lastActive);
    return {
      id: u.id,
      name: u.name,
      image: u.image,
      username: u.username || u.name?.toLowerCase().replace(/\s+/g, "_") || "user",
      isOnline: !!isOnline,
      lastSeen,
    };
  });
}

export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  const db = getDb();
  const posts = await db
    .select({ tags: schema.posts.tags, cendolCount: schema.posts.cendolCount })
    .from(schema.posts)
    .where(sql`${schema.posts.tags} IS NOT NULL`)
    .orderBy(desc(schema.posts.cendolCount))
    .limit(20);

  const tagCount: Record<string, number> = {};
  posts.forEach((p) => {
    if (p.tags) {
      const tags = p.tags.split(",").map((t) => t.trim().toLowerCase());
      tags.forEach((tag) => {
        if (tag) tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  const trending = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  if (trending.length === 0) {
    return [
      { tag: "fisika", count: 42 },
      { tag: "olimpiade", count: 38 },
      { tag: "mekanika", count: 25 },
      { tag: "quantum", count: 21 },
      { tag: "termodinamika", count: 18 },
      { tag: "elektromagnetik", count: 15 },
      { tag: "optik", count: 12 },
      { tag: "astronomi", count: 10 },
    ];
  }
  return trending;
}

export async function getSuggestedUsers(): Promise<SuggestedUser[]> {
  const db = getDb();
  const users = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      image: schema.user.image,
      bio: schema.user.bio,
      institution: schema.user.institution,
      username: schema.profiles.username,
      postsCount: schema.profiles.postsCount,
      cendolCount: schema.profiles.cendolCount,
    })
    .from(schema.user)
    .leftJoin(schema.profiles, eq(schema.user.id, schema.profiles.userId))
    .orderBy(desc(schema.profiles.cendolCount))
    .limit(4);

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    image: u.image,
    username: u.username || u.name?.toLowerCase().replace(/\s+/g, "_") || "user",
    bio: u.bio || "Anggota baru komunitas fisika!",
    institution: u.institution || "SMA",
    postsCount: u.postsCount || 0,
    cendolCount: u.cendolCount || 0,
  }));
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const db = getDb();
  const [userCount, postCount, discussionCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(schema.user),
    db.select({ count: sql<number>`count(*)` }).from(schema.posts),
    db.select({ count: sql<number>`count(*)` }).from(schema.posts).where(eq(schema.posts.type, "discussion")),
  ]);
  return {
    totalUsers: userCount[0]?.count || 0,
    totalPosts: postCount[0]?.count || 0,
    totalDiscussions: discussionCount[0]?.count || 0,
  };
}

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  // Static placeholder events – replace with DB query when available
  return [
    {
      id: 1,
      title: "Olympiad Physics 2026",
      date: "15 Juni 2026",
      type: "competition",
      icon: "🏆",
      participants: 234,
    },
    {
      id: 2,
      title: "Fisika Ganesha Webinar",
      date: "20 Juni 2026",
      type: "event",
      icon: "📚",
      participants: 156,
    },
    {
      id: 3,
      title: "Research Challenge",
      date: "1 Juli 2026",
      type: "competition",
      icon: "🔬",
      participants: 89,
    },
  ];
}
