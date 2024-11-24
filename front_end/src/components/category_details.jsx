import axios from 'axios';
import './Category.css'; // Updated CSS file with new class names
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "./Navbar";
import Grid from '@mui/material/Grid';

function Product() {
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [category_id]);

    const handleAddToCart = async (productId) => {
        if (isLoggedIn) {
          if (productId !== null) {
            const data = {
              userId: localStorage.getItem('userId', null),
              productId,
              quantity: 1,
            }
    
            console.log(data)
            try {
              const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (response.status === 200) {
                alert('Add to cart successfull')
              }
            } catch (error) {
              console.log(error?.message);
            }
          }
        } else {
          alert("Login to add cart")
          navigate('/login')
        }
      }
    
    return (
        <>
            <Header /> 
            <div className="product-grid">
                {products.length > 0 && 
                    products.map((product) => (
                        <div key={product._id} className="product-container" onClick={() => navigate(`/products/${product._id}`)}>
                            <img
                                src={product.image_product} 
                                alt={product.name_product}
                                className="product-image"
                            />
                            <p className="product-name">{product.name_product}</p>
                            <div className="product-ratings">
                  <p className="average-rating">
                    {product.averageRating && product.averageRating > 0 ? (
                      <>
                        Đánh giá: {product.averageRating.toFixed(1)}
                        <span style={{ color: '#FFD700', marginLeft: '5px' }}>★</span>
                      </>
                    ) : (
                      'Chưa có đánh giá'
                    )}
                  </p>
                  <p className="total-comments">
                    Bình luận: {product.totalComments || 0}
                  </p>
                </div>
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
