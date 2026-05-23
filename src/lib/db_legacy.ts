import { server$ } from "@builder.io/qwik-city";
import { neon } from "@neondatabase/serverless";
import { hash, compare } from "bcryptjs";

function getDatabaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEON_DATABASE_URL) {
    return process.env.NEON_DATABASE_URL;
  }
  if (import.meta.env.NEON_DATABASE_URL) {
    return import.meta.env.NEON_DATABASE_URL;
  }
  throw new Error("NEON_DATABASE_URL is not defined in environment variables");
}

function sql() {
  return neon(getDatabaseUrl());
}

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const initDB = server$(async function () {
  const db = sql();

  await db`CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    year TEXT,
    major TEXT,
    university TEXT,
    motivation TEXT,
    interests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    avatar_url TEXT,
    bio TEXT,
    institution TEXT,
    level TEXT DEFAULT 'SMA',
    posts_count INTEGER DEFAULT 0,
    cendol_count INTEGER DEFAULT 0,
    bata_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id),
    title TEXT,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'discussion',
    tags TEXT,
    cendol_count INTEGER DEFAULT 0,
    bata_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    tags TEXT,
    stars_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await db`CREATE TABLE IF NOT EXISTS reactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, post_id)
  )`;

  await db`CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
  )`;
});

export const seedDB = server$(async function () {
  if (import.meta.env.PROD) return;
  const db = sql();

  const existing = await db`SELECT COUNT(*) as count FROM users`;
  if (existing[0].count > 0) return;

  const passHash = await hash("password123", 10);

  await db`
    INSERT INTO users (username, name, email, password_hash, bio, institution, level, posts_count, cendol_count) VALUES
    ('budi_fisika', 'Budi Santoso', 'budi@example.com', ${passHash}, 'Mahasiswa Fisika ITB | Eksperimenter', 'Institut Teknologi Bandung', 'Universitas', 156, 234),
    ('siti_quantum', 'Siti Nurhaliza', 'siti@example.com', ${passHash}, 'Physics PhD Student | Quantum Computing', 'Universitas Indonesia', 'S2/S3', 312, 567),
    ('ahmad_osn', 'Ahmad Rizki', 'ahmad@example.com', ${passHash}, 'Siswa SMAN 1 Surabaya | Persiapan OSN 2026', 'SMAN 1 Surabaya', 'SMA', 23, 45)
  `;

  await db`
    INSERT INTO posts (author_id, title, content, type, tags, cendol_count) VALUES
    (1, 'Berhasil bikin interferometer Michelson dari cermin bekas!', 'Setelah 2 minggu trial error, akhirnya dapet pola interferensi yang bagus gan...', 'project', 'diy,optik,eksperimen', 89),
    (3, 'Kenapa momentum angular kekal tapi energi kinetik tidak pada tumbukan?', 'Saya bingung dengan konsep ini. Kalau tidak ada torsi eksternal, L kekal. Tapi kenapa KE bisa berubah?', 'question', 'mekanika,tanya', 45),
    (2, 'Pengalaman apply PhD Physics di luar negeri - AMA', 'Baru diterima di program PhD. Mau share pengalaman dari persiapan sampai interview...', 'discussion', 'karir,phd', 32)
  `;
});

export const registerUser = server$(async function (data: {
  name: string;
  email: string;
  password: string;
  institution: string;
}) {
  const db = sql();
  const passwordHash = await hash(data.password, 10);
  const username = data.email.split("@")[0].replace(/[^a-z0-9_]/g, "_");

  const result = await db`
    INSERT INTO users (username, name, email, password_hash, institution)
    VALUES (${username}, ${data.name}, ${data.email}, ${passwordHash}, ${data.institution})
    RETURNING id, username, name, email, institution
  `;
  return result[0];
});

export const loginUser = server$(async function (email: string, password: string) {
  const db = sql();

  const users = await db`
    SELECT id, username, name, email, password_hash, institution
    FROM users WHERE email = ${email}
  `;

  if (users.length === 0) return null;

  const user = users[0];
  const isValid = await compare(password, user.password_hash);
  if (!isValid) return null;

  const token = generateToken();
  await db`
    INSERT INTO sessions (user_id, token) VALUES (${user.id}, ${token})
  `;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    institution: user.institution,
    token,
  };
});

export const getSessionUser = server$(async function (token: string) {
  if (!token) return null;
  const db = sql();

  const rows = await db`
    SELECT u.id, u.username, u.name, u.email, u.institution
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ${token} AND s.expires_at > NOW()
  `;

  return rows[0] || null;
});

export const logoutUser = server$(async function (token: string) {
  if (!token) return;
  const db = sql();
  await db`DELETE FROM sessions WHERE token = ${token}`;
});

export const registerMember = server$(async function (data: {
  name: string;
  email: string;
  phone: string;
  year: string;
  major: string;
  university: string;
  motivation: string;
  interests: string;
}) {
  const db = sql();
  const result = await db`
    INSERT INTO members (name, email, phone, year, major, university, motivation, interests)
    VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.year}, ${data.major}, ${data.university}, ${data.motivation}, ${data.interests})
    RETURNING *
  `;
  return result[0];
});

export const getMemberByEmail = server$(async function (email: string) {
  const db = sql();
  const result = await db`
    SELECT name, email, year, major FROM members WHERE email = ${email}
  `;
  return result[0] || null;
});

export const updateMember = server$(async function (email: string, data: {
  name: string;
  year: string;
  major: string;
}) {
  const db = sql();
  await db`
    UPDATE members SET name = ${data.name}, year = ${data.year}, major = ${data.major}
    WHERE email = ${email}
  `;
});

export const getPosts = server$(async function (limit: number = 20) {
  const db = sql();
  return await db`
    SELECT p.*, u.username, u.name as author_name, u.level
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ${limit}
  `;
});

export const createPost = server$(async function (author: string, content: string) {
  const db = sql();
  const result = await db`
    INSERT INTO posts (author_id, content)
    SELECT id, ${content} FROM users WHERE username = ${author} LIMIT 1
    RETURNING *
  `;
  return result[0];
});

export const addLike = server$(async function (id: number) {
  const db = sql();
  await db`UPDATE posts SET cendol_count = cendol_count + 1 WHERE id = ${id}`;
});

export const getUserByUsername = server$(async function (username: string) {
  const db = sql();
  const result = await db`SELECT * FROM users WHERE username = ${username}`;
  return result[0] || null;
});
