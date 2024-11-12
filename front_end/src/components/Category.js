import React, { useState, useEffect } from 'react';
import './Category.css';
import { Grid, Grid2, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryItem = ({ image_category, name_category, category_id, onClick }) => {
  return (
    <div style={styles.container} onClick={() => onClick(category_id)}>
      <img src={image_category} alt={name_category} style={styles.icon} />
      <h3 style={styles.title}>{name_category}</h3>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '160px',
    height: '220px',
    backgroundColor: '#ffffff',
    padding: '20px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  icon: {
    width: '56px',
    height: '56px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#161d25',
    lineHeight: '20px',
    textAlign: 'center',
    margin: '8px 0',
  },
};

const CategoryTitle = () => {
  return (
    <div className="category-title" style={{ whiteSpace: 'nowrap', fontSize: '24px', fontWeight: 'bold' }}>
      Danh Mục
    </div>
  );
};

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3003/categories');
        setCategories(response.data);  
      } catch (error) {
        console.error('Error fetching categories:', error.response || error.message || error);
      }
    };
  
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3003/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.response || error.message || error);
      }
    };
  
    fetchCategories();
    fetchProducts();
  }, []);

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
      <CategoryTitle />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px 0' }}>
        {categories.map((category) => (
          <Grid onClick={() => navigate(`products?category=${category.category_id}`)}>
            <Stack
              spacing={3}
              style={{ cursor: 'pointer' }} > 
              <CategoryItem 
                image_category={category.image_category}  
                name_category={category.name_category}
                category_id={category.category_id}
                onClick={navigate}  
              />
            </Stack>
          </Grid>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Sản Phẩm</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {products.map((product) => (
            <Grid key={product.product_id} onClick={() => navigate(`/products/${product.product_id}`)} style={{ cursor: 'pointer' }}>
            <div key={product.product_id} className="product-container">
              <img 
                src={product.image_product} 
                alt={product.name_product} 
                className="product-image" 
              />
              <p className="product-name">{product.name_product}</p>
              <p className="product-price">${product.price}</p>
              <Grid2 className="add-to-cart-btn" onClick={(event)=>{event.stopPropagation();handleAddToCart(product._id)}}>Add to Cart</Grid2>
            </div>
            </Grid>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
