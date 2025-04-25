const { validateUrlValue, validateKeywordsValue } = require('../src/scripts/validation');

describe('Validation Tests', () => {

  describe('URL Validation', () => {
    test('Valid URL passes', () => {
      const result = validateUrlValue('https://example.com');
      expect(result.isValid).toBe(true);
    });

    test('Empty URL fails', () => {
      const result = validateUrlValue('');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/valid URL/i);
    });

    test('Invalid URL fails', () => {
      const result = validateUrlValue('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/valid URL/i);
    });

    test('URL with path passes', () => {
      const result = validateUrlValue('https://example.com/path/to/page');
      expect(result.isValid).toBe(true);
    });
  });

  describe('Keywords Validation', () => {
    test('Valid keywords pass', () => {
      const result = validateKeywordsValue('AI, ML, neural networks');
      expect(result.isValid).toBe(true);
    });

    test('Empty keywords fail', () => {
      const result = validateKeywordsValue('');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/at least 2 characters/i);
    });

    test('Too many keywords fail', () => {
      const result = validateKeywordsValue('a,b,c,d,e,f,g,h,i,j,k');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/maximum of 10 keywords/i);
    });

    test('Short keyword fails', () => {
      const result = validateKeywordsValue('a');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/at least 2 characters/i);
    });

    test('Invalid characters fail', () => {
      const result = validateKeywordsValue('one, two, @three');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/only letters, numbers/i);
    });

    test('Whitespace trimming and filtering works', () => {
      const result = validateKeywordsValue('  AI  ,    ML  ,  ');
      expect(result.isValid).toBe(true);
    });

   
  });

});
