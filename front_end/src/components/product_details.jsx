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
        if(isLoggedIn){
            if(productId !== null){
                const data = {
                  userId: localStorage.getItem('userId', null),
                  productId,
                  quantity: Number(document.getElementById("soluong").value,)
                }
                console.log(data)
                  try {
                    const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data,{
                      headers: {
                        "Content-Type": "application/json",
                        },
                    });
                     if (response.status === 200){
                       alert('Add to cart successfull');
                       navigate('/cart');
                     } 
                   } catch (error) {
                     console.log(error?.message);
                  }
              }
        }
      }
    
 return (
        <>
            <Header /> 
            <div className="productDetailWrapper">
    {product && (
        <div className="productDetailContent">
            <div className="productImageWrapper">
                <img
                    src={product.image_product}
                    alt={product.name_product}
                    className="productImage"
                />
            </div>

            <div className="productInfoWrapper">
                <h1 className="productTitle">{product.name_product}</h1>
                <p className="productCost">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <p className="productDescription">{product.description}</p>
                
                    <div className="optionRow">
                        <label>Số lượng:</label>
                        <input type="number" name="quantity" id="soluong" min="1" defaultValue="1" />
                    </div>
            
                <div className="productActionButtons">
                    <button onClick={() => handleAddToCart(product?._id)} className="addToCartButton">
                        Thêm Vào Giỏ Hàng
                    </button>
                    <button className="buyNowButton">Mua Ngay</button>
                </div>
            </div>
        </div>
    )}
</div>
            <CommentSection productId={id} />
        </>
    ); 
}
export default Productdetails;
