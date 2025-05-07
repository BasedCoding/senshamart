// src/components/ClientHomePage.js
import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './ClientHomePage.css'; 

function ClientHomePage() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const cartItems = JSON.parse(storedCartItems);
      setCartCount(cartItems.length);
    } else {
      setCartCount(0);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProviderLogin = () => {
    navigate("/provider"); 
  };

  const Cart = () => {
    navigate("/cart")
  }

  const Profile = () => {
    navigate("/profile")
  }

  return (
    <div className="app">
      <header className="header">
      <a href="/client" className="logo-link">
        <h1 className="logo">
          <span className="logo-part blue">Sen</span>
          <span className="logo-part orange">Sha</span>
          <span className="logo-part blue">Mart</span>
        </h1>
      </a> 
        <nav className="nav">
          <a href="search-sensors">Search Sensors</a>
          <a href="purchasehistory">Purchase History</a>
          <a href="#blog">Blog</a>
          <a href="help">Help</a>
        </nav>
        <div className="cart-profile">
          {/* Cart Section */}
          <div className="cart-container">
            <div onClick={Cart} className="cart-icon-container">
              <img src="/f7_cart.png" alt="Cart Icon" className="cart-icon" />
              <span className="cart-count">{cartCount}</span>
            </div>
          </div>

          {/* Separator */}
          <div className="separator">|</div>

          {/* Profile Section */}
          <div className="profile-container" onClick={toggleDropdown}>
            <img src="/profile.png" alt="Profile Icon" className="profile-icon" />
            <span className="dropdown-arrow">⌄</span>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={Profile}>Check Profile</button>
                <button onClick={handleProviderLogin}>Log in as a Provider</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <h2 className="greeting">Good Afternoon</h2>
        <h3 className="username">Username</h3>

        {/* Stats Section */}
        <div className="stats-container">
          <div className="all-stats">
            <div className="stat-item">
              <span className="stat-number">121</span> Entries
            </div>
            <div className="stat-item">
              <span className="stat-number">12</span> Orders
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span> Sample Stat
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="actions">
          <div className="action-card">
            <img src="/magnifyingglass.png" alt="Search Sensor Data" className="action-img" />
            <h4>Search Sensor Data</h4>
            <button className="action-btn orange-btn">Search with Filters</button>
            <button className="action-btn orange-btn">Search with SPARQL</button>
          </div>

          <div className="action-card">
            <img src="/shoppingcart.png" alt="View Cart" className="action-img" />
            <h4>View Cart</h4>
            <button className="action-btn blue-btn">Update Cart</button>
            <button className="action-btn blue-btn">Checkout</button>
          </div>

          <div className="action-card">
            <img src="/solar_history-outline.png" alt="Purchase History" className="action-img" />
            <h4>Purchase History</h4>
            <button className="action-btn blue-btn">View History</button>
          </div>
        </div>
      </main>

        {/* Footer Section */}
        <footer className="footer-section">
          <div className="footer-content">
              <div className="footer-logo">
                  <span className="logo-part blue">Sen</span>
                  <span className="logo-part orange">Sha</span>
                  <span className="logo-part blue">Mart</span>
              </div>
              <div className="footer-links">
                  <a href="#home">Home</a>
                  <a href="#about">About Us</a>
                  <a href="#services">Our Services</a>
                  <a href="#blog">Blog</a>
                  <a href="#contact">Contact Us</a>
                  <a href="#terms">Terms of Service</a>
              </div>
              <div className="newsletter-container">
              <h4 className="newsletter-heading">Sign Up For Our Newsletter!</h4>
              <div className="newsletter-form">
                  <input type="text" placeholder="Placeholder Text" />
                  <button className="signup-button">Sign Up</button>
              </div>
          </div>
          </div>
      </footer >
    </div>
  );
}

export default ClientHomePage;
