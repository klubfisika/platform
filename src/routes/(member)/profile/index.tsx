import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import {
  routeAction$,
  routeLoader$,
  Form,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { useAuth, getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { eq } from "drizzle-orm";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

export const useProfileData = routeLoader$(async (event) => {
  const authUser = await event.resolveValue(useAuth);
  if (!authUser) return null;

  try {
    const db = getDb();
    const [profile] = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, authUser.id))
      .limit(1);
    return { user: authUser, profile: profile || null };
  } catch (e) {
    console.error("profile error:", e);
    return { user: authUser, profile: null };
  }
});

export const useUpdateProfile = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user)
    return { success: false, error: "Silakan login terlebih dahulu" };
  const authUser = session.user;

  const institution = String(data.institution || "").trim();
  const level = String(data.level || "SMA").trim();
  const major = String(data.major || "").trim();
  const year = String(data.year || "").trim();
  const bio = String(data.bio || "").trim();
  const phone = String(data.phone || "").trim();

  try {
    const db = getDb();
    await db
      .insert(schema.profiles)
      .values({
        userId: authUser.id,
        institution,
        level,
        major: major || null,
        year: year || null,
        bio: bio || null,
        phone: phone || null,
      })
      .onConflictDoUpdate({
        target: schema.profiles.userId,
        set: {
          institution,
          level,
          major: major || null,
          year: year || null,
          bio: bio || null,
          phone: phone || null,
        },
      });

    return { success: true };
  } catch (e) {
    console.error("profile error:", e);
    return { success: false, error: "Gagal menyimpan profil" };
  }
});

export default component$(() => {
  const data = useProfileData();
  const action = useUpdateProfile();
  const institution = useSignal("");
  const level = useSignal("SMA");
  const major = useSignal("");
  const year = useSignal("");
  const bio = useSignal("");
  const phone = useSignal("");
  const saved = useSignal(false);

  useTask$(() => {
    if (!data.value?.user) {
      window.location.href = "/login";
      return;
    }
    const p = data.value?.profile;
    if (p) {
      institution.value = p.institution || "";
      level.value = p.level || "SMA";
      major.value = p.major || "";
      year.value = p.year || "";
      bio.value = p.bio || "";
      phone.value = p.phone || "";
    }
  });

  useTask$(({ track }) => {
    track(() => action.value?.success);
    if (action.value?.success) {
      saved.value = true;
      setTimeout(() => (saved.value = false), 3000);
    }
  });

  const user = data.value?.user;
  if (!user) return <div class="p-8 text-center text-gray-500">Memuat...</div>;

  const initials = (user.name || "?").charAt(0).toUpperCase();

  return (
    <PlatformLayout title="Profil" activeNav="/profile" hideRightSidebar={true}>
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="h-24 bg-gradient-to-r from-green-500 to-teal-600"></div>
          <div class="px-6 pb-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold -mt-10 border-4 border-white">
              {initials}
            </div>
            <div class="mt-3">
              <h1 class="text-xl font-bold text-gray-900">{user.name}</h1>
              <p class="text-sm text-gray-500">{user.email}</p>
            </div>
            {data.value?.profile && (
              <div class="flex gap-4 mt-4 text-sm">
                <div class="text-center px-3 py-2 bg-gray-50 rounded-lg">
                  <span class="block font-bold text-gray-900">
                    {data.value.profile.postsCount || 0}
                  </span>
                  <span class="text-xs text-gray-500">Post</span>
                </div>
                <div class="text-center px-3 py-2 bg-gray-50 rounded-lg">
                  <span class="block font-bold text-green-600">
                    {data.value.profile.cendolCount || 0}
                  </span>
                  <span class="text-xs text-gray-500">Cendol</span>
                </div>
                <div class="text-center px-3 py-2 bg-gray-50 rounded-lg">
                  <span class="block font-bold text-red-500">
                    {data.value.profile.bataCount || 0}
                  </span>
                  <span class="text-xs text-gray-500">Bata</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Edit Profil</h2>

          {saved.value && (
            <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
              Profil berhasil disimpan!
            </div>
          )}

          {action.value?.error && (
            <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {action.value.error}
            </div>
          )}

          <Form action={action} class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Institusi
                </label>
                <input
                  type="text"
                  name="institution"
                  value={institution.value}
                  onInput$={(e) =>
                    (institution.value = (e.target as HTMLInputElement).value)
                  }
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Nama sekolah/universitas"
                />
              </div>
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
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Jurusan
                </label>
                <input
                  type="text"
                  name="major"
                  value={major.value}
                  onInput$={(e) =>
                    (major.value = (e.target as HTMLInputElement).value)
                  }
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Fisika / Informatika / ..."
                />
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
                Nomor Telepon
              </label>
              <input
                type="text"
                name="phone"
                value={phone.value}
                onInput$={(e) =>
                  (phone.value = (e.target as HTMLInputElement).value)
                }
                class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Bio
              </label>
              <textarea
                name="bio"
                value={bio.value}
                onInput$={(e) =>
                  (bio.value = (e.target as HTMLTextAreaElement).value)
                }
                rows={3}
                class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                placeholder="Ceritakan tentang diri Anda..."
              />
            </div>
            <button
              type="submit"
              disabled={action.isRunning}
              class="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {action.isRunning ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </Form>
        </div>
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Profil - KF13 Platform" };
