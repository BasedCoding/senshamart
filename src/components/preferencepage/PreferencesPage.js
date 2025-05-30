import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PreferencesPage.css";

function PreferencesPage() {
  const navigate = useNavigate(); 
  const handleClientLogin = () => {
    navigate("/client"); 
  };
  return (
    <div className="preferences-page">
      {/* Header Section (same as Landing Page) */}
      <header className="header">
        <h1 className="logo">
          <span className="logo-part blue">Sen</span>
          <span className="logo-part orange">Sha</span>
          <span className="logo-part blue">Mart</span>
        </h1>
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

      {/* Main Content */}
      <main className="main">
        <h1 className="page-title">Before We Get Started</h1>
        <div className="preferences-container">
          <h2>Do You Have Experience in Coding?</h2>
          <p>
            Regardless of your level of experience, SenShaMart is for you.
            We want to direct you to the most suitable tools for you. You
            can change the answers later in account settings.
          </p>

          <form className="preferences-form">
            <div className="checkbox-option">
              <input type="checkbox" id="option1" />
              <label htmlFor="option1">No coding experience</label>
            </div>
            <div className="checkbox-option">
              <input type="checkbox" id="option2" />
              <label htmlFor="option2">
                Are you familiar with MQTT protocol and MQTT Brokers?
              </label>
            </div>
            <div className="checkbox-option">
              <input type="checkbox" id="option3" />
              <label htmlFor="option3">Are you familiar with RDF Triples?</label>
            </div>
            <div className="checkbox-option">
              <input type="checkbox" id="option4" />
              <label htmlFor="option4">
                Are you familiar with SPARQL Queries?
              </label>
            </div>
            <button onClick={handleClientLogin} type="submit" className="btn continue-btn">
              Continue
            </button>
          </form>
        </div>
      </main>

      {/* Footer Section (same as Landing Page) */}
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

export default PreferencesPage;
