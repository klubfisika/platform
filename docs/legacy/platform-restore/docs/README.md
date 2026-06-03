# 📚 KF13 Platform Documentation

> Dokumentasi ini dipakai untuk menjaga work platform yang sudah ada sambil memisahkan public site Astro dari app sosial Qwik.

## 🎯 **START HERE: Complete Development Guide**
- **[COMPLETE METHODOLOGY](./COMPLETE-METHODOLOGY.md)** ⭐ - **Full 11-phase restrukturisasi guide for developers**

## 🚀 Quick Start Guides
- **[Developer Handover](./HANDOVER.md)** - Onboarding for new developers
- **[Quick Reference](./QUICK-REFERENCE.md)** - Emergency procedures and commands

## 🏗️ Architecture & Design
- **[Profile Architecture](./profile-architecture.md)** - Component structure and design decisions
- **[Platform Proposal](./platform-proposal.md)** - Original platform vision and goals
- **[Database Strategy](./database-strategy.md)** - Data layer architecture decisions
- **[Domain & Hosting](./domain-hosting.md)** - Infrastructure and deployment strategy

## 📊 Performance & Quality
- **[Performance Report](./profile-performance.md)** - Metrics and benchmarks achieved
- **[Profile Roadmap](./profile-roadmap.md)** - Future development plans
- **[Mission Complete](./MISSION-COMPLETE.md)** - Project completion summary
- **[Final Report](./FINAL-REPORT.md)** - Executive summary and business impact

## 🎓 Knowledge & Legacy
- **[Legacy Documentation](./LEGACY.md)** - Long-term impact and future applications
- **[Platform Merge Inventory](./PLATFORM-MERGE-INVENTORY.md)** - Histori, aset, dan aturan penggabungan platform

## 🎯 Navigation by Role

### 👨‍💻 **For Developers (New to Project)**
1. **[COMPLETE METHODOLOGY](./COMPLETE-METHODOLOGY.md)** ← **Start here!**
2. [Developer Handover](./HANDOVER.md) - Quick setup
3. [Profile Architecture](./profile-architecture.md) - Understand the system
4. [Quick Reference](./QUICK-REFERENCE.md) - Daily commands

### 👔 **For Project Managers**
1. [Final Report](./FINAL-REPORT.md) - Business impact summary
2. [Mission Complete](./MISSION-COMPLETE.md) - Project achievements
3. [Legacy Documentation](./LEGACY.md) - Future planning

### 🏗️ **For Architects**
1. [Profile Architecture](./profile-architecture.md) - Technical design
2. [COMPLETE METHODOLOGY](./COMPLETE-METHODOLOGY.md) - Replication patterns
3. [Performance Report](./profile-performance.md) - Standards and benchmarks

---

## 🌟 **Key Achievement: 67% Performance Improvement**

The methodology documented here transformed the profile page from a basic component to an enterprise-grade system:
- **Bundle Size**: 45KB → 15KB (-67%)
- **Load Time**: 3.2s → 1.2s (-62%)  
- **Lighthouse**: 85/100 → 100/100
- **Accessibility**: Basic → WCAG 2.1 AA compliant
- **Architecture**: 1 monolith → 8 modular components

**This proven methodology can be replicated for any component on the platform.**
- [Domain & Hosting](./domain-hosting.md) - Strategi domain dan konfigurasi hosting
- [Database Strategy](./database-strategy.md) - Keputusan database (Supabase/PostgreSQL)

### Design System
- [Design System](./design-system.md) - Panduan komponen UI dan styling
- [Typography & Spacing Guide](./typography-spacing-guide.md) - Panduan tipografi dan spacing
- [Button Guide](./button-guide.md) - Panduan penggunaan komponen button

### Setup & Konfigurasi
- [Favicon & PWA Setup](./favicon-pwa-setup.md) - Konfigurasi favicon dan PWA

## 🏗️ Struktur Proyek

```
klubfisika.github.io/
├── src/
│   ├── components/     # Komponen UI
│   │   ├── qwik/       # Komponen Qwik (interaktif)
│   │   ├── ui/         # Komponen UI dasar
│   │   └── sections/   # Section components
│   ├── layouts/        # Layout templates
│   │   ├── Layout.astro        # Layout website utama
│   │   └── PlatformLayout.astro # Layout platform member
│   ├── pages/          # Halaman
│   │   ├── platform/   # Halaman platform (login required)
│   │   └── u/          # Profil publik user
│   ├── lib/            # Utilities
│   │   ├── router.ts   # Client-side routing guards
│   │   ├── kaskus.ts   # Sistem reputasi Kaskus-style
│   │   └── turso.ts    # Database client
│   ├── content/        # Content collections (blog)
│   └── assets/         # Static assets (images)
├── docs/               # Dokumentasi
├── public/             # Public assets
└── progress/           # Progress reports
```

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) v5 (SSG)
- **Interaktif**: [Qwik](https://qwik.builder.io) untuk komponen client-side
- **Database**: [Turso](https://turso.tech) (SQLite edge)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **Hosting**: GitHub Pages

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview
```

## 📁 Alias Path

| Alias | Path |
|-------|------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@lib/*` | `src/lib/*` |
| `@assets/*` | `src/assets/*` |
| `@data/*` | `src/data/*` |

## 🔗 Links

- Website: [klubfisika.github.io](https://klubfisika.github.io)
- Repository: [github.com/klubfisika/klubfisika.github.io](https://github.com/klubfisika/klubfisika.github.io)
