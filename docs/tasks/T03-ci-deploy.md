# T03 · GitHub Actions: test, then deploy to Pages

**Phase:** 1 (tooling and page shell) · **Depends on:** T01, T02 · **Size:** S

## Goal

Every push to `main` runs `npm run check`, and the site is deployed to GitHub Pages only if that passes. Pull requests run the checks but never deploy.

## Read first

- `docs/DECISIONS.md`: D11
- `package.json`: scripts

## Do

Create `.github/workflows/pages.yml`:

- **Triggers:** `push` to `main`, `pull_request`, `workflow_dispatch`.
- **Workflow permissions:** `contents: read`.
- **Job `check`** (`ubuntu-latest`): checkout, set up Node 24, run `npm run check`. Don't run `npm install` or `npm ci`: there are no dependencies.
- **Job `deploy`:**
  - `needs: check`; runs only when `github.event_name != 'pull_request'` and `github.ref == 'refs/heads/main'`.
  - Job permissions `pages: write` and `id-token: write`; environment `github-pages` with `url: ${{ steps.deployment.outputs.page_url }}`; `concurrency: { group: pages, cancel-in-progress: false }`.
  - Steps:
    1. checkout
    2. configure-pages
    3. Build `_site/` by copying **only site files**: `index.html`, `css/`, `js/`, `vendor/`, `assets/`. Copy each path that exists and fail if `index.html` is missing. (`vendor/` and `assets/` may not exist yet; see owner tasks O2/O3.)
    4. upload-pages-artifact with `path: _site`
    5. deploy-pages with `id: deployment`
- **Action versions:** use the latest major tag of each action. On 2026-10-20 these were `actions/checkout@v7`, `actions/setup-node@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`. Re-check them with the read-only command `git ls-remote --tags --refs https://github.com/actions/<name>` and mention any change in your report.

## Acceptance criteria

- [ ] The workflow follows the spec above. You can't run GitHub Actions locally: say so in your report, and say whether you could machine-check the YAML syntax with a tool that's already installed
- [ ] `_site/` would not contain `docs/`, `tests/`, `scripts/` or Markdown files
- [ ] `npm run check` passes (the workflow file counts toward the line limit)

## Out of scope

- Turning Pages on in the repository settings (owner task O4).
- Caching, matrix builds, badges.

## Owner follow-up

O4, then push and watch the run in the **Actions** tab.
