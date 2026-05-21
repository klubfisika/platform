// Client-side routing guards for static sites
const SESSION_KEY = 'kf13-member';

// Route constants - single source of truth
export const ROUTES = {
  GUEST_HOME: '/mulai',
  MEMBER_HOME: '/feed',
  OVERVIEW: '/overview',
  FEED: '/feed',
  DISCUSSIONS: '/discussions',
  PROJECTS: '/projects',
  COMPETITIONS: '/competitions',
  SHORTS: '/shorts',
  EXPLORE: '/explore',
  PROFILE: '/profile',
} as const;

export const hasSession = () => !!localStorage.getItem(SESSION_KEY);

export const redirectIfLoggedIn = (to = ROUTES.MEMBER_HOME) => {
  if (hasSession()) window.location.replace(to);
};

export const redirectIfGuest = (to = ROUTES.GUEST_HOME) => {
  if (!hasSession()) window.location.replace(to);
};

export const redirectAfterDelay = (to: string, ms = 800) => {
  setTimeout(() => window.location.replace(to), ms);
};
