// src/components/MyMarketplacePage.js
import React, { useState, useEffect } from "react";
import './market.css'; 
import { useNavigate } from "react-router-dom";

const API_BASE = "http://136.186.108.87:7001";

function MarketPage() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // const [selectedSensor, setSelectedSensor] = useState(null);

  // const sensors = [
  //   {
  //     id: 1,
  //     name: "Sample Sensor Name",
  //     idNumber: "1216548",
  //     type: "Room Temperature Sensor",
  //     sharedData: [
  //       { minutes: 60, coins: 60, date: "Apr-01-2024" },
  //       { minutes: 120, coins: 120, date: "Apr-04-2024" },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Another Sensor Name",
  //     idNumber: "1216549",
  //     type: "Humidity Sensor",
  //     sharedData: [
  //       { minutes: 24, coins: 24, date: "Apr-15-2024" },
  //       { minutes: 320, coins: 320, date: "Apr-20-2024" },
  //     ],
  //   },
  // ];

  // Wallet public key for OwnedBy API
  const [walletKeypair] = useState(
    "MHQCAQEEIKaHMfh7znw+YmIVPePU2f80mUpi6BKiUYNaAaTN02zJoAcGBSuBBAAKoUQDQgAEWHLcJyFezAjJkaM7Gy/khGCZUcBA0MViZUd3JEA7kFilrWWSPhT7rhfd5qKHAp+3WrEWQXjo0ewJFxIzCHe2fA=="
  );

  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
 // const [sharedData, setSharedData] = useState([]);
 // const [ownedError, setOwnedError] = useState("");
 const [setOwnedError] = useState("");

  useEffect(() => {
    const fetchOwned = async () => {
      setOwnedError("");
      try {
        const response = await fetch(`${API_BASE}/SensorRegistration/OwnedBy`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pubKey: walletKeypair }),
        });
        const data = await response.json();
        if (data.result && data.value) {
          const regs = Object.values(data.value).map((reg) => ({
            sensorName: reg.sensorName,
            hash: reg.hash,
            type: reg.unit || "",
          }));
          setSensors(regs);
        } else {
          const reason = data.reason || "Unknown failure";
          setOwnedError(`Could not load sensors: ${reason}`);
          console.error("OwnedBy API returned failure", data);
        }
      } catch (error) {
        setOwnedError(`Error fetching owned sensors: ${error.message}`);
        console.error("Error fetching owned sensors:", error);
      }
    };

    if (walletKeypair) {
      fetchOwned();
    }
  }, [walletKeypair]);
  // // Fetch registered sensors owned by this key
  // useEffect(() => {
  //   if (!walletKeypair) return;

  //   fetch(`${API_BASE}/SensorRegistration/OwnedBy`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ pubKey: walletKeypair }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.result && data.value) {
  //         const regs = Object.values(data.value).map((reg) => ({
  //           sensorName: reg.sensorName,
  //           hash: reg.hash,
  //           type: reg.unit || "",
  //         }));
  //         setSensors(regs);
  //       }
  //     })
  //     .catch(console.error);
  // }, [walletKeypair]);

  // Fetch registered sensors owned by this key
  // useEffect(() => {
  //   const fetchOwned = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE}/SensorRegistration/OwnedBy`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ pubKey: walletKeypair }),
  //       });
  //       const data = await response.json();
  //       if (data.result && data.value) {
  //         const regs = Object.values(data.value).map((reg) => ({
  //           sensorName: reg.sensorName,
  //           hash: reg.hash,
  //           type: reg.unit || "",
  //         }));
  //         setSensors(regs);
  //       } else {
  //         console.error("OwnedBy API returned failure", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching owned sensors:", error);
  //     }
  //   };

  //   if (walletKeypair) {
  //     fetchOwned();
  //   }
  // }, [walletKeypair]);

  // Handle clicking a sensor: load its shared-data history only
  // const handleSensorClick = async (sensor) => {
  //   setSelectedSensor(sensor);
  //   try {
  //     const history = await getSharedData(sensor.sensorName);
  //     setSharedData(history);
  //   } catch (error) {
  //     console.error("Error fetching shared data:", error);
  //   }
  // };
  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  const handleClientLogin = () => {
    navigate("/client");
  };

  const Profile = () => {
    navigate("/profile");
  };

  return (
    <div className="app">
      <header className="header">
        <a href="/provider" className="logo-link">
          <h1 className="logo">
            <span className="logo-part blue">Sen</span>
            <span className="logo-part orange">Sha</span>
            <span className="logo-part blue">Mart</span>
          </h1>
        </a>
        <nav className="nav">
          <a href="sell-data">Sell Data</a>
          <a href="my-marketplace">My Marketplace</a>
          <a href="blog">Blog</a>
          <a href="help">Help</a>
        </nav>
        <div className="cart-profile">
          {/* Profile Section */}
          <div className="profile-container" onClick={toggleDropdown}>
            <img
              src="/profile.png"
              alt="Profile Icon"
              className="profile-icon"
            />
            <span className="dropdown-arrow">⌄</span>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button onClick={Profile}>Check Profile</button>
                <button onClick={handleClientLogin}>Log in as a Client</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <h2 className="page-title">My Marketplace</h2>

        <div className="marketplace-container">
          {/* Left Side - Sensors List */}
          <div className="sensor-list">
            {sensors.map((sensor) => (
              <div
                key={sensor.id}
                className={`sensor-card ${
                  selectedSensor?.id === sensor.id ? "active" : ""
                }`}
                onClick={() => handleSensorClick(sensor)}
              >
                <h4>{sensor.name}</h4>
                <p>{sensor.idNumber}</p>
                <p>{sensor.type}</p>
              </div>
            ))}
          </div>

          <div className="market-separator"></div>

          {/* Right Side - Shared Data */}
          <div className="shared-data-list">
            {selectedSensor ? (
              selectedSensor.sharedData.map((data, index) => (
                <div key={index} className="shared-data-card">
                  <div className="shared-info">
                    <p>Shared for {data.minutes} Minutes</p>
                    <p>{data.coins} SensorCoins</p>
                    <p>{data.date}</p>
                  </div>
                  <span className="arrow">&gt;</span>
                </div>
              ))
            ) : (
              <p className="placeholder-text">
                Select a sensor to view shared data.
              </p>
            )}
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
      </footer>
    </div>
  );
}


export default MarketPage;
