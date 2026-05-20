import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import PlatformLayout from "~/components/platform/PlatformLayout";
import DiscussionList from "~/components/qwik/DiscussionList";

export default component$(() => {
  return (
    <PlatformLayout title="Diskusi" activeNav="/discussions">
      <DiscussionList />
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Diskusi",
};
