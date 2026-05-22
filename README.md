<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/klubfisika/platform/main/public/kf13-logo.png">
  <img alt="KF13 Platform" src="https://raw.githubusercontent.com/klubfisika/platform/main/public/kf13-logo.png" width="120">
</picture>

<h1 align="center">KF13 Platform</h1>

<p align="center">
  <strong>Jaringan sosial untuk ilmuwan, engineer, dan teknokrat Indonesia</strong><br>
  <em>Tempat kredibilitas dibangun dari diskusi dan karya nyata — bukan follower count</em>
</p>

<p align="center">
  <a href="https://community.klubfisika.or.id"><img src="https://img.shields.io/badge/live-community.klubfisika.or.id-065f46?style=flat-square" alt="Live"></a>
  <a href="https://github.com/klubfisika/community"><img src="https://img.shields.io/badge/monorepo-klubfisika%2Fcommunity-6366f1?style=flat-square&logo=github&logoColor=white" alt="Monorepo"></a>
  <img src="https://img.shields.io/badge/framework-Qwik_City-ac7ef4?style=flat-square&logo=qwik&logoColor=white" alt="Qwik">
  <img src="https://img.shields.io/badge/language-TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/styling-Tailwind_CSS_4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/database-Neon_PostgreSQL-00e599?style=flat-square&logo=postgresql&logoColor=white" alt="Neon">
  <img src="https://img.shields.io/badge/deploy-Vercel_Edge-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT"></a>
</p>

---

## Apa Ini?

**KF13 Platform** adalah jaringan sosial profesional yang dirancang khusus untuk komunitas STEM Indonesia. Bayangkan LinkedIn untuk kredibilitas + Kaskus untuk budaya komunitas — tapi khusus untuk ilmuwan, mahasiswa, dan engineer Indonesia.

Tempat bagi pelajar SMA hingga peneliti senior untuk:

- 💬 **Berdiskusi** tentang sains dan teknologi dalam bahasa yang mudah
- 🧪 **Berbagi proyek** riset, eksperimen, dan inovasi
- 🏆 **Membangun reputasi** nyata melalui kontribusi terverifikasi
- 🤝 **Menemukan kolaborator** dan mentor di bidangnya
- 📚 **Mempublikasikan karya** yang terindeks di [KF13 Index](https://github.com/klubfisika/index)

---

## Fitur

| Fitur | Deskripsi | Status |
|---|---|---|
| 📰 **Feed sosial** | Timeline posting — teks, gambar, proyek, pertanyaan | ✅ MVP |
| 💬 **Forum diskusi** | Subforum per topik (Fisika Modern, Olimpiade, dll) | ✅ MVP |
| 🛠️ **Proyek komunitas** | Katalog proyek dengan status, tag, dan star | ✅ MVP |
| 🎬 **Science Shorts** | Video pendek edukasi sains | ✅ MVP |
| 👤 **Profil publik** | Statistik aktivitas + portofolio karya | ✅ MVP |
| 📊 **Dashboard** | Statistik personal, grafik aktivitas, target mingguan | ✅ MVP |
| 🏅 **Sistem reputasi** | Cendol 🥒 & Bata 🧱 — 7 level rank ala Kaskus | ✅ MVP |
| 😄 **Emoticon Kaskus** | 18 emote: `:cendol:`, `:ngakak:`, `:pertamax:` ... | ✅ MVP |
| 🏆 **Kompetisi** | Direktori lomba sains nasional & internasional | ✅ MVP |
| 🔐 **Auth** | Login/register bcrypt + session cookie | ✅ MVP |
| 📱 **Mobile-first** | Responsive dengan bottom navigation | ✅ MVP |
| 🔬 **Integrasi Index** | Portofolio riset terverifikasi dari KF13 Index | 🔜 Soon |
| 🔔 **Notifikasi real-time** | WebSocket notifications | 🔜 Soon |
| 🌐 **i18n** | Multi-bahasa (ID, EN) | 🔜 Soon |

---

## Sistem Reputasi

Terinspirasi dari sistem reputasi Kaskus yang legendaris — bukan vanity metrics, tapi endorsement bermakna dari sesama anggota komunitas.

```
🥒 Cendol  =  endorsement positif (naik rank)
🧱 Bata     =  kritik membangun (warning)
```

| Level | Post | Rank |
|---|---|---|
| 0 | 0 | Newbie |
| 1 | 10 | Kaskuser |
| 2 | 50 | Aktivis |
| 3 | 100 | Kaskus Holic |
| 4 | 250 | Kaskus Addict |
| 5 | 500 | Kaskus Maniac |
| 6 | 1000 | Kaskus Geek |

**Emoticon yang tersedia:**

`:cendol:` `:bata:` `:ngakak:` `:malu:` `:cool:` `:bingung:` `:marah:` `:sedih:` `:takut:` `:love:` `:jempol:` `:salaman:` `:pertamax:` `:sundul:` `:repost:` `:hoax:` `:mantap:` `:gas:`

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                  KF13 Community Platform                 │
│              github.com/klubfisika/community             │
├────────────────────────┬────────────────────────────────┤
│     KF13 PLATFORM      │         KF13 INDEX             │
│  (repo ini)            │  github.com/klubfisika/index   │
│                        │                                 │
│  Sosial media STEM     │  Arsip riset K-12 Indonesia    │
│  Qwik City + Neon      │  SvelteKit + Drizzle           │
│  community.kf.or.id    │  index.kf.or.id                │
├────────────────────────┴────────────────────────────────┤
│               SATU IDENTITAS PENGGUNA                   │
│         Cookie domain: .klubfisika.or.id                │
│   Platform (siapa kamu) ↔ Index (apa karyamu)           │
└─────────────────────────────────────────────────────────┘
```

**Data flow:**
- Karya terverifikasi di Index → otomatis muncul di profil Platform
- Reputasi (cendol) di Platform → meningkatkan visibilitas karya di Index
- Satu akun, dua dimensi: sosial + akademik

---

## Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | [Qwik City](https://qwik.dev) 1.19 | Resumability — zero hydration overhead |
| Bahasa | TypeScript 5.4 | Type safety end-to-end |
| Styling | Tailwind CSS 4 | Utility-first, mobile-first |
| Database | PostgreSQL via [Neon](https://neon.tech) | Serverless, branching untuk dev |
| Auth | Custom bcrypt + session cookie | Kontrol penuh, future SSO-ready |
| Math | [KaTeX](https://katex.org) | Render LaTeX cepat di browser |
| Diagram | [Mermaid](https://mermaid.js.org) | Diagram dari Markdown |
| Deployment | Vercel Edge | Global CDN, cold start ~0ms |

---

## Mulai Development

```bash
# Clone
git clone git@github.com:klubfisika/platform.git
cd platform

# Install dependencies
bun install

# Setup environment
cp .env.example .env.local
# Edit .env.local:
# NEON_DATABASE_URL=postgres://...

# Jalankan dev server
bun run dev
```

### Commands

```bash
bun run dev           # Dev server (SSR mode) → http://localhost:5173
bun run build         # Production build
bun run build.server  # Vercel Edge build
bun run lint          # ESLint check
bun run fmt           # Prettier format
```

---

## Struktur Proyek

```
src/
├── components/
│   ├── platform/        # Layout (Header, Sidebar, BottomNav)
│   ├── qwik/            # Feature components (Feed, Forum, Projects...)
│   └── router-head/     # SEO & meta tags
├── routes/
│   ├── (auth)/          # Login & Register
│   ├── feed/            # Timeline utama
│   ├── discussions/     # Forum diskusi
│   ├── projects/        # Proyek komunitas
│   ├── explore/         # Jelajahi topik & anggota
│   ├── shorts/          # Science Shorts
│   ├── competitions/    # Direktori kompetisi
│   ├── overview/        # Dashboard personal
│   ├── u/[username]/    # Profil publik
│   ├── mulai/           # Landing page
│   ├── onboarding/      # Post-registration flow
│   └── api/             # API endpoints
├── lib/
│   ├── db.ts            # Database operations (raw pg)
│   ├── auth.ts          # Route auth guard
│   ├── kaskus.ts        # Rank & emoticon engine
│   ├── datasets.ts      # Institusi & lomba nasional
│   └── router.ts        # Route constants & guards
└── data/                # Mock data & static configs
```

---

## Berkontribusi

Platform ini open-source dan terbuka untuk kontribusi. Lihat [CONTRIBUTING.md](https://github.com/klubfisika/community/blob/main/CONTRIBUTING.md) untuk panduan lengkap.

**Quick start untuk kontributor:**

1. Fork repo ini
2. Buat branch: `git checkout -b feat/nama-fitur`
3. Commit dengan konvensi: `feat:`, `fix:`, `refactor:`, `docs:`
4. Submit pull request ke `main`

**Area yang butuh bantuan:**
- 🌐 Internasionalisasi (ID → EN)
- 🧪 Unit & integration tests
- ♿ Aksesibilitas (a11y)
- 📖 Dokumentasi komponen

---

## Lisensi

MIT © [Klub Fisika Indonesia](https://github.com/klubfisika)

---

<p align="center">
  <sub>Bagian dari <a href="https://github.com/klubfisika/community">KF13 Community Platform</a> · Diinisiasi oleh <a href="https://klubfisika.github.io">Klub Fisika Indonesia</a></sub>
</p>
