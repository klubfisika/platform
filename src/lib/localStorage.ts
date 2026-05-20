// localStorage utilities for client-side data
export const SESSION_KEY = 'kf13-session';
export const PREFERENCES_KEY = 'kf13-preferences';
export const CACHE_KEY = 'kf13-cache';

// Session management
export function getSession() {
  if (typeof localStorage === 'undefined') return null;
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function setSession(user: any) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    level: user.level,
    loginTime: Date.now()
  }));
}

export function getUser() {
  return getSession();
}

export function clearSession() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

// User preferences (theme, notifications, etc)
export function getPreferences() {
  if (typeof localStorage === 'undefined') return {};
  const prefs = localStorage.getItem(PREFERENCES_KEY);
  return prefs ? JSON.parse(prefs) : {
    theme: 'light',
    notifications: true,
    language: 'id'
  };
}

export function setPreferences(prefs: any) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

// Cache for frequently accessed data
export function getCache(key: string) {
  if (typeof localStorage === 'undefined') return null;
  const cache = localStorage.getItem(`${CACHE_KEY}_${key}`);
  if (!cache) return null;
  
  const { data, timestamp, ttl } = JSON.parse(cache);
  if (Date.now() - timestamp > ttl) {
    localStorage.removeItem(`${CACHE_KEY}_${key}`);
    return null;
  }
  return data;
}

export function setCache(key: string, data: any, ttlMinutes = 30) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify({
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  }));
}

export function clearCache(key?: string) {
  if (typeof localStorage === 'undefined') return;
  if (key) {
    localStorage.removeItem(`${CACHE_KEY}_${key}`);
  } else {
    // Clear all cache
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(CACHE_KEY)) {
        localStorage.removeItem(k);
      }
    });
  }
}

// Sync localStorage with database (for offline support)
export function syncToLocalStorage(key: string, data: any) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(`sync_${key}`, JSON.stringify({
    data,
    synced: false,
    timestamp: Date.now()
  }));
}

export function getPendingSync() {
  if (typeof localStorage === 'undefined') return [];
  const pending = [];
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sync_')) {
      const item = JSON.parse(localStorage.getItem(key)!);
      if (!item.synced) {
        pending.push({ key: key.replace('sync_', ''), ...item });
      }
    }
  });
  return pending;
}
