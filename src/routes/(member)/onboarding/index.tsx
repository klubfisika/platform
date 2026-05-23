import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/lib/db";
import { getAuth } from "~/lib/auth";
import { z } from "zod";

const allowedLevels = [
  "SD",
  "SMP",
  "SMA",
  "SMK",
  "D3",
  "S1",
  "S2",
  "S3",
] as const;

const onboardingSchema = z.object({
  institution: z.string().min(1, "Institusi wajib diisi"),
  level: z.enum(allowedLevels).default("SMA"),
  major: z.string().optional().default(""),
  year: z
    .string()
    .regex(/^\d{4}$/, "Format angkatan harus 4 digit (contoh: 2024)")
    .optional()
    .or(z.literal("")),
  bio: z.string().optional().default(""),
});

export const useOnboardingAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user)
    return { success: false, error: "Silakan login terlebih dahulu" };
  const authUser = session.user;

  const parsed = onboardingSchema.safeParse({
    institution: data.institution,
    level: data.level || "SMA",
    major: data.major || "",
    year: data.year || "",
    bio: data.bio || "",
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first.message };
  }

  const { institution, level, major, year, bio } = parsed.data;

  try {
    const db = getDb();
    const userId = authUser.id as string;

    await db
      .insert(schema.profiles)
      .values({
        userId,
        institution,
        level,
        major: major || null,
        year: year || null,
        bio: bio || null,
        onboardingCompleted: true,
      })
      .onConflictDoUpdate({
        target: schema.profiles.userId,
        set: {
          institution,
          level,
          major: major || null,
          year: year || null,
          bio: bio || null,
          onboardingCompleted: true,
        },
      });

    return { success: true };
  } catch (e) {
    console.error("onboarding error:", e);
    return { success: false, error: "Gagal menyimpan data" };
  }
});

export default component$(() => {
  const action = useOnboardingAction();

  useTask$(({ track }) => {
    const val = track(() => action.value);
    if (val?.success) {
      setTimeout(() => {
        window.location.href = "/feed";
      }, 1500);
    }
  });

  const institution = useSignal("");
  const level = useSignal("SMA");
  const major = useSignal("");
  const year = useSignal("");
  const bio = useSignal("");

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl mb-4">
            👋
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Lengkapi Profil Anda</h1>
          <p class="text-gray-500 mt-2 text-sm">
            Beberapa informasi untuk memulai perjalanan Anda di KF13
          </p>
        </div>

        {action.value?.error && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {action.value.error}
          </div>
        )}

        {action.value?.success && (
          <div class="text-center py-8">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-4 animate-bounce">
              ✓
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              Profil Berhasil Dilengkapi!
            </h2>
            <p class="text-green-600">Selamat datang di KF13 🎉</p>
            <p class="text-gray-400 text-sm mt-2">Mengalihkan ke beranda...</p>
          </div>
        )}

        {!action.value?.success && (
          <Form action={action} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Institusi <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="institution"
                value={institution.value}
                onInput$={(e) =>
                  (institution.value = (e.target as HTMLInputElement).value)
                }
                class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="SMA Negeri 1 Jakarta"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Jenjang
                </label>
                <select
                  name="level"
                  value={level.value}
                  onChange$={(e) =>
                    (level.value = (e.target as HTMLSelectElement).value)
                  }
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                >
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Angkatan
                </label>
                <input
                  type="text"
                  name="year"
                  value={year.value}
                  onInput$={(e) =>
                    (year.value = (e.target as HTMLInputElement).value)
                  }
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="2024"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Jurusan / Bidang
              </label>
              <input
                type="text"
                name="major"
                value={major.value}
                onInput$={(e) =>
                  (major.value = (e.target as HTMLInputElement).value)
                }
                class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Fisika / Teknik Informatika / ..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Bio Singkat
              </label>
              <textarea
                name="bio"
                value={bio.value}
                onInput$={(e) =>
                  (bio.value = (e.target as HTMLTextAreaElement).value)
                }
                rows={2}
                class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                placeholder="Siswa yang tertarik dengan eksperimen fisika..."
              />
            </div>
            <button
              type="submit"
              disabled={action.isRunning}
              class="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {action.isRunning ? "Menyimpan..." : "Selesai — Masuk ke Beranda"}
            </button>
          </Form>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = { title: "Onboarding - KF13 Platform" };
