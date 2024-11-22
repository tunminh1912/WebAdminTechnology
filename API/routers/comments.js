const express = require('express');
const Rate = require('../Model/comment');
const Product = require('../Model/product');
const router = express.Router();

// POST: Thêm bình luận và rating
router.post('/rate', async (req, res) => {
  try {
    const { userId, productId, comment, rating } = req.body;
    if (!userId || !productId || !comment || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }
    const rate = await Rate.findOne({ productId: product._id });
    if (!rate) {
      const newRate = new Rate({
        productId: product._id,
        users: [{
          userId,
          comment,
          rating,
        }],
      });

      await newRate.save();
      return res.status(200).json({ message: 'Comment and rating added successfully', rate: newRate });
    } else {
      rate.users.push({
        userId,
        comment,
        rating,
      });

      await rate.save();
      res.status(200).json({ message: 'Comment and rating added successfully', rate });
    }

  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
});

// GET: Lấy tất cả bình luận và rating của sản phẩm theo productId
router.get('/rate/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ product_id: productId });
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    const rate = await Rate.findOne({ productId: product._id }).populate('users.userId', 'username'); 

    if (!rate || rate.users.length === 0) {
      return res.status(200).json({ message: 'No comments found', rates: [] });
    }
    
    res.status(200).json({ ratings: rate.users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});


// DELETE: Xóa bình luận của người dùng
router.delete('/rate/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const rate = await Rate.findOne({ 'users._id': commentId });
    if (!rate) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const commentIndex = rate.users.findIndex(userComment => userComment._id.toString() === commentId);

    if (rate.users[commentIndex].userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
    }
    rate.users.splice(commentIndex, 1);
    await rate.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

module.exports = router;
