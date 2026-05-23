import { component$, useTask$ } from "@builder.io/qwik";
import {
  routeAction$,
  Form,
  useNavigate,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { z } from "zod";
import { getAuth } from "~/lib/auth";

const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const useRegisterAction = routeAction$(async (data, req) => {
  const parsed = registerSchema.safeParse({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message } as const;
  }

  const { name, email, password } = parsed.data;

  try {
    const result = await getAuth()!.api.signUpEmail({
      body: { name, email: email.toLowerCase(), password },
      asResponse: true,
    });

    const token = result.headers.get("set-cookie");
    if (token) {
      const origin =
        process.env.ORIGIN ||
        (import.meta as any).env?.ORIGIN ||
        "http://localhost:5173";
      const isDev = origin.includes("localhost");
      req.cookie.set("kf13.session_token", token, {
        httpOnly: true,
        secure: !isDev,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    if (!result.ok) {
      const body = await result.json().catch(() => ({}));
      return {
        success: false,
        error: body.message || body.error || "Pendaftaran gagal",
      } as const;
    }

    return { success: true } as const;
  } catch (e) {
    console.error("register error:", e);
    return { success: false, error: "Pendaftaran gagal" } as const;
  }
});

export default component$(() => {
  const action = useRegisterAction();
  const nav = useNavigate();

  useTask$(({ track }) => {
    const val = track(() => action.value);
    if (val && "success" in val && val.success) {
      nav("/onboarding");
    }
  });

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          {action.value && "success" in action.value && action.value.success ? (
            <>
              <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-4 animate-bounce">
                ✓
              </div>
              <h1 class="text-2xl font-bold text-gray-900">
                Pendaftaran Berhasil!
              </h1>
              <p class="text-green-600 mt-2 text-sm">
                Mengalihkan ke profil...
              </p>
            </>
          ) : (
            <>
              <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                K
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Daftar di KF13</h1>
              <p class="text-gray-500 mt-2 text-sm">
                Bergabung dengan komunitas sains Indonesia
              </p>
            </>
          )}
        </div>

        {action.value && "error" in action.value && action.value.error && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {action.value.error}
          </div>
        )}

        {(!action.value ||
          !("success" in action.value) ||
          !action.value.success) && (
          <>
            <Form action={action} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Nama Anda"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={action.isRunning}
                class="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {action.isRunning ? (
                  <>
                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar"
                )}
              </button>
            </Form>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-500">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  class="text-green-600 hover:text-green-700 font-medium"
                >
                  Masuk sekarang
                </a>
              </p>
            </div>
            <div class="mt-4 text-center">
              <a href="/" class="text-sm text-gray-400 hover:text-gray-600">
                ← Kembali ke beranda
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = { title: "Daftar - KF13 Platform" };
