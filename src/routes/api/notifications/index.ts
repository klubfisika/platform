import { type RequestEvent } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import { getDb, schema } from "~/lib/db";
import { eq, and, desc } from "drizzle-orm"; // Removed ne

export const onGet = async (event: RequestEvent) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.error(401, "Unauthorized");
  }

  const db = getDb();
  const action = event.query.get("action");

  if (action === "count") {
    const unread = await db
      .select({ id: schema.notifications.id })
      .from(schema.notifications)
      .where(and(
        eq(schema.notifications.userId, session.user.id),
        eq(schema.notifications.read, false)
      ));
    return event.json(200, { count: unread.length });
  }
  
  const notifications = await db
    .select({
      id: schema.notifications.id,
      type: schema.notifications.type,
      title: schema.notifications.title,
      message: schema.notifications.message,
      link: schema.notifications.link,
      read: schema.notifications.read,
      createdAt: schema.notifications.createdAt,
      fromUserName: schema.user.name,
      fromUserImage: schema.user.image,
    })
    .from(schema.notifications)
    .leftJoin(schema.user, eq(schema.notifications.fromUserId, schema.user.id))
    .where(eq(schema.notifications.userId, session.user.id))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(20);

  const unreadCount = await db
    .select({ id: schema.notifications.id })
    .from(schema.notifications)
    .where(and(
      eq(schema.notifications.userId, session.user.id),
      eq(schema.notifications.read, false)
    ));

  return event.json(200, {
    notifications,
    unreadCount: unreadCount.length,
  });
};

export const onPost = async (event: RequestEvent) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.error(401, "Unauthorized");
  }

  const action = event.query.get("action");
  const db = getDb();

  if (action === "markAllRead") {
    await db
      .update(schema.notifications)
      .set({ read: true })
      .where(and(
        eq(schema.notifications.userId, session.user.id),
        eq(schema.notifications.read, false)
      ));
    event.json(200, { success: true });
  } else if (action === "markRead") {
    const id = parseInt(event.query.get("id") || "", 10);
    if (!isNaN(id)) {
      await db
        .update(schema.notifications)
        .set({ read: true })
        .where(and(
          eq(schema.notifications.id, id),
          eq(schema.notifications.userId, session.user.id)
        ));
      event.json(200, { success: true });
    } else {
      event.json(400, { error: "Invalid ID" });
    }
  } else {
    event.json(400, { error: "Invalid action" });
  }
};
