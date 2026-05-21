import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import MemberProfile from "~/components/qwik/MemberProfile";
import CommunityFeed from "~/components/qwik/CommunityFeed";

export default component$(() => {
  const user = useAuth();
  useVisibleTask$(() => {
    if (!user.value) window.location.replace("/login");
  });

  return (
    <PlatformLayout title="Member" activeNav="">
      <div class="space-y-6">
        {user.value && (
          <>
            <MemberProfile user={{ name: user.value.name, email: user.value.email }} />
            <CommunityFeed currentUser={user.value.username} />
          </>
        )}
      </div>
    </PlatformLayout>
  );
});

export const head: DocumentHead = { title: "Member Home" };
