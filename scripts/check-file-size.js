// Fails if any authored file has more than MAX_LINES lines (AGENTS.md hard rule 3, DECISIONS D04).
// Run with `npm run check:size`. Importing this file only exposes the pure helpers.

import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_LINES = 200;
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '_site', 'vendor', 'assets']);
const CHECKED_EXTENSIONS = new Set(['.js', '.css', '.html', '.md', '.json', '.yml', '.yaml']);

/**
 * Counts lines like `wc -l`, plus a last line that has no trailing newline.
 * @param {string} text file contents
 * @returns {number} 0 for empty text
 */
export function countLines(text) {
  if (text === '') return 0;
  const parts = text.split('\n').length;
  return text.endsWith('\n') ? parts - 1 : parts;
}

/**
 * Tells whether the size rule applies to a file: it has a checked extension
 * and none of its folders is excluded, at any depth.
 * @param {string} relativePath path from the repo root, `/` or `\` separated
 * @returns {boolean}
 */
export function isChecked(relativePath) {
  const segments = relativePath.split(/[\\/]/);
  const folders = segments.slice(0, -1);
  if (folders.some((name) => EXCLUDED_DIRS.has(name))) return false;
  return CHECKED_EXTENSIONS.has(extname(segments.at(-1)));
}

/**
 * Lists every file under `dir`, skipping excluded folders, as `/`-separated
 * paths relative to `root`.
 * @param {string} root
 * @param {string} [dir]
 * @returns {string[]}
 */
function listFiles(root, dir = root) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) files.push(...listFiles(root, path));
    } else if (entry.isFile()) {
      files.push(relative(root, path).split(sep).join('/'));
    }
  }
  return files;
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const failures = listFiles(root)
    .filter(isChecked)
    .sort()
    .map((file) => ({ file, lines: countLines(readFileSync(join(root, file), 'utf8')) }))
    .filter(({ lines }) => lines > MAX_LINES);

  for (const { file, lines } of failures) {
    console.error(`${file}: ${lines} lines (max ${MAX_LINES})`);
  }
  if (failures.length > 0) {
    process.exitCode = 1;
    return;
  }
  console.log(`All files ≤ ${MAX_LINES} lines`);
}

// realpath on both sides so a symlinked checkout still counts as "run directly".
const entry = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (entry === realpathSync(fileURLToPath(import.meta.url))) main();
