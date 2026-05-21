import { component$, useSignal } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { neon } from "@neondatabase/serverless";
import { compare } from "bcryptjs";

function db() {
  const url = process.env.NEON_DATABASE_URL || (import.meta as any).env?.NEON_DATABASE_URL;
  return neon(url);
}

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const useLoginAction = routeAction$(async (data, req) => {
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi" };
  }

  const d = db();
  const users = await d`SELECT id, username, name, email, password_hash, institution FROM users WHERE email = ${email}`;

  if (users.length === 0) {
    return { success: false, error: "Email belum terdaftar" };
  }

  const user = users[0];
  const valid = await compare(password, user.password_hash);
  if (!valid) {
    return { success: false, error: "Password salah" };
  }

  const token = generateToken();
  await d`INSERT INTO sessions (user_id, token) VALUES (${user.id}, ${token})`;

  req.cookie.set("kf13-session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, name: user.name, email: user.email };
});

export default component$(() => {
  const action = useLoginAction();
  const email = useSignal("");
  const password = useSignal("");

  return (
    <div class="bg-white rounded-3xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🔐</div>
        <h1 class="text-2xl font-bold text-gray-900">Masuk ke KF13</h1>
        <p class="text-gray-500 mt-2 text-sm">Platform komunitas Klub Fisika Indonesia</p>
      </div>

      {action.value?.error && (
        <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {action.value.error}
        </div>
      )}

      {action.value?.success && (
        <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm text-center">
          Login berhasil! <a href="/feed" class="font-medium underline">Klik di sini jika tidak dialihkan</a>
          <script dangerouslySetInnerHTML="setTimeout(() => location.href = '/feed', 800)" />
        </div>
      )}

      <Form action={action} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={email.value}
            onInput$={(e) => email.value = (e.target as HTMLInputElement).value}
            class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            value={password.value}
            onInput$={(e) => password.value = (e.target as HTMLInputElement).value}
            class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="••••••••"
            required
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
            "Masuk"
          )}
        </button>
      </Form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Belum punya akun?{" "}
          <a href="/register" class="text-green-600 hover:text-green-700 font-medium">
            Daftar sekarang
          </a>
        </p>
      </div>

      <div class="mt-4 text-center">
        <a href="/" class="text-sm text-gray-400 hover:text-gray-600">
          ← Kembali ke beranda
        </a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login - KF13 Platform",
};
