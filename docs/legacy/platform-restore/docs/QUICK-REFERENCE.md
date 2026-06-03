# Profile Page Quick Reference

## Emergency Commands
```bash
# Rollback if issues
git revert HEAD

# Performance check
pnpm test:profile

# Force rebuild
rm -rf dist && pnpm build
```

## Key Files
- `src/pages/[username].astro` - Main profile page
- `src/components/ProfileCard.astro` - Reusable container
- `src/components/qwik/` - Interactive components

## Performance Targets
- Bundle: <20KB
- Load: <1.5s  
- Lighthouse: >95

## Contact
See HANDOVER.md for detailed guidance.
