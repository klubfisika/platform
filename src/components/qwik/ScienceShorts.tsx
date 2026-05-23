import { component$, useSignal, $ } from "@builder.io/qwik";

export interface Video {
  id: string;
  title: string;
  creator: string;
  avatar: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: number;
  tags: string[];
}

export default component$(({ videos }: { videos: Video[] }) => {
  const currentIndex = useSignal(0);

  const nextVideo = $(() => {
    currentIndex.value = (currentIndex.value + 1) % videos.length;
  });

  const prevVideo = $(() => {
    currentIndex.value =
      currentIndex.value === 0
        ? videos.length - 1
        : currentIndex.value - 1;
  });

  const toggleLike = $((videoId: string) => {
    // Handle like toggle
    console.log("Like video:", videoId);
  });

  if (videos.length === 0) return <div>Tidak ada video tersedia.</div>;

  const currentVideo = videos[currentIndex.value];

  return (
    <div class="max-w-sm mx-auto bg-black rounded-2xl overflow-hidden relative h-[600px]">

      {/* Video Container */}
      <div class="relative h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <img
          src={currentVideo.thumbnail}
          alt={currentVideo.title}
          class="w-full h-full object-cover"
          width={300}
          height={400}
        />

        {/* Play Button Overlay */}
        <div class="absolute inset-0 flex items-center justify-center">
          <button class="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition">
            <span class="text-white text-2xl ml-1">▶️</span>
          </button>
        </div>

        {/* Duration */}
        <div class="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentVideo.duration}
        </div>

        {/* Navigation */}
        <button
          onClick$={prevVideo}
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
        >
          ↑
        </button>
        <button
          onClick$={nextVideo}
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
        >
          ↓
        </button>
      </div>

      {/* Content Overlay */}
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        {/* Creator */}
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center font-bold">
            {currentVideo.avatar}
          </div>
          <div class="flex-1">
            <div class="font-medium">{currentVideo.creator}</div>
            <div class="text-sm opacity-75">{currentVideo.views} views</div>
          </div>
          <button class="px-4 py-1.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition">
            Follow
          </button>
        </div>

        {/* Title */}
        <h3 class="font-bold mb-2 line-clamp-2">{currentVideo.title}</h3>

        {/* Tags */}
        <div class="flex gap-2 mb-3 overflow-x-auto">
          {currentVideo.tags.map((tag) => (
            <span
              key={tag}
              class="bg-white/20 px-2 py-1 rounded-full text-xs whitespace-nowrap"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              onClick$={() => toggleLike(currentVideo.id)}
              class="flex items-center gap-1 hover:scale-110 transition"
            >
              <span class="text-xl">🥒</span>
              <span class="text-sm">{currentVideo.likes}</span>
            </button>
            <button class="flex items-center gap-1 hover:scale-110 transition">
              <span class="text-xl">💬</span>
              <span class="text-sm">12</span>
            </button>
            <button class="hover:scale-110 transition">
              <span class="text-xl">↗️</span>
            </button>
          </div>
          <button class="hover:scale-110 transition">
            <span class="text-xl">🔖</span>
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div class="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        {videos.map((_, index) => (
          <div
            key={index}
            class={`w-1 h-8 rounded-full transition ${
              index === currentIndex.value ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
});
