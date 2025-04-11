
const { chromium } = require('playwright');

async function scrapeContent(url) {
  console.log(url)
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });

   
    await page.evaluate(() => {
      const selectorsToRemove = ['nav', 'header', 'footer', 'aside', '.ads', '.advertisement'];
      selectorsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    });

    const content = await page.evaluate(() => {
      const candidates = ['article', 'main', 'section', '[role=main]'];
      for (const selector of candidates) {
        const el = document.querySelector(selector);
        if (el && el.innerText.length > 200) {
          return el.innerText;
        }
      }
      return document.body.innerText;
    });

    await browser.close();
    return { success: true, content };

  } catch (error) {
    await browser.close();
    return { success: false, error: error.message };
  }
}

module.exports = { scrapeContent };