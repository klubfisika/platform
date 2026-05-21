import { routeLoader$ } from "@builder.io/qwik-city";
import { neon } from "@neondatabase/serverless";

function db() {
  const url = process.env.NEON_DATABASE_URL || (import.meta as any).env?.NEON_DATABASE_URL;
  return neon(url);
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  institution: string;
}

export const useAuth = routeLoader$<AuthUser | null>(async (req) => {
  const token = req.cookie.get("kf13-session")?.value;
  if (!token) return null;

  try {
    const d = db();
    const rows = await d`
      SELECT u.id, u.username, u.name, u.email, u.institution
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `;
    return rows.length > 0 ? (rows[0] as AuthUser) : null;
  } catch {
    return null;
  }
});
