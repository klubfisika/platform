import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/lib/db";
import { useAuth } from "~/lib/router";

export const useOnboardingAction = routeAction$(async (data, req) => {
  const authUser = (await req.resolveValue(useAuth)) as Record<string, unknown> | null;
  if (!authUser) return { success: false, error: "Silakan login terlebih dahulu" };

  const institution = String(data.institution || "").trim();
  const level = String(data.level || "SMA").trim();
  const major = String(data.major || "").trim();
  const year = String(data.year || "").trim();
  const bio = String(data.bio || "").trim();
  const interests = String(data.interests || "").trim();

  if (!institution) return { success: false, error: "Institusi wajib diisi" };

  try {
    const db = getDb();
    const userId = authUser.id as string;

    await db.run(`
      INSERT INTO profiles (user_id, institution, level, major, year, bio, onboarding_completed, updated_at)
      VALUES ('${userId}', '${institution}', '${level}', '${major}', '${year}', '${bio}', true, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET institution = '${institution}', level = '${level}', major = '${major}', year = '${year}', bio = '${bio}', onboarding_completed = true, updated_at = NOW()
    `);

    return { success: true };
  } catch (e) {
    return { success: false, error: "Gagal menyimpan data" };
  }
});

export default component$(() => {
  const auth = useAuth();
  const action = useOnboardingAction();
  const institution = useSignal("");
  const level = useSignal("SMA");
  const major = useSignal("");
  const year = useSignal("");
  const bio = useSignal("");

  useVisibleTask$(() => {
    if (!auth.value) { window.location.href = "/login"; return; }
  });

  if (!auth.value) return null;

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl mb-4">👋</div>
          <h1 class="text-2xl font-bold text-gray-900">Lengkapi Profil Anda</h1>
          <p class="text-gray-500 mt-2 text-sm">Beberapa informasi untuk memulai perjalanan Anda di KF13</p>
        </div>

        {action.value?.error && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{action.value.error}</div>
        )}

        {action.value?.success && (
          <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm text-center">
            Profil berhasil dilengkapi! Selamat datang di KF13 🎉
            <meta http-equiv="refresh" content="0;url=/feed" />
          </div>
        )}

        <Form action={action} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Institusi <span class="text-red-500">*</span></label>
            <input type="text" name="institution" value={institution.value} onInput$={(e) => institution.value = (e.target as HTMLInputElement).value} class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="SMA Negeri 1 Jakarta" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Jenjang</label>
              <select name="level" value={level.value} onChange$={(e) => level.value = (e.target as HTMLSelectElement).value} class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white">
                <option value="SD">SD</option><option value="SMP">SMP</option><option value="SMA">SMA</option><option value="SMK">SMK</option><option value="D3">D3</option><option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Angkatan</label>
              <input type="text" name="year" value={year.value} onInput$={(e) => year.value = (e.target as HTMLInputElement).value} class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="2024" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Jurusan / Bidang</label>
            <input type="text" name="major" value={major.value} onInput$={(e) => major.value = (e.target as HTMLInputElement).value} class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Fisika / Teknik Informatika / ..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Bio Singkat</label>
            <textarea name="bio" value={bio.value} onInput$={(e) => bio.value = (e.target as HTMLTextAreaElement).value} rows={2} class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none" placeholder="Siswa yang tertarik dengan eksperimen fisika..." />
          </div>
          <button type="submit" disabled={action.isRunning} class="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {action.isRunning ? "Menyimpan..." : "Selesai — Masuk ke Beranda"}
          </button>
        </Form>
      </div>
    </div>
  );
});

export const head: DocumentHead = { title: "Onboarding - KF13 Platform" };
