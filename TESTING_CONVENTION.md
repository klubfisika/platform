# Testing Convention - KF13 Community Platform

Dokumen ini menjelaskan pendekatan 3-layer testing untuk platform KF13 berbasis Qwik + NeonDB + Tailwind CSS.

---

## Layer 1: Unit Testing (Function-Level)

**Scope**: Pure functions, utilities, dan logic yang tidak bergantung pada framework.

**Tools**: Vitest + Testing Library

**Contoh target**:

- `src/lib/kaskus.ts` - Rank system, emoticon parsing
- `src/lib/localStorage.ts` - Local storage helpers
- `src/lib/router.ts` - Route constants dan guards
- Utility functions di `src/data/*.ts`

**Cara menjalankan**:

```bash
bun test
bun test --watch
bun test src/lib/kaskus.test.ts
```

**Contoh test**:

```typescript
// src/lib/kaskus.test.ts
import { describe, it, expect } from "vitest";
import { getRank, RANKS, parseEmoticons } from "./kaskus";

describe("getRank", () => {
  it("returns Newbie for 0 posts", () => {
    expect(getRank(0).title).toBe("Newbie");
  });

  it("returns Kaskus Geek for 1000+ posts", () => {
    expect(getRank(1000).title).toBe("Kaskus Geek");
  });
});

describe("parseEmoticons", () => {
  it("replaces :cendol: with emoji", () => {
    expect(parseEmoticons(":cendol:")).toBe("🍵");
  });
});
```

---

## Layer 2: Component Testing (UI-Level)

**Scope**: Qwik components dengan simulated user interactions.

**Tools**: Vitest + @testing-library/dom

**Contoh target**:

- `src/components/qwik/*.tsx` - UI components
- Form validation
- Dropdown interactions
- Navigation behavior

**Cara menjalankan**:

```bash
bun test:components
bun test src/components/qwik/SearchBar.test.ts
```

**Contoh test**:

```typescript
// src/components/qwik/SearchBar.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/dom';
import { $ } from '@builder.io/qwik';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Cari diskusi...')).toBeTruthy();
  });

  it('calls onSearch when form submitted', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    // ... simulate input and submit
  });
});
```

---

## Layer 3: Integration Testing (E2E)

**Scope**: Full user flows melalui browser automation.

**Tools**: Playwright

**Contoh target**:

- Registration flow: `/register` → `/onboarding` → `/feed`
- Login flow: `/login` → `/feed`
- Post creation: `/feed` → compose → submit
- Navigation: sidebar, mobile nav, dropdowns

**Cara menjalankan**:

```bash
bun test:e2e
bun test:e2e --ui
bun test:e2e tests/auth.spec.ts
```

**Contoh test**:

```typescript
// tests/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("registration flow", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[type="text"]', "Test User");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/onboarding/);
  });

  test("login redirects to feed for existing member", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "existing@example.com");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/feed/);
  });
});
```

---

## Local Development Testing

### Setup

1. **Environment Variables**:

   ```bash
   cp .env.example .env.local
   ```

2. **Database Connection**:
   - `.env.local` berisi `NEON_DATABASE_URL` untuk koneksi ke NeonDB
   - Local dev akan connect langsung ke Neon (tidak perlu local Postgres)

3. **Run Development Server**:
   ```bash
   bun run dev
   ```

### Manual Testing Checklist

**Authentication Flow**:

- [ ] `/mulai` - Landing page dengan link ke login/register
- [ ] `/register` - Form pendaftaran baru
- [ ] `/login` - Form login
- [ ] `/onboarding` - Multi-step profile completion
- [ ] Redirect setelah login ke `/feed`

**Mobile Responsiveness**:

- [ ] Bottom navigation bar visible on mobile
- [ ] Dropdowns render as bottom sheets on mobile
- [ ] Touch interactions work correctly
- [ ] Safe area padding on iOS devices

**Desktop/Tablet**:

- [ ] Left sidebar visible and collapsible
- [ ] Right sidebar shows correctly
- [ ] Dropdowns render as popovers
- [ ] All navigation links work

---

## CI/CD Testing Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun test:e2e
```

---

## Testing Commands Summary

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `bun run dev`         | Start local dev server with NeonDB connection |
| `bun test`            | Run unit tests                                |
| `bun test:components` | Run component tests                           |
| `bun test:e2e`        | Run E2E tests with Playwright                 |
| `bun run lint`        | ESLint check                                  |
| `bun run build.types` | TypeScript type check                         |

---

## Best Practices

1. **Test Isolation**: Setiap test harus independen, tidak bergantung pada state test lain
2. **Mock External Dependencies**: Database calls, API calls harus di-mock untuk unit/component tests
3. **Real Database for E2E**: Integration tests menggunakan test database terpisah
4. **Visual Regression**: Screenshot comparison untuk UI changes
5. **Accessibility**: Test keyboard navigation dan screen reader compatibility

---

## File Structure

```
tests/
├── unit/
│   ├── kaskus.test.ts
│   ├── router.test.ts
│   └── localStorage.test.ts
├── components/
│   ├── SearchBar.test.ts
│   ├── MobileNav.test.ts
│   └── CreateMenu.test.ts
├── e2e/
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   └── posts.spec.ts
└── fixtures/
    ├── users.ts
    └── posts.ts
```
