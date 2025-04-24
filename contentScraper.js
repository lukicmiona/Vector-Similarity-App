const { chromium } = require('playwright');
const { JSDOM, VirtualConsole } = require('jsdom');
const { Readability, isProbablyReaderable } = require('@mozilla/readability');

const defaultSelectorsToRemove = [
  'nav', 'header', 'footer', 'aside', 'script', 'style',
  '.ads', '.advertisement', '.promo', '.newsletter', '.popup', '.cookie'
];

async function fetchHtml(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
  const html = await page.content();
  await browser.close();
  return html;
}

function cleanHtml(html, url, selectorsToRemove = defaultSelectorsToRemove) {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(html, { url, virtualConsole });
  const document = dom.window.document;

  selectorsToRemove.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  return dom.serialize();
}

function extractReadableContent(html, url) {
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;

  if (!isProbablyReaderable(doc)) {
    return null;
  }

  const reader = new Readability(doc);
  const article = reader.parse();
  return article ? article.textContent : null;
}



async function scrapeContent(url) {
  try {
    const rawHtml = await fetchHtml(url);
    const cleanedHtml = cleanHtml(rawHtml, url);
    console.log("sredjen html se nalazi ovde",cleanedHtml);
    const content = extractReadableContent(cleanedHtml, url);

    console.log(content);

    if (!content) {
      const fallbackDom = new JSDOM(cleanedHtml, { url });
      content = fallbackDom.window.document.body.textContent.trim().slice(0, 1000); 
      
    }


    return {
      success: true,
      content: content || 'No readable content found.',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  scrapeContent,
  fetchHtml,
  cleanHtml,
  extractReadableContent,
};
