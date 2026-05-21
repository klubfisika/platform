import { component$, useSignal, $ } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";
import InstitutionPicker from "~/components/qwik/InstitutionPicker";

function db() {
  const url = process.env.NEON_DATABASE_URL || (import.meta as any).env?.NEON_DATABASE_URL;
  return neon(url);
}

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const useRegisterAction = routeAction$(async (data, req) => {
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const confirmPassword = String(data.confirmPassword || "");
  const institution = String(data.institution || "").trim();

  if (!name || !email || !password) {
    return { success: false, error: "Nama, email, dan password wajib diisi" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Password tidak cocok" };
  }

  if (password.length < 8) {
    return { success: false, error: "Password minimal 8 karakter" };
  }

  const d = db();

  try {
    await d`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL, password_hash TEXT, institution TEXT,
      level TEXT DEFAULT 'SMA', posts_count INTEGER DEFAULT 0,
      cendol_count INTEGER DEFAULT 0, bata_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;
    await d`CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(),
      expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
    )`;
  } catch { console.error("Schema init skipped"); }

  const existing = await d`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return { success: false, error: "Email sudah terdaftar" };
  }

  const username = email.split("@")[0].replace(/[^a-z0-9_]/g, "_");
  const passwordHash = await hash(password, 10);

  const result = await d`
    INSERT INTO users (username, name, email, password_hash, institution)
    VALUES (${username}, ${name}, ${email}, ${passwordHash}, ${institution})
    RETURNING id
  `;

  const userId = result[0].id;
  const token = generateToken();
  await d`INSERT INTO sessions (user_id, token) VALUES (${userId}, ${token})`;

  req.cookie.set("kf13-session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
});

export default component$(() => {
  const action = useRegisterAction();
  const name = useSignal("");
  const email = useSignal("");
  const password = useSignal("");
  const confirmPassword = useSignal("");
  const institution = useSignal("");

  return (
    <div class="bg-white rounded-3xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🚀</div>
        <h1 class="text-2xl font-bold text-gray-900">Daftar KF13</h1>
        <p class="text-gray-500 mt-2 text-sm">Bergabung dengan komunitas fisika Indonesia</p>
      </div>

      {action.value?.error && (
        <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {action.value.error}
        </div>
      )}

      {action.value?.success && (
        <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm text-center">
          Pendaftaran berhasil! <a href="/feed" class="font-medium underline">Klik di sini jika tidak dialihkan</a>
          <script dangerouslySetInnerHTML="setTimeout(() => location.href = '/feed', 800)" />
        </div>
      )}

      <Form action={action} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={name.value}
            onInput$={(e) => name.value = (e.target as HTMLInputElement).value}
            class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="Nama lengkap"
            required
          />
        </div>

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
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Institusi</label>
          <InstitutionPicker
            value={institution.value}
            onChange$={$((val: string) => institution.value = val)}
            placeholder="SMA/Universitas"
          />
          <input type="hidden" name="institution" value={institution.value} />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            value={password.value}
            onInput$={(e) => password.value = (e.target as HTMLInputElement).value}
            class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword.value}
            onInput$={(e) => confirmPassword.value = (e.target as HTMLInputElement).value}
            class="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            placeholder="Ulangi password"
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
              Mendaftar...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </button>
      </Form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Sudah punya akun?{" "}
          <a href="/login" class="text-green-600 hover:text-green-700 font-medium">
            Masuk
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
  title: "Daftar - KF13 Platform",
};
