import { component$ } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";

export const useRegisterAction = routeAction$(async (data, req) => {
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  if (!name || !email || !password) {
    return { success: false, error: "Semua field wajib diisi" };
  }
  if (password.length < 8) {
    return { success: false, error: "Password minimal 8 karakter" };
  }

  try {
    const auth = getAuth();
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: true
    });

    const token = result.headers.get("set-cookie");
    if (token) {
      req.cookie.set("kf13.session_token", token, {
        httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60
      });
    }

    const body = await result.json();
    if (!result.ok) {
      return { success: false, error: body.message || "Pendaftaran gagal" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghubungi server" };
  }
});

export default component$(() => {
  const action = useRegisterAction();

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-4">K</div>
          <h1 class="text-2xl font-bold text-gray-900">Daftar di KF13</h1>
          <p class="text-gray-500 mt-2 text-sm">Bergabung dengan komunitas sains Indonesia</p>
        </div>

        {action.value?.error && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{action.value.error}</div>
        )}

        {action.value?.success && (
          <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm text-center">
            Pendaftaran berhasil! Mengalihkan ke onboarding...
            <meta http-equiv="refresh" content="0;url=/onboarding" />
          </div>
        )}

        <Form action={action} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
            <input type="text" name="name" class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Nama Anda" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" name="email" class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="email@example.com" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" name="password" class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" placeholder="Minimal 8 karakter" required minLength={8} />
          </div>
          <button type="submit" disabled={action.isRunning} class="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {action.isRunning ? <><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Memproses...</> : "Daftar"}
          </button>
        </Form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">Sudah punya akun? <a href="/login" class="text-green-600 hover:text-green-700 font-medium">Masuk sekarang</a></p>
        </div>
        <div class="mt-4 text-center">
          <a href="/" class="text-sm text-gray-400 hover:text-gray-600">← Kembali ke beranda</a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = { title: "Daftar - KF13 Platform" };
