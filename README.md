# KF13 Platform

> Platform sosial media untuk ilmuwan, engineer, dan teknokrat Indonesia — tempat kredibilitas dibangun dari diskusi dan karya nyata.

Bagian dari [KF13 Community Platform](https://github.com/klubfisika/community) — monorepo yang mengintegrasikan sosial media dengan arsip riset terpadu.

---

## Apa Ini?

**KF13 Platform** adalah jaringan sosial profesional yang dirancang khusus untuk komunitas STEM Indonesia. Terinspirasi oleh LinkedIn (kredibilitas profesional) dan Kaskus (budaya komunitas Indonesia), platform ini menjadi tempat bagi pelajar, mahasiswa, peneliti, dan praktisi untuk:

- Berbagi proyek dan eksperimen
- Berdiskusi tentang sains dan teknologi
- Membangun reputasi melalui sistem gamifikasi
- Menemukan kolaborator dan mentor
- Mempublikasikan dan mendiskusikan karya ilmiah

---

## Fitur

### Saat Ini

| Fitur | Deskripsi | Status |
|---|---|---|
| Feed sosial | Timeline posting dengan teks, gambar, proyek, dan pertanyaan | ✅ MVP |
| Diskusi forum | Subforum berdasarkan topik (Fisika Modern, Mekanika, Olimpiade, dll) | ✅ MVP |
| Proyek komunitas | Katalog proyek dengan status, tag, dan star | ✅ MVP |
| Science Shorts | Video pendek edukasi sains | ✅ MVP |
| Profil pengguna | Profil publik dengan statistik aktivitas | ✅ MVP |
| Dashboard overview | Statistik personal, grafik aktivitas, target mingguan | ✅ MVP |
| Sistem reputasi | Cendol (🥒) dan Bata (🧱) dengan 7 level rank Kaskus | ✅ MVP |
| Emoticon parser | 18 emote Kaskus-style (`:cendol:`, `:ngakak:`, `:pertamax:`) | ✅ MVP |
| Kompetisi | Direktori lomba sains nasional & internasional | ✅ MVP |
| Auth system | Login/register dengan bcrypt + session cookie (7 hari) | ✅ MVP |
| Mobile-first | Responsive dengan bottom nav untuk mobile | ✅ MVP |

### Mendatang

- [ ] Integrasi identitas dengan **index** (arsip riset)
- [ ] Mentorship matching
- [ ] Leaderboard & badge system
- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] API publik untuk third-party integration
- [ ] i18n multi-bahasa

---

## Sistem Reputasi

Platform menggunakan sistem gamifikasi terinspirasi Kaskus:

### Rank

| Level | Posts | Judul |
|---|---|---|
| 0 | 0 | Newbie |
| 1 | 10 | Kaskuser |
| 2 | 50 | Aktivis |
| 3 | 100 | Kaskus Holic |
| 4 | 250 | Kaskus Addict |
| 5 | 500 | Kaskus Maniac |
| 6 | 1000 | Kaskus Geek |

### Emoticon

`:cendol:` `:bata:` `:ngakak:` `:malu:` `:cool:` `:bingung:` `:marah:` `:sedih:` `:takut:` `:love:` `:jempol:` `:salaman:` `:pertamax:` `:sundul:` `:repost:` `:hoax:` `:mantap:` `:gas:`

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [Qwik City](https://qwik.dev) 1.19 |
| Bahasa | TypeScript 5.4 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via [Neon](https://neon.tech) serverless |
| Auth | Custom bcrypt + session cookie |
| Math | [KaTeX](https://katex.org) |
| Diagram | [Mermaid](https://mermaid.js.org) |
| Deployment | Vercel Edge |

---

## Development

### Setup

```bash
bun install
cp .env.example .env.local

# .env.local:
# NEON_DATABASE_URL=postgres://...
```

### Commands

```bash
bun run dev          # Development server (SSR mode)
bun run build        # Production build
bun run build.server # Vercel Edge build
bun run lint         # ESLint
bun run fmt          # Prettier
```

---

## Struktur Proyek

```
src/
├── components/
│   ├── platform/        # Layout components (Header, Sidebar)
│   ├── qwik/            # Feature components (Feed, Discussion, etc.)
│   └── router-head/     # SEO meta tags
├── routes/
│   ├── (auth)/          # Login & Register
│   ├── feed/            # Main timeline
│   ├── discussions/     # Forum diskusi
│   ├── projects/        # Proyek komunitas
│   ├── explore/         # Jelajahi topik
│   ├── shorts/          # Science Shorts
│   ├── competitions/    # Direktori kompetisi
│   ├── member/          # Member home
│   ├── overview/        # Dashboard personal
│   ├── profile/         # Pengaturan profil
│   ├── u/[username]/    # Profil publik
│   ├── mulai/           # Landing page
│   ├── onboarding/      # Post-registration flow
│   ├── design-system/   # Design system reference
│   └── api/             # API endpoints
├── lib/
│   ├── db.ts            # Database operations
│   ├── auth.ts          # Route loader auth guard
│   ├── kaskus.ts        # Rank & emoticon system
│   ├── datasets.ts      # Institution & competition data
│   └── router.ts        # Route constants & guards
└── data/                # Mock data & configs
```

---

## Domain

Production: [community.klubfisika.or.id](https://community.klubfisika.or.id)

---

<p align="center">
  <sub>Bagian dari <a href="https://github.com/klubfisika/community">KF13 Community Platform</a> · Diinisiasi oleh <a href="https://klubfisika.github.io">Klub Fisika Indonesia</a></sub>
</p>
