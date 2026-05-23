import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log("🔄 Running database migrations...\n");

  try {
    console.log("Ensuring tables exist...");

    await sql`
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
    console.log("  ✓ profiles table");

    await sql`
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
    console.log("  ✓ posts table");

    await sql`CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "posts"("author_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts"("created_at")`;
    console.log("  ✓ posts indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" SERIAL PRIMARY KEY,
        "post_id" INTEGER REFERENCES "posts"("id") ON DELETE CASCADE,
        "author_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("  ✓ comments table");

    await sql`CREATE INDEX IF NOT EXISTS "comments_post_idx" ON "comments"("post_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "comments_author_idx" ON "comments"("author_id")`;
    console.log("  ✓ comments indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" SERIAL PRIMARY KEY,
        "owner_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "status" TEXT DEFAULT 'open' NOT NULL,
        "tags" TEXT,
        "stars_count" INTEGER DEFAULT 0 NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("  ✓ projects table");

    await sql`CREATE INDEX IF NOT EXISTS "projects_owner_idx" ON "projects"("owner_id")`;
    console.log("  ✓ projects indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" SERIAL PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "from_user_id" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
        "link" TEXT,
        "read" BOOLEAN DEFAULT FALSE NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("  ✓ notifications table");

    await sql`CREATE INDEX IF NOT EXISTS "notifications_user_idx" ON "notifications"("user_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "notifications_user_read_idx" ON "notifications"("user_id", "read")`;
    console.log("  ✓ notifications indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS "conversations" (
        "id" SERIAL PRIMARY KEY,
        "participant1_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "participant2_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "last_message_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("  ✓ conversations table");

    await sql`CREATE INDEX IF NOT EXISTS "conversations_participant1_idx" ON "conversations"("participant1_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "conversations_participant2_idx" ON "conversations"("participant2_id")`;
    console.log("  ✓ conversations indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL PRIMARY KEY,
        "conversation_id" INTEGER NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
        "sender_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "read" BOOLEAN DEFAULT FALSE NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("  ✓ messages table");

    await sql`CREATE INDEX IF NOT EXISTS "messages_conversation_idx" ON "messages"("conversation_id")`;
    await sql`CREATE INDEX IF NOT EXISTS "messages_sender_idx" ON "messages"("sender_id")`;
    console.log("  ✓ messages indexes");

    await sql`
      CREATE TABLE IF NOT EXISTS "science_shorts" (
        "id" SERIAL PRIMARY KEY,
        "author_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "thumbnail" TEXT NOT NULL,
        "duration" TEXT NOT NULL,
        "views" TEXT DEFAULT '0',
        "likes" INTEGER DEFAULT 0,
        "tags" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("  ✓ science_shorts table");

    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "institution" TEXT`;
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "level" TEXT DEFAULT 'SMA'`;
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "major" TEXT`;
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "bio" TEXT`;
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN DEFAULT FALSE`;
    console.log("  ✓ user table columns");

    console.log("\n✅ All migrations completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
