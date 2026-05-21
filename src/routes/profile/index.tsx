import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";

export default component$(() => {
  const auth = useAuth();
  const name = useSignal("Member");
  const email = useSignal("");

  useVisibleTask$(() => {
    if (!auth.value) { window.location.replace("/login"); return; }
    name.value = auth.value.name || "Member";
    email.value = auth.value.email || "";
  });

  return (
    <PlatformLayout title="Profil" activeNav="/profile" hideRightSidebar={true}>
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">{name.value[0]?.toUpperCase()}</div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{name.value}</h1>
              <p class="text-gray-500">{email.value}</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            {[{ label: "Posts", value: "---" }, { label: "Cendol", value: "---" }, { label: "Proyek", value: "---" }].map((s, i) => (
              <div class="bg-gray-50 rounded-xl p-4 text-center" key={i}><div class="text-2xl font-bold text-gray-900">{s.value}</div><div class="text-sm text-gray-500">{s.label}</div></div>
            ))}
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="font-bold text-lg mb-4">Pengaturan Profil</h2>
          <div class="space-y-4">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama</label><input type="text" value={name.value} class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email.value} class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Institusi</label><input type="text" class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Universitas/Sekolah" /></div>
            <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Profil" };
