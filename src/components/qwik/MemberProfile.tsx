import {
  component$,
  useSignal,
  useStore,
  $,
  useTask$,
} from "@builder.io/qwik";
import { getMemberByEmail, updateMember } from "~/lib/db";

interface Props {
  user: { name: string; email: string };
}

export default component$<Props>(({ user }) => {
  const member = useStore({
    name: user.name || "",
    email: user.email || "",
    year: "",
    major: "",
  });

  const isEditing = useSignal(false);
  const isLoading = useSignal(true);

  useTask$(async () => {
    try {
      const row = await getMemberByEmail(user.email);
      if (row) {
        member.name = (row as any).name || user.name || "";
        member.email = (row as any).email || user.email || "";
        member.year = (row as any).year || "";
        member.major = (row as any).major || "";
      }
    } catch {
      console.error("Failed to load member");
    }
    isLoading.value = false;
  });

  const saveProfile = $(async () => {
    isLoading.value = true;
    try {
      await updateMember(member.email, {
        name: member.name,
        year: member.year,
        major: member.major,
      });
      isEditing.value = false;
    } catch {
      console.error("Failed to save");
    }
    isLoading.value = false;
  });

  if (isLoading.value) {
    return (
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        Loading...
      </div>
    );
  }

  return (
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Member Profile</h2>

      {isEditing.value ? (
        <form class="space-y-4" preventdefault:submit onSubmit$={saveProfile}>
          <input
            type="text"
            placeholder="Name"
            value={member.name}
            onInput$={(e) =>
              (member.name = (e.target as HTMLInputElement).value)
            }
            class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            required
          />
          <input
            type="email"
            value={member.email}
            disabled
            class="w-full p-2 border rounded bg-gray-100"
          />
          <input
            type="text"
            placeholder="Year"
            value={member.year}
            onInput$={(e) =>
              (member.year = (e.target as HTMLInputElement).value)
            }
            class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          />
          <input
            type="text"
            placeholder="Major"
            value={member.major}
            onInput$={(e) =>
              (member.major = (e.target as HTMLInputElement).value)
            }
            class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          />
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      ) : (
        <div class="space-y-2">
          <p>
            <strong>Name:</strong> {member.name || "Not set"}
          </p>
          <p>
            <strong>Email:</strong> {member.email || "Not set"}
          </p>
          <p>
            <strong>Year:</strong> {member.year || "Not set"}
          </p>
          <p>
            <strong>Major:</strong> {member.major || "Not set"}
          </p>
          <button
            onClick$={() => (isEditing.value = true)}
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
});
