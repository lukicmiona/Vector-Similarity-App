
const { chromium } = require('playwright');

async function scrapeContent(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });

   
    await page.evaluate(() => {
      const selectorsToRemove = [
        'nav', 'header', 'footer', 'aside', 'script', 'style',
        '.ads', '.advertisement', '.promo', '.newsletter', '.popup', '.cookie'
      ];
      selectorsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    });
    
    const content = await page.evaluate(() => {
      const candidates = [
        'article', 'main', 'section', '[role=main]', '.post', '.content', '.home',
        '.article-body', '#main', 'div#main', '.post-content', '.main-content',
        '.entry-content', '.blog-post', '.readable-content', '.text', '.page-body'
      ];
      let bestMatch = null;
      let maxLength = 0;

      for (const selector of candidates) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.innerText.trim();
          if (text.length > maxLength && text.length > 200) {
            bestMatch = text;
            maxLength = text.length;
          }
        }
      }

      return bestMatch || document.body.innerText;

      
    });

    await browser.close();
    return { success: true, content };

  } catch (error) {
    await browser.close();
    return { success: false, error: error.message };
  }
}

module.exports = { scrapeContent };