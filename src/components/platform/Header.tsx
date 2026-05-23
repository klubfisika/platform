import { component$ } from "@builder.io/qwik";
import kf13Logo from "~/assets/images/kf13-logo.png";
import ProfileDropdown from "~/components/qwik/ProfileDropdown";
import SearchBar from "~/components/qwik/SearchBar";
import NotificationDropdown from "~/components/qwik/NotificationDropdown";
import MessageDropdown from "~/components/qwik/MessageDropdown";
import CreateMenu from "~/components/qwik/CreateMenu";

export default component$(() => {
  return (
    <nav class="bg-gray-50 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <a href="/" class="flex items-center gap-2 font-bold text-blue-800">
            <img
              src={kf13Logo}
              alt="KF13"
              width={36}
              height={36}
              class="rounded-lg"
            />
            <span class="hidden sm:block text-xl">KF13</span>
          </a>

          <div class="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <div class="flex items-center gap-2">
            <NotificationDropdown />
            <MessageDropdown />
            <CreateMenu />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
});
