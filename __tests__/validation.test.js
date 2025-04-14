const { validateUrl, validateKeywords } = require('../validation');

test('Valid URL passes', () => {
  document.body.innerHTML = '<input id="urlInput" value="https://example.com"><div id="urlError"></div>';
  expect(validateUrl()).toBe(true);
});

test('Invalid URL fails', () => {
  document.body.innerHTML = '<input id="urlInput" value="invalidurl"><div id="urlError"></div>';
  expect(validateUrl()).toBe(false);
});

test('Valid keywords pass', () => {
  document.body.innerHTML = '<input id="keywordsInput" value="AI, ML"><div id="keywordsError"></div>';
  expect(validateKeywords()).toBe(true);
});

test('Too many keywords fail', () => {
  document.body.innerHTML = '<input id="keywordsInput" value="a,b,c,d,e,f,g,h,i,j,k"><div id="keywordsError"></div>';
  expect(validateKeywords()).toBe(false);
});
