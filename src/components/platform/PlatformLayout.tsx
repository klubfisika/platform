import { component$, Slot, useSignal, useTask$ } from "@builder.io/qwik";
import PlatformHeader from "~/components/platform/Header";
import LeftSidebar from "~/components/qwik/LeftSidebar";
import PlatformRightSidebar from "~/components/platform/RightSidebar";
import MobileNav from "~/components/qwik/MobileNav";

export interface PlatformLayoutProps {
  title?: string;
  activeNav?: string;
  hideRightSidebar?: boolean;
}

export default component$<PlatformLayoutProps>(
  ({ activeNav, hideRightSidebar = false }) => {
    const sidebarCollapsed = useSignal(false);

    useTask$(() => {
      if (typeof window !== "undefined") {
        sidebarCollapsed.value =
          localStorage.getItem("sidebar-minimized") === "true";

        const handler = (e: Event) => {
          sidebarCollapsed.value = (e as CustomEvent).detail;
        };
        window.addEventListener("sidebar-toggle", handler);
        return () => window.removeEventListener("sidebar-toggle", handler);
      }
    });

    return (
      <div class="bg-gray-100 min-h-screen">
        <PlatformHeader />

        <LeftSidebar activeNav={activeNav} />

        <div
          id="main-wrapper"
          class={{
            "flex flex-col xl:flex-row transition-all duration-300": true,
            "lg:ml-64": !sidebarCollapsed.value,
            "lg:ml-16": sidebarCollapsed.value,
          }}
        >
          <main
            class={{
              "flex-1 min-w-0 px-4 py-4 lg:py-6": true,
              "xl:pr-4": hideRightSidebar,
            }}
          >
            <Slot />
          </main>

          {!hideRightSidebar && <PlatformRightSidebar />}
        </div>

        <MobileNav activeNav={activeNav} />
        <div class="lg:hidden h-16" />
      </div>
    );
  },
);
