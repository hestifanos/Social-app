function isPostContentValid(text, imageUri) {
  return text.trim().length > 0 || Boolean(imageUri);
}

module.exports = isPostContentValid;
