const express = require('express')
const mongoose = require('mongoose')
const { Cart } = require('../Model/cart')
const router = express.Router()

// xem thong tin tu gio hang
router.get('/:userId', async(req,res)=>{
    const {userId} = req.params
    try {
        const cart = await Cart.findById(userId).populate({
            path: 'products.productId',
            model: 'Product'
        })

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productCount = cart.products.length;
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({error: 'Error fetching cart'})
    } 
})

// them san pham vao cart
router.post('/addproduct_cart', async (req,res)=>{
    const { userId, productId, quanlity} = req.body
    try {
        let cart = await Cart.findById(userId)
        if(!cart){
            cart = new Cart({_id: userId, products: [] })
        }

        // Tìm sản phẩm trong giỏ hàng
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId,
        )

        if(existingProductIndex !== -1){
            cart.products[existingProductIndex].quanlity += quanlity
        }else{
            cart.products.push({
                productId,
                quanlity
            })
        }
        const productCount = cart.products.length;
        await cart.save()
        return res.status(200).json(cart)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

module.exports = router