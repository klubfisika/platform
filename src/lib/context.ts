import { createContextId } from "@builder.io/qwik";

export const SidebarContext = createContextId<{
  activeUsers: any;
  trendingTopics: any;
  suggestedUsers: any;
  stats: any;
  upcomingEvents: any;
}>('sidebar-context');
