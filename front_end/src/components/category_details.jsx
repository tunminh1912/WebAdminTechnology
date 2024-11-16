import axios from 'axios';
import './Category.css'; // Updated CSS file with new class names
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import Header from "./Navbar";

function Product() {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category_id = queryParams.get('category');  
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`http://localhost:3003/products/category/${category_id}`);
                if (response.status === 200) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.log('Error fetching products:', error.message);
            }
        }
        if (category_id) fetchProducts();
    }, [category_id]);

    const handleAddToCart = async (productId) => {
        if(productId !== null){
          const data = {
            userId: "672d6eea5d8c6f7abb9452f7",
            productId,
            quanlity: 1,
          }
    
            try {
              const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data,{
                headers: {
                  "Content-Type": "application/json",
                  },
              });
               if (response.status === 200){
                 alert('Add to cart successfull')
                 navigate('/cart')
               } 
             } catch (error) {
               console.log(error?.message);
            }
        }
      }

    return (
        <>
            <Header /> 
            <div className="product-grid">
                {products.length > 0 && 
                    products.map((product) => (
                        <div key={product.product_id} className="product-container" onClick={() => navigate(`/products/${product.product_id}`)}>
                            <img
                                src={product.image_product} 
                                alt={product.name_product}
                                className="product-image"
                            />
                            <p className="product-name">{product.name_product}</p>
                            <p className="product-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </p>
                            <Grid className="add-to-cart-btn" onClick={(event) => { event.stopPropagation(); handleAddToCart(product._id); }}>
                                Add to Cart
                            </Grid>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Product;
