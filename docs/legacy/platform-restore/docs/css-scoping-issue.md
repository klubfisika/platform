# Masalah CSS Scoping Astro + Tailwind v4

## Diagram Alur Masalah

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CARA IMPORT CSS DI ASTRO                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐    ┌─────────────────────────────────────┐
│  ❌ BERMASALAH                  │    │  ✅ BENAR                           │
│                                 │    │                                     │
│  <style>                        │    │  ---                                │
│    @import "platform.css";      │    │  import '@styles/platform.css';    │
│  </style>                       │    │  ---                                │
└────────────────┬────────────────┘    └──────────────────┬──────────────────┘
                 │                                        │
                 ▼                                        ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────────┐
│  Astro SCOPING aktif            │    │  Astro SCOPING tidak aktif          │
│  (menambah [data-astro-cid-xx]) │    │  (CSS tetap global)                 │
└────────────────┬────────────────┘    └──────────────────┬──────────────────┘
                 │                                        │
                 ▼                                        ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────────┐
│  CSS OUTPUT:                    │    │  CSS OUTPUT:                        │
│                                 │    │                                     │
│  [data-astro-cid-xxx] {         │    │  *, *::before, *::after {           │
│    margin: 0;  ← dari Tailwind  │    │    margin: 0;                       │
│  }                              │    │  }                                  │
│                                 │    │                                     │
│  .lg\:ml-64 {                   │    │  .lg\:ml-64 {                       │
│    margin-left: 16rem;          │    │    margin-left: 16rem;              │
│  }                              │    │  }                                  │
└────────────────┬────────────────┘    └──────────────────┬──────────────────┘
                 │                                        │
                 ▼                                        ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────────┐
│  SPECIFICITY BATTLE:            │    │  SPECIFICITY BATTLE:                │
│                                 │    │                                     │
│  [data-astro-cid-xxx]           │    │  * (universal)                      │
│  = 0,1,0 (1 attribute)          │    │  = 0,0,0                            │
│                                 │    │                                     │
│  .lg\:ml-64                     │    │  .lg\:ml-64                         │
│  = 0,1,0 (1 class)              │    │  = 0,1,0 (1 class)                  │
│                                 │    │                                     │
│  SAMA! → yang terakhir menang   │    │  CLASS MENANG! ✅                   │
│  → margin: 0 menang ❌          │    │                                     │
└────────────────┬────────────────┘    └──────────────────┬──────────────────┘
                 │                                        │
                 ▼                                        ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────────┐
│  HASIL:                         │    │  HASIL:                             │
│                                 │    │                                     │
│  <div class="lg:ml-64">         │    │  <div class="lg:ml-64">             │
│    margin-left: 0 ❌            │    │    margin-left: 16rem ✅            │
│                                 │    │                                     │
│  Main content TERTUTUP sidebar  │    │  Main content TIDAK tertutup       │
└─────────────────────────────────┘    └─────────────────────────────────────┘
```

## Visualisasi Layout

```
❌ SEBELUM (margin-left ter-override)
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  Sidebar   │  ┌─────────────────────────────────────────┐   │
│  (fixed)   │  │ Main Content                            │   │
│            │  │ TERTUTUP SIDEBAR!                       │   │
│  w-64      │  │                                         │   │
│  left-0    │  │ lg:ml-64 tidak bekerja                  │   │
│            │  │ karena margin: 0 dari scoped CSS        │   │
│            │  └─────────────────────────────────────────┘   │
└────────────┴─────────────────────────────────────────────────┘

✅ SESUDAH (margin-left bekerja)
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  Sidebar   │  ┌─────────────────────────────────────────┐   │
│  (fixed)   │  │ Main Content                            │   │
│            │  │                                         │   │
│  w-64      │  │ lg:ml-64 = margin-left: 16rem           │   │
│  left-0    │  │ BEKERJA DENGAN BENAR!                   │   │
│            │  │                                         │   │
│            │  └─────────────────────────────────────────┘   │
│            │  ↑                                              │
│            │  └── 16rem (256px) margin                      │
└────────────┴─────────────────────────────────────────────────┘
```

## Kesimpulan

| Metode Import | Scoping | Tailwind Works? |
|---------------|---------|-----------------|
| `<style>@import</style>` | ✅ Ya (scoped) | ❌ Tidak |
| `import 'css'` di frontmatter | ❌ Tidak (global) | ✅ Ya |
