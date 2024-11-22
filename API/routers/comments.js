const express = require('express');
const Rate = require('../Model/comment');
const Product = require('../Model/product');
const router = express.Router();

// POST: Thêm bình luận và rating
router.post('/rate', async (req, res) => {
  try {
    const { userId, productId, comment, rating } = req.body;

    // Kiểm tra dữ liệu đầu vào
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

    const newRate = new Rate({
      userId,
      productId: product._id,
      comment,
      rating,
    });

    await newRate.save();
    res.status(200).json({ message: 'Comment and rating added successfully', rate: newRate });
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

    const rates = await Rate.find({ productId: product._id }).populate('userId', '_id username');

    if (rates.length === 0) {
      return res.status(200).json({ message: 'No comments found', rates: [] });
    }
    res.status(200).json(rates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

// DELETE: Xóa bình luận của chính người dùng
router.delete('/rate/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing userId' });
    }

    const comment = await Rate.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

module.exports = router;
