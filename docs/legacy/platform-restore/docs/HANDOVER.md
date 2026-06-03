# 🎓 Profile Page - Developer Handover Guide

## Quick Start
```bash
# Development
pnpm dev

# Testing
pnpm test:profile

# Production Build
pnpm build

# Launch Validation
pnpm launch:profile
```

## 🏗️ Architecture Overview

### Component Structure
```
src/
├── pages/[username].astro          # Main profile page
├── components/
│   ├── ProfileCard.astro           # Reusable card container
│   ├── ProfileSEO.astro           # Basic SEO meta tags
│   ├── ProfileAdvancedSEO.astro   # Dynamic OG images
│   └── qwik/
│       ├── ShareProfile.tsx        # Copy link functionality
│       ├── StatsGrid.tsx          # Interactive statistics
│       └── ContributionGraph.tsx   # Lazy-loaded activity
└── lib/
    ├── kaskus.ts                  # Rank system utilities
    └── monitoring.ts              # Performance tracking
```

### Key Design Decisions
- **Astro + Qwik**: SSR for SEO, client hydration for interactivity
- **CSS Custom Properties**: Centralized design tokens
- **Progressive Enhancement**: Works without JavaScript
- **Component-First**: Reusable, testable pieces

## 🔧 Common Tasks

### Adding New Profile Section
```astro
<ProfileCard title="New Section" icon="🆕">
  <div class="your-content">
    <!-- Content here -->
  </div>
</ProfileCard>
```

### Creating Interactive Component
```tsx
// src/components/qwik/NewFeature.tsx
import { component$ } from '@builder.io/qwik';

export const NewFeature = component$(() => {
  return <div>Interactive content</div>;
});
```

### Performance Monitoring
```typescript
// Add to monitoring.ts
gtag('event', 'new_interaction', {
  element: 'feature_name',
  page_path: window.location.pathname
});
```

## 🚨 Critical Points

### Performance Budget
- **Bundle Size**: Keep under 20KB total
- **Load Time**: Target <1.5s
- **Lighthouse**: Maintain 95+ scores

### Accessibility Requirements
- Always include ARIA labels
- Test with screen readers
- Ensure keyboard navigation

### SEO Essentials
- Update structured data for new fields
- Generate OG images for new content
- Maintain semantic HTML structure

## 🧪 Testing Strategy

### Before Each Release
```bash
# 1. Run full test suite
pnpm test:profile

# 2. Performance validation
npx lighthouse http://localhost:4321/budi_fisika

# 3. Accessibility check
npx axe-cli http://localhost:4321/budi_fisika
```

### Monitoring Checklist
- [ ] Bundle size within budget
- [ ] All Lighthouse scores >95
- [ ] No accessibility violations
- [ ] Error handling works
- [ ] Offline functionality intact

## 📞 Support Contacts
- **Architecture Questions**: Review docs/profile-architecture.md
- **Performance Issues**: Check docs/profile-performance.md
- **Testing Problems**: See tests/profile.spec.ts

## 🎯 Success Metrics
- Load time <1.2s
- Bundle size <20KB
- Lighthouse 100/100
- Zero accessibility violations
- 95%+ test coverage

**The profile system is production-ready and optimized for scale! 🚀**
