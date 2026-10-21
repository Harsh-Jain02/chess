import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  clearGame,
  getBrowserStorage,
  loadGame,
  saveGame,
} from '../../js/state/storage.js';

function createStorage() {
  const entries = new Map();

  return {
    getItem(key) {
      return entries.has(key) ? entries.get(key) : null;
    },
    setItem(key, value) {
      entries.set(key, value);
    },
    removeItem(key) {
      entries.delete(key);
    },
  };
}

test('save then load returns the same game data', () => {
  const storage = createStorage();
  const game = { moves: ['e2e4', 'e7e5', 'g1f3'], orientation: 'b' };

  assert.equal(saveGame(storage, game), true);
  assert.deepEqual(loadGame(storage), game);
});

test('save writes the versioned payload under the storage key', () => {
  const storage = createStorage();

  saveGame(storage, { moves: ['e2e4'], orientation: 'w' });

  assert.equal(
    storage.getItem(STORAGE_KEY),
    JSON.stringify({ version: 1, moves: ['e2e4'], orientation: 'w' }),
  );
});

test('load returns null when nothing is saved', () => {
  assert.equal(loadGame(createStorage()), null);
});

test('load returns null for invalid JSON', () => {
  const storage = createStorage();
  storage.setItem(STORAGE_KEY, '{invalid');

  assert.equal(loadGame(storage), null);
});

test('load rejects a wrong version', () => {
  const storage = createStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({
    version: 2,
    moves: [],
    orientation: 'w',
  }));

  assert.equal(loadGame(storage), null);
});

test('load rejects moves that are not an array of strings', () => {
  const invalidMoves = [null, 'e2e4', ['e2e4', 2]];

  for (const moves of invalidMoves) {
    const storage = createStorage();
    storage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      moves,
      orientation: 'w',
    }));

    assert.equal(loadGame(storage), null);
  }
});

test('load rejects an invalid orientation', () => {
  const storage = createStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1,
    moves: [],
    orientation: 'white',
  }));

  assert.equal(loadGame(storage), null);
});

test('storage access errors do not escape', () => {
  const setError = { setItem() { throw new Error('blocked'); } };
  const getError = { getItem() { throw new Error('blocked'); } };
  const removeError = { removeItem() { throw new Error('blocked'); } };

  assert.equal(saveGame(setError, { moves: [], orientation: 'w' }), false);
  assert.equal(loadGame(getError), null);
  assert.doesNotThrow(() => clearGame(removeError));
});

test('null storage uses safe fallback values', () => {
  assert.equal(saveGame(null, { moves: [], orientation: 'w' }), false);
  assert.equal(loadGame(null), null);
  assert.doesNotThrow(() => clearGame(null));
});

test('clear removes the saved game', () => {
  const storage = createStorage();
  saveGame(storage, { moves: [], orientation: 'w' });

  clearGame(storage);

  assert.equal(loadGame(storage), null);
});

test('importing storage in Node does not require window', () => {
  assert.equal(getBrowserStorage(), null);
});

test('browser storage is returned or safely falls back to null', () => {
  const storage = createStorage();

  try {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { localStorage: storage },
    });
    assert.equal(getBrowserStorage(), storage);

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {},
    });
    assert.equal(getBrowserStorage(), null);

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    assert.equal(getBrowserStorage(), null);
  } finally {
    delete globalThis.window;
  }
});
