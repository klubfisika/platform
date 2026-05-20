import { component$, useSignal, useTask$ } from '@builder.io/qwik';

interface Props {
  username: string;
}

export const ProfilePreloader = component$<Props>(({ username }) => {
  const isLoading = useSignal(true);
  const profileData = useSignal<any>(null);

  useTask$(async () => {
    // Preload profile data for faster navigation
    try {
      const response = await fetch(`/api/profiles/${username}`);
      if (response.ok) {
        profileData.value = await response.json();
      }
    } catch (error) {
      console.warn('Profile preload failed:', error);
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="hidden" data-preload={username}>
      {/* Preloaded data for instant navigation */}
      {profileData.value && (
        <script 
          type="application/json" 
          dangerouslySetInnerHTML={JSON.stringify(profileData.value)}
        />
      )}
    </div>
  );
});
