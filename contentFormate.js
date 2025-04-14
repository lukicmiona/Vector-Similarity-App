const TurndownService = require('turndown');
const { JSDOM } = require('jsdom');

function formatHtmlToMarkdown(htmlContent) {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  });

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const selectorsToRemove = [
    'nav', 'header', 'footer', 'aside', 'script', 'style',
    '.ads', '.advertisement', '.promo', '.newsletter', '.popup', '.cookie'
  ];
  selectorsToRemove.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  const decodedHTML = document.body.innerHTML.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

  const markdown = turndownService.turndown(decodedHTML);

  return markdown;
}

module.exports = { formatHtmlToMarkdown};
