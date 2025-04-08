import React, { useState, useEffect } from "react";
import styles from "./purchasehistory.module.css";
import { Link, useNavigate } from "react-router-dom";

function PurchaseHistory() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const navigate = useNavigate();
    const [cart] = useState(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    useEffect(() => {
        const storedPurchaseHistory = localStorage.getItem("purchaseHistory");
        if (storedPurchaseHistory) {
            setPurchaseHistory(JSON.parse(storedPurchaseHistory));
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleProviderLogin = () => {
        navigate("/provider");
    };

    const Cart = () => {
        navigate("/cart");
    };

    return (
        <div className={styles.app}>
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
                    <div className={styles["cart-container"]}>
                        <div onClick={Cart} className={styles["cart-icon-container"]}>
                            <img src="/f7_cart.png" alt="Cart Icon" className={styles["cart-icon"]} />
                            <span className={styles["cart-count"]}>{cart.length}</span>
                        </div>
                    </div>
                    <div className={styles.separator}>|</div>
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
                {purchaseHistory.length === 0 ? (
                    <p>No purchases found.</p>
                ) : (
                    <div className={styles.purchaseList}>
                        {purchaseHistory.map((item) => (
                            <div key={item.invoiceNumber} className={styles.purchaseItem}>
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
                                    <p className={styles.itemPrice}>{item.subtotal} senshacoins</p>
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
                )}
            </main>
        </div>
    );
}

export default PurchaseHistory;
