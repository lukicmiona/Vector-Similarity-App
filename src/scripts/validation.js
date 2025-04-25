
// Validate the input URL

function validateUrlValue(url) {
  const urlPattern = /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  if (!url || !urlPattern.test(url.trim())) {
    return { isValid: false, error: 'Please enter a valid URL (e.g. https://example.com).' };
  }
  return { isValid: true };
}


// Validate the input keywords
function validateKeywordsValue(keywords) {
  const cleaned = keywords.trim();
  if (cleaned.length < 2) {
    return { isValid: false, error: 'Keywords must be at least 2 characters.' };
  }

  const keywordList = cleaned.split(',').map(k => k.trim()).filter(k => k !== '');
  if (keywordList.length > 10) {
    return { isValid: false, error: 'Maximum of 10 keywords allowed.' };
  }

  const keywordPattern = /^[a-zA-Z0-9\s,]+$/;
  if (!keywordPattern.test(cleaned)) {
    return { isValid: false, error: 'Only letters, numbers, spaces, and commas are allowed.' };
  }

  return { isValid: true };
}

module.exports = {
  validateUrlValue,
  validateKeywordsValue
  };