import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import * as schema from './db/schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;
let migrationPromise: Promise<void> | null = null;

function getEnv(key: string): string {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key] as string;
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) return (import.meta as any).env[key];
  return '';
}

async function runAutoMigration(url: string) {
  try {
    const client = neon(url);
    // Driver HTTP Neon Serverless tidak mendukung multi-statement dipisah titik koma dalam satu panggilan,
    // oleh karena itu kita jalankan secara terpisah satu demi satu.
    await client`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "institution" TEXT`;
    await client`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "level" TEXT DEFAULT 'SMA'`;
    await client`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "major" TEXT`;
    await client`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "bio" TEXT`;
    await client`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN DEFAULT FALSE`;
    
    // Pembuatan tabel-tabel tambahan Klub Fisika
    await client`
      CREATE TABLE IF NOT EXISTS "profiles" (
        "id" SERIAL PRIMARY KEY,
        "user_id" TEXT NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
        "username" TEXT UNIQUE,
        "bio" TEXT,
        "institution" TEXT,
        "level" TEXT DEFAULT 'SMA',
        "major" TEXT,
        "year" TEXT,
        "phone" TEXT,
        "website" TEXT,
        "avatar_url" TEXT,
        "posts_count" INTEGER DEFAULT 0,
        "cendol_count" INTEGER DEFAULT 0,
        "bata_count" INTEGER DEFAULT 0,
        "onboarding_completed" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" SERIAL PRIMARY KEY,
        "author_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "type" TEXT DEFAULT 'discussion',
        "title" TEXT,
        "category" TEXT DEFAULT 'lounge',
        "content" TEXT NOT NULL,
        "tags" TEXT,
        "cendol_count" INTEGER DEFAULT 0,
        "bata_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `;
    await client`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'lounge'`;
    
    await client`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" SERIAL PRIMARY KEY,
        "owner_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'open',
        "tags" TEXT,
        "stars_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" SERIAL PRIMARY KEY,
        "post_id" INTEGER REFERENCES "posts"("id") ON DELETE CASCADE,
        "author_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    await client`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" SERIAL PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "from_user_id" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
        "link" TEXT,
        "read" BOOLEAN NOT NULL DEFAULT FALSE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await client`CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications"("user_id")`;
    await client`CREATE INDEX IF NOT EXISTS "notifications_user_read_idx" ON "notifications"("user_id", "read")`;
    
    await client`
      CREATE TABLE IF NOT EXISTS "conversations" (
        "id" SERIAL PRIMARY KEY,
        "participant1_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "participant2_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "last_message_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await client`CREATE INDEX IF NOT EXISTS "conversations_participant1_idx" ON "conversations"("participant1_id")`;
    await client`CREATE INDEX IF NOT EXISTS "conversations_participant2_idx" ON "conversations"("participant2_id")`;
    
    await client`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL PRIMARY KEY,
        "conversation_id" INTEGER NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
        "sender_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT FALSE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await client`CREATE INDEX IF NOT EXISTS "messages_conversation_idx" ON "messages"("conversation_id")`;
    await client`CREATE INDEX IF NOT EXISTS "messages_sender_idx" ON "messages"("sender_id")`;
    
    await client`
      CREATE TABLE IF NOT EXISTS "science_shorts" (
        "id" SERIAL PRIMARY KEY,
        "author_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "thumbnail" TEXT NOT NULL,
        "duration" TEXT NOT NULL,
        "views" TEXT DEFAULT '0',
        "likes" INTEGER DEFAULT 0,
        "tags" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Seeding data jika kosong
    const usersCount = await client`SELECT COUNT(*)::int as count FROM "user"`;
    if (usersCount[0].count === 0) {
      console.log('[Seeding] Basis data kosong. Memulai proses seeding data simulasi Klub Fisika...');
      // 1. Seed Users
      await client`INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at) VALUES 
        ('seed_moderator', 'moderator', 'moderator@klubfisika.or.id', true, null, now(), now()),
        ('seed_budi', 'Budi Santoso', 'budi@klubfisika.or.id', true, null, now(), now()),
        ('seed_ahmad', 'Ahmad Rizki', 'ahmad@klubfisika.or.id', true, null, now(), now()),
        ('seed_siti', 'Siti Nurhaliza', 'siti@klubfisika.or.id', true, null, now(), now())`;

      // 2. Seed Profiles
      await client`INSERT INTO "profiles" (user_id, username, bio, institution, level, major, year, posts_count, cendol_count, onboarding_completed, created_at, updated_at) VALUES 
        ('seed_moderator', 'moderator', 'Moderator platform Klub Fisika', 'Klub Fisika Indonesia', 'S3', 'Fisika', '2020', 10, 150, true, now(), now()),
        ('seed_budi', 'budi_fisika', 'Suka ngulik alat eksperimen optik bekas', 'SMA Negeri 3 Yogyakarta', 'SMA', 'Fisika', '2024', 5, 89, true, now(), now()),
        ('seed_ahmad', 'ahmad_osn', 'Persiapan OSN Fisika 2026', 'SMA Negeri 1 Jakarta', 'SMA', 'Fisika', '2026', 3, 23, true, now(), now()),
        ('seed_siti', 'siti_quantum', 'Tertarik di komputasi kuantum', 'Universitas Indonesia', 'S1', 'Fisika', '2023', 8, 120, true, now(), now())`;

      // 3. Seed Projects
      await client`INSERT INTO "projects" (owner_id, title, description, status, tags, stars_count, created_at, updated_at) VALUES 
        ('seed_budi', 'Interferometer Michelson DIY', 'Membangun interferometer dari barang bekas untuk eksperimen optik', 'in_progress', 'diy, optik, eksperimen', 89, now(), now()),
        ('seed_ahmad', 'Roket Air - Optimasi Tekanan', 'Eksperimen optimasi tekanan udara untuk jarak tempuh maksimal roket air', 'open', 'roket, aerodinamika', 45, now(), now()),
        ('seed_siti', 'Sensor Suhu + LCD Arduino', 'Sistem monitoring suhu real-time untuk eksperimen termodinamika', 'completed', 'arduino, sensor, iot', 156, now(), now())`;

      // 4. Seed Posts (Discussions & Feed Statuses)
      await client`INSERT INTO "posts" (id, author_id, type, title, category, content, tags, cendol_count, bata_count, created_at, updated_at) VALUES 
        (1, 'seed_moderator', 'megathread', 'Persiapan OSN Fisika 2026 - Tips, Materi, dan Diskusi', 'olympiad', 'Thread ini untuk diskusi persiapan OSN Fisika. Share tips, materi, dan tanya jawab seputar olimpiade fisika.', 'olimpiade, osn', 156, 0, now() - interval '2 hour', now()),
        (2, 'seed_moderator', 'tutorial', 'Diagram Alur Eksperimen Fisika Modern', 'modern', 'Diagram alur metodologi eksperimen fisika modern untuk mengukur konstanta Planck.', 'eksperimen, diagram, metodologi', 67, 2, now() - interval '6 hour', now()),
        (3, 'seed_budi', 'discussion', 'Berhasil bikin interferometer Michelson dari cermin bekas!', 'modern', 'Setelah 2 minggu trial error, akhirnya dapet pola interferensi yang bagus gan. Akhirnya berhasil bikin Interferometer Michelson dari barang bekas! 🎉 Total biaya cuma 50rb. Siapa yang mau tutorial lengkapnya?', 'diy, optik, eksperimen', 89, 0, now() - interval '5 hour', now()),
        (4, 'seed_ahmad', 'ask', 'Kenapa momentum angular kekal tapi energi kinetik tidak pada tumbukan?', 'mechanics', 'Agan2 sekalian, ane bingung nih kenapa pada tumbukan rotasi momentum angularnya kekal tapi energi kinetiknya berubah?', 'mekanika, tanya', 23, 0, now() - interval '1 day', now())`;
      
      await client`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts))`;

      // 5. Seed Comments
      await client`INSERT INTO "comments" (post_id, author_id, content, created_at, updated_at) VALUES 
        (1, 'seed_ahmad', 'Makasih infonya min, ngebantu banget buat persiapan osn!', now() - interval '1 hour', now()),
        (4, 'seed_siti', 'Bisa pake metode pendulum fisika atau water displacement. Untuk OSN biasanya...', now() - interval '12 hour', now())`;

        console.log('[Seeding] Sukses menyemai data tiruan awal ke PostgreSQL Neon.');
        // 6. Seed Notifications
        await client`INSERT INTO "notifications" (user_id, type, title, message, from_user_id, link, read) VALUES
          ('seed_moderator', 'cendol', 'Selamat! Anda mendapat cendol', 'Anda mendapatkan 10 cendol', null, null, false),
          ('seed_budi', 'reply', 'Balasan pada posting Anda', 'Ada balasan baru di post Anda', 'seed_ahmad', '/posts/1', false);`;
        // 7. Seed Conversations
        await client`INSERT INTO "conversations" (participant1_id, participant2_id, last_message_at) VALUES
          ('seed_budi', 'seed_ahmad', now()),
          ('seed_siti', 'seed_moderator', now());`;
        // 8. Seed Messages
        await client`INSERT INTO "messages" (conversation_id, sender_id, content, read) VALUES
          (1, 'seed_budi', 'Halo, ada update?', false),
          (1, 'seed_ahmad', 'Ya, sudah selesai', true),
          (2, 'seed_siti', 'Hai, mau kolaborasi?', false);`;

        // 9. Seed Science Shorts
        await client`INSERT INTO "science_shorts" (author_id, title, thumbnail, duration, views, likes, tags) VALUES
          ('seed_budi', 'Eksperimen Interferensi Cahaya 60 Detik! 🌈', 'https://placehold.co/300x400/3b82f6/ffffff?text=🔬', '0:58', '2.3K', 89, 'optik,eksperimen,diy'),
          ('seed_siti', 'Kenapa Langit Biru? Penjelasan Singkat ☁️', 'https://placehold.co/300x400/06b6d4/ffffff?text=🌌', '1:12', '5.1K', 156, 'atmosfer,cahaya,teori'),
          ('seed_ahmad', 'Bikin Generator Van de Graaff Mini ⚡', 'https://placehold.co/300x400/f59e0b/ffffff?text=⚡', '2:05', '1.8K', 67, 'listrik,generator,diy');`;
    }

    console.log('[AutoMigration] Kolom tambahan tabel user dan tabel-tabel Klub Fisika berhasil diselaraskan.');
  } catch (err) {
    console.error('[AutoMigration] Gagal menyelaraskan kolom/tabel database:', err);
  }
}

export function getDb() {
  const url = getEnv('DATABASE_URL');
  if (!url) throw new Error('DATABASE_URL is not set');

  if (!migrationPromise) {
    migrationPromise = runAutoMigration(url);
  }

  if (dbInstance) return dbInstance;

  const client = neon(url);
  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export { schema };
export type DbClient = ReturnType<typeof getDb>;

export async function getMemberByEmail(email: string) {
  const db = getDb();
  const [row] = await db
    .select({
      name: schema.user.name,
      email: schema.user.email,
      year: schema.profiles.year,
      major: schema.profiles.major,
    })
    .from(schema.user)
    .leftJoin(schema.profiles, eq(schema.user.id, schema.profiles.userId))
    .where(eq(schema.user.email, email))
    .limit(1);
  return row || null;
}

export async function updateMember(email: string, data: { name: string; year: string; major: string }) {
  const db = getDb();
  const [user] = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.email, email))
    .limit(1);
  if (!user) return;
  await db
    .update(schema.user)
    .set({ name: data.name })
    .where(eq(schema.user.id, user.id));
  await db
    .insert(schema.profiles)
    .values({ userId: user.id, year: data.year || null, major: data.major || null })
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: { year: data.year || null, major: data.major || null },
    });
}

export async function getPosts(limit: number = 20) {
  const db = getDb();
  const rows = await db
    .select({
      id: schema.posts.id,
      authorId: schema.posts.authorId,
      authorName: schema.user.name,
      content: schema.posts.content,
      type: schema.posts.type,
      title: schema.posts.title,
      tags: schema.posts.tags,
      cendolCount: schema.posts.cendolCount,
      createdAt: schema.posts.createdAt,
    })
    .from(schema.posts)
    .leftJoin(schema.user, eq(schema.posts.authorId, schema.user.id))
    .orderBy(desc(schema.posts.createdAt))
    .limit(limit);
  return rows;
}

export async function createPost(authorId: string, content: string) {
  const db = getDb();
  const [row] = await db
    .insert(schema.posts)
    .values({ authorId, content })
    .returning();
  return row;
}

export async function registerMember(data: {
  name: string; email: string; phone: string;
  year: string; major: string; university: string;
  motivation: string; interests: string;
}) {
  const db = getDb();
  const [userRow] = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.email, data.email))
    .limit(1);
  if (!userRow) throw new Error('User not found');
  const [profile] = await db
    .insert(schema.profiles)
    .values({
      userId: userRow.id,
      year: data.year || null,
      major: data.major || null,
      institution: data.university || null,
      onboardingCompleted: true,
    })
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: { year: data.year || null, major: data.major || null },
    })
    .returning();
  return profile;
}

export async function addLike(postId: number) {
  const db = getDb();
  await db
    .update(schema.posts)
    .set({ cendolCount: sql`${schema.posts.cendolCount} + 1` })
    .where(eq(schema.posts.id, postId));
}

export async function getNotifications(userId: string, limit: number = 20) {
  const db = getDb();
  return db
    .select({
      id: schema.notifications.id,
      type: schema.notifications.type,
      title: schema.notifications.title,
      message: schema.notifications.message,
      fromUserId: schema.notifications.fromUserId,
      fromUserName: schema.user.name,
      fromUserImage: schema.user.image,
      link: schema.notifications.link,
      read: schema.notifications.read,
      createdAt: schema.notifications.createdAt,
    })
    .from(schema.notifications)
    .leftJoin(schema.user, eq(schema.notifications.fromUserId, schema.user.id))
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(limit);
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  fromUserId?: string;
  link?: string;
}) {
  const db = getDb();
  const [row] = await db
    .insert(schema.notifications)
    .values({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      fromUserId: data.fromUserId || null,
      link: data.link || null,
    })
    .returning();
  return row;
}

export async function markNotificationRead(notificationId: number) {
  const db = getDb();
  await db
    .update(schema.notifications)
    .set({ read: true })
    .where(eq(schema.notifications.id, notificationId));
}

export async function markAllNotificationsRead(userId: string) {
  const db = getDb();
  await db
    .update(schema.notifications)
    .set({ read: true })
    .where(eq(schema.notifications.userId, userId));
}

export async function getUnreadNotificationCount(userId: string) {
  const db = getDb();
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications)
    .where(sql`${schema.notifications.userId} = ${userId} AND ${schema.notifications.read} = false`);
  return result?.count || 0;
}

export async function getConversations(userId: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: schema.conversations.id,
      participant1Id: schema.conversations.participant1Id,
      participant2Id: schema.conversations.participant2Id,
      lastMessageAt: schema.conversations.lastMessageAt,
      otherUserId: sql<string>`CASE WHEN ${schema.conversations.participant1Id} = ${userId} THEN ${schema.conversations.participant2Id} ELSE ${schema.conversations.participant1Id} END`,
    })
    .from(schema.conversations)
    .where(sql`${schema.conversations.participant1Id} = ${userId} OR ${schema.conversations.participant2Id} = ${userId}`)
    .orderBy(desc(schema.conversations.lastMessageAt));
  
  const withUserData = await Promise.all(
    rows.map(async (row) => {
      const [otherUser] = await db
        .select({ name: schema.user.name, image: schema.user.image })
        .from(schema.user)
        .where(eq(schema.user.id, row.otherUserId))
        .limit(1);
      const [lastMessage] = await db
        .select({ content: schema.messages.content, createdAt: schema.messages.createdAt, read: schema.messages.read })
        .from(schema.messages)
        .where(eq(schema.messages.conversationId, row.id))
        .orderBy(desc(schema.messages.createdAt))
        .limit(1);
      const [unreadCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.messages)
        .where(sql`${schema.messages.conversationId} = ${row.id} AND ${schema.messages.senderId} != ${userId} AND ${schema.messages.read} = false`);
      return {
        ...row,
        otherUserName: otherUser?.name || 'Unknown',
        otherUserImage: otherUser?.image || null,
        lastMessage: lastMessage?.content || '',
        lastMessageAt: lastMessage?.createdAt || row.lastMessageAt,
        unreadCount: unreadCount?.count || 0,
      };
    })
  );
  return withUserData;
}

export async function getOrCreateConversation(userId1: string, userId2: string) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(schema.conversations)
    .where(
      sql`(${schema.conversations.participant1Id} = ${userId1} AND ${schema.conversations.participant2Id} = ${userId2}) OR (${schema.conversations.participant1Id} = ${userId2} AND ${schema.conversations.participant2Id} = ${userId1})`
    )
    .limit(1);
  if (existing) return existing;
  
  const [newConv] = await db
    .insert(schema.conversations)
    .values({ participant1Id: userId1, participant2Id: userId2 })
    .returning();
  return newConv;
}

export async function sendMessage(conversationId: number, senderId: string, content: string) {
  const db = getDb();
  const [message] = await db
    .insert(schema.messages)
    .values({ conversationId, senderId, content })
    .returning();
  
  await db
    .update(schema.conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(schema.conversations.id, conversationId));
  
  return message;
}

export async function getMessages(conversationId: number, limit: number = 50) {
  const db = getDb();
  return db
    .select({
      id: schema.messages.id,
      senderId: schema.messages.senderId,
      senderName: schema.user.name,
      senderImage: schema.user.image,
      content: schema.messages.content,
      read: schema.messages.read,
      createdAt: schema.messages.createdAt,
    })
    .from(schema.messages)
    .leftJoin(schema.user, eq(schema.messages.senderId, schema.user.id))
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(schema.messages.createdAt)
    .limit(limit);
}

export async function markMessagesRead(conversationId: number, userId: string) {
  const db = getDb();
  await db
    .update(schema.messages)
    .set({ read: true })
    .where(sql`${schema.messages.conversationId} = ${conversationId} AND ${schema.messages.senderId} != ${userId} AND ${schema.messages.read} = false`);
}

export async function getTotalUnreadMessages(userId: string) {
  const db = getDb();
  const convs = await db
    .select({ id: schema.conversations.id })
    .from(schema.conversations)
    .where(sql`${schema.conversations.participant1Id} = ${userId} OR ${schema.conversations.participant2Id} = ${userId}`);
  
  let total = 0;
  for (const conv of convs) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.messages)
      .where(sql`${schema.messages.conversationId} = ${conv.id} AND ${schema.messages.senderId} != ${userId} AND ${schema.messages.read} = false`);
    total += result?.count || 0;
  }
  return total;
}
