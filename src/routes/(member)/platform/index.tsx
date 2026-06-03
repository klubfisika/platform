import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";
import {
  PLATFORM_FEATURES,
  PLATFORM_HOME_ACTIONS,
  PLATFORM_HUB_HERO,
  PLATFORM_PRESERVED_WORK,
} from "~/data/platformHomeConfig";

export default component$(() => {
  return (
    <PlatformLayout activeNav="/feed">
      <section class="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div class="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-700 px-6 py-8 text-white">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{PLATFORM_HUB_HERO.eyebrow}</p>
          <div class="mt-3 max-w-3xl">
            <h1 class="text-3xl font-black leading-tight sm:text-4xl">{PLATFORM_HUB_HERO.title}</h1>
            <p class="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">{PLATFORM_HUB_HERO.description}</p>
          </div>
          <div class="mt-6 flex flex-wrap gap-3">
            {PLATFORM_HOME_ACTIONS.map((action) => (
              <a href={action.href} class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50">
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PLATFORM_FEATURES.map((feature) => (
          <a href={feature.href} class="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-teal-100 text-2xl">{feature.icon}</div>
              <div class="min-w-0">
                <h2 class="font-bold text-gray-900 transition group-hover:text-green-700">{feature.title}</h2>
                <p class="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
              </div>
            </div>
          </a>
        ))}
      </section>

      <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-6">
          <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-bold text-gray-900">Apa yang dipertahankan</h2>
            <p class="mt-2 text-sm leading-6 text-gray-600">Pekerjaan yang sudah dikerjakan tetap dijaga sebagai fondasi aplikasi sosial. Tidak ada fitur yang dihapus hanya karena repositori sedang disesuaikan arah produk.</p>
            <ul class="mt-4 space-y-3">
              {PLATFORM_PRESERVED_WORK.map((item) => (
                <li class="flex gap-3 text-sm leading-6 text-gray-700"><span class="mt-0.5 text-green-600">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 class="text-lg font-bold text-gray-900">Arah kerja platform</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-gray-50 p-4"><div class="text-sm font-semibold text-gray-900">Public site tetap di Astro</div><p class="mt-1 text-sm leading-6 text-gray-600">Landing, blog, about, contact, dan halaman publik lain tetap menjadi wajah organisasi.</p></div>
              <div class="rounded-xl bg-gray-50 p-4"><div class="text-sm font-semibold text-gray-900">App sosial fokus di platform</div><p class="mt-1 text-sm leading-6 text-gray-600">Feed, forum, proyek, explore, profil, dan onboarding tetap berkembang di area ini.</p></div>
            </div>
          </div>
        </div>
      </section>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Platform",
  meta: [{ name: "description", content: "KF13 Platform hub for discussions, projects, and discovery" }],
};
