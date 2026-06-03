# Database Strategy

## Keputusan Arsitektur

> "Untuk sekelas sosial media saya pikir SQLite/Turso bukan cara yang ideal dan jelas akan memakan banyak bottleneck dan throttle. Saya menyarankan menggunakan **Supabase/PostgreSQL** jika server side rendering nanti sudah siap kita jalankan (akibat domain klubfisika.or.id dan .org belum siap)"

> "Baik untuk deploy production demo kita putuskan pakai **Turso DB**, namun untuk local `pnpm run dev` kita tetap utamakan **local file SQL database** dan reflected ke **localStorage** (untuk bagian bagian atau konteks yang memang cocok di localStorage)"

## Strategi Hybrid Database

### Environment-Based Database Strategy

| Environment | Primary Database | Secondary Storage | Use Case |
|-------------|------------------|-------------------|----------|
| **Development** | Local SQLite file (`./local.db`) | localStorage | Full development, seeding, testing |
| **Production Demo** | Turso (remote SQLite) | localStorage | GitHub Pages deployment |
| **Production Final** | Supabase (PostgreSQL) | localStorage | SSR dengan domain custom |

### Pembagian Data Storage

#### Database (SQLite/Turso/PostgreSQL)
- User profiles & authentication
- Posts, discussions, comments
- Projects & collaborations
- Reactions (cendol/bata)
- Relationships (follows, stars)

#### localStorage (Browser)
- **Session management** - Login state, current user
- **User preferences** - Theme, language, notifications
- **Cache** - Frequently accessed data (30 min TTL)
- **Offline sync** - Pending actions when offline
- **UI state** - Sidebar collapsed, filters, etc

### Implementation Strategy

#### Development (`pnpm run dev`)
```typescript
// Local SQLite file for development
const db = createClient({
  url: 'file:./local.db'  // No auth token needed
});

// Auto-seed with demo data
await seedDB(); // budi_fisika, siti_quantum, ahmad_osn
```

#### Production Demo (GitHub Pages)
```typescript
// Turso remote SQLite for production
const db = createClient({
  url: 'libsql://klubfisika-konxc.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
});
```

#### localStorage Integration
```typescript
// Session (always localStorage)
setSession({ id, username, name, email, level });

// Cache database queries
const posts = getCache('recent_posts') || await getPosts();
setCache('recent_posts', posts, 30); // 30 min TTL

// Offline sync
syncToLocalStorage('new_post', postData);
```

### Keuntungan Strategi Hybrid

1. **Development Speed** - Local SQLite cepat, tidak perlu internet
2. **Production Ready** - Turso untuk demo, Supabase untuk final
3. **Offline Support** - localStorage untuk cache & sync
4. **Performance** - Reduce database calls dengan smart caching
5. **User Experience** - Session & preferences persist di browser

## Fase Development

### Fase 1: Static Site (Sekarang)
- **Hosting**: GitHub Pages
- **Database**: localStorage (demo/prototype)
- **Auth**: Client-side session
- **Domain**: klubfisika.github.io

### Fase 2: SSR Ready (Planned)
- **Hosting**: Vercel / Railway / VPS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Domain**: klubfisika.or.id / klubfisika.org

## Perbandingan Database

| Aspek | SQLite/Turso | PostgreSQL/Supabase |
|-------|--------------|---------------------|
| Concurrent writes | Limited | Excellent |
| Real-time subscriptions | ❌ | ✅ Built-in |
| Full-text search | Basic | ✅ Advanced (tsvector) |
| Row-level security | Manual | ✅ Native RLS |
| Auth | Manual | ✅ Built-in |
| Storage (images) | ❌ | ✅ Included |
| Scaling | Edge-limited | Horizontal |
| Cost | Free tier generous | Free tier 500MB |

## Mengapa Supabase untuk KF13

1. **Real-time feeds** - Notifikasi, live updates, chat
2. **Auth built-in** - Google, GitHub, email/password
3. **Row Level Security** - Kontrol akses per user
4. **Storage** - Upload gambar proyek, avatar
5. **Full-text search** - Cari diskusi, proyek, member
6. **PostgreSQL power** - Complex queries, joins, indexes

## Schema Planning (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  institution TEXT,
  level TEXT, -- SMP, SMA, Universitas, S2/S3, Profesional
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts/Discussions
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id),
  title TEXT,
  content TEXT NOT NULL,
  type TEXT, -- discussion, question, project, achievement
  tags TEXT[],
  cendol_count INT DEFAULT 0,
  bata_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT, -- open, in_progress, completed
  tags TEXT[],
  stars_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions (Cendol/Bata)
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  type TEXT, -- cendol, bata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

## Migration Path

1. **Sekarang**: localStorage untuk demo
2. **Domain ready**: Setup Supabase project
3. **Migration**: Export localStorage → Supabase
4. **SSR**: Switch Astro ke `output: 'server'`
5. **Auth**: Implement Supabase Auth
6. **Real-time**: Enable subscriptions

## Environment Variables (Future)

```env
# Supabase
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## Catatan

- Turso tetap bisa digunakan untuk caching atau read-heavy data
- Supabase free tier cukup untuk MVP (500MB database, 1GB storage)
- Upgrade ke Pro ($25/mo) jika traffic meningkat
