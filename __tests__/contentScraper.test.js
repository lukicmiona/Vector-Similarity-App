jest.mock('playwright');

const { scrapeContent } = require('../contentScraper');
const { chromium } = require('playwright');

describe('scrapeContent', () => {
  let mockPage, mockBrowser;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn(),
      close: jest.fn()
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn()
    };

    chromium.launch.mockResolvedValue(mockBrowser);
  });

  it('should return content successfully', async () => {
    const mockText = 'This is a test article content';
    mockPage.evaluate.mockImplementationOnce(() => {}) // remove selectors
                      .mockImplementationOnce(() => mockText);

    const result = await scrapeContent('https://example.com');
    expect(result.success).toBe(true);
    expect(result.content).toBe(mockText);
  });

  it('should handle error gracefully', async () => {
    mockPage.goto.mockImplementation(() => {
      throw new Error('Timeout');
    });

    const result = await scrapeContent('https://broken-link.com');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Timeout/);
  });
});
