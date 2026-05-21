import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";

const projects = [
  { title: "Interferometer Michelson DIY", author: "budi_fisika", status: "In Progress", tags: ["diy", "optik", "eksperimen"], stars: 89, desc: "Membangun interferometer dari barang bekas untuk eksperimen optik" },
  { title: "Roket Air - Optimasi Tekanan", author: "ahmad_osn", status: "Open", tags: ["roket", "aerodinamika"], stars: 45, desc: "Eksperimen optimasi tekanan udara untuk jarak tempuh maksimal roket air" },
  { title: "Sensor Suhu + LCD Arduino", author: "siti_quantum", status: "Completed", tags: ["arduino", "sensor", "iot"], stars: 156, desc: "Sistem monitoring suhu real-time untuk eksperimen termodinamika" },
];

export default component$(() => {
  const user = useAuth();
  useVisibleTask$(() => {
    if (!user.value) window.location.replace("/login");
  });

  return (
    <PlatformLayout title="Proyek" activeNav="/projects">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">🔬 Proyek Komunitas</h1>
        <a href="/projects/new" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">+ Proyek Baru</a>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition" key={i}>
            <div class="flex items-center justify-between mb-3">
              <span class={`text-xs px-2 py-1 rounded-full font-medium ${p.status === "Completed" ? "bg-green-100 text-green-700" : p.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
              <span class="text-sm text-gray-400">⭐ {p.stars}</span>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">{p.title}</h3>
            <p class="text-sm text-gray-600 mb-3">{p.desc}</p>
            <div class="flex gap-1 flex-wrap mb-3">{p.tags.map((t: string) => <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full" key={t}>#{t}</span>)}</div>
            <div class="text-xs text-gray-400">oleh {p.author}</div>
          </div>
        ))}
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Proyek" };
