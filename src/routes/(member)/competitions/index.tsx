import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import PlatformLayout from "~/components/platform/PlatformLayout";
import {
  fetchCompetitions,
  type CompetitionsData,
  CATEGORY_LABELS,
  LEVEL_LABELS,
} from "~/lib/datasets";

export default component$(() => {
  const data = useSignal<CompetitionsData | null>(null);
  const isLoading = useSignal(true);
  const selectedCategory = useSignal("");
  const selectedLevel = useSignal("");
  const error = useSignal("");

  useTask$(async () => {
    try {
      data.value = await fetchCompetitions();
    } catch {
      error.value = "Gagal memuat data kompetisi";
    }
    isLoading.value = false;
  });

  const categories = data.value ? Object.keys(data.value) : [];
  const levels =
    selectedCategory.value && data.value
      ? Object.keys(data.value[selectedCategory.value])
      : [];

  const filteredComps =
    selectedLevel.value && selectedCategory.value && data.value
      ? data.value[selectedCategory.value][selectedLevel.value] || []
      : [];

  return (
    <PlatformLayout activeNav="/competitions">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">🏆 Kompetisi</h1>
        <p class="text-gray-500 mt-1 text-sm">
          Data dari{" "}
          <a
            href="https://klubfisika.github.io/datasets/"
            target="_blank"
            class="text-green-600 hover:underline font-medium"
          >
            KF13 Open Datasets
          </a>
        </p>
      </div>

      {isLoading.value && (
        <div class="text-center py-12">
          <div class="animate-pulse text-4xl mb-4">🏆</div>
          <p class="text-gray-500">Memuat data kompetisi...</p>
        </div>
      )}

      {error.value && (
        <div class="p-4 bg-red-50 text-red-700 rounded-xl">{error.value}</div>
      )}

      {data.value && (
        <>
          <div class="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick$={() => {
                  selectedCategory.value = cat;
                  selectedLevel.value = "";
                }}
                class={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory.value === cat
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200"
                }`}
              >
                {CATEGORY_LABELS[cat]?.icon}{" "}
                {CATEGORY_LABELS[cat]?.label || cat}
              </button>
            ))}
          </div>

          {selectedCategory.value && (
            <div class="flex flex-wrap gap-2 mb-6">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick$={() => (selectedLevel.value = level)}
                  class={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedLevel.value === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  {LEVEL_LABELS[level] || level}
                </button>
              ))}
            </div>
          )}

          {filteredComps.length > 0 && (
            <div class="grid md:grid-cols-2 gap-4">
              {filteredComps.map((comp, i) => (
                <div
                  key={i}
                  class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <h3 class="font-bold text-gray-900 mb-2">{comp.name}</h3>
                  <div class="space-y-1.5 text-sm text-gray-600">
                    <p>
                      <span class="text-gray-400">Penyelenggara:</span>{" "}
                      {comp.organizer}
                    </p>
                    <p>
                      <span class="text-gray-400">Kategori:</span>{" "}
                      {comp.categories?.join(", ")}
                    </p>
                    <p>
                      <span class="text-gray-400">Periode:</span>{" "}
                      {comp.competition_period}
                    </p>
                    <p>
                      <span class="text-gray-400">Pendaftaran:</span>{" "}
                      {comp.registration_period}
                    </p>
                    <p>
                      <span class="text-gray-400">Lokasi:</span>{" "}
                      {comp.venue.replace(/_/g, " ")}
                    </p>
                    {comp.teams_limit && (
                      <p>
                        <span class="text-gray-400">Kuota:</span>{" "}
                        {comp.teams_limit} tim
                      </p>
                    )}
                    {comp.participants_limit && (
                      <p>
                        <span class="text-gray-400">Kuota:</span>{" "}
                        {comp.participants_limit} peserta
                      </p>
                    )}
                    {comp.prize_pool && (
                      <p>
                        <span class="text-gray-400">Total hadiah:</span> Rp
                        {Number(comp.prize_pool).toLocaleString("id-ID")}
                      </p>
                    )}
                    {comp.team_size && (
                      <p>
                        <span class="text-gray-400">Ukuran tim:</span>{" "}
                        {comp.team_size} orang
                      </p>
                    )}
                  </div>
                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      class="inline-block mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Kunjungi website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedCategory.value &&
            selectedLevel.value &&
            filteredComps.length === 0 && (
              <div class="text-center py-8 text-gray-400">
                <p>Tidak ada data kompetisi untuk filter ini</p>
              </div>
            )}
        </>
      )}
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Kompetisi - KF13 Platform",
  meta: [
    {
      name: "description",
      content:
        "Database kompetisi fisika, robotik, roket, dan riset di Indonesia",
    },
  ],
};
