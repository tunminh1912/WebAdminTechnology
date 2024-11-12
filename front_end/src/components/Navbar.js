import React, { useEffect, useState } from 'react';
import './Navbar.css';
import search from '../assets/search.png';
import profile from '../assets/profile.png';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const CartIcon = () => {
  const navigate = useNavigate()

  const [cartProduct, setcartProduct] = useState([])
  useEffect(()=>{
    async function fetchCartProduct(){
      try {
        const response = await axios.get(`http://localhost:3003/cart/672d6eea5d8c6f7abb9452f7`);
        if(response.status === 200) setcartProduct(response.data)
      } catch (error) {
        console.log('Error fetching carts:', error.message);
      }
    }
    fetchCartProduct()
  },[])

  // Đếm tổng số lượng sản phẩm
  const productCount = cartProduct?.products?.length || 0;  

  return (
      <div className="icon-container">
        <IconButton onClick={()=>{navigate('/cart')}} size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={productCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </div>  
  );
};

const SearchField = () => {
  const [searchText, setSearchText] = React.useState('');

  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Tìm kiếm..." 
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />
      <button className="search-button">
        <img src={search} alt="Search Icon" className="search-icon" />
      </button>
    </div>
  );
};

const Header = () => {
  return (
    <div className="main-header">
      <div className="header-center">
        <SearchField />
      </div>
      <div className="header-right">
        <CartIcon />
        <img src={profile} alt="Profile Icon" className="profile-icon" />
      </div>
    </div>
  );
};

export default Header;
