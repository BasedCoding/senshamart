import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page">
            {/* Header Section */}
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
                    <Link to="/login" className="login-button">Log In</Link>
                    <Link to="/register" className="get-started-button">Get Started</Link>
                </div>
            </header>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-text">
                <h1 className="hero-title">
                    Lorem Ipsum
                </h1>
                <h1 className="hero-title orange-text">
                    Sensor Sharing
                </h1>
                <Link to="/client" className="get-started-button-hero">
                    Get Started
                </Link>
                </div>
                <div className="hero-image">
                <img src="/Australian-Locations-New-Era-Technology.png" alt="Australia Map" />
                </div>
            </section>

            {/* Options Section */}
            <section className="options-section">
                <div className="option-wrapper">
                    <div className="option-card">
                        <img src="/magnifyingglass.png" alt="Client Icon" className="option-icon" />
                        <div className="option-heading">
                            As a <Link to="/client" className="option-link">Client</Link>
                        </div>
                        <p>A short explanation on what the client's purpose is labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud tempor incididunt ut labore et dolore.</p>
                        <Link to="/client" className="learn-more">Learn More</Link>
                        <div className="placeholder-box"></div> {/* Placeholder below Client */}
                    </div>
                    <div className="separator"></div>
                    <div className="option-card">
                        <img src="/provider-icon.png" alt="Data Provider Icon" className="option-icon" />
                        <div className="option-heading">
                            As a <Link to="/provider" className="option-link">Sensor Provider</Link>
                        </div>
                        <p>A short explanation on what the data provider’s purpose is Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <Link to="/provider" className="learn-more">Learn More</Link>
                        <div className="placeholder-box"></div> {/* Placeholder below Data Provider */}
                    </div>
                </div>
            </section>

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
        </div >
    );
}

export default LandingPage;
