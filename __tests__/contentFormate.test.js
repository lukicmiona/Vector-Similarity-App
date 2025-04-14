const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { formatHtmlToMarkdown } = require('../contentFormate');

describe('formatHtmlToMarkdown', () => {
  it('should convert HTML headings to markdown headings', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2>';
    const md = formatHtmlToMarkdown(html);
    expect(md).toContain('# Title');
    expect(md).toContain('## Subtitle');
  });

  it('should remove unwanted elements', () => {
    const html = '<div class="ads">Buy now!</div><p>Content</p>';
    const md = formatHtmlToMarkdown(html);
    expect(md).toContain('Content');
    expect(md).not.toContain('Buy now');
  });

  it('should decode HTML entities', () => {
    const html = '<p>Fish &amp; Chips&nbsp;are tasty</p>';
    const md = formatHtmlToMarkdown(html);
    expect(md).toContain('Fish & Chips are tasty');
  });

  it('should convert bullet lists', () => {
    const html = '<ul><li>One</li><li>Two</li></ul>';
    const md = formatHtmlToMarkdown(html);
    expect(md.replace(/\s+/g, ' ')).toContain('- One');
    expect(md.replace(/\s+/g, ' ')).toContain('- Two');

  });
});
