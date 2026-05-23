import { component$, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import { routeLoader$, RequestHandler } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import {
  getDb,
  schema,
  getNotifications,
  getUnreadNotificationCount,
  getTotalUnreadMessages,
} from "~/lib/db";
import { eq } from "drizzle-orm";
import { SidebarContext } from "~/lib/context";
import {
  getActiveUsers,
  getTrendingTopics,
  getSuggestedUsers,
  getPlatformStats,
  getUpcomingEvents,
} from "~/lib/services/userService";

export const useActiveUsers = routeLoader$(async () => {
  try {
    return await getActiveUsers();
  } catch {
    return [];
  }
});

export const useTrendingTopics = routeLoader$(async () => {
  try {
    return await getTrendingTopics();
  } catch {
    return [];
  }
});

export const useSuggestedUsers = routeLoader$(async () => {
  try {
    return await getSuggestedUsers();
  } catch {
    return [];
  }
});

export const usePlatformStats = routeLoader$(async () => {
  try {
    return await getPlatformStats();
  } catch {
    return { totalUsers: 0, totalPosts: 0, totalDiscussions: 0 };
  }
});

export const useUpcomingEvents = routeLoader$(async () => {
  return await getUpcomingEvents();
});

export const useUserNotifications = routeLoader$(async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user)
    return { notifications: [], unreadCount: 0, unreadMessages: 0 };
  try {
    const notifications = await getNotifications(session.user.id, 10);
    const unreadCount = await getUnreadNotificationCount(session.user.id);
    const unreadMessages = await getTotalUnreadMessages(session.user.id);
    return {
      notifications,
      unreadCount,
      unreadMessages,
      userId: session.user.id,
    };
  } catch {
    console.error("Error loading notifications:");
    return {
      notifications: [],
      unreadCount: 0,
      unreadMessages: 0,
      userId: session.user.id,
    };
  }
});

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }

  let onboardingCompleted = false;
  try {
    const db = getDb();
    const [profile] = await db
      .select({ onboardingCompleted: schema.profiles.onboardingCompleted })
      .from(schema.profiles)
      .where(eq(schema.profiles.userId, session.user.id))
      .limit(1);
    onboardingCompleted = profile?.onboardingCompleted ?? false;
  } catch (err) {
    console.error("Layout auth/onboarding guard DB error:", err);
  }

  const isOnboardingPath = event.url.pathname.startsWith("/onboarding");

  if (!onboardingCompleted && !isOnboardingPath) {
    throw event.redirect(302, "/onboarding");
  }

  if (onboardingCompleted && isOnboardingPath) {
    throw event.redirect(302, "/feed");
  }
};

export default component$(() => {
  useUserNotifications();

  const activeUsers = useActiveUsers();
  const trendingTopics = useTrendingTopics();
  const suggestedUsers = useSuggestedUsers();
  const stats = usePlatformStats();
  const upcomingEvents = useUpcomingEvents();

  useContextProvider(SidebarContext, useStore({
    activeUsers: activeUsers.value,
    trendingTopics: trendingTopics.value,
    suggestedUsers: suggestedUsers.value,
    stats: stats.value,
    upcomingEvents: upcomingEvents.value,
  }));

  return <Slot />;
});
