
// Validate the input URL
function validateUrl() {
    const input = document.getElementById('urlInput');
    const errorDiv = document.getElementById('urlError');
    const url = input.value.trim();

    input.classList.remove('error');
    errorDiv.textContent = '';

    const urlPattern = /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    if (!url || !urlPattern.test(url)) {
        errorDiv.textContent = 'Please enter a valid URL (e.g. https://example.com).';
        input.classList.add('error');
        return false;
    }

    return true;
}

// Validate the input keywords
function validateKeywords() {
    const input = document.getElementById('keywordsInput');
    const errorDiv = document.getElementById('keywordsError');
    const keywords = input.value.trim();

    input.classList.remove('error');
    errorDiv.textContent = '';

    if (keywords.length < 3) {
      errorDiv.textContent = 'Keywords must be at least 3 characters.';
      input.classList.add('error');
      return false;
    }

    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k !== '');
    if (keywordList.length > 10) {
      errorDiv.textContent = 'Maximum of 10 keywords allowed.';
      input.classList.add('error');
      return false;
    }

    const keywordPattern = /^[a-zA-Z0-9\s,]+$/;
    if (!keywordPattern.test(keywords)) {
      errorDiv.textContent = 'Only letters, numbers, spaces, and commas are allowed.';
      input.classList.add('error');
      return false;
    }

    return true;
}


module.exports = {
    validateUrl,
    validateKeywords
  };