export const PLATFORM_HUB_HERO = {
  eyebrow: "Platform Sosial KF13",
  title: "Tempat untuk diskusi, proyek, dan portfolio riset",
  description:
    "Halaman ini menjadi pintu masuk utama ke aplikasi sosial KF13. Fitur yang sudah dibangun tetap dipertahankan, lalu diarahkan ke ruang yang lebih fokus untuk interaksi komunitas.",
};

export const PLATFORM_FEATURES = [
  { href: "/feed", icon: "📰", title: "Feed & timeline", description: "Alur posting cepat untuk berbagi ide, eksperimen, dan update aktivitas." },
  { href: "/discussions", icon: "💬", title: "Forum diskusi", description: "Thread, balasan, dan budaya forum yang sudah dibangun untuk diskusi teknis." },
  { href: "/projects", icon: "🔬", title: "Proyek riset", description: "Showcase proyek, kolaborasi, status pengerjaan, dan daftar kontributor." },
  { href: "/explore", icon: "🔍", title: "Explore & discovery", description: "Menemukan member, topik, proyek populer, dan konten yang sedang naik." },
  { href: "/profile", icon: "👤", title: "Profil & portfolio", description: "Profil publik, reputasi, badge, signature, dan data personal member." },
  { href: "/shorts", icon: "🎬", title: "Science shorts", description: "Format konten singkat untuk ide cepat, highlight, dan discovery ringan." },
] as const;

export const PLATFORM_PRESERVED_WORK = [
  "Routing dan guard session berbasis localStorage sudah ada dan tetap dipakai.",
  "Qwik components untuk sidebar, dropdown, feed, profile, dan onboarding tetap dipertahankan.",
  "Data layer Turso / SQLite, mock thread, mock user, dan utilitas reputasi tidak dibuang.",
  "Halaman discuss, project, explore, profile, dan overview tetap menjadi modul platform aktif.",
] as const;

export const PLATFORM_HOME_ACTIONS = [
  { href: "/overview", label: "Buka Dashboard", icon: "📊" },
  { href: "/feed", label: "Lihat Feed", icon: "📰" },
  { href: "/discussions", label: "Masuk Forum", icon: "💬" },
  { href: "/projects", label: "Telusuri Proyek", icon: "🔬" },
] as const;
