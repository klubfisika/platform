import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { ShareProfile } from "~/components/qwik/ShareProfile";
import { StatsGrid } from "~/components/qwik/StatsGrid";
import { ContributionGraph } from "~/components/qwik/ContributionGraph";
import { MOCK_USERS } from "~/lib/mockUsers";
import { getRank } from "~/lib/kaskus";

export const useProfile = routeLoader$(({ params, redirect }) => {
  const username = params.username;
  const user = MOCK_USERS.find((entry) => entry.username === username);

  if (!user) {
    throw redirect(302, "/explore");
  }

  return user;
});

export default component$(() => {
  const user = useProfile();
  const rank = getRank(user.value.posts);
  const stats = [
    { label: "Posts", value: user.value.posts, color: "green", emoji: "📝" },
    { label: "Cendol", value: user.value.cendol, color: "blue", emoji: "🥒" },
    { label: "Bata", value: user.value.bata, color: "red", emoji: "🧱" },
    {
      label: "Proyek",
      value: user.value.projects,
      color: "purple",
      emoji: "🔬",
    },
    {
      label: "Kontribusi",
      value: user.value.contributions,
      color: "teal",
      emoji: "⚡",
    },
  ];

  return (
    <PlatformLayout title={user.value.name} activeNav="" hideRightSidebar={true}>
      <div class="mx-auto max-w-5xl space-y-6">
        <section class="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div class="h-32 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500" />
          <div class="px-6 pb-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div class="-mt-12 flex items-end gap-4">
                <div class="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-lg">
                  {user.value.avatar}
                </div>
                <div class="pb-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-2xl font-bold text-gray-900">
                      {user.value.name}
                    </h1>
                    <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      @{user.value.username}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">
                    {user.value.institution} · {user.value.location}
                  </p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      class="rounded-full px-3 py-1 text-sm font-medium"
                      style={`background: ${rank.color}20; color: ${rank.color};`}
                    >
                      ★ {rank.title}
                    </span>
                    <span class="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                      {user.value.level}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button class="rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-green-600 hover:to-teal-600">
                  Follow
                </button>
                <button class="rounded-full bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200">
                  Pesan
                </button>
              </div>
            </div>

            <p class="mt-4 max-w-3xl text-sm leading-6 text-gray-700">
              {user.value.bio}
            </p>

            <div class="mt-4">
              <StatsGrid stats={stats} />
            </div>
          </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div class="space-y-6">
            <div class="rounded-2xl bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-lg font-bold text-gray-900">Profil singkat</h2>
                <span class="text-sm text-gray-500">
                  Bergabung {new Date(user.value.joined).toLocaleDateString(
                    "id-ID",
                    { month: "long", year: "numeric" },
                  )}
                </span>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                {user.value.badges?.map((badge: string) => (
                  <span
                    key={badge}
                    class="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div class="mt-5 grid gap-4 sm:grid-cols-2">
                <div class="rounded-xl bg-gray-50 p-4">
                  <h3 class="text-sm font-semibold text-gray-900">Minat</h3>
                  <div class="mt-2 flex flex-wrap gap-2">
                    {user.value.interests?.map((interest: string) => (
                      <span
                        key={interest}
                        class="rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div class="rounded-xl bg-gray-50 p-4">
                  <h3 class="text-sm font-semibold text-gray-900">
                    Bagikan profil
                  </h3>
                  <div class="mt-2">
                    <ShareProfile username={user.value.username} />
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900">Kontribusi 12 bulan</h2>
              <div class="mt-4">
                <ContributionGraph contributions={user.value.contributions} />
              </div>
            </div>

            <div class="rounded-2xl bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900">Proyek unggulan</h2>
              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                {user.value.featured_projects?.map((project) => (
                  <article
                    key={project.title}
                    class="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <h3 class="font-semibold text-gray-900">{project.title}</h3>
                      <span class="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
                        ★ {project.stars}
                      </span>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          class="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p class="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                      {project.status}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside class="space-y-6">
            <div class="rounded-2xl bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900">Artikel terbaru</h2>
              <div class="mt-4 space-y-3">
                {user.value.articles?.slice(0, 4).map((article) => (
                  <article
                    key={article.id}
                    class="rounded-xl bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <h3 class="line-clamp-2 text-sm font-semibold text-gray-900">
                        {article.title}
                      </h3>
                      {article.published && (
                        <span class="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                          Published
                        </span>
                      )}
                    </div>
                    <p class="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
                      {article.excerpt}
                    </p>
                    <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>{article.readTime}</span>
                      <span>♥ {article.likes}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div class="rounded-2xl bg-white p-6 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900">Perjalanan riset</h2>
              <div class="mt-4 space-y-3">
                {user.value.timeline?.map((item) => (
                  <div
                    key={`${item.year}-${item.event}`}
                    class="rounded-xl bg-gray-50 p-4"
                  >
                    <div class="text-xs font-semibold uppercase tracking-wide text-green-600">
                      {item.year}
                    </div>
                    <p class="mt-1 text-sm leading-6 text-gray-700">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = ({ params }) => ({
  title: `@${params.username} · KF13 Community`,
  meta: [
    {
      name: "description",
      content: `Profil publik @${params.username} di KF13 Community`,
    },
  ],
});
