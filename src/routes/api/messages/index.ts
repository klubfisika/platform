import { type RequestHandler } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import { getConversations, getTotalUnreadMessages } from "~/lib/db";

export const onGet: RequestHandler = async ({ request, json }) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    json(401, { error: "Unauthorized" });
    return;
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  try {
    if (action === "count") {
      const count = await getTotalUnreadMessages(session.user.id);
      json(200, { count });
    } else {
      const conversations = await getConversations(session.user.id);
      const unreadCount = await getTotalUnreadMessages(session.user.id);
      json(200, { conversations, unreadCount });
    }
  } catch (e) {
    console.error("Messages API error:", e);
    json(500, { error: "Internal server error" });
  }
};
