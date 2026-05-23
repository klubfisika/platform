import { component$, useSignal, useTask$, type Signal } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  Form,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { eq, desc, and, or, ne } from "drizzle-orm"; // Removed sql import
import { z } from "zod";
import { parseEmoticons } from "~/lib/kaskus";

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

function formatMessageTime(dateInput: Date | string | null): string {
  if (!dateInput) return "Baru saja";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "Baru saja";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("id-ID", options);
}

export const useConversationLoader = routeLoader$(async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  const userId = session?.user?.id;
  const conversationId = parseInt(event.params.id, 10);

  if (!userId || isNaN(conversationId)) {
    return null;
  }

  const db = getDb();

  // Fetch conversation details
  const [conversation] = await db
    .select()
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.id, conversationId),
        or(
          eq(schema.conversations.participant1Id, userId),
          eq(schema.conversations.participant2Id, userId),
        ),
      ),
    );

  if (!conversation) {
    return null;
  }

  // Fetch other participant details
  const otherParticipantId =
    conversation.participant1Id === userId
      ? conversation.participant2Id
      : conversation.participant1Id;

  const [otherUser] = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      image: schema.user.image,
    })
    .from(schema.user)
    .where(eq(schema.user.id, otherParticipantId));

  // Fetch all messages in the conversation
  const messages = await db
    .select({
      id: schema.messages.id,
      senderId: schema.messages.senderId,
      content: schema.messages.content,
      createdAt: schema.messages.createdAt,
      senderName: schema.user.name,
      senderImage: schema.user.image,
    })
    .from(schema.messages)
    .leftJoin(schema.user, eq(schema.messages.senderId, schema.user.id))
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(desc(schema.messages.createdAt)); // Order by latest first

  // Mark all unread messages from other participant as read
  await db
    .update(schema.messages)
    .set({ read: true })
    .where(
      and(
        eq(schema.messages.conversationId, conversationId),
        ne(schema.messages.senderId, userId),
        eq(schema.messages.read, false),
      ),
    );

  return {
    id: conversation.id,
    otherParticipant: otherUser
      ? {
          id: otherUser.id,
          name: otherUser.name,
          avatar: otherUser.image || otherUser.name?.charAt(0).toUpperCase() || 'U',
        }
      : null,
    messages: messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt,
      senderName: m.senderName,
      senderImage: m.senderImage,
      isCurrentUser: m.senderId === userId,
    })),
    currentUser: {
      id: userId,
      name: session.user.name,
    }
  };
});

const sendMessageSchema = z.object({
  content: z.string().min(1, "Pesan tidak boleh kosong"),
});

export const useSendMessageAction = routeAction$(async (data, req) => {
  const session = await getAuth()!.api.getSession({
    headers: req.request.headers,
  });
  if (!session?.user) {
    throw req.redirect(302, "/login");
  }

  const parsed = sendMessageSchema.safeParse({ content: data.content });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const conversationId = parseInt(req.params.id, 10);
  if (isNaN(conversationId)) {
    return { success: false, error: "Percakapan tidak valid." };
  }

  try {
    const db = getDb();

    // Check if conversation exists and current user is a participant
    const [conversation] = await db.select().from(schema.conversations).where(
      and(
        eq(schema.conversations.id, conversationId),
        or(
          eq(schema.conversations.participant1Id, session.user.id),
          eq(schema.conversations.participant2Id, session.user.id),
        ),
      ),
    );

    if (!conversation) {
      return { success: false, error: "Percakapan tidak ditemukan." };
    }

    await db.insert(schema.messages).values({
      conversationId,
      senderId: session.user.id,
      content: parsed.data.content,
      read: false, // Mark as unread for the recipient initially
    });

    // Update lastMessageAt for the conversation
    await db.update(schema.conversations)
            .set({ lastMessageAt: new Date() })
            .where(eq(schema.conversations.id, conversationId));

    return { success: true };
  } catch (err) {
    console.error("Gagal mengirim pesan:", err);
    return { success: false, error: "Gagal menyimpan pesan ke database." };
  }
});

export default component$(() => {
  const conversationData = useConversationLoader();
  const sendMessageAction = useSendMessageAction();
  const chatContainerRef = useSignal<Element | undefined>();

  // Scroll to bottom on initial load and when new messages arrive
  useTask$(({ track }: { track: (value: any) => void }) => {
    track(() => conversationData.value?.messages.length);
    track(() => sendMessageAction.value?.success);

    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });

  if (!conversationData.value) {
    return (
      <PlatformLayout title="Percakapan Tidak Ditemukan" activeNav="/messages">
        <div class="text-center py-12">
          <p class="text-gray-500">Percakapan tidak ditemukan.</p>
          <a
            href="/messages"
            class="text-green-600 hover:underline mt-4 inline-block"
          >
            Kembali ke Pesan
          </a>
        </div>
      </PlatformLayout>
    );
  }

  const { otherParticipant, messages, currentUser } = conversationData.value;

  return (
    <PlatformLayout title={`Pesan dengan ${otherParticipant?.name || 'Pengguna'}`} activeNav="/messages">
      <div class="flex items-center gap-3 bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
          {otherParticipant?.avatar || otherParticipant?.name?.charAt(0).toUpperCase()}
        </div>
        <h1 class="text-xl font-bold text-gray-900">
          Percakapan dengan {otherParticipant?.name || "Pengguna Tak Dikenal"}
        </h1>
      </div>

      <div
        ref={chatContainerRef as Signal<Element>}
        class="bg-white rounded-2xl shadow-sm p-4 mb-4 h-[calc(100vh-280px)] overflow-y-auto flex flex-col-reverse"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            class={`flex gap-3 mb-4 ${
              message.isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {!message.isCurrentUser && (
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 flex-shrink-0">
                {message.senderImage || message.senderName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              class={`max-w-[70%] p-3 rounded-lg ${
                message.isCurrentUser
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <div class="font-semibold text-sm mb-1">
                {message.isCurrentUser ? "Anda" : message.senderName}
              </div>
              <p class="text-sm whitespace-pre-wrap">{parseEmoticons(message.content || "")}</p>
              <div
                class={`text-xs mt-1 ${
                  message.isCurrentUser ? "text-green-200" : "text-gray-500"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </div>
            </div>
            {message.isCurrentUser && (
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      <Form action={sendMessageAction} class="bg-white rounded-2xl shadow-sm p-4">
        {sendMessageAction.value &&
          "error" in sendMessageAction.value &&
          sendMessageAction.value.error && (
            <div class="mb-2 p-2 bg-red-50 border border-red-150 text-red-600 rounded-xl text-xs font-semibold">
              {sendMessageAction.value.error}
            </div>
          )}
        <textarea
          name="content"
          placeholder="Tulis pesan..."
          class="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          required
        ></textarea>
        <div class="flex items-center justify-between mt-2">
          <button
            type="submit"
            disabled={sendMessageAction.isRunning}
            class="px-5 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {sendMessageAction.isRunning ? "Kirim..." : "Kirim"}
          </button>
        </div>
      </Form>
    </PlatformLayout>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const conversation = resolveValue(useConversationLoader);
  return {
    title: `Percakapan dengan ${conversation?.otherParticipant?.name || 'Pengguna'}`,
  };
};