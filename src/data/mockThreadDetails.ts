import type { Thread } from '../components/qwik/ThreadRow';

export interface ThreadDetail extends Thread {
  content: string;
  image?: string;
  signature?: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  author: { name: string; rank: string; posts: number };
  content: string;
  cendol: number;
  bata: number;
  createdAt: string;
  isPertamax?: boolean;
  quote?: { author: string; text: string };
  nested?: Reply[];
  signature?: string;
}

// Slug generator
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    .replace(/-+$/, '');
}

// Extract unique ID from full slug (last segment after last dash)
export function extractUniqueId(fullSlug: string): string {
  const parts = fullSlug.split('-');
  return parts[parts.length - 1];
}

export const mockThreadDetails: Record<string, ThreadDetail> = {
  'persiapan-osn-fisika-2026-tips-materi-dan-diskusi-a1b2c3d4e5f6': {
    id: 'persiapan-osn-fisika-2026-tips-materi-dan-diskusi-a1b2c3d4e5f6',
    title: 'Persiapan OSN Fisika 2026 - Tips, Materi, dan Diskusi',
    type: 'megathread',
    author: { name: 'moderator', rank: 'Kaskus Geek', posts: 1234 },
    tags: ['olimpiade', 'osn', 'megathread'],
    replyCount: 1,
    lastActivity: '2 jam lalu',
    cendol: 156,
    bata: 0,
    isSticky: true,
    isHot: true,
    category: 'olympiad',
    content: `Halo agan-agan calon juara OSN! :salaman

Thread ini dibuat sebagai **pusat diskusi** untuk persiapan OSN Fisika 2026.

## Timeline OSN 2026

| Tahap | Tanggal | Keterangan |
|-------|---------|------------|
| OSN-K | Maret 2026 | Tingkat Kabupaten/Kota |
| OSN-P | Mei 2026 | Tingkat Provinsi |
| OSN Nasional | Agustus 2026 | Final! |

## Materi yang Harus Dikuasai

- Mekanika (kinematika, dinamika, rotasi)
- Termodinamika
- Listrik & Magnet
- Fisika Modern

Silakan diskusi di bawah! :jempol`,
    signature: '🏆 OSN Fisika - Pair of Minds, Pair of Hands',
    replies: [
      {
        id: 'r1',
        author: { name: 'calon_osn', rank: 'Kaskuser', posts: 45 },
        content: 'PERTAMAX! :pertamax\n\nMakasih min udah bikin thread ini!',
        cendol: 23,
        bata: 0,
        createdAt: '1 jam lalu',
        isPertamax: true,
      }
    ]
  },
  'berhasil-bikin-interferometer-michelson-dari-cermi-f7g8h9i0j1k2': {
    id: 'berhasil-bikin-interferometer-michelson-dari-cermi-f7g8h9i0j1k2',
    title: 'Berhasil bikin interferometer Michelson dari cermin bekas!',
    type: 'share',
    author: { name: 'budi_fisika', rank: 'Kaskus Holic', posts: 156 },
    tags: ['eksperimen', 'optik', 'diy'],
    replyCount: 67,
    lastActivity: '5 jam lalu',
    cendol: 89,
    bata: 0,
    isHot: true,
    category: 'modern',
    content: `Assalamualaikum agan-agan sekalian! :salaman

Ane mau share nih hasil eksperimen ane bikin **interferometer Michelson** dari barang-barang bekas. :cool

## Bahan-bahan

- Laser pointer merah (15rb di toko mainan)
- Cermin bekas dari kompak bedak (2 buah)
- Beam splitter dari kaca CD bekas
- Tripod HP buat holder

Keliatan kan pola gelap-terangnya? Itu bukti interferensi konstruktif dan destruktif! :gas`,
    image: '/images/posts/interferensi-eksperimen.png',
    signature: '"Physics is like sex: sure, it may give some practical results, but that\'s not why we do it." - Richard Feynman',
    replies: [
      {
        id: 'r1',
        author: { name: 'ahmad_fisika', rank: 'Kaskus Geek', posts: 890 },
        content: 'PERTAMAX GAN! :pertamax\n\nWih keren banget gan hasilnya! :mantap',
        cendol: 12,
        bata: 0,
        createdAt: '2 jam lalu',
        isPertamax: true,
        nested: [
          {
            id: 'r1-1',
            author: { name: 'budi_fisika', rank: 'Kaskus Holic', posts: 156 },
            content: 'Makasih gan! :jempol',
            cendol: 8,
            bata: 0,
            createdAt: '1 jam lalu',
          }
        ]
      }
    ]
  },
  'diagram-alur-eksperimen-fisika-modern-x9y8z7w6v5u4': {
    id: 'diagram-alur-eksperimen-fisika-modern-x9y8z7w6v5u4',
    title: 'Diagram Alur Eksperimen Fisika Modern',
    type: 'tutorial',
    author: { name: 'lab_master', rank: 'Kaskus Geek', posts: 445 },
    tags: ['eksperimen', 'diagram', 'metodologi'],
    replyCount: 23,
    lastActivity: '6 jam lalu',
    cendol: 67,
    bata: 2,
    isHot: false,
    category: 'modern',
    content: `# Metodologi Eksperimen Fisika Modern

Berikut adalah diagram alur standar untuk eksperimen fisika modern:

\`\`\`mermaid
flowchart TD
    A[Hipotesis] --> B[Desain Eksperimen]
    B --> C[Persiapan Alat]
    C --> D[Kalibrasi]
    D --> E[Pengambilan Data]
    E --> F{Data Valid?}
    F -->|Ya| G[Analisis Statistik]
    F -->|Tidak| H[Troubleshooting]
    H --> D
    G --> I[Interpretasi Hasil]
    I --> J{Hipotesis Terbukti?}
    J -->|Ya| K[Publikasi]
    J -->|Tidak| L[Revisi Hipotesis]
    L --> A
    K --> M[Peer Review]
\`\`\`

## Tahapan Detail

### 1. Persiapan
- Studi literatur
- Formulasi hipotesis
- Desain eksperimen

### 2. Eksekusi
- Setup peralatan
- Kalibrasi instrumen
- Pengambilan data

### 3. Analisis
- Pengolahan data
- Analisis statistik
- Interpretasi hasil

## Contoh Aplikasi

Diagram ini bisa diterapkan untuk berbagai eksperimen seperti:
- Spektroskopi atom
- Interferometri laser
- Deteksi partikel
- Pengukuran konstanta fisika`,
    replies: [
      {
        id: 'reply-1',
        author: { name: 'siti_quantum', rank: 'Kaskus Addict', posts: 234 },
        content: 'Diagram yang sangat membantu! Bisa ditambahkan tahap dokumentasi juga?',
        cendol: 12,
        bata: 0,
        createdAt: '5 jam lalu',
        replies: [
          {
            id: 'nested-1',
            author: { name: 'lab_master', rank: 'Kaskus Geek', posts: 445 },
            content: 'Good point! Dokumentasi memang penting di setiap tahap.',
            cendol: 8,
            bata: 0,
            createdAt: '4 jam lalu',
          }
        ]
      }
    ]
  },
  'derivasi-persamaan-schrodinger-dari-prinsip-varias-l3m4n5o6p7q8': {
    id: 'derivasi-persamaan-schrodinger-dari-prinsip-varias-l3m4n5o6p7q8',
    title: 'Derivasi Persamaan Schrödinger dari prinsip variasi',
    type: 'tutorial',
    author: { name: 'quantum_master', rank: 'Kaskus Geek', posts: 890 },
    tags: ['kuantum', 'matematika'],
    replyCount: 45,
    lastActivity: '4 jam lalu',
    cendol: 120,
    bata: 0,
    isHot: true,
    category: 'modern',
    content: `Halo agan-agan! :salaman

Derivasi **Persamaan Schrödinger** dari prinsip variasi.

## Lagrangian Density

$$\\mathcal{L} = i\\hbar \\psi^* \\frac{\\partial \\psi}{\\partial t} - \\frac{\\hbar^2}{2m} |\\nabla \\psi|^2 - V|\\psi|^2$$

## Hasil

$$i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi$$

Voila! **Persamaan Schrödinger**! :mantap`,
    signature: '∂ψ/∂t = iℏ⁻¹Ĥψ',
    replies: [
      {
        id: 'r1',
        author: { name: 'fisika_ui', rank: 'Kaskus Holic', posts: 234 },
        content: 'PERTAMAX! :pertamax\n\nGila gan, ini materi S2 dijelasin dengan sangat clear. Nih cendol :cendol :cendol :cendol',
        cendol: 25,
        bata: 0,
        createdAt: '3 jam lalu',
        isPertamax: true,
      },
      {
        id: 'r2',
        author: { name: 'newbie_quantum', rank: 'Newbie', posts: 5 },
        content: 'Gan, ane masih bingung di bagian variasi. Kenapa kita variasi terhadap $\\psi^*$ bukan $\\psi$? :bingung',
        cendol: 3,
        bata: 0,
        createdAt: '2 jam lalu',
      },
      {
        id: 'r3',
        author: { name: 'quantum_master', rank: 'Kaskus Geek', posts: 890 },
        content: 'Good question! :jempol\n\nKarena $\\psi$ dan $\\psi^\\*$ itu **independent variables** dalam functional. Kalo kita anggap $\\psi$ sebagai complex field, maka $\\psi^\\*$ juga harus divariasi secara terpisah.\n\nAnalogi: kayak variasi terhadap $x$ dan $y$ di fungsi $f(x,y)$.',
        cendol: 18,
        bata: 0,
        createdAt: '1 jam lalu',
        nested: [
          {
            id: 'r3-1',
            author: { name: 'newbie_quantum', rank: 'Newbie', posts: 5 },
            content: 'Ohhh gitu! Makasih gan penjelasannya :salaman',
            cendol: 5,
            bata: 0,
            createdAt: '45 menit lalu',
          }
        ]
      }
    ]
  },
  'kenapa-momentum-angular-kekal-tapi-energi-kinetik-r9s0t1u2v3w4': {
    id: 'kenapa-momentum-angular-kekal-tapi-energi-kinetik-r9s0t1u2v3w4',
    title: 'Kenapa momentum angular kekal tapi energi kinetik tidak pada tumbukan?',
    type: 'ask',
    author: { name: 'newbie_phy', rank: 'Newbie', posts: 3 },
    tags: ['mekanika', 'tanya'],
    replyCount: 1,
    lastActivity: '1 hari lalu',
    cendol: 45,
    bata: 0,
    isSolved: true,
    category: 'mechanics',
    content: `Agan-agan sekalian, ane bingung nih... :bingung

1. Kenapa momentum bisa kekal tapi energi tidak?
2. Kemana energi yang "hilang" itu pergi?

Mohon pencerahannya gan! :salaman`,
    replies: [
      {
        id: 'r1',
        author: { name: 'guru_fisika', rank: 'Kaskus Maniac', posts: 567 },
        content: 'Jawabannya ada di **Teorema Noether**:\n\n- Momentum kekal karena invariant terhadap translasi ruang\n- Energi kinetik berubah jadi panas, bunyi, deformasi\n\nTotal energi tetap kekal! :mantap',
        cendol: 35,
        bata: 0,
        createdAt: '23 jam lalu',
        isPertamax: true,
      }
    ]
  },
  'bikin-sensor-suhu-lcd-dengan-arduino-untuk-eksperi-x5y6z7a8b9c0': {
    id: 'bikin-sensor-suhu-lcd-dengan-arduino-untuk-eksperi-x5y6z7a8b9c0',
    title: 'Bikin sensor suhu + LCD dengan Arduino untuk eksperimen termodinamika',
    type: 'tutorial',
    author: { name: 'maker_phy', rank: 'Kaskus Maniac', posts: 567 },
    tags: ['arduino', 'diy', 'termodinamika'],
    replyCount: 34,
    lastActivity: '2 hari lalu',
    cendol: 78,
    bata: 2,
    category: 'lounge',
    content: `Halo agan-agan maker! :salaman

Tutorial: bikin **termometer digital** pake Arduino!

| Komponen | Harga |
|----------|-------|
| Arduino Uno | 50rb |
| DS18B20 | 15rb |
| LCD 16x2 I2C | 25rb |

\`\`\`cpp
void setup() {
  sensors.begin();
}

void loop() {
  float temp = sensors.getTempCByIndex(0);
  lcd.print(temp);
  delay(1000);
}
\`\`\`

Selamat mencoba! :gas`,
    signature: 'DIY or Die Trying 🔧',
    replies: [
      {
        id: 'r1',
        author: { name: 'arduino_newbie', rank: 'Newbie', posts: 8 },
        content: 'PERTAMAX! :pertamax\n\nMantap gan tutorialnya! Ane udah coba tapi kok LCD nya blank ya? :bingung',
        cendol: 12,
        bata: 0,
        createdAt: '1 hari lalu',
        isPertamax: true,
      },
      {
        id: 'r2',
        author: { name: 'maker_phy', rank: 'Kaskus Maniac', posts: 567 },
        content: 'Coba cek wiring I2C nya gan. Pastikan:\n- SDA ke pin A4\n- SCL ke pin A5\n- VCC ke 5V\n- GND ke GND\n\nKalo masih blank, coba scan I2C address dulu pake I2C scanner. :jempol',
        cendol: 25,
        bata: 0,
        createdAt: '20 jam lalu',
        nested: [
          {
            id: 'r2-1',
            author: { name: 'arduino_newbie', rank: 'Newbie', posts: 8 },
            content: 'Solved gan! Ternyata address I2C nya 0x3F bukan 0x27. Makasih! :salaman',
            cendol: 8,
            bata: 0,
            createdAt: '18 jam lalu',
          }
        ]
      },
      {
        id: 'r3',
        author: { name: 'lab_assistant', rank: 'Aktivis', posts: 156 },
        content: 'Keren gan! Ane mau pake ini buat praktikum termodinamika. Bisa ditambah data logging ke SD card gak? :cool',
        cendol: 15,
        bata: 0,
        createdAt: '12 jam lalu',
      }
    ]
  },
  'pengalaman-apply-phd-physics-di-luar-negeri-ama-d1e2f3g4h5i6': {
    id: 'pengalaman-apply-phd-physics-di-luar-negeri-ama-d1e2f3g4h5i6',
    title: 'Pengalaman apply PhD Physics di luar negeri - AMA',
    type: 'share',
    author: { name: 'phd_bound', rank: 'Kaskus Addict', posts: 312 },
    tags: ['karir', 'phd'],
    replyCount: 89,
    lastActivity: '2 hari lalu',
    cendol: 32,
    bata: 0,
    category: 'career',
    content: `Halo agan-agan! :salaman

Baru diterima di program PhD Physics di Jerman. Mau share pengalaman dari persiapan sampai diterima.

## Timeline Apply

- **Januari 2025**: Mulai research supervisor
- **Maret 2025**: Submit aplikasi
- **Juni 2025**: Interview online
- **Agustus 2025**: Diterima!

## Tips Penting

1. **Research dulu** - Baca paper calon supervisor
2. **Email yang baik** - Jangan copy-paste
3. **CV yang kuat** - Highlight research experience
4. **Bahasa Inggris** - IELTS minimal 6.5

Ask me anything! :jempol`,
    signature: 'PhD or bust! 🎓',
    replies: [
      {
        id: 'r1',
        author: { name: 'fresh_grad', rank: 'Kaskuser', posts: 23 },
        content: 'PERTAMAX! :pertamax\n\nSelamat gan! Boleh share contoh email ke supervisor?',
        cendol: 15,
        bata: 0,
        createdAt: '1 hari lalu',
        isPertamax: true,
      }
    ]
  },
  'flat-earth-itu-bener-gak-sih-serius-nanya-j7k8l9m0n1o2': {
    id: 'flat-earth-itu-bener-gak-sih-serius-nanya-j7k8l9m0n1o2',
    title: 'Flat Earth itu bener gak sih? Serius nanya',
    type: 'debat',
    author: { name: 'curious123', rank: 'Newbie', posts: 1 },
    replyCount: 156,
    lastActivity: '3 hari lalu',
    cendol: 5,
    bata: 20,
    isLocked: true,
    lockReason: 'Diskusi menyimpang dari topik utama',
    lockedAt: '3 jam lalu',
    category: 'lounge',
    content: `Ane penasaran aja gan... :bingung

Kan banyak yang bilang bumi itu datar. Tapi di sekolah diajarnya bulat.

Yang mana yang bener nih? Ada yang bisa jelasin pake bukti ilmiah?`,
    signature: 'Newbie yang penasaran',
    replies: [
      {
        id: 'r1',
        author: { name: 'moderator', rank: 'Kaskus Geek', posts: 1234 },
        content: 'Thread ini di-lock karena sudah terlalu banyak flame war.\n\nBumi itu bulat, sudah terbukti secara ilmiah sejak ribuan tahun lalu. :mantap',
        cendol: 45,
        bata: 0,
        createdAt: '3 hari lalu',
      }
    ]
  },
  'pembahasan-soal-osn-fisika-2025-nomor-1-5-p3q4r5s6t7u8': {
    id: 'pembahasan-soal-osn-fisika-2025-nomor-1-5-p3q4r5s6t7u8',
    title: 'Pembahasan Soal OSN Fisika 2025 - Nomor 1-5',
    type: 'share',
    author: { name: 'olimpiade_hunter', rank: 'Kaskus Holic', posts: 234 },
    tags: ['olimpiade', 'pembahasan'],
    replyCount: 78,
    lastActivity: '6 jam lalu',
    cendol: 95,
    bata: 0,
    category: 'olympiad',
    content: `Halo agan-agan OSN! :salaman

Ane coba bahas soal OSN Fisika 2025 kemarin. Semoga membantu yang mau persiapan tahun depan.

## Soal 1: Kinematika

Sebuah bola dilempar dengan kecepatan awal 20 m/s pada sudut 45°.

**Penyelesaian:**
- $v_x = v_0 \\cos 45° = 20 \\times 0.707 = 14.14$ m/s
- $v_y = v_0 \\sin 45° = 14.14$ m/s
- Waktu mencapai titik tertinggi: $t = \\frac{v_y}{g} = 1.44$ s

## Soal 2: Dinamika

Balok 5 kg ditarik gaya 50 N pada bidang miring 30°...

Lanjutan di comment! :gas`,
    signature: 'OSN Hunter 🏆',
    replies: [
      {
        id: 'r1',
        author: { name: 'calon_osn_2026', rank: 'Kaskuser', posts: 45 },
        content: 'PERTAMAX! :pertamax\n\nMakasih gan! Ane lagi persiapan OSN 2026 nih. Boleh lanjutin soal nomor 2? :salaman',
        cendol: 23,
        bata: 0,
        createdAt: '5 jam lalu',
        isPertamax: true,
      },
      {
        id: 'r2',
        author: { name: 'olimpiade_hunter', rank: 'Kaskus Holic', posts: 234 },
        content: 'Oke gan, lanjut soal 2:\n\n**Soal 2:** Balok 5 kg ditarik gaya 50 N pada bidang miring 30°, koefisien gesek 0.2.\n\n**Penyelesaian:**\n- $N = mg \\cos 30° = 5 \\times 10 \\times 0.866 = 43.3$ N\n- $f = \\mu N = 0.2 \\times 43.3 = 8.66$ N\n- $F_{net} = 50 - mg \\sin 30° - f = 50 - 25 - 8.66 = 16.34$ N\n- $a = F_{net}/m = 16.34/5 = 3.27$ m/s²\n\n:mantap',
        cendol: 45,
        bata: 0,
        createdAt: '4 jam lalu',
      },
      {
        id: 'r3',
        author: { name: 'guru_osn', rank: 'Kaskus Geek', posts: 678 },
        content: 'Pembahasan bagus gan! :jempol\n\nTambahan tips: untuk soal kinematika, selalu gambar diagram dulu. Banyak siswa langsung rumus tanpa analisis.',
        cendol: 28,
        bata: 0,
        createdAt: '3 jam lalu',
      }
    ]
  },
  'cara-cepat-selesaikan-soal-gerak-parabola-tanpa-ru-v9w0x1y2z3a4': {
    id: 'cara-cepat-selesaikan-soal-gerak-parabola-tanpa-ru-v9w0x1y2z3a4',
    title: 'Cara cepat selesaikan soal gerak parabola tanpa rumus',
    type: 'tutorial',
    author: { name: 'trik_fisika', rank: 'Aktivis', posts: 89 },
    tags: ['mekanika', 'tips'],
    replyCount: 23,
    lastActivity: '1 hari lalu',
    cendol: 56,
    bata: 3,
    category: 'mechanics',
    content: `Agan-agan, ane mau share trik yang ane pake waktu OSN dulu. :cool

## Trik Grafik

Daripada hafal rumus, mendingan pakai **grafik v-t**:

1. Gambar grafik kecepatan vertikal vs waktu
2. Luas di bawah kurva = perpindahan
3. Titik potong sumbu x = waktu total

## Contoh

Bola dilempar 30 m/s, sudut 60°:
- $v_y$ awal = 30 sin 60° = 26 m/s
- Grafik: segitiga dengan tinggi 26, alas 5.3 s
- Tinggi maksimum = ½ × 26 × 2.65 = 34.5 m

Lebih cepat dari rumus! :mantap`,
    signature: 'Trik > Rumus',
    replies: [
      {
        id: 'r1',
        author: { name: 'siswa_sma', rank: 'Newbie', posts: 7 },
        content: 'PERTAMAX! :pertamax\n\nWah keren gan! Ane selama ini pake rumus terus. Tapi kok bisa ya luas segitiga = tinggi maksimum? :bingung',
        cendol: 15,
        bata: 0,
        createdAt: '20 jam lalu',
        isPertamax: true,
      },
      {
        id: 'r2',
        author: { name: 'trik_fisika', rank: 'Aktivis', posts: 89 },
        content: 'Good question! :jempol\n\nKarena luas di bawah kurva v-t = perpindahan. Nah, dari t=0 sampai t=puncak, perpindahan vertikal = tinggi maksimum.\n\nLuas segitiga = $\\frac{1}{2} \\times \\text{alas} \\times \\text{tinggi} = \\frac{1}{2} \\times t_{\\text{puncak}} \\times v_{y,\\text{awal}}$\n\nSama dengan rumus: $h = \\frac{v_y^2}{2g}$ :mantap',
        cendol: 28,
        bata: 0,
        createdAt: '18 jam lalu',
      },
      {
        id: 'r3',
        author: { name: 'guru_fisika_sma', rank: 'Kaskus Holic', posts: 234 },
        content: 'Metode bagus gan! Ane juga ngajarin ini ke siswa. Visualisasi grafik bikin konsep lebih mudah dipahami daripada hafal rumus buta. :cool',
        cendol: 22,
        bata: 0,
        createdAt: '12 jam lalu',
      }
    ]
  },
  'tips-lolos-lpdp-untuk-jurusan-fisika-b5c6d7e8f9g0': {
    id: 'tips-lolos-lpdp-untuk-jurusan-fisika-b5c6d7e8f9g0',
    title: 'Tips Lolos LPDP untuk Jurusan Fisika',
    type: 'share',
    author: { name: 'lpdp_warrior', rank: 'Kaskus Addict', posts: 178 },
    tags: ['beasiswa', 'karir'],
    replyCount: 112,
    lastActivity: '8 jam lalu',
    cendol: 88,
    bata: 0,
    isHot: true,
    category: 'career',
    content: `Halo agan-agan! :salaman

Sharing pengalaman lolos LPDP 2025 untuk S2 Physics. Dari essay sampai interview.

## Persiapan Essay

**Essay Kontribusi** (yang paling penting):
- Jangan cuma nulis "mau jadi dosen"
- Spesifik: research apa, impact ke masyarakat
- Contoh: "Riset material superkonduktor untuk teknologi MRI murah"

**Essay Kepemimpinan**:
- Cerita konkret, bukan teori
- Quantify impact: "Melatih 50 siswa, 80% lolos SNMPTN"

## Interview

- **Dress code**: Formal, tapi jangan berlebihan
- **Bahasa**: Mix Indo-English, tunjukkan kemampuan
- **Pertanyaan favorit**: "Kenapa harus fisika?"

Good luck! :jempol`,
    signature: 'LPDP Awardee 2025 🎓',
    replies: [
      {
        id: 'r1',
        author: { name: 'fresh_grad_fisika', rank: 'Kaskuser', posts: 23 },
        content: 'PERTAMAX! :pertamax\n\nMakasih gan sharing nya! Ane lagi prepare LPDP 2026. Boleh share contoh essay kontribusi yang lolos? :salaman',
        cendol: 35,
        bata: 0,
        createdAt: '7 jam lalu',
        isPertamax: true,
      },
      {
        id: 'r2',
        author: { name: 'lpdp_warrior', rank: 'Kaskus Addict', posts: 178 },
        content: 'Boleh gan, tapi ane paraphrase ya:\n\n**"Saya akan mengembangkan material graphene untuk aplikasi sensor gas di industri pertambangan Indonesia. Target: mengurangi kecelakaan tambang 30% dalam 5 tahun melalui early warning system yang affordable."**\n\nKunci: **spesifik + measurable + Indonesia-centric** :mantap',
        cendol: 67,
        bata: 0,
        createdAt: '6 jam lalu',
      },
      {
        id: 'r3',
        author: { name: 'mahasiswa_s1', rank: 'Newbie', posts: 12 },
        content: 'Gan, kalo IPK 3.4 masih ada harapan gak ya? :sedih',
        cendol: 8,
        bata: 0,
        createdAt: '5 jam lalu',
      },
      {
        id: 'r4',
        author: { name: 'lpdp_alumni', rank: 'Kaskus Holic', posts: 456 },
        content: 'IPK 3.4 masih oke kok gan! Ane dulu 3.45 juga lolos. Yang penting essay dan achievement lainnya kuat. LPDP itu holistic assessment. :jempol',
        cendol: 42,
        bata: 0,
        createdAt: '4 jam lalu',
      }
    ]
  },
  'paradoks-kembar-dalam-relativitas-khusus-siapa-yan-h1i2j3k4l5m6': {
    id: 'paradoks-kembar-dalam-relativitas-khusus-siapa-yan-h1i2j3k4l5m6',
    title: 'Paradoks kembar dalam relativitas khusus - siapa yang lebih tua?',
    type: 'debat',
    author: { name: 'einstein_fan', rank: 'Kaskus Holic', posts: 345 },
    tags: ['relativitas', 'diskusi'],
    replyCount: 67,
    lastActivity: '12 jam lalu',
    cendol: 34,
    bata: 5,
    category: 'modern',
    content: `Agan-agan, ini topik klasik tapi masih banyak yang salah paham. :bingung

## Skenario

- Kembar A di Bumi
- Kembar B naik roket ke bintang, kecepatan 0.8c
- Perjalanan 10 tahun (menurut A)

## Pertanyaan

Siapa yang lebih tua saat B kembali?

**Jawaban umum**: B lebih muda karena time dilation.

**Tapi**: Dari sudut pandang B, A yang bergerak relatif terhadapnya. Jadi A yang harusnya lebih muda?

Ini yang bikin bingung! Ada yang bisa jelasin? :mikir`,
    signature: 'E = mc² enthusiast',
    replies: [
      {
        id: 'r1',
        author: { name: 'physics_prof', rank: 'Kaskus Geek', posts: 890 },
        content: 'Kuncinya di **akselerasi**! B mengalami akselerasi saat berangkat dan pulang, A tidak. Jadi B yang lebih muda. :mantap',
        cendol: 25,
        bata: 0,
        createdAt: '10 jam lalu',
      }
    ]
  },
  'diy-spektrometer-dari-dvd-bekas-hasil-analisis-spe-n7o8p9q0r1s2': {
    id: 'diy-spektrometer-dari-dvd-bekas-hasil-analisis-spe-n7o8p9q0r1s2',
    title: 'DIY Spektrometer dari DVD bekas - hasil analisis spektrum lampu',
    type: 'share',
    author: { name: 'maker_indo', rank: 'Aktivis', posts: 67 },
    tags: ['diy', 'optik', 'eksperimen'],
    replyCount: 29,
    lastActivity: '1 hari lalu',
    cendol: 72,
    bata: 0,
    category: 'modern',
    content: `Halo agan-agan! :salaman

Lanjutan project kemarin, sekarang udah bisa analisis spektrum lampu!

## Hasil Spektrum

**Lampu LED putih**:
- Peak biru: 450 nm
- Peak kuning: 580 nm
- Tidak ada hijau murni (gap 500-550 nm)

**Lampu neon**:
- Garis merkuri: 436, 546, 578 nm
- Fosfor: spektrum kontinu

## Setup

DVD bekas → slit → webcam → software ImageJ

Resolusi: ~2 nm. Lumayan untuk DIY! :gas`,
    signature: 'Spektroskopi Rakyat 🌈',
    replies: [
      {
        id: 'r1',
        author: { name: 'optics_student', rank: 'Kaskuser', posts: 34 },
        content: 'PERTAMAX! :pertamax\n\nKeren banget gan! Ane kuliah optik tapi belum pernah bikin spektrometer sendiri. DVD nya yang mana? Yang silver atau yang ungu? :cool',
        cendol: 18,
        bata: 0,
        createdAt: '22 jam lalu',
        isPertamax: true,
      },
      {
        id: 'r2',
        author: { name: 'maker_indo', rank: 'Aktivis', posts: 67 },
        content: 'Pake yang silver gan, yang ungu (DVD-R) kurang bagus difraksinya. DVD silver punya track spacing ~740 nm, cocok buat visible light.\n\nTips: lepas lapisan reflektif nya dulu, biar cuma plastic transparan aja. :jempol',
        cendol: 25,
        bata: 0,
        createdAt: '20 jam lalu',
      },
      {
        id: 'r3',
        author: { name: 'lab_fisika', rank: 'Kaskus Holic', posts: 189 },
        content: 'Mantap gan! Resolusi 2 nm udah bagus buat DIY. Spektrometer lab ane yang 50 juta juga cuma 1 nm :ngakak\n\nBoleh share tutorial lengkapnya? Mau ane pake buat praktikum mahasiswa.',
        cendol: 31,
        bata: 0,
        createdAt: '15 jam lalu',
      }
    ]
  }
};

// Lookup by full slug or unique ID suffix
export function getThreadDetail(fullSlug: string): ThreadDetail | undefined {
  if (mockThreadDetails[fullSlug]) {
    return mockThreadDetails[fullSlug];
  }
  const uniqueId = extractUniqueId(fullSlug);
  return Object.values(mockThreadDetails).find(t => t.id.endsWith(uniqueId));
}
