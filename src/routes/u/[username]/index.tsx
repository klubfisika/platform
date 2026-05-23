import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  const loc = useLocation();
  const username = loc.params.username;

  return (
    <PlatformLayout title={username} activeNav="">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-green-500 to-teal-500"></div>
          <div class="px-6 pb-6">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold -mt-12 border-4 border-white">
              {username[0]?.toUpperCase()}
            </div>
            <div class="mt-4">
              <h1 class="text-2xl font-bold text-gray-900">@{username}</h1>
              <p class="text-gray-500 mt-1">Anggota KF13 Community</p>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Posts", value: "---" },
                { label: "Cendol", value: "---" },
                { label: "Proyek", value: "---" },
              ].map((s, i) => (
                <div class="bg-gray-50 rounded-xl p-4 text-center" key={i}>
                  <div class="text-xl font-bold text-gray-900">{s.value}</div>
                  <div class="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = ({ params }) => ({
  title: `@${params.username}`,
});
