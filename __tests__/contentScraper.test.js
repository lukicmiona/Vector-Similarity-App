global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const { chromium } = require('playwright');

jest.mock('playwright');
jest.mock('@mozilla/readability');

const {
  fetchHtml,
  cleanHtml,
  extractReadableContent,
  scrapeContent
} = require('../contentScraper'); // prilagodi putanju

describe('fetchHtml', () => {
  it('should fetch HTML content from a URL', async () => {
    const mockHtml = '<html><body>Hello</body></html>';
    const mockPage = {
      goto: jest.fn(),
      content: jest.fn().mockResolvedValue(mockHtml)
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn()
    };
    chromium.launch.mockResolvedValue(mockBrowser);

    const html = await fetchHtml('https://example.com');
    expect(chromium.launch).toHaveBeenCalled();
    expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', { timeout: 15000, waitUntil: 'domcontentloaded' });
    expect(html).toBe(mockHtml);
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});

describe('cleanHtml', () => {
  it('should remove unwanted selectors from HTML', () => {
    const html = `
      <html>
        <body>
          <nav>Menu</nav>
          <article>Main content</article>
          <footer>Footer</footer>
        </body>
      </html>
    `;
    const url = 'https://example.com';
    const cleaned = cleanHtml(html, url);
    expect(cleaned).not.toMatch(/<nav>/);
    expect(cleaned).not.toMatch(/<footer>/);
    expect(cleaned).toMatch(/<article>Main content<\/article>/);
  });
});

describe('extractReadableContent', () => {
  it('should extract readable content if page is readerable', () => {
    const html = '<html><body><article><p>This is article content.</p></article></body></html>';
    const url = 'https://example.com';

    const mockParse = jest.fn().mockReturnValue({ textContent: 'This is article content.' });
    Readability.mockImplementation(() => ({
      parse: mockParse
    }));
    const isProbablyReaderable = require('@mozilla/readability').isProbablyReaderable;
    isProbablyReaderable.mockReturnValue(true);

    const result = extractReadableContent(html, url);
    expect(result).toBe('This is article content.');
  });

  it('should return null if page is not readerable', () => {
    const html = '<html><body><div>Just a random div</div></body></html>';
    const url = 'https://example.com';

    const isProbablyReaderable = require('@mozilla/readability').isProbablyReaderable;
    isProbablyReaderable.mockReturnValue(false);

    const result = extractReadableContent(html, url);
    expect(result).toBeNull();
  });
});
