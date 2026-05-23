import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { eq, sql, and, gte } from "drizzle-orm";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

export const useOverviewLoader = routeLoader$(async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }

  const userId = session.user.id;
  const userName = session.user.name || "Member";

  try {
    const db = getDb();

    // 1. Ambil data profil
    const [profileRow] = await db
      .select({
        cendolCount: schema.profiles.cendolCount,
        institution: schema.profiles.institution,
      })
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, userId))
      .limit(1);

    // 2. Hitung jumlah postingan pengguna
    const [postsCountRes] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.posts)
      .where(eq(schema.posts.authorId, userId));
    const totalPosts = postsCountRes?.count || 0;

    // 3. Hitung jumlah proyek pengguna
    const [projectsCountRes] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.projects)
      .where(eq(schema.projects.ownerId, userId));
    const totalProjects = projectsCountRes?.count || 0;

    // 4. Hitung akumulasi cendol dari postingan
    const [postsCendolRes] = await db
      .select({ sum: sql<number>`sum(${schema.posts.cendolCount})::int` })
      .from(schema.posts)
      .where(eq(schema.posts.authorId, userId));
    const postCendols = postsCendolRes?.sum || 0;

    const totalCendol = (profileRow?.cendolCount || 0) + postCendols;

    // 5. Kalkulasi Reputasi Akademik
    const reputation = totalPosts * 3 + totalCendol * 5 + totalProjects * 10;

    // 6. Hitung kemajuan Rank
    let rankTitle = "Newbie";
    let rankProgress = 0;
    let rankNext = "";

    if (totalPosts < 5) {
      rankTitle = "Newbie";
      rankProgress = (totalPosts / 5) * 100;
      rankNext = `${5 - totalPosts} posts lagi ke Kaskuser`;
    } else if (totalPosts < 15) {
      rankTitle = "Kaskuser";
      rankProgress = ((totalPosts - 5) / 10) * 100;
      rankNext = `${15 - totalPosts} posts lagi ke Aktivis`;
    } else if (totalPosts < 30) {
      rankTitle = "Aktivis";
      rankProgress = ((totalPosts - 15) / 15) * 100;
      rankNext = `${30 - totalPosts} posts lagi ke Kaskus Holic`;
    } else if (totalPosts < 50) {
      rankTitle = "Kaskus Holic";
      rankProgress = ((totalPosts - 30) / 20) * 100;
      rankNext = `${50 - totalPosts} posts lagi ke Kaskus Addict`;
    } else {
      rankTitle = "Kaskus Geek";
      rankProgress = 100;
      rankNext = "Kamu telah mencapai tingkatan tertinggi akademisi!";
    }

    // 7. Aktivitas 7 hari terakhir
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activities = await db
        .select({ createdAt: schema.posts.createdAt })
        .from(schema.posts)
        .where(and(eq(schema.posts.authorId, userId), gte(schema.posts.createdAt, sevenDaysAgo)));
    
    const activityData = [0,0,0,0,0,0,0]; // 7 days
    activities.forEach(a => {
        if (a.createdAt) {
            const dayDiff = Math.floor((new Date().getTime() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 0 && dayDiff < 7) {
                activityData[6 - dayDiff]++;
            }
        }
    });
    const maxActivity = Math.max(...activityData, 1);
    const weeklyActivity = activityData.map(count => (count / maxActivity) * 100);

    return {
      userName,
      totalPosts,
      totalCendol,
      totalProjects,
      reputation,
      rankTitle,
      rankProgress,
      rankNext,
      weeklyActivity,
    };
  } catch (err) {
    console.error("Gagal mengagregasi data overview:", err);
    return {
      userName,
      totalPosts: 0,
      totalCendol: 0,
      totalProjects: 0,
      reputation: 0,
      rankTitle: "Newbie",
      rankProgress: 0,
      rankNext: "Gagal menghubungkan metrik riil.",
      weeklyActivity: [0,0,0,0,0,0,0],
    };
  }
});

export default component$(() => {
  const overview = useOverviewLoader();
  const data = overview.value;

  return (
    <PlatformLayout activeNav="/overview">
      {/* Welcome Banner */}
      <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white mb-6">
        <h1 class="text-2xl font-bold mb-2">Selamat datang kembali! 👋</h1>
        <p class="text-green-100">
          Lihat perkembangan aktivitasmu, {data.userName}
        </p>
      </div>

      {/* Metric Cards */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">📝</div>
          <div class="text-2xl font-bold text-gray-900 mb-1">
            {data.totalPosts}
          </div>
          <div class="text-xs text-gray-500 font-medium">Total Posts</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">🥒</div>
          <div class="text-2xl font-bold text-green-600 mb-1">
            {data.totalCendol}
          </div>
          <div class="text-xs text-gray-500 font-medium">Cendol</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">🔬</div>
          <div class="text-2xl font-bold text-blue-600 mb-1">
            {data.totalProjects}
          </div>
          <div class="text-xs text-gray-500 font-medium">Proyek</div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="text-3xl mb-3">⭐</div>
          <div class="text-2xl font-bold text-orange-500 mb-1">
            {data.reputation}
          </div>
          <div class="text-xs text-gray-500 font-medium">Reputasi Akademik</div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div class="grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          {/* Activity Tracker */}
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">📊</span> Aktivitas Mingguan
            </h2>
            <div class="h-40 flex items-end justify-between gap-3 px-2">
              {data.weeklyActivity.map((height, i) => (
                <div class="flex-1 flex flex-col items-center gap-2" key={i}>
                  <div
                    class="w-full rounded-t bg-green-400"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span class="text-xs text-gray-500 font-medium">
                    {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* ... sisa komponen tetap sama ... */}


          {/* Activity Logs */}
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">🕐</span> Aktivitas Terbaru
            </h2>
            <div class="space-y-4">
              <div class="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  🥒
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-1">
                    Kamu mendapat{" "}
                    <strong class="text-green-600">cendol baru</strong> dari
                    anggota komunitas
                  </p>
                  <p class="text-xs text-gray-400">Aktif</p>
                </div>
              </div>
              <div class="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  💬
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-1">
                    Komentar dan balasan terhubung secara riil di forum
                  </p>
                  <p class="text-xs text-gray-400">Baru saja</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          {/* Quick Actions */}
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">⚡</span> Aksi Cepat
            </h2>
            <div class="space-y-3">
              <a
                href="/feed"
                class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition"
              >
                <span class="text-lg">📰</span>
                <span class="text-sm font-medium text-gray-700">
                  Lihat Feed
                </span>
              </a>
              <a
                href="/projects/new"
                class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition"
              >
                <span class="text-lg">🔬</span>
                <span class="text-sm font-medium text-gray-700">
                  Buat Proyek Baru
                </span>
              </a>
              <a
                href="/discussions"
                class="flex items-center gap-4 p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition"
              >
                <span class="text-lg">💬</span>
                <span class="text-sm font-medium text-gray-700">
                  Mulai Diskusi
                </span>
              </a>
            </div>
          </div>

          {/* Rank Progress Card */}
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">🏆</span> Rank Progress
            </h2>
            <div class="text-center py-4">
              <div class="text-4xl mb-3">⭐</div>
              <div class="font-bold text-gray-900 mb-1">{data.rankTitle}</div>
              <div class="text-sm text-gray-500 font-semibold">
                {data.totalPosts} posts
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                class="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full"
                style={{ width: `${data.rankProgress}%` }}
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-3 text-center font-medium">
              {data.rankNext}
            </p>
          </div>

          {/* Target Card */}
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="text-xl">🎯</span> Target Minggu Ini
            </h2>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600 font-medium">Buat postingan</span>
                  <span class="text-green-600 font-medium">
                    {data.totalPosts >= 3 ? "3/3" : `${data.totalPosts}/3`}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min((data.totalPosts / 3) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600 font-medium">Bantu diskusi</span>
                  <span class="text-orange-500 font-medium">1/5</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-orange-400 h-2 rounded-full"
                    style="width: 20%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Overview",
};
