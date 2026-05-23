import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Seed data verification', () => {
  test.beforeAll(async ({ request }) => {
    // Ensure the API endpoints are reachable
    const res = await request.get(`${baseURL}/api/posts?limit=10`);
    expect(res.ok()).toBeTruthy();
  });

  test('posts are seeded', async ({ request }) => {
    const res = await request.get('/api/posts?limit=10');
    const data = await res.json();
    expect(data.posts.length).toBeGreaterThanOrEqual(3);
    const titles = data.posts.map((p: any) => p.title);
    expect(titles).toContain('Persiapan OSN Fisika 2026 - Tips, Materi, dan Diskusi');
  });

  test('notifications are seeded', async ({ request }) => {
    const res = await request.get('/api/notifications');
    const data = await res.json();
    expect(data.notifications.length).toBeGreaterThanOrEqual(2);
    const notificationTitles = data.notifications.map((n: any) => n.title);
    expect(notificationTitles).toContain('Selamat! Anda mendapat cendol');
  });

  test('conversations and messages are seeded', async ({ request }) => {
    const convRes = await request.get(`${baseURL}/api/conversations`);
    const convData = await convRes.json();
    expect(convData.conversations.length).toBeGreaterThanOrEqual(2);
    const firstConvId = convData.conversations[0].id;
    const msgRes = await request.get(`${baseURL}/api/messages?conversationId=${firstConvId}`);
    const msgData = await msgRes.json();
    expect(msgData.messages.length).toBeGreaterThanOrEqual(1);
    const contents = msgData.messages.map((m: any) => m.content);
    expect(contents).toContain('Halo, ada update?');
  });
});
