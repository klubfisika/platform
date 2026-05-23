import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";

interface Reply {
  name: string;
  initial: string;
  rank: string;
  rankColor: string;
  time: string;
  number: string;
  isPertamax?: boolean;
  isTs?: boolean;
  content: string;
  cendol: number;
  quote?: { author: string; text: string };
}

const replies: Reply[] = [
  {
    name: "ahmad_fisika",
    initial: "A",
    rank: "Kaskus Geek",
    rankColor: "text-red-600",
    time: "01-01-2026, 08:32",
    number: "#2",
    isPertamax: true,
    content:
      "PERTAMAX GAN! 🏆\n\nWih keren banget gan hasilnya! Ane juga pengen coba bikin. Boleh minta detail ukuran jarak antar cerminnya?",
    cendol: 12,
  },
  {
    name: "siti_quantum",
    initial: "S",
    rank: "Kaskus Addict",
    rankColor: "text-orange-600",
    time: "01-01-2026, 09:15",
    number: "#3",
    content:
      "Gan, ini pake CD yang mana? Yang bagian label atau yang bening? Ane pernah coba pake yang bening tapi refleksinya kurang bagus",
    cendol: 5,
    quote: { author: "budi_fisika", text: "Beam splitter dari kaca CD bekas" },
  },
  {
    name: "budi_fisika",
    initial: "B",
    rank: "Kaskus Holic",
    rankColor: "text-purple-600",
    time: "01-01-2026, 09:30",
    number: "#4",
    isTs: true,
    content:
      "Pake yang bagian bening gan, tapi harus dilapisin dulu pake selotip bening biar lebih rata permukaannya. Kuncinya di sudut 45 derajat. Kalo kurang presisi, pola interferensinya gak keliatan",
    cendol: 8,
    quote: { author: "siti_quantum", text: "Gan, ini pake CD yang mana?" },
  },
];

export default component$(() => {
  return (
    <PlatformLayout title="Thread Diskusi" activeNav="/discussions">
      <div class="text-sm text-gray-500 mb-4">
        <a href="/discussions" class="hover:text-green-600">
          Forum
        </a>{" "}
        ›{" "}
        <a href="/discussions?cat=modern" class="hover:text-green-600">
          Fisika Modern
        </a>{" "}
        › <span class="text-gray-700">Berhasil bikin interferometer...</span>
      </div>

      <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-2xl p-5">
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
            SHARE
          </span>
          <span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            🔥 Hot Thread
          </span>
        </div>
        <h1 class="text-xl font-bold">
          Berhasil bikin interferometer Michelson dari cermin bekas! (Pic
          Inside)
        </h1>
        <div class="flex items-center gap-3 mt-3 text-sm opacity-90">
          <span>
            oleh <strong>budi_fisika</strong>
          </span>
          <span>•</span>
          <span>01 Jan 2026</span>
        </div>
      </div>

      <div class="bg-white border-x border-gray-100 px-4 py-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-4 text-gray-600">
          <span class="flex items-center gap-1">👁️ 2,341</span>
          <span class="flex items-center gap-1">💬 67</span>
          <span class="flex items-center gap-1 text-green-600">🥒 89</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-gray-600">
            ⭐ Bookmark
          </button>
        </div>
      </div>

      <div class="border-x border-b border-gray-100 rounded-b-2xl bg-white overflow-hidden">
        <article class="border-b border-gray-100">
          <div class="flex">
            <div class="w-48 bg-gray-50 p-4 text-center border-r flex-shrink-0 hidden md:block">
              <div class="w-20 h-20 bg-blue-500 rounded mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold">
                B
              </div>
              <div class="font-bold text-blue-600">budi_fisika</div>
              <div class="text-xs text-purple-600 font-medium">
                Kaskus Holic
              </div>
              <div class="text-xs text-gray-500 mt-2">
                <div>Posts: 156</div>
                <div class="text-green-600">🥒 Cendol: 234</div>
              </div>
            </div>
            <div class="flex-1 p-4">
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div class="flex items-center gap-2">
                  <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                    TS
                  </span>
                  <span>📅 01-01-2026, 08:30</span>
                </div>
              </div>
              <div class="prose max-w-none">
                <p>Assalamualaikum agan-agan sekalian! 🙏</p>
                <p>
                  Ane mau share nih hasil eksperimen ane bikin{" "}
                  <strong>interferometer Michelson</strong> dari barang-barang
                  bekas.
                </p>
                <p>
                  <strong>Bahan-bahan:</strong>
                </p>
                <ul>
                  <li>Laser pointer merah (15rb)</li>
                  <li>Cermin bekas dari kompak bedak (2 buah)</li>
                  <li>Beam splitter dari kaca CD bekas</li>
                  <li>Tripod HP buat holder</li>
                  <li>Kardus bekas buat base</li>
                </ul>
                <div class="bg-gray-100 p-4 rounded-lg text-center my-4">
                  <div class="text-6xl mb-2">📸</div>
                  <p class="text-sm text-gray-500">
                    [Gambar pola interferensi]
                  </p>
                </div>
              </div>
              <div class="mt-6 pt-4 border-t border-dashed text-sm text-gray-500 italic">
                <p>---</p>
                <p>
                  "Physics is like sex: sure, it may give some practical
                  results, but that's not why we do it." - Richard Feynman
                </p>
              </div>
              <div class="mt-4 pt-4 border-t flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button class="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">
                    🥒 Cendol
                  </button>
                  <button class="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">
                    🧱 Bata
                  </button>
                </div>
                <button class="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition">
                  ↩️ Reply
                </button>
              </div>
            </div>
          </div>
        </article>

        {replies.map((r, i) => (
          <article
            class={`border-b ${r.isPertamax ? "bg-yellow-50" : ""}`}
            key={i}
          >
            <div class="flex">
              <div
                class={`w-48 p-4 text-center border-r flex-shrink-0 hidden md:block ${r.isPertamax ? "bg-yellow-100/50" : r.isTs ? "bg-blue-50" : "bg-gray-50"}`}
              >
                <div
                  class={`w-16 h-16 ${r.isPertamax ? "bg-green-500" : r.name === "siti_quantum" ? "bg-purple-500" : "bg-blue-500"} rounded mx-auto mb-2 flex items-center justify-center text-white text-xl font-bold`}
                >
                  {r.initial}
                </div>
                <div class="font-bold text-blue-600">{r.name}</div>
                <div class={`text-xs font-medium ${r.rankColor}`}>{r.rank}</div>
              </div>
              <div class="flex-1 p-4">
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div class="flex items-center gap-2">
                    {r.isPertamax && (
                      <span class="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs font-bold">
                        🏆 PERTAMAX
                      </span>
                    )}
                    {r.isTs && (
                      <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                        TS
                      </span>
                    )}
                    <span>📅 {r.time}</span>
                  </div>
                  <span class="text-gray-400">{r.number}</span>
                </div>
                {r.quote && (
                  <div class="bg-gray-100 border-l-4 border-blue-500 p-3 mb-4 text-sm">
                    <div class="text-blue-600 font-medium mb-1">
                      Quote: Originally Posted by {r.quote.author}
                    </div>
                    <p class="text-gray-600 italic">{r.quote.text}</p>
                  </div>
                )}
                <div class="prose max-w-none">
                  <p>{r.content}</p>
                </div>
                <div class="mt-4 pt-4 border-t flex items-center gap-2">
                  <button class="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm">
                    🥒 +{r.cendol}
                  </button>
                  <button class="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition">
                    💬 Quote
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
        <div class="p-4 text-center">
          <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Muat 63 balasan lainnya...
          </button>
        </div>
      </div>

      <div class="mt-4 bg-white rounded-2xl shadow-sm p-4">
        <h3 class="font-bold mb-3">💬 Quick Reply</h3>
        <textarea
          rows={4}
          placeholder="Ketik balasan..."
          class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
        ></textarea>
        <div class="flex items-center justify-between mt-3">
          <div class="flex gap-2">
            {["🥒", "🧱", "👍", "😎", "😭", "🤣", "🔥", "💯"].map(
              (e: string) => (
                <button class="text-xl hover:scale-125 transition" key={e}>
                  {e}
                </button>
              ),
            )}
          </div>
          <button class="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 font-medium transition">
            Kirim Balasan
          </button>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Thread Diskusi" };
