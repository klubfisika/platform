import {
  component$,
  useSignal,
  useComputed$,
  $,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useOnDocument } from "@builder.io/qwik";
import ThreadRow, { type Thread } from "./ThreadRow";
import {
  FORUM_CONFIG,
  SUBFORUMS,
  FORUM_LABELS,
  getForumStats,
} from "~/data/forumConfig";

const parseTimeToMinutes = (timeStr: string): number => {
  const { timeMultipliers } = FORUM_CONFIG;
  if (timeStr.includes("menit")) return timeMultipliers.menit;
  if (timeStr.includes("jam")) return parseInt(timeStr) * timeMultipliers.jam;
  return parseInt(timeStr) * timeMultipliers.hari;
};

const syncThreadData = (thread: Thread) => {
  const recentActivity =
    thread.lastActivity.includes("jam") ||
    thread.lastActivity.includes("menit");
  const { hotThreadThresholds } = FORUM_CONFIG;
  const highEngagement =
    thread.cendol > hotThreadThresholds.cendol ||
    thread.replyCount > hotThreadThresholds.replies;
  const isHot = recentActivity && highEngagement;
  return { ...thread, isHot };
};

interface DiscussionListProps {
  initialThreads?: Thread[];
}

export default component$<DiscussionListProps>(({ initialThreads }) => {
  const loc = useLocation();
  const activeTab = useSignal(loc.url.searchParams.get("tab") || "all");
  const currentPage = useSignal(
    parseInt(loc.url.searchParams.get("page") || "1"),
  );
  const activeTag = useSignal(loc.url.searchParams.get("tag") || "");
  const searchQuery = useSignal(loc.url.searchParams.get("search") || "");
  const sortBy = useSignal(loc.url.searchParams.get("sort") || "latest");
  const itemsPerPage = FORUM_CONFIG.itemsPerPage;
  const forumStats = getForumStats();

  useOnDocument(
    "tag-filter",
    $((e: Event) => {
      const customEvent = e as CustomEvent;
      const url = new URL(window.location.href);
      url.searchParams.set("tag", customEvent.detail);
      url.searchParams.delete("page");
      window.history.pushState({}, "", url.toString());
      window.location.reload();
    }),
  );

  const updateURL = $(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (activeTab.value !== "all") params.set("tab", activeTab.value);
    else params.delete("tab");

    if (currentPage.value > 1) params.set("page", currentPage.value.toString());
    else params.delete("page");

    if (activeTag.value) params.set("tag", activeTag.value);
    else params.delete("tag");

    if (searchQuery.value) params.set("search", searchQuery.value);
    else params.delete("search");

    if (sortBy.value !== "latest") params.set("sort", sortBy.value);
    else params.delete("sort");

    window.history.replaceState({}, "", url.toString());
  });

  const syncedThreads = useComputed$(() => {
    const baseThreads = initialThreads || [];
    return baseThreads.map((thread) => syncThreadData(thread));
  });

  const filteredThreads = useComputed$(() => {
    let threads = syncedThreads.value;

    if (activeTab.value !== "all") {
      threads = threads.filter((t) => t.category === activeTab.value);
    }

    if (activeTag.value) {
      threads = threads.filter(
        (t) =>
          t.tags &&
          t.tags.some((tag) =>
            tag.toLowerCase().includes(activeTag.value.toLowerCase()),
          ),
      );
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      threads = threads.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.excerpt?.toLowerCase().includes(query) ||
          t.author.name.toLowerCase().includes(query) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return threads;
  });

  const sortedThreads = useComputed$(() => {
    const threads = [...filteredThreads.value];

    threads.sort((a, b) => {
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      return 0;
    });

    const nonSticky = threads.filter((t) => !t.isSticky);
    const sticky = threads.filter((t) => t.isSticky);

    switch (sortBy.value) {
      case "popular":
        nonSticky.sort(
          (a, b) => b.cendol + b.replyCount - (a.cendol + a.replyCount),
        );
        break;
      case "replies":
        nonSticky.sort((a, b) => b.replyCount - a.replyCount);
        break;
      case "latest":
      default:
        nonSticky.sort(
          (a, b) =>
            parseTimeToMinutes(a.lastActivity) -
            parseTimeToMinutes(b.lastActivity),
        );
        break;
    }

    return [...sticky, ...nonSticky];
  });

  const totalPages = useComputed$(() =>
    Math.ceil(sortedThreads.value.length / itemsPerPage),
  );

  const paginatedThreads = useComputed$(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return sortedThreads.value.slice(start, start + itemsPerPage);
  });

  return (
    <div>
      <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-2xl p-5 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <span class="text-3xl">💬</span>
          <div>
            <h1 class="text-xl font-bold">{FORUM_CONFIG.title}</h1>
            <p class="text-sm opacity-90">{FORUM_CONFIG.subtitle}</p>
          </div>
        </div>
        <a
          href="/discussions/new"
          class="bg-white text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-50 transition shadow-sm"
        >
          {FORUM_LABELS.createThread}
        </a>
      </div>

      {activeTag.value && (
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-medium">
              {FORUM_LABELS.activeFilter}
            </span>
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              #{activeTag.value}
            </span>
          </div>
          <button
            onClick$={() => {
              activeTag.value = "";
              currentPage.value = 1;
              updateURL();
            }}
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {FORUM_LABELS.removeFilter}
          </button>
        </div>
      )}

      <div class="bg-white rounded-b-2xl shadow-sm p-2 mb-4 overflow-x-auto">
        <div class="flex gap-1">
          {SUBFORUMS.map((tab) => (
            <button
              key={tab.id}
              onClick$={() => {
                activeTab.value = tab.id;
                currentPage.value = 1;
                updateURL();
              }}
              class={`px-4 py-2 rounded-xl font-medium text-sm transition whitespace-nowrap ${
                activeTab.value === tab.id
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div class="ml-2 flex items-center justify-between mb-2 text-sm">
        <div class="flex items-center gap-4 text-gray-500">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {forumStats.onlineUsers} online
          </span>
          <span>{forumStats.totalThreads} thread</span>
          <span>{forumStats.totalReplies} balasan</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-xs">{FORUM_LABELS.sortBy}</span>
            <select
              value={sortBy.value}
              onChange$={(e) => {
                sortBy.value = (e.target as HTMLSelectElement).value;
                currentPage.value = 1;
                updateURL();
              }}
              class="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
            >
              <option value="latest">{FORUM_LABELS.sortOptions.latest}</option>
              <option value="popular">
                {FORUM_LABELS.sortOptions.popular}
              </option>
              <option value="replies">
                {FORUM_LABELS.sortOptions.replies}
              </option>
            </select>
          </div>
          <div class="relative">
            <input
              type="text"
              placeholder={FORUM_LABELS.searchPlaceholder}
              value={searchQuery.value}
              onInput$={(e) => {
                searchQuery.value = (e.target as HTMLInputElement).value;
                currentPage.value = 1;
                updateURL();
              }}
              class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-gray-600 w-48 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <span class="absolute right-2.5 top-1.5 text-gray-400 text-sm">
              🔍
            </span>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm overflow-hidden"
        id="thread-list"
      >
        <div class="px-4 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <div class="col-span-6">{FORUM_LABELS.tableHeaders.topic}</div>
          <div class="col-span-2 text-center">
            {FORUM_LABELS.tableHeaders.author}
          </div>
          <div class="col-span-2 text-center">
            {FORUM_LABELS.tableHeaders.engagement}
          </div>
          <div class="col-span-2 text-center">
            {FORUM_LABELS.tableHeaders.activity}
          </div>
        </div>

        {paginatedThreads.value.length === 0 ? (
          <div class="p-12 text-center text-gray-400">
            <span class="text-4xl mb-2 block">📭</span>
            {activeTag.value
              ? FORUM_LABELS.emptyStates.noThreadsWithTag(activeTag.value)
              : FORUM_LABELS.emptyStates.noThreadsInCategory}
          </div>
        ) : (
          paginatedThreads.value.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} />
          ))
        )}
      </div>

      {totalPages.value > 1 && (
        <div class="flex items-center justify-between mt-4 text-sm">
          <div class="text-gray-500">
            {FORUM_LABELS.pagination.showing(
              (currentPage.value - 1) * itemsPerPage + 1,
              Math.min(
                currentPage.value * itemsPerPage,
                sortedThreads.value.length,
              ),
              sortedThreads.value.length,
            )}
          </div>
          <div class="flex gap-1">
            {Array.from({ length: totalPages.value }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick$={() => {
                    currentPage.value = page;
                    updateURL();
                  }}
                  class={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    currentPage.value === page
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
});
