import { routeLoader$ } from '@builder.io/qwik-city';
import { getAuth } from './auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

export const useAuth = routeLoader$<AuthUser | null>(async (event) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: event.request.headers
    });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image ?? null
    };
  } catch {
    return null;
  }
});

export const ROUTES = {
  GUEST_HOME: '/mulai',
  SIGN_IN: '/login',
  SIGN_UP: '/register',
  ONBOARDING: '/onboarding',
  MEMBER_HOME: '/feed',
  FEED: '/feed',
  DISCUSSIONS: '/discussions',
  PROJECTS: '/projects',
  COMPETITIONS: '/competitions',
  PROFILE: '/profile'
} as const;
