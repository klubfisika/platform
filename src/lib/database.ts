import { createClient } from '@libsql/client';

// Environment-based database client
export const db = createClient({
  url: import.meta.env.DEV 
    ? 'file:./local.db'  // Local SQLite file for development
    : import.meta.env.TURSO_DATABASE_URL, // Turso for production
  authToken: import.meta.env.DEV 
    ? undefined 
    : import.meta.env.TURSO_AUTH_TOKEN
});

// Database schema
export async function initDB() {
  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      institution TEXT,
      level TEXT DEFAULT 'SMA',
      posts_count INTEGER DEFAULT 0,
      cendol_count INTEGER DEFAULT 0,
      bata_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Posts table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER REFERENCES users(id),
      title TEXT,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'discussion',
      tags TEXT,
      cendol_count INTEGER DEFAULT 0,
      bata_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'open',
      tags TEXT,
      stars_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Reactions table (cendol/bata)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      post_id INTEGER REFERENCES posts(id),
      type TEXT NOT NULL, -- 'cendol' or 'bata'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, post_id)
    )
  `);
}

// Seed development data
export async function seedDB() {
  if (!import.meta.env.DEV) return; // Only seed in development
  
  // Check if already seeded
  const users = await db.execute('SELECT COUNT(*) as count FROM users');
  if (users.rows[0].count > 0) return;

  // Seed users
  await db.execute(`
    INSERT INTO users (username, name, email, bio, institution, level, posts_count, cendol_count) VALUES
    ('budi_fisika', 'Budi Santoso', 'budi@example.com', 'Mahasiswa Fisika ITB | Eksperimenter', 'Institut Teknologi Bandung', 'Universitas', 156, 234),
    ('siti_quantum', 'Siti Nurhaliza', 'siti@example.com', 'Physics PhD Student | Quantum Computing', 'Universitas Indonesia', 'S2/S3', 312, 567),
    ('ahmad_osn', 'Ahmad Rizki', 'ahmad@example.com', 'Siswa SMAN 1 Surabaya | Persiapan OSN 2026', 'SMAN 1 Surabaya', 'SMA', 23, 45)
  `);

  // Seed posts
  await db.execute(`
    INSERT INTO posts (author_id, title, content, type, tags, cendol_count) VALUES
    (1, 'Berhasil bikin interferometer Michelson dari cermin bekas!', 'Setelah 2 minggu trial error, akhirnya dapet pola interferensi yang bagus gan...', 'project', 'diy,optik,eksperimen', 89),
    (3, 'Kenapa momentum angular kekal tapi energi kinetik tidak pada tumbukan?', 'Saya bingung dengan konsep ini. Kalau tidak ada torsi eksternal, L kekal. Tapi kenapa KE bisa berubah?', 'question', 'mekanika,tanya', 45),
    (2, 'Pengalaman apply PhD Physics di luar negeri - AMA', 'Baru diterima di program PhD. Mau share pengalaman dari persiapan sampai interview...', 'discussion', 'karir,phd', 32)
  `);
}

// Utility functions
export async function getUser(id: number) {
  const result = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return result.rows[0];
}

export async function getUserByUsername(username: string) {
  const result = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return result.rows[0];
}

export async function createUser(userData: any) {
  const result = await db.execute(`
    INSERT INTO users (username, name, email, bio, institution, level) 
    VALUES (?, ?, ?, ?, ?, ?) 
    RETURNING *
  `, [userData.username, userData.name, userData.email, userData.bio, userData.institution, userData.level]);
  return result.rows[0];
}

export async function getPosts(limit = 10) {
  const result = await db.execute(`
    SELECT p.*, u.username, u.name as author_name, u.level 
    FROM posts p 
    JOIN users u ON p.author_id = u.id 
    ORDER BY p.created_at DESC 
    LIMIT ?
  `, [limit]);
  return result.rows;
}
