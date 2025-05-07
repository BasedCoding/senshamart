import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css"; // For header/nav/cart styles
import "./ProfilePage.css";    // Custom dashboard styles (see below)
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [profile, setProfile] = useState({});
  const [preferences, setPreferences] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    setProfile(storedProfile ? JSON.parse(storedProfile) : {
      name: "Anonymous User",
      email: "Not set",
      publicKey: "Not set",
    });

    const storedPrefs = localStorage.getItem("userPreferences");
    setPreferences(storedPrefs ? JSON.parse(storedPrefs) : {
      coding: false,
      mqtt: false,
      rdf: false,
      sparql: false,
    });

    const storedPurchaseHistory = localStorage.getItem("purchaseHistory");
    setPurchaseHistory(storedPurchaseHistory ? JSON.parse(storedPurchaseHistory) : []);
    const storedCartItems = localStorage.getItem("cartItems");
    setCartCount(storedCartItems ? JSON.parse(storedCartItems).length : 0);
  }, []);

  const totalPurchases = purchaseHistory.length;
  const totalSpent = purchaseHistory.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);

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
          <a href="/search-sensors">Search Sensors</a>
          <a href="/purchasehistory">Purchase History</a>
          <a href="#blog">Blog</a>
          <a href="/help">Help</a>
        </nav>
        <div className={styles["cart-profile"]}>
          <div className={styles["cart-container"]}>
            <div className={styles["cart-icon-container"]}>
              <img src="/f7_cart.png" alt="Cart Icon" className={styles["cart-icon"]} />
              <span className={styles["cart-count"]}>{cartCount}</span>
            </div>
          </div>
          <div className={styles.separator}>|</div>
          <div className={styles["profile-container"]}>
            <img src="/profile.png" alt="Profile Icon" className={styles["profile-icon"]} />
            <span className={styles["dropdown-arrow"]}>⌄</span>
          </div>
        </div>
      </header>

      <main className="profile-dashboard-main">
        <div className="profile-dashboard-grid">
          {/* Sidebar */}
          <aside className="profile-dashboard-sidebar">
            <div className="profile-dashboard-logo">
              <span className="logo-part blue">Sen</span>
              <span className="logo-part orange">Sha</span>
              <span className="logo-part blue">Mart</span>
            </div>
            <ul>
              <li className="active">My dashboard</li>
              <li>Accounts</li>
              <li>Mobile</li>
              <li>Payments</li>
              <li>Supports</li>
            </ul>
          </aside>

          {/* Main Profile Card */}
          <section className="profile-dashboard-maincol">
            <div className="profile-dashboard-cards">
              {/* Profile Card */}
              <div className="profile-dashboard-card profile-dashboard-profile">
                <div className="profile-dashboard-avatar">
                  <img src="/profile.png" alt="Profile" />
                </div>
                <div className="profile-dashboard-profileinfo">
                  <div className="profile-dashboard-profilename">{profile.name}</div>
                  <div className="profile-dashboard-profileemail">{profile.email}</div>
                  <div className="profile-dashboard-profilemeta">
                    <span>Email: a@gmail.com</span>
                  </div>
                  <div className="profile-dashboard-profilemeta" style={{marginTop: 8}}>
                    <span>Public Key:</span>
                    <div className="profile-dashboard-profilekey">{profile.publicKey}</div>
                  </div>
                </div>
              </div>

              {/* Accounts Card */}
              <div className="profile-dashboard-card profile-dashboard-accounts">
                <div className="profile-dashboard-cardtitle">My Preferences</div>
                <ul className="profile-dashboard-pref-list">
                  <li>No coding experience: <b>{preferences.coding ? "Yes" : "No"}</b></li>
                  <li>Familiar with MQTT: <b>{preferences.mqtt ? "Yes" : "No"}</b></li>
                  <li>Familiar with RDF Triples: <b>{preferences.rdf ? "Yes" : "No"}</b></li>
                  <li>Familiar with SPARQL: <b>{preferences.sparql ? "Yes" : "No"}</b></li>
                </ul>
              </div>

              {/* Bills Card (Purchase Stats) */}
              <div className="profile-dashboard-card profile-dashboard-bills">
                <div className="profile-dashboard-cardtitle">My Purchases</div>
                <ul className="profile-dashboard-bill-list">
                  <li>
                    <span>Total Purchases</span>
                    <span className="profile-dashboard-billstatus paid">{totalPurchases}</span>
                  </li>
                  <li>
                    <span>Total Spent</span>
                    <span className="profile-dashboard-billstatus paid">{totalSpent.toFixed(2)} senshacoins</span>
                  </li>
                  <li>
                    <span>Recent Purchases</span>
                    <span>
                      <ul className="profile-dashboard-recent-list">
                        {purchaseHistory.length === 0 ? (
                          <li className="profile-dashboard-recent-empty">No purchases yet.</li>
                        ) : (
                          purchaseHistory.slice(-3).reverse().map((item, idx) => (
                            <li key={idx}>
                              <span className="profile-dashboard-recent-sensor">{item.sensor_name || item.name}</span>
                              {" - "}
                              {item.purchaseDate || "-"}
                              {item.subtotal && (
                                <> - <span className="profile-dashboard-recent-amount">{Number(item.subtotal).toFixed(2)} senshacoins</span></>
                              )}
                            </li>
                          ))
                        )}
                      </ul>
                    </span>
                  </li>
                </ul>
                <div style={{marginTop: 12}}>
                  <a href="/purchasehistory" className="profile-dashboard-link">View Full Purchase History</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
