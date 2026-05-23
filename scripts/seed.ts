import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function seed() {
  console.log("🌱 Starting comprehensive seed...\n");

  const createdUsers: string[] = [];
  const seedUsers = [
    {
      id: "seed-user-1",
      email: "alice@kf13.id",
      name: "Alice Fatmawati",
      institution: "Universitas Indonesia",
      level: "Kuliah",
      major: "Fisika",
      bio: "Mahasiswa fiska teori, suka debat quantum",
    },
    {
      id: "seed-user-2",
      email: "bob@kf13.id",
      name: "Bob Prasetyo",
      institution: "SMA Negeri 2 Yogyakarta",
      level: "SMA",
      major: "IPA",
      bio: "Siswa olimpiade fisika",
    },
    {
      id: "seed-user-3",
      email: "carol@kf13.id",
      name: "Carol Antoinette",
      institution: "Institut Teknologi Bandung",
      level: "Kuliah",
      major: "Teknik Fisika",
      bio: "Peneliti energi terbarukan",
    },
    {
      id: "seed-user-4",
      email: "david@kf13.id",
      name: "David Wijaya",
      institution: "SMA Negeri 1 Surabaya",
      level: "SMA",
      major: "IPA",
      bio: "Future physicist",
    },
    {
      id: "seed-user-5",
      email: "eva@kf13.id",
      name: "Eva Susilowati",
      institution: "Universitas Gadjah Mada",
      level: "Kuliah",
      major: "Astronomi",
      bio: "Stargazer & astrophysics enthusiast",
    },
    {
      id: "seed-user-6",
      email: "fajar@kf13.id",
      name: "Fajar Rahmadi",
      institution: "SMA Negeri 3 Jakarta",
      level: "SMA",
      major: "IPA",
      bio: "Olimpiade physics champion",
    },
    {
      id: "seed-user-7",
      email: "hana@kf13.id",
      name: "Hana Lestari",
      institution: "Universitas Brawijaya",
      level: "Kuliah",
      major: "Fisika Medis",
      bio: "Researcher in medical physics",
    },
    {
      id: "siti-nurhaliza",
      email: "siti@kf13.id",
      name: "Siti Nurhaliza",
      institution: "SMA Negeri 1 Bandung",
      level: "SMA",
      major: "IPA",
      bio: "Kaskus Addict - 312 posts · 567 cendol · 8 proyek",
      onboardingCompleted: true,
    },
  ];

  console.log("👤 Creating users...");
  for (const u of seedUsers) {
    const existing = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, u.email))
      .limit(1);
    if (existing.length > 0) {
      console.log(`  ⏭️  Skip ${u.email} (exists)`);
      createdUsers.push(existing[0].id);
    } else {
      await db.insert(schema.user).values({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: true,
        image: null,
        institution: u.institution,
        level: u.level,
        major: u.major,
        bio: u.bio,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  ✓ Created: ${u.name}`);
      createdUsers.push(u.id);
    }
  }

  console.log("\n📋 Creating profiles...");
  for (const userId of createdUsers) {
    const existing = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .limit(1);
    if (existing.length > 0) {
      console.log(`  ⏭️  Skip profile ${userId}`);
    } else {
      await db.insert(schema.profiles).values({
        userId,
        username: userId.replace("seed-user-", "user").replace("-", "_"),
        bio: "anggota aktif KF13",
        institution: "Institution",
        level: "SMA",
        major: "IPA",
        year: "2024",
        postsCount: Math.floor(Math.random() * 100),
        cendolCount: Math.floor(Math.random() * 50),
        onboardingCompleted: true,
      });
      console.log(`  ✓ Profile: ${userId}`);
    }
  }

  console.log("\n📝 Creating posts (discussions)...");
  const posts = [
    {
      authorId: createdUsers[0],
      type: "discussion",
      title: "apa itu entanglement quantum?",
      category: "fisika-kuantum",
      content:
        "mau tanya nih, apa itu quantum entanglement dan gimana cara kerjanya? siapa yang sudah pernah belajar ini?",
      tags: "kuantum,entanglement,quantum",
      cendolCount: 42,
    },
    {
      authorId: createdUsers[1],
      type: "ask",
      title: "tips olimpiade fisika",
      category: "olimpiade",
      content:
        "halo kakak2, mau tanya tips buat persiapan olimpiade fisika tahun depan. materi apa saja yang harus dikuasai?",
      tags: "olimpiade,tips,fisika",
      cendolCount: 38,
    },
    {
      authorId: createdUsers[2],
      type: "proyek",
      title: "panel surya homemade",
      category: "proyek",
      content:
        "lagi bangun panel surya dari bahan daur ulang, siapa mau collaborate? targetnya buat lampu darurat untuk rumah.",
      tags: "energi,diy,panel-surya",
      cendolCount: 25,
    },
    {
      authorId: createdUsers[3],
      type: "tutorial",
      title: "cara belajar mekanika dengan mudah",
      category: "belajar",
      content:
        "bagi pengalaman belajar mekanika yang efektif dong. saya masih kelas 10 dan kadang suka nemu soal yang sulit.",
      tags: "mekanika,tutorial,belajar",
      cendolCount: 21,
    },
    {
      authorId: createdUsers[4],
      type: "debat",
      title: "apakah black hole bisa hilang?",
      category: "astronomi",
      content:
        "Hawking radiation - apa benar black hole bisa menguap? siapa yang bisa jelaskan dengan bahasa yang mudah dipahami?",
      tags: "blackhole,astronomi,hawking",
      cendolCount: 18,
    },
    {
      authorId: createdUsers[5],
      type: "discussion",
      title: "[MEGATHREAD] Persiapan OSN Fisika 2026",
      category: "olimpiade",
      content:
        "Thread ini untuk diskusi persiapan OSN Fisika. Share tips, materi, dan tanya jawab seputar olimpiade fisika. Jangan lupa follow thread ini ya!",
      tags: "osn,olimpiade,tips,megathread",
      cendolCount: 156,
    },
    {
      authorId: createdUsers[6],
      type: "share",
      title: "Eksperimen Interferensi Cahaya sederhana",
      category: "eksperimen",
      content:
        "Bikin eksperimen interferensi cahaya menggunakan laser pointer dan CD-ROM. Hasilnya luar biasa!",
      tags: "optik,eksperimen,diy",
      cendolCount: 67,
    },
    {
      authorId: createdUsers[0],
      type: "discussion",
      title: "Kenapa langit biru?",
      category: "atmosfer",
      content:
        "Penjelasan singkat tentang fenomena langit biru. Siapa yang tau jawabannya?",
      tags: "atmosfer,cahaya,fisika",
      cendolCount: 45,
    },
    {
      authorId: createdUsers[2],
      type: "proyek",
      title: "Bikin Generator Van de Graaff Mini",
      category: "listrik",
      content:
        "Lagi bangun generator Van de Graaff mini dari barang bekas. Siapa mau ikut?",
      tags: "listrik,generator,diy",
      cendolCount: 89,
    },
    {
      authorId: createdUsers[4],
      type: "ask",
      title: "Rekomendasi buku fisika untuk pemula",
      category: "belajar",
      content:
        "Mau belajar fisika dari dasar. Ada rekomendasi buku yang bagus dan mudah dipahami?",
      tags: "buku,belajar,fisika",
      cendolCount: 33,
    },
  ];

  for (const p of posts) {
    const existing = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.title, p.title))
      .limit(1);
    if (existing.length > 0) {
      console.log(`  ⏭️  Skip: "${p.title.substring(0, 30)}..."`);
    } else {
      await db.insert(schema.posts).values({
        authorId: p.authorId,
        type: p.type,
        title: p.title,
        category: p.category,
        content: p.content,
        tags: p.tags,
        cendolCount: p.cendolCount,
        bataCount: Math.floor(Math.random() * 5),
      });
      console.log(`  ✓ Created: ${p.title.substring(0, 35)}...`);
    }
  }

  console.log("\n💬 Creating comments/replies...");
  const comments = [
    {
      postId: 1,
      authorId: createdUsers[1],
      content:
        "Quantum entanglement adalah fenomena di mana dua partikel terhubung sehingga keadaan salah satu langsung mempengaruhi yang lain, tanpa memandang jarak.",
    },
    {
      postId: 1,
      authorId: createdUsers[2],
      content:
        "Bisa dibaca juga di buku fisika kuantum by David J. Griffiths, sehr recommended!",
    },
    {
      postId: 2,
      authorId: createdUsers[0],
      content:
        "Tips: banyak latihan soal tahun sebelumnya dan kuasai konsep dasar mekanika terlebih dahulu.",
    },
    {
      postId: 6,
      authorId: createdUsers[3],
      content:
        "ikutan nich! lagi persiapan osn juga. ada yang dari jakarta juga?",
    },
    {
      postId: 6,
      authorId: createdUsers[5],
      content: "Buat yang mau materi osn, bisa cek di website primpal ya!",
    },
  ];

  for (const c of comments) {
    await db.insert(schema.comments).values({
      postId: c.postId,
      authorId: c.authorId,
      content: c.content,
    });
    console.log(`  ✓ Comment on post ${c.postId}`);
  }

  console.log("\n🚀 Creating projects...");
  const projects = [
    {
      ownerId: createdUsers[0],
      title: "Simulasi Gerak Planet",
      description: "bikin simulator orbit planet dengan python dan pygame",
      status: "in_progress",
      tags: "python,astronomi,simulasi",
      starsCount: 15,
    },
    {
      ownerId: createdUsers[2],
      title: "Sensor Suhu Arduino",
      description: "sensor suhu low-cost untuk eksperimen sekolah",
      status: "open",
      tags: "arduino,sensor,fisika",
      starsCount: 8,
    },
    {
      ownerId: createdUsers[4],
      title: "Analisis Data Cuaca",
      description: "prediksi cuaca pake machine learning",
      status: "in_progress",
      tags: "ml,cuca,data-science",
      starsCount: 22,
    },
    {
      ownerId: createdUsers[5],
      title: "Rocket Model TF",
      description: "bikin model roket untuk competition",
      status: "in_progress",
      tags: "roket,diy,fisika",
      starsCount: 31,
    },
    {
      ownerId: createdUsers[6],
      title: "Microscope DIY",
      description: "bikin mikroskop dari hp dan lensa kacamata",
      status: "completed",
      tags: "mikroskop,diy,eksperimen",
      starsCount: 45,
    },
  ];

  for (const p of projects) {
    const existing = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.title, p.title))
      .limit(1);
    if (existing.length > 0) {
      console.log(`  ⏭️  Skip: ${p.title}`);
    } else {
      await db.insert(schema.projects).values({
        ownerId: p.ownerId,
        title: p.title,
        description: p.description,
        status: p.status,
        tags: p.tags,
        starsCount: p.starsCount,
      });
      console.log(`  ✓ Created: ${p.title}`);
    }
  }

  console.log("\n🔔 Creating notifications...");
  const notifications = [
    {
      userId: createdUsers[0],
      type: "cendol",
      title: "Cendol +5",
      message: "Postingan kamu mendapat 5 cendol",
      fromUserId: createdUsers[1],
      link: "/feed",
      read: false,
    },
    {
      userId: createdUsers[1],
      type: "reply",
      title: "Balasan baru",
      message: "Alice membalas diskusi kamu",
      fromUserId: createdUsers[0],
      link: "/discussions",
      read: false,
    },
    {
      userId: createdUsers[2],
      type: "follow",
      title: "User baru mengikuti",
      message: "Bob mulai mengikuti kamu",
      fromUserId: createdUsers[1],
      link: "/profile",
      read: true,
    },
    {
      userId: createdUsers[0],
      type: "mention",
      title: "Mention",
      message: "David menyebut kamu di diskusi",
      fromUserId: createdUsers[3],
      link: "/discussions",
      read: false,
    },
    {
      userId: createdUsers[5],
      type: "cendol",
      title: "Cendol +156",
      message: "Megathread OSN kamu viral!",
      fromUserId: createdUsers[0],
      link: "/discussions/6",
      read: false,
    },
  ];

  for (const n of notifications) {
    await db.insert(schema.notifications).values({
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      fromUserId: n.fromUserId,
      link: n.link,
      read: n.read,
    });
    console.log(`  ✓ ${n.title}: ${n.message.substring(0, 30)}...`);
  }

  console.log("\n💬 Creating conversations & messages...");
  if (createdUsers.length >= 2) {
    const conv = await db
      .select()
      .from(schema.conversations)
      .where(eq(schema.conversations.participant1Id, createdUsers[0]))
      .limit(1);
    let convId: number;

    if (conv.length > 0 && conv[0].participant2Id === createdUsers[1]) {
      convId = conv[0].id;
      console.log(`  ⏭️  Conversation exists`);
    } else {
      const result = await db
        .insert(schema.conversations)
        .values({
          participant1Id: createdUsers[0],
          participant2Id: createdUsers[1],
        })
        .returning({ id: schema.conversations.id });
      convId = result[0].id;
      console.log(`  ✓ New conversation`);
    }

    const messages = [
      {
        conversationId: convId,
        senderId: createdUsers[0],
        content: "Halo! Selamat datang di KF13!",
        read: true,
      },
      {
        conversationId: convId,
        senderId: createdUsers[1],
        content: "Terima kasih! Sen gabung komunitas ini",
        read: true,
      },
      {
        conversationId: convId,
        senderId: createdUsers[0],
        content: "Ada yang bisa aku bantu?",
        read: false,
      },
    ];

    for (const m of messages) {
      await db.insert(schema.messages).values(m);
      console.log(`  ✓ Message: ${m.content.substring(0, 25)}...`);
    }
  }

  console.log("\n🎬 Creating Science Shorts data...");
  const shorts = [
    {
      authorId: createdUsers[0],
      title: "Eksperimen Interferensi Cahaya 60 Detik! 🌈",
      thumbnail: "https://placehold.co/300x400/3b82f6/ffffff?text=🔬",
      duration: "0:58",
      views: "2300",
      likes: 89,
      tags: "optik,eksperimen,diy",
    },
    {
      authorId: createdUsers[1],
      title: "Kenapa Langit Biru? Penjelasan Singkat ☁️",
      thumbnail: "https://placehold.co/300x400/06b6d4/ffffff?text=🌌",
      duration: "1:12",
      views: "5100",
      likes: 156,
      tags: "atmosfer,cahaya,teori",
    },
  ];

  for (const s of shorts) {
    await db.insert(schema.scienceShorts).values({
      authorId: s.authorId,
      title: s.title,
      thumbnail: s.thumbnail,
      duration: s.duration,
      views: s.views,
      likes: s.likes,
      tags: s.tags,
      createdAt: new Date(),
    });
    console.log(`  ✓ Science Short: ${s.title.substring(0, 20)}...`);
  }

  console.log("\n📊 Verifying data...");
  const userCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.user);
  const postCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.posts);
  const projectCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.projects);
  const commentCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.comments);
  const notifCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications);

  console.log("\n📈 Database stats:");
  console.log(`  Users: ${userCount[0].count}`);
  console.log(`  Posts: ${postCount[0].count}`);
  console.log(`  Projects: ${projectCount[0].count}`);
  console.log(`  Comments: ${commentCount[0].count}`);
  console.log(`  Notifications: ${notifCount[0].count}`);

  console.log("\n✅ Comprehensive seed completed!");
  console.log("\nTest accounts:");
  seedUsers.forEach((u) => console.log(`  - ${u.email}`));
}

seed().catch(console.error);
