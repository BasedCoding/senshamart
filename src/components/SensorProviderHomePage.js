// src/components/SensorProviderPage.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './SensorProviderHomePage.css'; 

function SensorProviderPage() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); 

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClientLogin = () => {
    navigate("/client"); 
  };


  return (
    <div className="app">
      <header className="header">
        <a href="/provider" className="logo-link">
          <h1 className="logo">
            <span className="logo-part blue">Sen</span>
            <span className="logo-part orange">Sha</span>
            <span className="logo-part blue">Mart</span>
          </h1>
        </a>
        <nav className="nav">
          <a href="sell-data">Sell Data</a>
          <a href="my-marketplace">My Marketplace</a>
          <a href="blog">Blog</a>
          <a href="help">Help</a>
        </nav>
        <div className="cart-profile">
          {/* Profile Section */}
          <div className="profile-container" onClick={toggleDropdown}>
            <img
              src="/profile.png"
              alt="Profile Icon"
              className="profile-icon"
            />
            <span className="dropdown-arrow">⌄</span>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button>Check Profile</button>
                <button onClick={handleClientLogin}>Log in as a Client</button>
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
              <span className="stat-number">121</span> Minutes Sold
            </div>
            <div className="stat-item">
              <span className="stat-number">12</span> Coins Earned
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span> Sample Stat
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="actions">
          <div className="action-card">
            <img
              src="/ion_share-outline.png"
              alt="Register Sensors"
              className="action-img"
            />
            <h4>Register Sensors</h4>
            <p>Add new IoT sensors to your Marketplace</p>
            <button className="action-btn orange-btn">Register</button>
          </div>

          <div className="action-card">
            <img
              src="/lsicon_marketplace-outline.png"
              alt="My Marketplace"
              className="action-img"
            />
            <h4>My Marketplace</h4>
            <p>View and manage your registered IoT sensors</p>
            <button className="action-btn blue-btn">View</button>
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
      </footer>
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

export default SensorProviderPage;
