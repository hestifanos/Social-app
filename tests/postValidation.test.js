const test = require('node:test');
const assert = require('node:assert/strict');

const isPostContentValid = require('../screens/postValidation');

test('rejects a post with no text or image', () => {
  assert.equal(isPostContentValid('', null), false);
  assert.equal(isPostContentValid('   ', ''), false);
});

test('accepts text-only, image-only, and combined posts', () => {
  assert.equal(isPostContentValid('Hello', null), true);
  assert.equal(isPostContentValid('  ', 'file://photo.jpg'), true);
  assert.equal(isPostContentValid('Hello', 'file://photo.jpg'), true);
});
