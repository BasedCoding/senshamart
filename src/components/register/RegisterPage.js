// RegisterPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Add registration logic (validation, API call, etc.)
    // On success, navigate to Preferences page:
    navigate("/preferences");
  };

  return (
    <div className="register-page">
      {/* Header Section */}
      <header className="header">
        <a href="/" className="logo-link">
          <h1 className="logo">
            <span className="logo-part blue">Sen</span>
            <span className="logo-part orange">Sha</span>
            <span className="logo-part blue">Mart</span>
          </h1>
        </a> 
        <nav className="nav">
          <a href="/">Home</a>
          <a href="#about">About Us</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact Us</a>
        </nav>
        <div className="auth-buttons">
          <a href="/login" className="login-button">Log In</a>
          <a href="/register" className="get-started-button">Get Started</a>
        </div>
      </header>

      {/* Main Registration Section */}
      <main className="main">
        <h1 className="page-title">Register for SenShaMart Services</h1>
        <p className="signin-redirect">
          or <a href="/login" className="orange">sign into your account</a>
        </p>
        <form className="register-form" onSubmit={handleRegister}>
          {/* Row 1: Name & Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Name*</label>
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label>Email Address*</label>
              <input type="email" placeholder="example@domain.com" required />
            </div>
          </div>
          {/* Row 2: Password & Confirm Password */}
          <div className="form-row">
            <div className="form-group">
              <label>Password*</label>
              <input type="password" placeholder="Create a password" required />
            </div>
            <div className="form-group">
              <label>Confirm Password*</label>
              <input type="password" placeholder="Re-enter your password" required />
            </div>
          </div>
          {/* Role Selection */}
          <div className="form-group">
            <label>Role*</label>
            <select required>
              <option value="Buyer">Purchase Sensors</option>
              <option value="Seller">Sell Sensors</option>
              <option value="Data Provider">Provide Sensor Data</option>
            </select>
          </div>
          {/* Key Pair Section */}
          <h2 className="keypair-title">SenShaMart Key Pair</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Public Key</label>
              <input type="text" placeholder="Generated Public Key" />
            </div>
            <div className="form-group">
              <label>Private Key</label>
              <input type="text" placeholder="Generated Private Key" />
            </div>
          </div>
          <button type="button" className="btn generate-btn">
            Generate New Keypair
          </button>
          {/* Checkboxes */}
          <div className="checkbox-row">
            <input type="checkbox" id="agree" />
            <label htmlFor="agree">
              Yes, I agree to the <span className="orange">Terms of Service</span>
            </label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" id="notify" />
            <label htmlFor="notify">
              Yes, I want to be notified of exclusive offers, upcoming betas, and the latest news from SenShaMart.
            </label>
          </div>
          {/* Create Account Button */}
          <button type="submit" className="btn create-btn">
            Create Account
          </button>
        </form>
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
    </div>
  );
}

export default RegisterPage;
