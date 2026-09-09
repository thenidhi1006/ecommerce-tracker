const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const url = 'https://www.amazon.in/dp/B09V4MXT7T'; // Replace with your product link
  const browser = await puppeteer.launch({ headless: false }); // Use headless: true for production
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36'
  );

  let price = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Random delay between 3–6 seconds
      const delay = Math.floor(Math.random() * 3000) + 3000;
      await new Promise(resolve => setTimeout(resolve, delay));

      await page.screenshot({ path: `amazon_debug_attempt${attempt}.png`, fullPage: true });
      console.log(`📸 Screenshot saved as amazon_debug_attempt${attempt}.png`);

      // Flexible selector strategy
      price = await page.evaluate(() => {
        const selectors = [
          '#priceblock_ourprice',
          '#priceblock_dealprice',
          '#priceblock_saleprice',
          'span.a-price-whole',
          '[data-a-color="price"] .a-offscreen',
          '.a-price .a-offscreen'
        ];

        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el) return el.textContent.trim();
        }

        return null;
      });

      if (price) {
        console.log(`✅ Scraped Price (Attempt ${attempt}):`, price);
        break;
      } else {
        throw new Error('Price element not found');
      }
    } catch (err) {
      console.log(`❌ Attempt ${attempt} failed:`, err.message);
      if (attempt === 3) console.log('🚫 Giving up after 3 attempts');
    }
  }

  await browser.close();
})();