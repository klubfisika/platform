import type { RequestHandler } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";

export const onPost: RequestHandler = async (event) => {
  const auth = getAuth();

  try {
    await auth.api.signOut({
      headers: event.request.headers,
    });
  } catch (e) {
    console.error("Better Auth signOut failed:", e);
  }

  event.cookie.delete("kf13.session_token", { path: "/" });

  event.json(200, { success: true });
};

export const useLogoutAction = routeAction$(async (_data, req) => {
  const auth = getAuth();

  try {
    await auth.api.signOut({
      headers: req.request.headers,
    });
  } catch (e) {
    console.error("Better Auth signOut failed:", e);
  }

  req.cookie.delete("kf13.session_token", { path: "/" });

  return { success: true };
});
