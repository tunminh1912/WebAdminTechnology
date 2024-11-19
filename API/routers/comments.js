const express = require('express');
const Rate = require('../Model/comment');
const Product = require('../Model/product'); 
const router = express.Router();

// POST: Thêm bình luận
router.post('/rate', async (req, res) => {
  try {
    const { userId, productId, comment } = req.body;

    if (!userId || !productId || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const product = await Product.findOne({ product_id: productId }); 
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    const newRate = new Rate({ userId, productId: product._id, comment });
    await newRate.save();

    res.status(200).json({ message: 'Comment added successfully', rate: newRate });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
});

router.get('/rate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }
    const rates = await Rate.find({ productId: product._id }).populate('userId', 'username');

    if (rates.length === 0) {
      return res.status(200).json({ message: 'No comments found', rates: [] });
    }

    res.status(200).json(rates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});


module.exports = router;
