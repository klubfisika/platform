declare global {
  function gtag(event: string, action: string, params: Record<string, unknown>): void;
}

export function initProfileMonitoring() {
  if (typeof window === 'undefined') return;
  if (typeof gtag !== 'function') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('/[username]')) {
        gtag('event', 'profile_page_performance', {
          metric_name: entry.entryType,
          metric_value: (entry as PerformanceEntry & { value?: number }).value ?? entry.duration,
          page_path: window.location.pathname
        });
      }
    }
  });

  observer.observe({ entryTypes: ['navigation', 'paint', 'layout-shift'] });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('[data-track]')) {
      gtag('event', 'profile_interaction', {
        element: target.dataset.track,
        page_path: window.location.pathname
      });
    }
  });
}
