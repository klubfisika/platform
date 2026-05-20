import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import OnboardingForm from "~/components/qwik/OnboardingForm";

export default component$(() => {
  useVisibleTask$(() => {
    if (localStorage.getItem("kf13-member")) window.location.replace("/feed");
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div class="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🚀</div>
          <h1 class="text-3xl font-bold text-gray-900">Pendaftaran KF13</h1>
          <p class="text-gray-500 mt-2">Lengkapi data diri untuk bergabung dengan komunitas</p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
});

export const head: DocumentHead = { title: "Pendaftaran" };
