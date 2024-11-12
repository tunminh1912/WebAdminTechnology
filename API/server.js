const express = require('express');
const cors = require('cors');
const { router, upload } = require('./routers/router'); 
const categoryRouter = require('./routers/categories');
const mongoose = require('mongoose');
const Product = require('./Model/product'); 
const Category = require('./Model/category');
const cart_router = require('./routers/cart')
const user_router = require('./routers/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', user_router)

const url = 'mongodb+srv://Nhom07:Nhom07VAA@group07.i8yw5.mongodb.net/technology?retryWrites=true&w=majority&appName=Group07';

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sử dụng router
app.use('/user', user_router);
app.use('/categories', categoryRouter)
app.use('/products', router)
app.use('/cart', cart_router)

// GET: Lấy tất cả sản phẩm
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// GET: Lấy sản phẩm theo ID
app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ product_id: productId });
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT: Cập nhật thông tin sản phẩm
app.put('/products/:id', upload.array('image_product',5), async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = {
      product_id: req.body.product_id,
      category_id: req.body.category_id,
      name_product: req.body.name_product,
      description: req.body.description,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
    };

    if (req.file) {
      updatedProduct.image_product = `/uploads/${req.file.filename}`;
    }

    const result = await Product.updateOne(
      { product_id: productId },
      { $set: updatedProduct }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
});
// API để xóa sản phẩm theo product_id
app.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;  // Lấy productId từ URL
  
  try {
    // Sử dụng mô hình Product để tìm và xóa sản phẩm
    const result = await Product.findOneAndDelete({ product_id: productId });

    if (!result) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
});

//get category
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Bắt đầu server
const startServer = async () => {
  await connectDB();
  app.listen(3003, () => {
    console.log('Server is running on port 3003');
  });
};

startServer();
