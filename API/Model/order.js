const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    OrderDate: { type: Date },
    TotalAmount: {type: Number},
    OrderCode: {type: String},
    Status: {type: String}
})

exports.Order = mongoose.model('Order',orderSchema,'orders')