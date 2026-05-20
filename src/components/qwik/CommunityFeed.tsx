import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { turso, initDB } from '~/lib/turso';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  likes: number;
}

export default component$(() => {
  const posts = useStore<Post[]>([]);
  const newPost = useSignal('');
  const currentUser = useSignal('Anonymous');
  const isLoading = useSignal(true);

  useVisibleTask$(async () => {
    try {
      await initDB();
      const member = localStorage.getItem('kf13-member');
      if (member) currentUser.value = JSON.parse(member).name || 'Anonymous';
      
      const result = await turso.execute('SELECT * FROM posts ORDER BY created_at DESC LIMIT 20');
      posts.splice(0, posts.length, ...result.rows.map(row => ({
        id: row.id as number,
        author: row.author as string,
        content: row.content as string,
        created_at: new Date(row.created_at as string).toLocaleString('id-ID'),
        likes: row.likes as number
      })));
    } catch (e) {
      console.log('Failed to load posts');
    }
    isLoading.value = false;
  });

  const addPost = $(async () => {
    if (!newPost.value.trim()) return;
    try {
      const result = await turso.execute({
        sql: 'INSERT INTO posts (author, content) VALUES (?, ?) RETURNING *',
        args: [currentUser.value, newPost.value]
      });
      const row = result.rows[0];
      posts.unshift({
        id: row.id as number,
        author: row.author as string,
        content: row.content as string,
        created_at: 'Baru saja',
        likes: 0
      });
      newPost.value = '';
    } catch (e) {
      console.error('Failed to post');
    }
  });

  const likePost = $(async (id: number) => {
    try {
      await turso.execute({ sql: 'UPDATE posts SET likes = likes + 1 WHERE id = ?', args: [id] });
      const post = posts.find(p => p.id === id);
      if (post) post.likes++;
    } catch (e) {}
  });

  if (isLoading.value) {
    return <div class="text-center py-8">Loading...</div>;
  }

  return (
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <textarea value={newPost.value}
          onInput$={(e) => newPost.value = (e.target as HTMLTextAreaElement).value}
          placeholder="Share something with the KF13 community..."
          class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none" rows={3} />
        <button onClick$={addPost} class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Post
        </button>
      </div>

      <div class="space-y-4">
        {posts.map((post) => (
          <div key={post.id} class="bg-white p-4 rounded-lg shadow">
            <div class="flex justify-between items-start mb-2">
              <span class="font-semibold text-blue-600">{post.author}</span>
              <span class="text-sm text-gray-500">{post.created_at}</span>
            </div>
            <p class="mb-3">{post.content}</p>
            <button onClick$={() => likePost(post.id)} class="text-sm text-gray-600 hover:text-blue-600">
              👍 {post.likes} likes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
