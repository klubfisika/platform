import type { RequestHandler } from "@builder.io/qwik-city";
import { getAuth } from "../../../../lib/auth";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();

  try {
    const res = await auth.handler(event.request);
    res.headers.forEach((value: string, key: string) => {
      event.headers.set(key, value);
    });
    event.send(res.status, await res.text());
  } catch (e) {
    console.error("[Auth API] Error:", e);
    event.send(500, JSON.stringify({ error: "Internal Server Error" }));
  }
};
