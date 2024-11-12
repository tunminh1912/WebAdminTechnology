import axios from 'axios';
import './Category.css';
import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function Productdetails() {
    const { id } = useParams();  
    const [product, setProduct] = useState(null);
    const navigate = useNavigate()

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
        fetchProduct();
    }, [id]);


    const handleAddToCart = async (productId) => {
        if(productId !== null){
          const data = {
            userId: "672d6eea5d8c6f7abb9452f7",
            productId,
            quanlity: document.getElementById("soluong").value,
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
        <div className="product-details-container">
            {product && (  
                <Stack spacing={3}>
                    <img
                        src={product.image_product} 
                        alt={product.name_product}
                    />
                    <Stack>
                        <p className="product-name">{product.name_product}</p>
                        <p className="product-price">${product.price}</p>
                        <p className="product-description">{product.description}</p>                        
                    </Stack>
                    <input type="number" name="quanlity" id="soluong"></input>
                    <button onClick={()=>{handleAddToCart(product?._id)}}>Add to cart</button>
                </Stack>
            )}
        </div>
    );
    
}
export default Productdetails;
