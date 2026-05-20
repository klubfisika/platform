import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { turso } from '~/lib/turso';

interface Member {
  name: string;
  email: string;
  year: string;
  major: string;
}

export default component$(() => {
  const member = useStore<Member>({
    name: '',
    email: '',
    year: '',
    major: ''
  });
  
  const isEditing = useSignal(false);
  const isLoading = useSignal(true);

  useVisibleTask$(async () => {
    try {
      const local = localStorage.getItem('kf13-member');
      if (local) {
        const { email } = JSON.parse(local);
        const result = await turso.execute({
          sql: 'SELECT name, email, year, major FROM members WHERE email = ?',
          args: [email]
        });
        if (result.rows.length > 0) {
          const row = result.rows[0];
          member.name = row.name as string || '';
          member.email = row.email as string || '';
          member.year = row.year as string || '';
          member.major = row.major as string || '';
        }
      }
    } catch (e) {
      console.log('Failed to load member');
    }
    isLoading.value = false;
  });

  const saveProfile = $(async () => {
    isLoading.value = true;
    try {
      await turso.execute({
        sql: 'UPDATE members SET name = ?, year = ?, major = ? WHERE email = ?',
        args: [member.name, member.year, member.major, member.email]
      });
      localStorage.setItem('kf13-member', JSON.stringify({ name: member.name, email: member.email }));
      isEditing.value = false;
    } catch (e) {
      console.error('Failed to save');
    }
    isLoading.value = false;
  });

  if (isLoading.value) {
    return <div class="bg-white p-6 rounded-lg shadow-lg text-center">Loading...</div>;
  }

  return (
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Member Profile</h2>
      
      {isEditing.value ? (
        <form class="space-y-4" preventdefault:submit onSubmit$={saveProfile}>
          <input type="text" placeholder="Name" value={member.name}
            onInput$={(e) => member.name = (e.target as HTMLInputElement).value}
            class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" required />
          <input type="email" value={member.email} disabled
            class="w-full p-2 border rounded bg-gray-100" />
          <input type="text" placeholder="Year" value={member.year}
            onInput$={(e) => member.year = (e.target as HTMLInputElement).value}
            class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
          <input type="text" placeholder="Major" value={member.major}
            onInput$={(e) => member.major = (e.target as HTMLInputElement).value}
            class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" />
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Profile
          </button>
        </form>
      ) : (
        <div class="space-y-2">
          <p><strong>Name:</strong> {member.name || 'Not set'}</p>
          <p><strong>Email:</strong> {member.email || 'Not set'}</p>
          <p><strong>Year:</strong> {member.year || 'Not set'}</p>
          <p><strong>Major:</strong> {member.major || 'Not set'}</p>
          <button onClick$={() => isEditing.value = true}
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
});
