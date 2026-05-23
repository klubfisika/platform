import { component$, useSignal } from "@builder.io/qwik";
import {
  routeAction$,
  Form,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

const updateSettingsSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
});

export const useUpdateSettings = routeAction$(async (data, req) => {
  const parsed = updateSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user)
    return { success: false, error: "Silakan login terlebih dahulu" };

  const db = getDb();
  const userId = session.user.id;

  if (parsed.data.email !== undefined) {
    await db
      .update(schema.user)
      .set({ email: parsed.data.email, updatedAt: new Date() })
      .where(eq(schema.user.id, userId));
  }

  if (parsed.data.name !== undefined) {
    await db
      .update(schema.user)
      .set({ name: parsed.data.name, updatedAt: new Date() })
      .where(eq(schema.user.id, userId));
  }

  return { success: true, message: "Pengaturan berhasil diperbarui" };
});

export default component$(() => {
  const action = useUpdateSettings();
  const activeTab = useSignal("profile");

  return (
    <PlatformLayout>
      <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-6">Pengaturan</h1>

        <div class="flex gap-4 mb-6 border-b">
          {["profile", "account", "privacy", "notifications"].map((tab) => (
            <button
              key={tab}
              onClick$={() => (activeTab.value = tab)}
              class={`px-4 py-2 capitalize ${
                activeTab.value === tab
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab.value === "profile" && (
          <div class="space-y-6">
            <h2 class="text-lg font-semibold">Profil Publik</h2>
            <Form action={action} class="space-y-4 max-w-md">
              <div>
                <label class="block text-sm font-medium mb-1">
                  Nama Tampilan
                </label>
                <input
                  name="name"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama Anda"
                />
              </div>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Simpan Perubahan
              </button>
            </Form>
          </div>
        )}

        {activeTab.value === "account" && (
          <div class="space-y-6">
            <h2 class="text-lg font-semibold">Akun</h2>
            <Form action={action} class="space-y-4 max-w-md">
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">
                  Password Baru
                </label>
                <input
                  name="password"
                  type="password"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Perbarui Akun
              </button>
            </Form>
          </div>
        )}

        {activeTab.value === "privacy" && (
          <div class="space-y-6">
            <h2 class="text-lg font-semibold">Privasi</h2>
            <div class="space-y-4 max-w-md">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4" />
                <span>Tampilkan profil saya kepada semua orang</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4" />
                <span>Izinkan pesan dari pengguna lain</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4" />
                <span>Tampilkan aktivitas online saya</span>
              </label>
            </div>
          </div>
        )}

        {activeTab.value === "notifications" && (
          <div class="space-y-6">
            <h2 class="text-lg font-semibold">Notifikasi</h2>
            <div class="space-y-4 max-w-md">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4" defaultChecked />
                <span>Notifikasi email untuk balasan</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4" defaultChecked />
                <span>Notifikasi email untuk pesan baru</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4" defaultChecked />
                <span>Notifikasi email untuk kompetisi baru</span>
              </label>
            </div>
          </div>
        )}

        {action.value?.success && (
          <div class="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            {action.value.message}
          </div>
        )}
        {action.value?.error && (
          <div class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {action.value.error}
          </div>
        )}
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Pengaturan - KF13 Platform",
  meta: [{ name: "description", content: "Pengaturan akun dan privasi Anda" }],
};
