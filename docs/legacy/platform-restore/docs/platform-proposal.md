# KF13 Platform Proposal
## "Your Reddit and Your Github for your Research Career"

---

## Visi Utama

> "Platform KF13 seperti **Your Reddit and Your Github for your Research Career**"

Platform ini dirancang sebagai ekosistem digital yang menggabungkan kekuatan komunitas diskusi ala Reddit dengan sistem kolaborasi dan portfolio proyek ala GitHub, khusus untuk karir riset di bidang fisika.

---

## Identitas & Nuansa Platform

### Ciri Khas Forum Kaskus
> "Saya juga ingin membawakan **ciri khas forum kaskus supaya nuansa forum keindonesiaan kembali terasa nostalgianya**"

Elemen Kaskus yang diimplementasikan:
- **Sistem Cendol/Bata** - Pengganti upvote/downvote dengan nuansa lokal
- **Emoticon khas** - :cendol :bata :ngakak :pertamax :sundul
- **Sistem Rank** - Newbie → Kaskuser → Aktivis → Kaskus Holic → Kaskus Addict → Kaskus Maniac → Kaskus Geek
- **Budaya PERTAMAX** - Apresiasi untuk responder pertama
- **Quote style** yang khas dengan format "Originally Posted by"
- **Signature** - Kutipan personal di setiap post
- **Thread format** - Sticky, Hot Thread, Solved, Locked

### Inspirasi Platform Lain
> "Nuansa **reddit, home esp, atau bahkan hackaday.io dengan nuansa diy dan kits nya**"

- **Reddit** - Sistem karma, subreddit/subforum, voting, threaded discussions
- **GitHub** - Contribution graph, stars, project collaboration, portfolio
- **Hackaday.io** - DIY projects, kits, eksperimen, dokumentasi build
- **Home ESP** - Komunitas maker, hardware projects

---

## Target Pengguna

> "**Konsern dengan pengguna sejak usia SMP, SMA hingga kuliah** karena kami benar-benar ingin merancang platform ini sebagai **tempat berkumpul komunitas fisika**"

### Segmentasi Level Pendidikan

| Level | Warna Badge | Target Pengguna |
|-------|-------------|-----------------|
| SMP | 🔵 Biru | Siswa SMP yang mulai tertarik fisika |
| SMA | 🟢 Hijau | Siswa SMA, peserta OSN, klub fisika sekolah |
| Universitas | 🟣 Ungu | Mahasiswa S1 Fisika dan jurusan terkait |
| S2/S3 | 🟠 Oranye | Mahasiswa pascasarjana, peneliti muda |
| Profesional | 🔴 Merah | Dosen, peneliti, praktisi industri |

### Journey Pengguna
Platform mendukung perjalanan karir riset dari awal:
1. **SMP** - Mulai eksplorasi, bertanya, belajar dasar
2. **SMA** - Persiapan OSN, eksperimen sederhana, mulai kontribusi
3. **Kuliah** - Proyek riset, kolaborasi, publikasi, membangun portfolio
4. **Pascasarjana** - Mentoring, riset lanjutan, networking profesional

---

## Fitur Profil Publik

> "Halaman slug untuk detail user dengan username misal seperti milik **instagram.com/sandikodev dan twitter.com/@sandikodev atau github.com/sandikodev** yang nanti bisa lihat **profil, cendol ijo, kontribusi, project, dan lain lain** yang dapat pengguna gunakan sebagai **portfolio dalam karir mereka di bidang research** yang sudah mereka kerjakan"

### URL Format
```
klubfisika.github.io/u/{username}
```

### Komponen Profil Portfolio

#### Header Profil
- Avatar dan banner kustom
- Nama lengkap dan username
- Badge level pendidikan (SMP/SMA/Univ/S2-S3/Pro)
- Rank Kaskus berdasarkan aktivitas
- Bio/tagline personal
- Institusi dan lokasi
- Tanggal bergabung
- Link sosial media (GitHub, Twitter, LinkedIn)

#### Statistik Publik
- Total posts/thread
- Cendol (reputasi positif)
- Bata (reputasi negatif)
- Jumlah proyek
- Total kontribusi
- Skor reputasi keseluruhan

#### Research Timeline
Kronologi pencapaian dan milestone:
- 🏆 Prestasi (OSN, kompetisi, penghargaan)
- 🎓 Pendidikan (masuk sekolah/kuliah, lulus)
- 🔬 Proyek (memulai/menyelesaikan riset)
- 📝 Publikasi (paper, artikel, jurnal)
- 💼 Karir (magang, kerja, posisi)

#### Featured Projects
- Proyek unggulan dengan stars
- Status proyek (Open/In Progress/Completed)
- Tags teknologi dan bidang
- Link ke detail proyek

#### Contribution Graph
- Visualisasi aktivitas seperti GitHub
- Heatmap kontribusi 12 bulan terakhir
- Total kontribusi

#### Badges & Achievements
- Early Member, Top Contributor, Experimenter
- OSN Medalist, Educator, Mentor
- Cendol Master, Fast Learner, dll

#### Interests/Skills
- Tag bidang minat
- Keahlian teknis
- Area riset

---

## Struktur Platform

### Halaman Publik (Tanpa Login)
- `/` - Landing page website KF13
- `/blog` - Artikel dan konten edukasi
- `/about` - Tentang KF13
- `/gabung` - Login/Register
- `/u/{username}` - Profil publik (portfolio)

### Halaman Platform (Memerlukan Login)
- `/platform/overview` - Dashboard personal
- `/platform/discussions` - Forum diskusi (Reddit-style)
- `/platform/projects` - Proyek riset (GitHub-style)
- `/platform/explore` - Discover topics, users, projects
- `/platform/profile` - Edit profil sendiri

### Alur Pengguna

> "Tidak mungkin pengguna awam dapat mengingat path /platform dengan mudah, utamanya mereka pasti akan **membuka website sebagai entrypoint**"

```
Website (/) 
    ↓
Klik "Gabung" 
    ↓
/gabung (Login/Register)
    ├── Tab "Masuk" → Login dengan email
    └── Tab "Daftar Baru" → Registrasi
    ↓
/platform/overview (Dashboard)
```

---

## Fitur Forum Diskusi

### Subforum/Kategori
- ⚛️ Fisika Modern (Kuantum, Relativitas)
- 🔧 Mekanika (Klasik, Fluida)
- 🌡️ Termodinamika
- ⚡ Elektromagnetisme
- 🔭 Astrofisika
- 🏆 Olimpiade (OSN, IPhO)
- 💼 Karir & Kuliah
- 🎮 Lounge (Off-topic)

### Tipe Thread
- [ASK] - Pertanyaan
- [SHARE] - Berbagi pengalaman/pengetahuan
- [TUTORIAL] - Panduan langkah-langkah
- [DEBAT] - Diskusi/perdebatan
- [PROYEK] - Showcase proyek
- [MEGATHREAD] - Thread komprehensif

### Fitur Thread
- Sticky/Pin thread penting
- Hot Thread badge untuk thread populer
- Solved badge untuk pertanyaan terjawab
- Lock thread yang sudah selesai/bermasalah
- Quote dengan format Kaskus
- Emoticon forum
- Signature di setiap post

---

## Fitur Proyek Riset

### Tipe Proyek
- 🔬 Eksperimen - Proyek lab/DIY
- 💻 Simulasi/Komputasi - Kode dan visualisasi
- 📚 Edukasi/Materi - Catatan, modul, tutorial
- 🛠️ Tools/Software - Aplikasi dan utilitas
- 📝 Riset/Paper - Penelitian formal
- 🎯 Olimpiade - Persiapan kompetisi

### Status Proyek
- 🟢 Open - Mencari kontributor
- 🟡 In Progress - Sedang dikerjakan
- ✅ Completed - Selesai
- 🔒 Private - Tidak publik

### Fitur Proyek
- Stars (bookmark/apresiasi)
- Contributors list
- Tags teknologi dan bidang
- Link repository eksternal (GitHub)
- Update log
- Diskusi proyek

---

## Sistem Reputasi

### Cendol & Bata
- 🥒 Cendol (+1) - Apresiasi konten berkualitas
- 🧱 Bata (-1) - Konten tidak berkualitas/melanggar

### Karma/Reputasi
```
Reputasi = Total Cendol - Total Bata
```

### Rank Progression
| Posts | Rank |
|-------|------|
| 0+ | Newbie |
| 10+ | Kaskuser |
| 50+ | Aktivis |
| 100+ | Kaskus Holic |
| 250+ | Kaskus Addict |
| 500+ | Kaskus Maniac |
| 1000+ | Kaskus Geek |

---

## Teknologi

### Stack
- **Frontend**: Astro.js (SSG) + Qwik (interaktif)
- **Database**: Turso (SQLite edge)
- **Hosting**: GitHub Pages (static)
- **Auth**: localStorage session (client-side)

### Arsitektur
- Static Site Generation untuk performa optimal
- Client-side interactivity dengan Qwik
- Edge database untuk data dinamis
- Progressive enhancement

---

## Roadmap

### Phase 1 - Foundation ✅
- [x] Setup Astro + Qwik
- [x] Layout website dan platform
- [x] Sistem routing dan guards
- [x] Halaman login/register
- [x] Profil publik dengan username slug

### Phase 2 - Core Features
- [ ] Integrasi Turso untuk data persistence
- [ ] CRUD diskusi/thread
- [ ] CRUD proyek
- [ ] Sistem cendol/bata
- [ ] Real-time updates

### Phase 3 - Community
- [ ] Notifikasi
- [ ] Follow users
- [ ] Bookmark/save
- [ ] Search global
- [ ] Trending algorithm

### Phase 4 - Portfolio
- [ ] Export profil ke PDF
- [ ] Custom domain untuk profil
- [ ] Integrasi ORCID
- [ ] Verifikasi institusi

---

## Kesimpulan

KF13 Platform adalah jawaban untuk kebutuhan komunitas fisika Indonesia akan wadah yang:

1. **Inklusif** - Menerima dari SMP hingga profesional
2. **Lokal** - Nuansa Indonesia dengan budaya Kaskus
3. **Portfolio-ready** - Profil publik untuk karir riset
4. **Kolaboratif** - Proyek bersama seperti GitHub
5. **Diskursif** - Forum aktif seperti Reddit
6. **DIY-friendly** - Mendukung eksperimen dan maker culture

> "Tempat berkumpul komunitas fisika yang memiliki nuansa reddit, home esp, atau bahkan hackaday.io dengan nuansa diy dan kits nya"

---

*Dokumen ini dibuat berdasarkan visi dan gagasan founder KF13.*
*Dikelola oleh Yayasan Keluarga Fisika.*
*Terakhir diperbarui: 1 Januari 2026*


---

## Addendum: Identitas Platform

### Prinsip Desain UX

> "Sempurnakan platform, polish platform supaya **tidak terasa seperti forum dokumentatif yang boring**, namun lebih terasa seperti **sosial media yang ramah interaksi seperti Facebook** dan **eksploratif seperti Reddit** namun tetap **tidak meninggalkan nuansa kekeluargaan seperti Kaskus**, dan tetap **terasa teknis yang kuat seperti hackaday.io dan hackster.io**"

### Diferensiasi Platform

> "Sosial media spesifik yang dirancang untuk para **kreator, DIY, saintis, pembelajar dan peneliti di Indonesia** dengan kemampuan teknis platform yang lebih dalam"

### Diferensiasi dari Social Media Umum

| Aspek | Social Media Umum | KF13 Platform |
|-------|-------------------|---------------|
| Konten | General, viral-driven | Riset, eksperimen, pembelajaran |
| Interaksi | Like/Retweet | Cendol + Kolaborasi proyek |
| Profil | Bio singkat | Portfolio riset + timeline karir |
| Discovery | Algoritma engagement | Skill-based + bidang riset |
| Komunitas | Followers | Kontributor + mentor-mentee |
| Output | Thread viral | Paper, proyek, eksperimen terdokumentasi |

### Target Pengguna Spesifik
- **Kreator** - Pembuat konten edukasi fisika
- **DIY Enthusiast** - Eksperimenter dengan alat sederhana
- **Saintis** - Peneliti dan akademisi
- **Pembelajar** - Siswa SMP, SMA, mahasiswa
- **Peneliti** - Dari riset awal hingga publikasi

### Kemampuan Teknis Mendalam (Roadmap)
- LaTeX rendering untuk rumus matematika
- Code snippets dengan syntax highlighting
- Embedded simulations (PhET, GeoGebra)
- Dataset sharing & visualization
- Lab notebook digital
- Citation/reference system
- Peer review untuk proyek
- Version control untuk dokumen riset

*Ditambahkan: 1 Januari 2026*
