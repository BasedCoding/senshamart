import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

function SignInPage() {
  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault(); 

    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate("/client"); 
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="sign-in-page">
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
          <a href="/login" className="login-button">
            Log In
          </a>
          <a href="/register" className="get-started-button">
            Get Started
          </a>
        </div>
      </header>

      {/* Main Sign In Content */}
      <main className="main">
        <h1 className="page-title">Sign In to SenShaMart</h1>
        <p className="register-instead">
          or{" "}
          <a href="/register" className="orange">
            register instead
          </a>
        </p>

        {/* Sign-In Form */}
        <form className="signin-form" onSubmit={handleSignIn}>
          <div className="form-group">
            <label>Email Address*</label>
            <input type="email" placeholder="example@domain.com" required />
          </div>
          <div className="form-group">
            <label>Password*</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          {/* Sign In Button */}
          <button type="submit" className="btn sign-in-btn">
            Sign In
          </button>
        </form>

        <p className="trouble-signin">Having trouble signing in?</p>
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
              <button className="signup-button">Sign-Up</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignInPage;
