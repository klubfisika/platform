# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seed-verification.spec.ts >> Seed data verification >> posts are seeded
- Location: tests/playwright/seed-verification.spec.ts:12:3

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED ::1:5174
Call log:
  - → GET http://localhost:5174/api/posts?limit=10
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```