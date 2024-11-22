import React from 'react';
import headphoneImage from '../assets/16.png'; // Đảm bảo đường dẫn đúng
import './Header.css';

function Header() {
  return (
    <div
      className="background-image"
      style={{ backgroundImage: `url(${headphoneImage})` }}
    >
      <div className="content">
        <h1 className="product-title">iPhone 16</h1>
        <p className="product-subtitle">The Biggest Upcoming Sales Events </p>
        <div className="button-container">
          <button className="learn-more-btn">Learn More</button>
          <button className="buy-btn">Buy</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
