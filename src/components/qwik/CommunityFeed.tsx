import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { getPosts, createPost, addLike } from '~/lib/db';

interface Post {
  id: number;
  author: string;
  content: string;
  created_at: string;
  likes: number;
}

interface Props {
  currentUser?: string;
}

export default component$<Props>(({ currentUser }) => {
  const posts = useStore<Post[]>([]);
  const newPost = useSignal('');
  const isLoading = useSignal(true);

  useVisibleTask$(async () => {
    try {
      const rows = await getPosts(20);
      if (rows) {
        posts.splice(0, posts.length, ...rows.map((row: any) => ({
          id: row.id as number,
          author: row.author_name as string,
          content: row.content as string,
          created_at: new Date(row.created_at as string).toLocaleString('id-ID'),
          likes: (row.cendol_count as number) || 0
        })));
      }
    } catch {
      console.error('Failed to load posts');
    }
    isLoading.value = false;
  });

  const handleAddPost = $(async () => {
    if (!newPost.value.trim() || !currentUser) return;
    try {
      const row = await createPost(currentUser, newPost.value);
      if (row) {
        posts.unshift({
          id: row.id as number,
          author: currentUser,
          content: newPost.value,
          created_at: 'Baru saja',
          likes: 0
        });
      }
      newPost.value = '';
    } catch {
      console.error('Failed to post');
    }
  });

  const likePost = $(async (id: number) => {
    try {
      await addLike(id);
      const post = posts.find(p => p.id === id);
      if (post) post.likes++;
    } catch {
      console.error('Failed to add like');
    }
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
        <button onClick$={handleAddPost} class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
