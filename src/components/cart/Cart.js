// src/components/Cart.js
import React, { useState, useCallback } from "react";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      date: "Apr-05-2024",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      price: 284.35,
    },
    {
      id: 2,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      date: "Apr-05-2024",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      price: 284.35,
    },
    {
      id: 3,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      date: "Apr-05-2024",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      price: 284.35,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const navigate = useNavigate(); 
    

  const handleProviderLogin = () => {
    navigate("/provider"); 
  };

  const removeSensor = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cartItems.length;

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
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
          <a href="#help">Help</a>
        </nav>
        <div className={styles["cart-profile"]}>
          {/* Cart Section */}
          <div className={styles["cart-container"]}>
            <div className={styles["cart-icon-container"]}>
              <img src="/f7_cart.png" alt="Cart Icon" className={styles["cart-icon"]} />
              <span className={styles["cart-count"]}>{cartCount}</span>
            </div>
          </div>

          {/* Separator */}
          <div className={styles.separator}>|</div>

          {/* Profile Section */}
          <div className={styles["profile-container"]} onClick={toggleDropdown}>
            <img src="/profile.png" alt="Profile Icon" className={styles["profile-icon"]} />
            <span className={styles["dropdown-arrow"]}>⌄</span>
            {dropdownVisible && (
              <div className={styles["dropdown-menu"]}>
                <button>Check Profile</button>
                <button onClick={handleProviderLogin}>Log in as a Provider</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles["cart-page"]}>
        <h2 className={styles["page-title"]}>Cart</h2>
        <div className={styles["cart-items"]}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles["cart-item"]}>
              <button
                className={styles["remove-button"]}
                onClick={() => removeSensor(item.id)}
              >
                -
              </button>
              <div className={styles["item-details"]}>
                <p className={styles["item-name"]}>{item.name}</p>
                <p>{item.serial}</p>
                <p>{item.type}</p>
                <p>{item.location}</p>
                <p>{item.date}</p>
              </div>
              <div className={styles["item-inputs"]}>
                <div>
                  <label>Amount</label>
                  <input type="text" value={item.amount} />
                </div>
                <div>
                  <label>Duration (Minutes)</label>
                  <input type="text" value={item.duration} />
                </div>
                <div>
                  <label>Duty Cycle</label>
                  <input type="text" value={item.dutyCycle} />
                </div>
              </div>
              <div className={styles["item-price"]}>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className={styles["promo-code"]}>
          <input
            type="text"
            placeholder="Promo Code?"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </div>
        <div className={styles.subtotal}>
            <span className={styles.sub}>Subtotal</span> <span className={styles.subtotalNumber}>${total.toFixed(2)}</span>
          </div>
        <div className={styles.buttons}>
          <button className={styles["add-sensors"]}>Add More Sensors</button>
          <button className={styles.checkout}>Checkout</button>
        </div>
      </main>
    </div>
  );
}

export default Cart;
