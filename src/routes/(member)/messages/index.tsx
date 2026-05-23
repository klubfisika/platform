import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, type RequestHandler } from "@builder.io/qwik-city";
import { getAuth } from "~/lib/auth";
import PlatformLayout from "~/components/platform/PlatformLayout";
import { getDb, schema } from "~/lib/db";
import { eq, desc, sql, or, and, ne } from "drizzle-orm"; // Added sql, or, and, ne imports
import ConversationList from "~/components/qwik/ConversationList"; 

export const onRequest: RequestHandler = async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    throw event.redirect(302, "/login");
  }
};

export const useConversationsLoader = routeLoader$(async (event) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) {
    // This case should be handled by onRequest, but good to have a fallback
    return [];
  }

  const db = getDb();

  const userConversations = await db
    .select({
      id: schema.conversations.id,
      participant1Id: schema.conversations.participant1Id,
      participant2Id: schema.conversations.participant2Id,
      lastMessageAt: schema.conversations.lastMessageAt,
      // We need to fetch the last message content and sender for display
      lastMessageContent: schema.messages.content,
      lastMessageSenderId: schema.messages.senderId,
      lastMessageRead: schema.messages.read,
    })
    .from(schema.conversations)
    .leftJoin(
      schema.messages,
      eq(schema.conversations.id, schema.messages.conversationId)
    )
    .where(
      or( // Changed || to or()
        eq(schema.conversations.participant1Id, session.user.id),
        eq(schema.conversations.participant2Id, session.user.id),
      )
    )
    .orderBy(desc(schema.conversations.lastMessageAt));

    // For each conversation, get details of the other participant and aggregate messages
    const conversationsWithDetails = await Promise.all(
        userConversations.map(async (conv) => {
            const otherParticipantId = conv.participant1Id === session.user.id
                ? conv.participant2Id
                : conv.participant1Id;

            const [otherUser] = await db
                .select({
                    id: schema.user.id,
                    name: schema.user.name,
                    image: schema.user.image,
                })
                .from(schema.user)
                .where(eq(schema.user.id, otherParticipantId));

            const unreadCountResult = await db
                .select({ count: sql<number>`count(*)` })
                .from(schema.messages)
                .where(
                    and( // Changed && to and()
                        eq(schema.messages.conversationId, conv.id),
                        eq(schema.messages.read, false),
                        ne(schema.messages.senderId, session.user.id) // Only count unread messages sent by others
                    )
                );
            const unreadCount = unreadCountResult[0].count;

            return {
                id: conv.id,
                otherParticipant: otherUser ? {
                    id: otherUser.id,
                    name: otherUser.name,
                    avatar: otherUser.image || otherUser.name?.charAt(0).toUpperCase() || 'U',
                } : null,
                lastMessage: {
                    content: conv.lastMessageContent,
                    senderId: conv.lastMessageSenderId,
                    read: conv.lastMessageRead,
                },
                lastMessageAt: conv.lastMessageAt,
                unreadCount: unreadCount,
                currentUser: {
                    id: session.user.id,
                    name: session.user.name,
                }
            };
        })
    );


  return conversationsWithDetails.filter(conv => conv.otherParticipant !== null);
});

export default component$(() => {
  const conversations = useConversationsLoader();

  return (
    <PlatformLayout title="Pesan" activeNav="/messages">
      <h1 class="text-2xl font-bold mb-4">Pesan Anda</h1>
      {conversations.value.length === 0 ? (
        <div class="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <p class="mb-4">Anda belum memiliki percakapan.</p>
          <a href="#" class="text-green-600 hover:underline">
            Mulai Percakapan Baru
          </a>
        </div>
      ) : (
        <ConversationList conversations={conversations.value} />
      )}
    </PlatformLayout>
  );
});

export const head: DocumentHead = {
  title: "Pesan",
};