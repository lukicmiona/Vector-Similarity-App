const { validateUrl, validateKeywords } = require('../src/scripts/validation');

describe('Validation Tests', () => {
  beforeEach(() => document.body.innerHTML = '');

  test('Valid URL passes', () => {
    document.body.innerHTML = '<input id="urlInput" value="https://example.com"><div id="urlError"></div>';
    expect(validateUrl()).toBe(true);
  });

  test('Empty URL fails', () => {
    document.body.innerHTML = '<input id="urlInput" value=""><div id="urlError"></div>';
    expect(validateUrl()).toBe(false);
  });

  test('Invalid URL fails', () => {
    document.body.innerHTML = '<input id="urlInput" value="invalid"><div id="urlError"></div>';
    expect(validateUrl()).toBe(false);
  });

  test('Valid keywords pass', () => {
    document.body.innerHTML = '<input id="keywordsInput" value="AI, ML"><div id="keywordsError"></div>';
    expect(validateKeywords()).toBe(true);
  });

  test('Empty keywords fail', () => {
    document.body.innerHTML = '<input id="keywordsInput" value=""><div id="keywordsError"></div>';
    expect(validateKeywords()).toBe(false);
  });

  test('Too many keywords fail', () => {
    document.body.innerHTML = '<input id="keywordsInput" value="a,b,c,d,e,f,g,h,i,j,k"><div id="keywordsError"></div>';
    expect(validateKeywords()).toBe(false);
  });

  test('Short keyword fails', () => {
    document.body.innerHTML = '<input id="keywordsInput" value="a"><div id="keywordsError"></div>';
    expect(validateKeywords()).toBe(false);
  });

  test('Invalid characters fail', () => {
    document.body.innerHTML = '<input id="keywordsInput" value="one,@two"><div id="keywordsError"></div>';
    expect(validateKeywords()).toBe(false);
  });
});
