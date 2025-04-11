const TurndownService = require('turndown');
const { JSDOM } = require('jsdom');

function formatHtmlToPlainText(htmlContent) {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  });

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const selectorsToRemove = ['nav', 'header', 'footer', 'aside', '.ads', '.advertisement', 'script', 'style'];
  selectorsToRemove.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  const cleanedHtml = document.body.innerHTML;
  const markdown = turndownService.turndown(cleanedHtml);

  return markdown;
}

module.exports = { formatHtmlToPlainText };
