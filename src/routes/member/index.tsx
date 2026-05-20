import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";
import MemberProfile from "~/components/qwik/MemberProfile";
import CommunityFeed from "~/components/qwik/CommunityFeed";

export default component$(() => {
  useVisibleTask$(() => {
    if (!localStorage.getItem("kf13-member")) window.location.replace("/mulai");
  });

  return (
    <PlatformLayout title="Member" activeNav="">
      <div class="space-y-6">
        <MemberProfile />
        <CommunityFeed />
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Member Home" };
