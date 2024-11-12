const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    product_id: String,
    category_id: Number,
    name_product: String,
    description: String,
    price: Number,
    quantity: Number,
    image_product: String,
});


let Product = mongoose.model('Product', productSchema, 'product');

module.exports = Product;
