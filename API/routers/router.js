const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../Model/product.js');


const router = express.Router();

// Cấu hình để sử dụng thư mục public cho ảnh tĩnh
router.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Cấu hình multer để lưu file vào thư mục public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads')); // Lưu vào thư mục public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Đặt tên file với timestamp
  },
});

const upload = multer({ storage: storage });

// POST: Thêm sản phẩm
router.post('/FormAddProduct/alert', upload.single('image_product'), async (req, res) => {
  const { product_id, category_id, name_product, description, price, quantity } = req.body;
  const image_product = req.file;

  if (!image_product) {
    return res.send('Vui lòng tải lên một hình ảnh.');
  }

  const newProduct = new Product({
    product_id,
    category_id,
    name_product,
    description,
    price,
    quantity,
    image_product: '/uploads/' + image_product.filename,
  });

  try {
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi xảy ra khi thêm sản phẩm!');
  }
});

// Route để xóa sản phẩm
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;  // Lấy productId từ URL
  try {
      console.log('Deleting product with ID:', productId); // Log ID để kiểm tra

      // Truy vấn với product_id
      const deletedProduct = await Product.findOneAndDelete({ product_id: productId });

      if (!deletedProduct) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
});
router.get('/category/:category_id', async (req, res) => {
  try {
    const category_id = req.params.category_id;

    const products = await Product.find({ category_id: category_id });

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm cho danh mục này' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy sản phẩm theo danh mục', details: err });
  }
});

// Xuất router và upload
module.exports = { router, upload };
