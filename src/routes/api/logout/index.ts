import { routeAction$ } from "@builder.io/qwik-city";
import { neon } from "@neondatabase/serverless";

function db() {
  const url = process.env.NEON_DATABASE_URL || (import.meta as any).env?.NEON_DATABASE_URL;
  return neon(url);
}

export const useLogoutAction = routeAction$(async (_data, req) => {
  const token = req.cookie.get("kf13-session")?.value;
  if (token) {
    try {
      const d = db();
      await d`DELETE FROM sessions WHERE token = ${token}`;
    } catch { console.error("Failed to delete session token"); }
  }

  req.cookie.delete("kf13-session", { path: "/" });

  return { success: true };
});
