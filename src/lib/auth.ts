import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from './db';

let authInstance: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (authInstance) return authInstance;

  const origin = process.env.ORIGIN || '';
  const secret = process.env.BETTER_AUTH_SECRET || '';
  const isDev = origin?.includes('localhost');

  authInstance = betterAuth({
    baseURL: origin,
    secret,
    database: drizzleAdapter(getDb(), { provider: 'pg' }),
    session: {
      cookieCache: { enabled: true, maxAge: 5 * 60 }
    },
    advanced: {
      cookiePrefix: 'kf13',
      crossSubDomainCookies: {
        enabled: !isDev,
        domain: isDev ? undefined : '.klubfisika.or.id'
      },
      defaultCookieAttributes: {
        secure: !isDev,
        httpOnly: true,
        sameSite: 'lax'
      }
    },
    trustedOrigins: [
      origin,
      'https://index.klubfisika.or.id',
      'https://platform.klubfisika.or.id'
    ]
  });

  return authInstance;
}
