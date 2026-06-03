# Legacy Platform Repo Delete Checklist

Repo target: `platform.klubfisika.or.id`

## Already archived in `community.klubfisika.or.id/apps/platform`

- Merge branch: `integration/platform-history-merge-20260603`
- Merge commit: `51aeabd`
- Follow-up docs commits: `eda5d95`, `2c3c9b9`, `27c2e97`
- Legacy docs snapshot:
  - `docs/legacy/platform-repo/README.md`
  - `docs/legacy/platform-repo/TESTING_CONVENTION.md`
  - `docs/legacy/platform-repo/FILE-INVENTORY.md`
  - `docs/legacy/platform-repo/FILE-MANIFEST.md`

## Safe-delete conditions

1. Remote branch `origin/integration/platform-history-merge-20260603` exists and is visible on GitHub.
2. The merge inventory notes the archived legacy docs and route mapping.
3. No unique platform docs or route names are only available in the deleted repo.
4. Any person who needs historical code can inspect the merge branch or tags instead of the old repo.

## What remains unique to the old repo

- The old repo's live tree layout and file paths are preserved in `FILE-MANIFEST.md`.
- The actual code history is preserved by git history in the community repo.

## Recommended final action

- Mark `platform.klubfisika.or.id` as archived/read-only or delete it after the team confirms the merge branch is sufficient.
