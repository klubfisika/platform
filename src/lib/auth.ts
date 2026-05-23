import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from './db';

let authInstance: ReturnType<typeof betterAuth> | null = null;

function getEnv(key: string): string {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) return (import.meta as any).env[key];
  return '';
}

export function getAuth() {
  if (authInstance) return authInstance;

  const origin = getEnv('ORIGIN') || 'http://localhost:5173';
  const secret = getEnv('BETTER_AUTH_SECRET');
  const githubId = getEnv('GITHUB_CLIENT_ID');
  const githubSecret = getEnv('GITHUB_CLIENT_SECRET');
  const isDev = origin?.includes('localhost');
  const db = getDb();

  authInstance = betterAuth({
    baseURL: origin,
    secret,
    database: drizzleAdapter(db, { provider: 'pg' }),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 8,
      maxPasswordLength: 128
    },

    socialProviders: {
        github: {
          clientId: githubId,
          clientSecret: githubSecret,
          enabled: Boolean(githubId)
        }
    },

    session: {
      expiresIn: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
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
    ],

    user: {
      changeEmail: { enabled: true },
      deleteUser: { enabled: true },
      additionalFields: {
        institution: { type: 'string', required: false },
        level: { type: 'string', required: false, defaultValue: 'SMA' },
        major: { type: 'string', required: false },
        bio: { type: 'string', required: false },
        onboardingCompleted: { type: 'boolean', required: false, defaultValue: false, input: false }
      }
    },

    databaseHooks: {
      user: {
        create: {
          after: async (newUser) => {
            const d = getDb();
            await d.run(`CREATE TABLE IF NOT EXISTS profiles (
              id SERIAL PRIMARY KEY,
              user_id TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
              username TEXT UNIQUE,
              bio TEXT,
              institution TEXT,
              level TEXT DEFAULT 'SMA',
              major TEXT,
              year TEXT,
              phone TEXT,
              website TEXT,
              avatar_url TEXT,
              posts_count INTEGER DEFAULT 0,
              cendol_count INTEGER DEFAULT 0,
              bata_count INTEGER DEFAULT 0,
              onboarding_completed BOOLEAN DEFAULT false,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            )`);
          }
        }
      }
    }
  });

  return authInstance;
}
