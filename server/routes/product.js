const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.post('/compare', async (req, res) => {
  const { link } = req.body;

  try {
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);

    let title = '';
    let image = '';
    let amazonPrice = '—';
    let flipkartPrice = '—';

    // 🔍 Amazon logic
    if (link.includes('amazon')) {
      title = $('#productTitle').text().trim() || $('title').text().trim();
      image = $('#imgTagWrapperId img').attr('src') || '';
      const priceText = $('#priceblock_ourprice, #priceblock_dealprice').first().text().trim();
      amazonPrice = priceText.replace(/[^\d]/g, '') || '—';
    }

    // 🔍 Flipkart logic
    else if (link.includes('flipkart')) {
      title = $('span.B_NuCI').text().trim() || $('title').text().trim();
      const priceText = $('div._30jeq3._16Jk6d').first().text().trim();
      flipkartPrice = priceText.replace(/[^\d]/g, '') || '—';
    }

    // 🔍 Snapdeal logic
    else if (link.includes('snapdeal')) {
      title = $('h1.pdp-e-i-head').text().trim() || $('title').text().trim();
    }

    // 🔍 Fallback
    else {
      title = $('title').text().trim();
    }

    if (!title) {
      throw new Error('Could not extract product title');
    }

    const encodedQuery = encodeURIComponent(title);

    const prices = [
      {
        platform: 'Amazon',
        price: amazonPrice,
        link: `https://www.amazon.in/s?k=${encodedQuery}`
      },
      {
        platform: 'Flipkart',
        price: flipkartPrice,
        link: `https://www.flipkart.com/search?q=${encodedQuery}`
      },
      {
        platform: 'Snapdeal',
        price: '—',
        link: `https://www.snapdeal.com/search?keyword=${encodedQuery}`
      },
      {
        platform: 'Reliance Digital (via Google)',
        price: '—',
        link: `https://www.google.com/search?q=${encodedQuery}+site:reliancedigital.in`
      }
    ];

    // ✅ Find best deal
    const numericPrices = prices
      .filter(p => /^\d+$/.test(p.price))
      .map(p => ({ ...p, numeric: parseInt(p.price) }));

    const bestDeal = numericPrices.reduce((min, p) => p.numeric < min.numeric ? p : min, numericPrices[0]);

    // ✅ Send full response
    res.json({
      product: title,
      image,
      prices,
      bestDeal: bestDeal?.platform || null
    });
  } catch (err) {
    console.error('Error fetching product page:', err.message);
    res.status(500).json({ error: 'Failed to extract product info' });
  }
});

module.exports = router;


