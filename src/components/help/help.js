import React, { useState } from 'react';
import styles from './help.module.css';
import { useNavigate } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

function HelpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

    const [dropdownVisible, setDropdownVisible] = useState(false);
  
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  
    const handleProviderLogin = () => {
      navigate("/provider"); 
    };
  

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    // For production: Use Formcarry/HeroTofu here
    setFormData({ name: '', email: '', message: '' });
  };

  const Profile = () => {
    navigate("/profile")
  }

  return (
    <div className={styles.app}>
      <header className="header">
      <a href="/" className="logo-link">
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

      <main className={styles.helpPage}>
        <h2 className={styles.pageTitle}>Help Information</h2>
        <div className={styles.helpContainer}>
          <div className={styles.contactForm}>
            <h3>Have a question?</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>Send</button>
            </form>
          </div>

          <div className={styles.contactInfo}>
            <h3>Contact</h3>
            <p><Mail className={styles.icon} />support@senshamart.com</p>
            <p><Phone className={styles.icon} />+1 (555) 123-4567</p>
            <p><MapPin className={styles.icon} />123 Street, Melbourne, Victoria, 12345</p>
            
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook"><Facebook /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin /></a>
              <a href="#" aria-label="Twitter"><Twitter /></a>
            </div>
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

export default HelpPage;
