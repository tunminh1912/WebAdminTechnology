import React from 'react';
import headphoneImage from '../assets/16.png'; 
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  return (
    <div
      className="background-image"
      style={{ backgroundImage: `url(${headphoneImage})` }}
    >
      <div className="content">
        <h1 className="product-title">iPhone 16</h1>
        <p className="product-subtitle">The Biggest Upcoming Sales Events</p>
        <div className="button-container">
          <button
            className="learn-more-btn"
            onClick={() => navigate('/products/67089ad609136ebff0d348c8')} // Điều hướng đến sản phẩm cụ thể
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
