// src/components/MyMarketplacePage.js
import React, { useState } from 'react';
import './market.css'; 
import { useNavigate } from "react-router-dom";

function MarketPage() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    const navigate = useNavigate(); 
  
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
    const [selectedSensor, setSelectedSensor] = useState(null);

  const sensors = [
    {
      id: 1,
      name: "Sample Sensor Name",
      idNumber: "1216548",
      type: "Room Temperature Sensor",
      sharedData: [
        { minutes: 60, coins: 60, date: "Apr-01-2024" },
        { minutes: 120, coins: 120, date: "Apr-04-2024" },
      ],
    },
    {
      id: 2,
      name: "Another Sensor Name",
      idNumber: "1216549",
      type: "Humidity Sensor",
      sharedData: [
        { minutes: 24, coins: 24, date: "Apr-15-2024" },
        { minutes: 320, coins: 320, date: "Apr-20-2024" },
      ],
    },
  ];

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  const handleClientLogin = () => {
    navigate("/client"); 
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
            <img src="/profile.png" alt="Profile Icon" className="profile-icon" />
            <span className="dropdown-arrow">⌄</span>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button>Check Profile</button>
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
                                className={`sensor-card ${selectedSensor?.id === sensor.id ? "active" : ""}`}
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
                            <p className="placeholder-text">Select a sensor to view shared data.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}


export default MarketPage;
