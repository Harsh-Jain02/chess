import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countLines, isChecked } from '../../scripts/check-file-size.js';

test('countLines: empty text has 0 lines', () => {
  assert.equal(countLines(''), 0);
});

test('countLines matches wc -l for text ending in a newline', () => {
  assert.equal(countLines('a\n'), 1);
  assert.equal(countLines('a\nb\n'), 2);
  assert.equal(countLines('\n'), 1);
  assert.equal(countLines('\n\n\n'), 3);
});

test('countLines counts a last line that has no trailing newline', () => {
  assert.equal(countLines('a'), 1);
  assert.equal(countLines('a\nb'), 2);
  assert.equal(countLines('a\n\nb'), 3);
});

test('countLines counts CRLF lines once each', () => {
  assert.equal(countLines('a\r\nb\r\n'), 2);
});

test('countLines tells 200 lines from 201', () => {
  assert.equal(countLines('x\n'.repeat(200)), 200);
  assert.equal(countLines('x\n'.repeat(201)), 201);
});

test('isChecked accepts every checked extension', () => {
  for (const path of [
    'index.html',
    'js/main.js',
    'css/base.css',
    'README.md',
    'package.json',
    '.github/workflows/deploy.yml',
    'config.yaml',
  ]) {
    assert.equal(isChecked(path), true, path);
  }
});

test('isChecked rejects other extensions and files without one', () => {
  for (const path of ['LICENSE', '.gitignore', '.editorconfig', 'notes.txt', 'img/logo.svg']) {
    assert.equal(isChecked(path), false, path);
  }
});

test('isChecked rejects files inside excluded folders', () => {
  for (const path of [
    'vendor/chess.js/chess.js',
    'assets/pieces/readme.md',
    'node_modules/pkg/index.js',
    '_site/index.html',
    '.git/info/notes.md',
  ]) {
    assert.equal(isChecked(path), false, path);
  }
});

test('isChecked rejects excluded folders at any depth', () => {
  assert.equal(isChecked('docs/vendor/lib.js'), false);
  assert.equal(isChecked('a/b/assets/c/d.css'), false);
});

test('isChecked only excludes folders, not files sharing their name', () => {
  assert.equal(isChecked('vendor.js'), true);
  assert.equal(isChecked('docs/assets.md'), true);
});

test('isChecked understands Windows separators', () => {
  assert.equal(isChecked('vendor\\chess.js\\chess.js'), false);
  assert.equal(isChecked('js\\main.js'), true);
});
