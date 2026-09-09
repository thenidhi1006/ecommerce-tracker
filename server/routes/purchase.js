const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// POST /api/purchase → Save a new purchase
router.post('/', async (req, res) => {
  try {
    console.log('Incoming purchase:', req.body);
    const newPurchase = new Purchase(req.body);
    const saved = await newPurchase.save();
    res.json(saved);
  } catch (err) {
    console.error('Error saving purchase:', err);
    res.status(500).json({ error: 'Failed to save purchase' });
  }
});

// GET /api/purchase → Fetch all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases); // ✅ This must return an array
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});


// DELETE /api/purchase/:id → Delete a purchase by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    console.error('Error deleting purchase:', err);
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
});

// Total spent per category
router.get('/summary', async (req, res) => {
  try {
    const summary = await Purchase.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).send('Error generating summary');
  }
});


module.exports = router;
