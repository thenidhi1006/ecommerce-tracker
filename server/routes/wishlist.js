const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/authMiddleware');

puppeteer.use(StealthPlugin());

const router = express.Router();

/* ===========================
   AMAZON PRICE SCRAPER
=========================== */
async function scrapeAmazonPrice(link) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36'
  );

  let price = null;

  try {
    await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

    price = await page.evaluate(() => {
      const el = document.querySelector('.a-price .a-offscreen');
      return el ? el.textContent.trim() : null;
    });

  } catch (err) {
    console.log("Amazon scrape failed:", err.message);
  }

  await browser.close();

  return parseInt(price?.replace(/[^\d]/g, '')) || null;
}

/* ===========================
   ADD WISHLIST ITEM
=========================== */
router.post('/add', authMiddleware, async (req, res) => {
  const { link } = req.body;

  try {
    let title = '';
    let price = null;

    if (link.includes('amazon')) {
      price = await scrapeAmazonPrice(link);
      title = 'Amazon Product';
    }

    if (!price) {
      return res.status(400).json({ error: 'Price not found' });
    }

    const newItem = new Wishlist({
      userId: req.user.userId,   // ✅ FIXED HERE
      productName: title,        // match your model field
      price: price,              // match your model field
      category: "General",
      link: link
    });

    await newItem.save();

    res.json(newItem);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   GET USER WISHLIST
=========================== */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.userId }); // ✅ FIXED
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   DELETE WISHLIST ITEM
=========================== */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId   // ✅ FIXED
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const Wishlist = require('../models/Wishlist');
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// const router = express.Router();

// // 🔧 Amazon price scraper using Puppeteer
// async function scrapeAmazonPrice(link) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.setUserAgent(
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36'
//   );

//   let price = null;

//   for (let attempt = 1; attempt <= 3; attempt++) {
//     try {
//       await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
//       const delay = Math.floor(Math.random() * 3000) + 3000;
//       await new Promise(resolve => setTimeout(resolve, delay));

//       price = await page.evaluate(() => {
//         const selectors = [
//           '#priceblock_ourprice',
//           '#priceblock_dealprice',
//           '#priceblock_saleprice',
//           'span.a-price-whole',
//           '[data-a-color="price"] .a-offscreen',
//           '.a-price .a-offscreen'
//         ];
//         for (const selector of selectors) {
//           const el = document.querySelector(selector);
//           if (el) return el.textContent.trim();
//         }
//         return null;
//       });

//       if (price) break;
//     } catch (err) {
//       if (attempt === 3) console.log('🚫 Amazon scraping failed:', err.message);
//     }
//   }

//   await browser.close();
//   return parseInt(price?.replace(/[^\d]/g, '')) || null;
// }

// // ✅ Route to add a wishlist item
// router.post('/add', async (req, res) => {
//   const { link } = req.body;

//   try {
//     let title = '';
//     let price = null;

//     if (link.includes('amazon')) {
//       price = await scrapeAmazonPrice(link);
//       title = 'Amazon Product';
//     } else if (link.includes('flipkart')) {
//       const response = await axios.get(link, {
//         headers: {
//           'User-Agent':
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36',
//           'Accept-Language': 'en-US,en;q=0.9',
//           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//           'Referer': 'https://www.google.com/',
//         },
//       });

//       const $ = cheerio.load(response.data);
//       title = $('title').text().trim();

//       const priceText =
//         $('div._30jeq3._16Jk6d').first().text().trim() ||
//         $('div._25b18c ._30jeq3').first().text().trim() ||
//         $('._1vC4OE').first().text().trim();

//       price = parseInt(priceText.replace(/[^\d]/g, '')) || null;
//     }

//     if (!price) {
//       console.log('❌ Price not found for:', link);
//       return res.status(400).json({ error: 'Could not extract price from page' });
//     }

//     const newItem = new Wishlist({
//       title,
//       link,
//       currentPrice: price,
//       previousPrice: price,
//     });

//     await newItem.save();
//     res.json({ message: 'Wishlist item added', item: newItem });
//   } catch (err) {
//     console.error('Error adding wishlist item:', err.message);
//     res.status(500).json({ error: 'Failed to add item' });
//   }
// });

// // ✅ Route to fetch all wishlist items and compare prices
// router.get('/', async (req, res) => {
//   try {
//     const items = await Wishlist.find();

//     const updatedItems = await Promise.all(
//       items.map(async (item) => {
//         try {
//           let newPrice = item.currentPrice;

//           if (item.link.includes('amazon')) {
//             newPrice = await scrapeAmazonPrice(item.link) || item.currentPrice;
//           } else if (item.link.includes('flipkart')) {
//             const response = await axios.get(item.link, {
//               headers: {
//                 'User-Agent':
//                   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36',
//                 'Accept-Language': 'en-US,en;q=0.9',
//                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//                 'Referer': 'https://www.google.com/',
//               },
//             });

//             const $ = cheerio.load(response.data);
//             const priceText =
//               $('div._30jeq3._16Jk6d').first().text().trim() ||
//               $('div._25b18c ._30jeq3').first().text().trim() ||
//               $('._1vC4OE').first().text().trim();

//             newPrice = parseInt(priceText.replace(/[^\d]/g, '')) || item.currentPrice;
//           }

//           if (newPrice !== item.currentPrice) {
//             item.previousPrice = item.currentPrice;
//             item.currentPrice = newPrice;
//             await item.save();
//           }

//           return item;
//         } catch (err) {
//           console.error(`Error updating item ${item._id}:`, err.message);
//           return item;
//         }
//       })
//     );

//     res.json(updatedItems);
//   } catch (err) {
//     console.error('Error fetching wishlist:', err.message);
//     res.status(500).json({ error: 'Failed to fetch wishlist' });
//   }
// });

// // ✅ Route to delete a wishlist item by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deleted = await Wishlist.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: 'Item not found' });
//     }
//     res.json({ message: 'Item deleted' });
//   } catch (err) {
//     console.error('Error deleting item:', err.message);
//     res.status(500).json({ error: 'Failed to delete item' });
//   }
// });

// module.exports = router;

