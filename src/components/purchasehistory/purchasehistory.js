// src/components/PurchaseHistory.js
import React, { useState } from "react";
import styles from "./purchasehistory.module.css"; // Create this CSS module
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";

function PurchaseHistory() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProviderLogin = () => {
    navigate("/provider");
  };

  const Cart = () => {
    navigate("/cart");
  };

  const purchaseData = [
    {
      id: 1,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      purchaseDate: "Apr-08-2024",
      invoiceNumber: "423463455",
      price: 284.35,
    },
    {
      id: 2,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      purchaseDate: "Apr-08-2024",
      invoiceNumber: "423463455",
      price: 284.35,
    },
    {
      id: 3,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      purchaseDate: "Apr-08-2024",
      invoiceNumber: "423463455",
      price: 284.35,
    },
    {
      id: 4,
      name: "Sample Sensor Name",
      serial: "1216548",
      type: "Room Temperature Sensor",
      location: "Australia",
      amount: 12482,
      duration: 600,
      dutyCycle: 21,
      purchaseDate: "Apr-08-2024",
      invoiceNumber: "423463455",
      price: 284.35,
    },
  ];

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
            <div onClick={Cart} className={styles["cart-icon-container"]}>
              <img src="/f7_cart.png" alt="Cart Icon" className={styles["cart-icon"]} />
              <span className={styles["cart-count"]}>3</span>
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

      <main className={styles.purchaseHistoryPage}>
        <h2 className={styles.pageTitle}>Purchase History</h2>
        <div className={styles.purchaseList}>
          {purchaseData.map((item) => (
            <div key={item.id} className={styles.purchaseItem}>
              <div className={styles.itemDetails}>
                <p className={styles.itemName}>{item.name}</p>
                <p>{item.serial}</p>
                <p>{item.type}</p>
                <p>{item.location}</p>
              </div>
              <div className={styles.itemInfo}>
                <p>
                  Amount: <span className={styles.itemValue}>{item.amount}</span>
                </p>
                <p>
                  Duration (Minutes):{" "}
                  <span className={styles.itemValue}>{item.duration}</span>
                </p>
                <p>
                  Duty Cycle: <span className={styles.itemValue}>{item.dutyCycle}</span>
                </p>
                <p>
                  Purchase Date:{" "}
                  <span className={styles.itemValue}>{item.purchaseDate}</span>
                </p>
              </div>
              <div className={styles.itemInvoice}>
                <p className={styles.itemPrice}>${item.price}</p>
                <p className={styles.invoiceContainer}>
                  Invoice Number: <span className={styles.invoiceNumber}>{item.invoiceNumber}</span>
                </p>
                <Link to="/data" className={styles.viewDataLink}>
                  View Data
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PurchaseHistory;