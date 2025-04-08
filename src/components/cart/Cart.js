import React, { useState, useCallback, useEffect } from "react";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });
    const [promoCode, setPromoCode] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleProviderLogin = () => {
        navigate("/provider");
    };

    const removeSensor = useCallback((id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }, []);

    const updateCartItem = (itemId, newAmount, newDuration, newDutyCycle) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const updatedItem = {
                        ...item,
                        amount: newAmount,
                        duration: newDuration,
                        dutyCycle: newDutyCycle,
                        subtotal: newAmount * newDuration * newDutyCycle * 5,
                    };
                    return updatedItem;
                }
                return item;
            });
        });
    };

    const checkout = () => {
        const purchaseDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const purchasesWithInvoice = cartItems.map((item) => ({
            ...item,
            invoiceNumber: Math.floor(Math.random() * 1000000000).toString(),
            purchaseDate,
        }));

        // Get existing purchase history from local storage
        const existingPurchaseHistory = localStorage.getItem("purchaseHistory")
            ? JSON.parse(localStorage.getItem("purchaseHistory"))
            : [];

        // Append new purchases to existing history
        const updatedPurchaseHistory = [...existingPurchaseHistory, ...purchasesWithInvoice];

        // Save updated purchase history to local storage
        localStorage.setItem("purchaseHistory", JSON.stringify(updatedPurchaseHistory));

        navigate("/purchasehistory");

        // Clear cart
        setCartItems([]);
    };

    const total = cartItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const cartCount = cartItems.length;

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
                        <div className={styles["cart-icon-container"]}>
                            <img src="/f7_cart.png" alt="Cart Icon" className={styles["cart-icon"]} />
                            <span className={styles["cart-count"]}>{cartCount}</span>
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
                                    <input
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => updateCartItem(item.id, parseInt(e.target.value), item.duration, item.dutyCycle)}
                                    />
                                </div>
                                <div>
                                    <label>Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        value={item.duration}
                                        onChange={(e) => updateCartItem(item.id, item.amount, parseInt(e.target.value), item.dutyCycle)}
                                    />
                                </div>
                                <div>
                                    <label>Duty Cycle</label>
                                    <input
                                        type="number"
                                        value={item.dutyCycle}
                                        onChange={(e) => updateCartItem(item.id, item.amount, item.duration, parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className={styles["item-price"]}>
                                {Number(item.subtotal).toFixed(2)} senshacoins
                            </div>
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
                    <span className={styles.sub}>Subtotal</span>{" "}
                    <span className={styles.subtotalNumber}>${total.toFixed(2)} senshacoins</span>
                </div>
                <div className={styles.buttons}>
                    <button className={styles["add-sensors"]}>Add More Sensors</button>
                    <button onClick={checkout} className={styles.checkout}>Checkout</button>
                </div>
            </main>
        </div>
    );
}

export default Cart;
