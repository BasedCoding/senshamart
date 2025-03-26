import React from "react";
import { Link } from "react-router-dom";
import "./SignInPage.css";

function SignInPage() {
  return (
    <div className="sign-in-page">
      {/* Header Section (same styling as Landing Page) */}
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
          <Link to="/login" className="login-button">
            Log In
          </Link>
          <Link to="/register" className="get-started-button">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Sign In Content */}
      <main className="main">
        <h1 className="page-title">Sign In to SenShaMart</h1>
        <p className="register-instead">
          or{" "}
          <Link to="/register" className="orange">
            register instead
          </Link>
        </p>

        <form className="signin-form">
          <div className="form-group">
            <label>Email Address*</label>
            <input type="email" placeholder="example@domain.com" required />
          </div>
          <div className="form-group">
            <label>Password*</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn sign-in-btn">
            Sign In
          </button>
        </form>

        <p className="trouble-signin">Having trouble signing in?</p>
      </main>

      {/* Footer Section (same styling as Landing Page) */}
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
              <button className="signup-button">Sign-Up</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignInPage;
