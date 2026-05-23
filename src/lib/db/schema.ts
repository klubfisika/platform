import { pgTable, text, boolean, timestamp, serial, integer, unique, index, pgEnum } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  institution: text('institution'),
  level: text('level').default('SMA'),
  major: text('major'),
  bio: text('bio'),
  onboardingCompleted: boolean('onboarding_completed').default(false)
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  username: text('username').unique(),
  bio: text('bio'),
  institution: text('institution'),
  level: text('level').default('SMA'),
  major: text('major'),
  year: text('year'),
  phone: text('phone'),
  website: text('website'),
  avatarUrl: text('avatar_url'),
  postsCount: integer('posts_count').default(0),
  cendolCount: integer('cendol_count').default(0),
  bataCount: integer('bata_count').default(0),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const postType = pgEnum('post_type', ['discussion', 'share', 'tutorial', 'debat', 'proyek', 'ask']);

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').default('discussion'),
  title: text('title'),
  category: text('category').default('lounge'),
  content: text('content').notNull(),
  tags: text('tags'),
  cendolCount: integer('cendol_count').default(0),
  bataCount: integer('bata_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  authorIdx: index('posts_author_idx').on(table.authorId),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt)
}));

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').default('open').notNull(), // 'open', 'in_progress', 'completed'
  tags: text('tags'),
  starsCount: integer('stars_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  ownerIdx: index('projects_owner_idx').on(table.ownerId)
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  postIdx: index('comments_post_idx').on(table.postId),
  authorIdx: index('comments_author_idx').on(table.authorId)
}));

export const notificationType = pgEnum('notification_type', ['cendol', 'reply', 'mention', 'follow', 'thread_reply', 'quote', 'project_invite']);

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  fromUserId: text('from_user_id').references(() => user.id, { onDelete: 'set null' }),
  link: text('link'),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.read)
}));

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  participant1Id: text('participant1_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  participant2Id: text('participant2_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  participant1Idx: index('conversations_participant1_idx').on(table.participant1Id),
  participant2Idx: index('conversations_participant2_idx').on(table.participant2Id)
}));

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  conversationIdx: index('messages_conversation_idx').on(table.conversationId),
  senderIdx: index('messages_sender_idx').on(table.senderId)
}));

export const scienceShorts = pgTable('science_shorts', {
  id: serial('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  thumbnail: text('thumbnail').notNull(),
  duration: text('duration').notNull(),
  views: text('views').default('0'),
  likes: integer('likes').default(0),
  tags: text('tags'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
