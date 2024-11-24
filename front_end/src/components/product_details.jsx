import axios from 'axios';
import './Category.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Navbar";
import CommentSection from './CommentSection';

function Productdetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get(`http://localhost:3003/products/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200) setProduct(response.data);
            } catch (error) {
                console.log(error?.message);
            }
        }
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        fetchProduct();
    }, [id]);

        const handleAddToCart = async (productId) => {
        if (isLoggedIn) {
            if (productId !== null) {
                const inputQuantity = parseInt(document.getElementById("soluong").value, 10);
                if (inputQuantity > product.quantity) {
                    alert("Vượt quá số lượng trong kho");
                    return;
                }
    
                const data = {
                  userId: localStorage.getItem('userId', null),
                  productId,
                  quantity: inputQuantity
                }
                console.log(data)
                  try {
                    const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data,{
                      headers: {
                        "Content-Type": "application/json",
                        },
                    });
                    if (response.status === 200) {
                        alert('Thêm vào giỏ hàng thành công');
                    }
                } catch (error) {
                    console.log(error?.message);
                }
            }
        } else {
            alert("Đăng nhập để thêm sản phẩm vào giỏ hàng");
            navigate('/login');
        }
    };
    
    return (
        <>
            <Header />
            <div className="product-grid">
                {products.length > 0 &&
                    products.map((product) => ( // Bỏ ngoặc {} bao quanh map()
                        <Grid
                            key={product._id}
                            onClick={() => navigate(`/products/${product._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="product-container">
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

                                <Grid
                                    className="add-to-cart-btn"
                                    onClick={(event) => { event.stopPropagation(); handleAddToCart(product._id); }}
                                >
                                    Add to Cart
                                </Grid>
                            </div>
                        </Grid>
                    ))
                }
            </div>
        </>
    );
}

export default Productdetails;
