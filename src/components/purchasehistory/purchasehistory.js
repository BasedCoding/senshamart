import React, { useState, useEffect } from "react";
import styles from "./purchasehistory.module.css";
import { Link, useNavigate } from "react-router-dom";

function PurchaseHistory() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("latest");
    const ITEMS_PER_PAGE = 5;
    const navigate = useNavigate();
    const [cart] = useState(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    useEffect(() => {
        loadPurchaseHistory();
    }, []);

    useEffect(() => {
        if (purchaseHistory.length > 0) {
            const totalPages = Math.ceil(purchaseHistory.length / ITEMS_PER_PAGE);
            if (currentPage > totalPages) {
                setCurrentPage(totalPages > 0 ? totalPages : 1);
            }
        } else {
            setCurrentPage(1); 
        }
    }, [purchaseHistory, currentPage]);

    const loadPurchaseHistory = () => {
        const storedPurchaseHistory = localStorage.getItem("purchaseHistory");
        if (storedPurchaseHistory) {
            setPurchaseHistory(JSON.parse(storedPurchaseHistory));
        } else {
            setPurchaseHistory([]); 
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleProviderLogin = () => {
        navigate("/provider");
    };

    const Cart = () => {
        navigate("/cart");
    };

    // Remove a purchase history item
    const removePurchase = (invoiceNumber) => {
        const updatedHistory = purchaseHistory.filter(
            (item) => item.invoiceNumber !== invoiceNumber
        );
        localStorage.setItem("purchaseHistory", JSON.stringify(updatedHistory));
        loadPurchaseHistory();
    };

    // Sort purchase history by time
    const sortPurchaseHistory = () => {
        const sortedHistory = [...purchaseHistory].sort((a, b) => {
            const dateA = new Date(a.purchaseDate).getTime();
            const dateB = new Date(b.purchaseDate).getTime();

            return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        });
        setPurchaseHistory(sortedHistory);
        setSortOrder(sortOrder === "latest" ? "oldest" : "latest");
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = purchaseHistory.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(purchaseHistory.length / ITEMS_PER_PAGE); i++) {
        pageNumbers.push(i);
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
                <nav className={styles.nav}>
                    <a href="search-sensors">Search Sensors</a>
                    <a href="purchasehistory">Purchase History</a>
                    <a href="#blog">Blog</a>
                    <a href="help">Help</a>
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

                {/* Sorting and Pagination Controls */}
                <div className={styles.controls}>
                    <button onClick={sortPurchaseHistory} className={styles.sortButton}>
                        Sort by: {sortOrder === "latest" ? "Latest" : "Oldest"}
                    </button>
                </div>

                {currentItems.length === 0 ? (
                    <p>No purchases found.</p>
                ) : (
                    <>
                        {/* Purchase List */}
                        <div className={styles.purchaseList}>
                            {currentItems.map((item) => (
                                <div key={item.invoiceNumber} className={styles.purchaseItem}>
                                    <div className={styles.itemDetails}>
                                        <p className={styles.itemName}>{item.sensor_name}</p>
                                        <p>{item.serial}</p>
                                        <p>{item.type}</p>
                                        <p>{item.location}</p>
                                    </div>

                                    <div className={styles.itemInfo}>
                                        <p>
                                            Amount:{" "}
                                            <span className={styles.itemValue}>{item.amount}</span>
                                        </p>
                                        <p>
                                            Duration (Minutes):{" "}
                                            <span className={styles.itemValue}>{item.duration}</span>
                                        </p>
                                        <p>
                                            Duty Cycle:{" "}
                                            <span className={styles.itemValue}>{item.dutyCycle}</span>
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
                                        <button
                                            onClick={() => removePurchase(item.invoiceNumber)}
                                            className={styles.removeButton}
                                        >
                                            Remove
                                        </button>
                                        <Link to="/data" className={styles.viewDataLink}>
                                            View Data
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {purchaseHistory.length > ITEMS_PER_PAGE && (
                            <div className={styles.pagination}>
                                {Array.from(
                                    { length: Math.ceil(purchaseHistory.length / ITEMS_PER_PAGE) },
                                    (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ""}`}
                                        >
                                            {i + 1}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default PurchaseHistory;
