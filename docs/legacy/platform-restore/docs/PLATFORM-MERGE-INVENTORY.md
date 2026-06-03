# Platform Merge Inventory

Dokumen ini menjaga jejak penggabungan pekerjaan platform dan memastikan tidak ada aset, histori, atau konteks produk yang hilang saat arah produk dipusatkan ke `community.klubfisika.or.id/apps/platform`.

## Tujuan

- `klubfisika.github.io` tetap menjadi public site Astro: landing page, blog, SEO, dan halaman organisasi.
- `platform` tetap menjadi area kerja aplikasi sosial.
- Komponen, route, dan dokumen lama tetap dipertahankan sebagai kompatibilitas dan referensi historis.

## Apa yang dipertahankan di repo ini

- Route platform sosial: `feed`, `discussions`, `projects`, `shorts`, `explore`, `profile`, `overview`, dan hub `/platform`.
- Guard session dan redirect login/onboarding berbasis `localStorage`.
- Komponen Qwik untuk interaksi aktif: profile, feed, discussion, search, onboarding, dan shell aplikasi.
- Sidebar kiri untuk navigasi global dan sidebar kanan untuk konteks halaman.
- Struktur data dan helper reputasi/Kaskus-style yang sudah terlanjur dibangun.
- Dokumen publik Astro yang bukan bagian dari aplikasi sosial tetap di tempatnya.

## Histori yang diamankan dari repo platform lama

- `58032b2` — rewrite README soal visi platform, fitur, dan gamification.
- `6e889b0` — rewrite README soal badges, arsitektur, dan tabel fitur.
- `f09ce58` — perbaikan badge/logo README.

Catatan:
- Commit-komit ini penting secara historis, tetapi isi utamanya adalah dokumentasi dan branding, bukan runtime logic.
- Histori tersebut dipertahankan lewat arsip branch/ref, bundle backup, dan cabang integrasi non-destruktif.

## Histori aktif di repo community

- `868d90e` — commit besar yang membawa tooling aplikasi: tests, Playwright, seed/migrate scripts, konfigurasi build, dan perubahan infra lain.
- Histori ini tetap menjadi jalur kerja aktif untuk aplikasi sosial.

## Aturan merge

- Jangan rewrite `main`.
- Jangan menghapus branch/refs arsip.
- Kalau ada route lama, pertahankan sebagai legacy alias atau redirect terkontrol.
- Kalau ada fitur duplikat, satukan di hub `/platform` lalu jadikan route lama sebagai kompatibilitas.
- Kalau ada komponen lama yang belum dipakai, pertahankan sampai fungsinya dipindahkan atau digantikan di jalur aktif.

## Jalur saat ini

- `/platform` = hub utama aplikasi sosial.
- `/platform/overview` = dashboard member.
- `/member` = legacy compatibility alias ke `/platform/overview`.
- `community.klubfisika.or.id/apps/platform` = lokasi kerja aktif untuk aplikasi sosial Qwik.

## Peta route ringkas

- `/platform` → landing hub sosial
- `/platform/overview` → ringkasan aktivitas member
- `/platform/feed` → timeline konten
- `/platform/discussions` → forum thread
- `/platform/projects` → showcase proyek
- `/platform/explore` → discovery
- `/platform/profile` → profil publik member
- `/member` → alias lama yang langsung mengarah ke `/platform/overview`
