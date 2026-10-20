# Owner tasks

Things only the owner does: git writes, adding third-party files, GitHub settings, legal decisions. AI agents must not do these (AGENTS.md hard rules 1–2). Commands assume you're in the project root.

## O1 · Put the project under git and on GitHub

**When:** first, before T01, so every agent task can be reviewed as a diff.

1. `git init -b main`
2. Review the setup files, then `git add -A` and `git commit -m "Project setup: agent docs and task plan"`.
3. On GitHub, create an **empty** repository. Don't let GitHub add a README, .gitignore or license, because they would conflict. It must be **public** if you're on the free plan: GitHub Pages for private repositories needs a paid plan.
4. `git remote add origin <repo-url>` and then `git push -u origin main`.

**After every agent task from now on:** read `git diff`, run `npm run check` (once T01 exists), then commit with the agent's suggested message.

## O2 · Add chess.js 1.4.0

**When:** before T04.

```bash
mkdir -p vendor/chess.js
curl -fsSL -o vendor/chess.js/chess.js https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js
curl -fsSL -o vendor/chess.js/LICENSE  https://cdn.jsdelivr.net/npm/chess.js@1.4.0/LICENSE
```

Verify (values recorded during setup on 2026-10-20):

```bash
sha256sum vendor/chess.js/chess.js   # 76c7c34f0e2e9ab076521a5d6fe786a9cce537bb1b6f29d32a9c9970b5b232d2
wc -l vendor/chess.js/chess.js       # 3368
tail -1 vendor/chess.js/chess.js     # starts with: export { BISHOP, BLACK, Chess,
head -1 vendor/chess.js/LICENSE      # Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
```

**Why this file:** `dist/esm/chess.js` is the package's ES-module build. It's a single file with no imports, so both browsers and Node can load it without a build step. jsDelivr serves the files of the npm package unchanged.

Commit: `O2: vendor chess.js 1.4.0 (BSD-2-Clause)`

## O3 · Add the piece images

**When:** before T08.

The set is "Cburnett" from Wikimedia Commons, licensed **CC BY-SA 3.0**: you must credit the author, and modified images must be shared under the same license. We only rename the files, so they count as unmodified.

```bash
mkdir -p assets/pieces
for c in l d; do
  for p in k q r b n p; do
    color=$([ "$c" = l ] && echo w || echo b)
    name="$color$(echo "$p" | tr 'a-z' 'A-Z').svg"
    curl -fsSL -o "assets/pieces/$name" \
      "https://commons.wikimedia.org/wiki/Special:FilePath/Chess_${p}${c}t45.svg"
  done
done
ls assets/pieces    # expect 12 files: bB bK bN bP bQ bR wB wK wN wP wQ wR (.svg)
```

Open two or three of the files in a browser to check them. (The download command was tested for `wK.svg` during setup.)

Prefer a different set? Choose it, check its license on its source page, then update `CREDITS.md` and decision D09 before committing. Keep the file names (`wK.svg` …) so the code doesn't change.

Commit: `O3: add Cburnett piece SVGs (CC BY-SA 3.0)`

## O4 · Turn on GitHub Pages

**When:** after T03 is committed and pushed.

1. In the GitHub repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
2. Re-run the workflow from the **Actions** tab, or push a commit.
3. The site appears at `https://<your-user>.github.io/<repo-name>/`.

## O5 · Decide the project license

**When:** before inviting contributors or announcing the project. Nothing else waits on it.

Options reviewed during setup:

- **MIT:** permissive and short.
- **GPL-3.0:** copyleft; modified versions that others distribute must stay open.
- **Apache-2.0:** permissive, with a patent grant.
- **No license:** all rights reserved. This is the current state.

Things to know:

- **Third-party licenses don't change.** chess.js (BSD-2-Clause) is compatible with all of the options above. The piece images stay CC BY-SA 3.0 whatever you choose.
- **Check who owns the copyright first.** If the project is made as part of a job or on an employer's equipment, an employment agreement may give the employer ownership. This is general information, not legal advice.
- **How to add it:** on GitHub choose **Add file → Create new file**, name it `LICENSE`, then use "Choose a license template". Then update the License section of `README.md`, the top of `CREDITS.md`, and ask to have D14 in `docs/DECISIONS.md` updated.

## O6 · Release check

**When:** after T19–T21. Go through `docs/QA.md` in a desktop browser and a phone browser. Fix anything that fails by adding a new task in `TODO.md`.
