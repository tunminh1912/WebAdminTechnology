const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    category_id: { type: Number, required: true },
    name_product: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 0 }, 
    image_product: { type: String, required: true }, 
},);

let Product = mongoose.model('Product', productSchema, 'product');

module.exports = Product;
