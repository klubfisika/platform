import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/lib/auth";
import OnboardingForm from "~/components/qwik/OnboardingForm";

export default component$(() => {
  const user = useAuth();
  useVisibleTask$(() => {
    if (!user.value) {
      window.location.replace("/login");
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div class="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">📝</div>
          <h1 class="text-2xl font-bold text-gray-900">Lengkapi Profil</h1>
          <p class="text-gray-500 mt-2 text-sm">Ceritakan lebih lanjut tentang dirimu</p>
        </div>
        <OnboardingForm userEmail={user.value?.email} userName={user.value?.name} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Onboarding - KF13 Platform",
  meta: [
    { name: "description", content: "Lengkapi profil untuk bergabung dengan komunitas KF13" }
  ]
};
