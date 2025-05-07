import React, { useState, useCallback, useEffect } from "react";
import styles from "./Cart.module.css";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });
    const [promoCode, setPromoCode] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const walletKeypair = "MHQCAQEEIKaHMfh7znw+YmIVPePU2f80mUpi6BKiUYNaAaTN02zJoAcGBSuBBAAKoUQDQgAEWHLcJyFezAjJkaM7Gy/khGCZUcBA0MViZUd3JEA7kFilrWWSPhT7rhfd5qKHAp+3WrEWQXjo0ewJFxIzCHe2fA==";

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const fetchBalance = async () => {
        try {
            const response = await fetch('http://136.186.108.87:7001/Balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pubKey: walletKeypair })
            });

            const data = await response.json();
            if (data.result === false) {
                throw new Error(data.reason);
            }

            setBalance(data.default || 0);
            setError("");
        } catch (err) {
            console.error("Balance check failed:", err);
            setError("Failed to fetch balance. Please try again.");
        }
    };

    const handleCheckoutClick = async () => {
        await fetchBalance();
        setShowCheckoutModal(true);
    };

    const handleConfirmPayment = async () => {
        try {
            if (rewardAmount > balance) {
                throw new Error("Reward amount exceeds available balance");
            }

            const integrationData = {
                keyPair: walletKeypair,
                rewardAmount: rewardAmount,
                witnessCount: 1,
                outputs: cartItems.map(item => ({
                    amount: Number(item.subtotal),
                    sensorName: item.sensor_name,
                    sensorHash: item.sensor_hash,
                    brokerHash: item.broker_hash
                }))
            };

            const response = await fetch('http://136.186.108.87:7001/Integration/Register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(integrationData)
            });

            const result = await response.json();
            if (result.result === false) {
                throw new Error(result.reason);
            }

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

            setCartItems([]);
            setShowCheckoutModal(false);
            navigate("/purchasehistory");

        } catch (err) {
            console.error("Payment failed:", err);
            setError(err.message || "Payment failed. Please try again.");
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleProviderLogin = () => {
        navigate("/provider");
    };

    const handleBuyPage = () => {
        navigate("/search-sensors");
    };

    const removeSensor = useCallback((id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }, []);

    const updateCartItem = (itemId, newAmount, newDuration, newDutyCycle) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const parsedAmount = Number(newAmount);
                    const parsedDuration = Number(newDuration);
                    const parsedDutyCycle = Number(newDutyCycle);
                    const parsedSensorCpm = Number(item.sensor_cpm);

                    const updatedItem = {
                        ...item,
                        amount: parsedAmount,
                        duration: parsedDuration,
                        dutyCycle: parsedDutyCycle,
                        subtotal: parsedAmount * parsedDuration * parsedDutyCycle * parsedSensorCpm,
                    };
                    return updatedItem;
                }
                return item;
            });
        });
    };

    const total = cartItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const cartCount = cartItems.length;

    const Profile = () => {
        navigate("/profile")
      }

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
                    <a href="/search-sensors">Search Sensors</a>
                    <a href="/purchasehistory">Purchase History</a>
                    <a href="#blog">Blog</a>
                    <a href="help">Help</a>
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
                                <button onClick={Profile}>Check Profile</button>
                                <button onClick={handleProviderLogin}>Log in as a Provider</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles["cart-page"]}>
                <h2 className={styles["page-title"]}>Cart</h2>

                {cartItems.length === 0 ? (
                    <div className={styles["empty-cart"]}>
                        <p>Your cart is currently empty.</p>
                        <Link to="/search-sensors" className={styles["browse-sensors-link"]}>
                            Browse Sensors
                        </Link>
                    </div>
                ) : (
                    <>
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
                                        <p className={styles["item-name"]}>{item.sensor_name}</p>
                                        <p>Sensor Hash: {item.sensor_hash}</p>
                                        <p>Broker: {item.broker_name}</p>
                                        <p>Location: {item.lat}, {item.long}</p>
                                    </div>
                                    <div className={styles["item-inputs"]}>
                                        <div>
                                            <label>Amount</label>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => updateCartItem(item.id, e.target.value, item.duration, item.dutyCycle)}
                                            />
                                        </div>
                                        <div>
                                            <label>Duration (Minutes)</label>
                                            <input
                                                type="number"
                                                value={item.duration}
                                                onChange={(e) => updateCartItem(item.id, item.amount, e.target.value, item.dutyCycle)}
                                            />
                                        </div>
                                        <div>
                                            <label>Duty Cycle</label>
                                            <input
                                                type="number"
                                                value={item.dutyCycle}
                                                onChange={(e) => updateCartItem(item.id, item.amount, item.duration, e.target.value)}
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
                            <span className={styles.subtotalNumber}>{total.toFixed(2)} senshacoins</span>
                        </div>
                        <div className={styles.buttons}>
                            <button onClick={handleBuyPage} className={styles["add-sensors"]}>Add More Sensors</button>
                            <button onClick={handleCheckoutClick} className={styles.checkout}>Checkout</button>
                        </div>
                    </>
                )}

                {showCheckoutModal && (
                    <div className={styles["modal-overlay"]}>
                        <div className={styles["modal-content"]}>
                            <h3>Checkout Summary</h3>
                            <div className={styles["balance-section"]}>
                                <p>Available Balance: {balance.toFixed(2)} senshacoins</p>
                                <div className={styles["input-group"]}>
                                    <label>Reward Amount:</label>
                                    <input
                                        type="number"
                                        value={rewardAmount}
                                        onChange={(e) => setRewardAmount(Number(e.target.value))}
                                        min="0"
                                        max={balance}
                                    />
                                </div>
                            </div>
                            
                            {error && <p className={styles.error}>{error}</p>}

                            <div className={styles["modal-actions"]}>
                                <button 
                                    className={styles["cancel-button"]}
                                    onClick={() => setShowCheckoutModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={styles["confirm-button"]}
                                    onClick={handleConfirmPayment}
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Cart;
