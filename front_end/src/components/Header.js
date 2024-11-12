import React from 'react';
import './Header.css';
import headphoneImage from '../assets/headphone.png';

function Header() {
  return (
    <section className="header">
      <div className="image-content">
        <img src={headphoneImage} alt="banner" />
      </div>
    </section>
  );
}

export default Header;
