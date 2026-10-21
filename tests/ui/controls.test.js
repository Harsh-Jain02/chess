// Tests for controls.js. renderControls needs a DOM, so it is checked in the
// browser. bindControls only needs addEventListener and closest(), so it is checked
// here with two small stand-ins. Importing the module also shows that it doesn't touch
// `document` at import time (Node has none).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindControls, controlButtons } from '../../js/ui/controls.js';

/** A #controls stand-in that records the listeners added to it. */
function fakeControls() {
  const listeners = [];
  return {
    listeners,
    addEventListener: (type, listener) => listeners.push({ type, listener }),
  };
}

/** A click on an element inside #controls whose closest [data-action] has `action`. */
const clickOn = (action) => ({
  target: { closest: () => (action ? { dataset: { action } } : null) },
});

/** Handlers that record which ones were called, in order. */
function recordingHandlers() {
  const calls = [];
  return {
    calls,
    onNewGame: () => calls.push('onNewGame'),
    onUndo: () => calls.push('onUndo'),
    onFlip: () => calls.push('onFlip'),
  };
}

test('controlButtons: New game, Undo, then Flip board', () => {
  assert.deepEqual(controlButtons().map(({ action, label }) => [action, label]), [
    ['new-game', 'New game'],
    ['undo', 'Undo'],
    ['flip', 'Flip board'],
  ]);
});

test('controlButtons: each action calls its own handler', () => {
  assert.deepEqual(controlButtons().map(({ action, handler }) => [action, handler]), [
    ['new-game', 'onNewGame'],
    ['undo', 'onUndo'],
    ['flip', 'onFlip'],
  ]);
});

test('bindControls: adds exactly one click listener', () => {
  const controls = fakeControls();
  bindControls(controls, recordingHandlers());
  assert.deepEqual(controls.listeners.map(({ type }) => type), ['click']);
});

test('bindControls: a click calls the handler of the button clicked', () => {
  const controls = fakeControls();
  const handlers = recordingHandlers();
  bindControls(controls, handlers);
  const [{ listener }] = controls.listeners;
  listener(clickOn('flip'));
  listener(clickOn('undo'));
  listener(clickOn('new-game'));
  listener(clickOn('flip'));
  assert.deepEqual(handlers.calls, ['onFlip', 'onUndo', 'onNewGame', 'onFlip']);
});

test('bindControls: clicks between buttons or on an unknown action do nothing', () => {
  const controls = fakeControls();
  const handlers = recordingHandlers();
  bindControls(controls, handlers);
  const [{ listener }] = controls.listeners;
  listener(clickOn(null));
  listener(clickOn('settings'));
  assert.deepEqual(handlers.calls, []);
});
