import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import mqtt from "mqtt";
import "./SensorDataPage.css";
import { useNavigate } from "react-router-dom";

function SensorDataPage() {
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("graph");
  const [purchasedSensors, setPurchasedSensors] = useState([]);
  const [selectedSensorIndex, setSelectedSensorIndex] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // MQTT state
  const [liveData, setLiveData] = useState(null);

  // MQTT connection details - using hardcoded values
  const broker = "mqtt://136.186.108.94:5003";
  const defaultTopic = "out/test"; 
  const [topic, setTopic] = useState(defaultTopic); 
  const [client, setClient] = useState(null);

  useEffect(() => {
    loadPurchaseHistory();
  }, []);

  const loadPurchaseHistory = () => {
    const storedPurchaseHistory = localStorage.getItem("purchaseHistory");
    if (storedPurchaseHistory) {
      const parsedHistory = JSON.parse(storedPurchaseHistory);
      setPurchasedSensors(parsedHistory);
      setSelectedSensorIndex(parsedHistory.length > 0 ? 0 : null);
    } else {
      setPurchasedSensors([]);
      setSelectedSensorIndex(null);
    }
  };

  // --- MQTT SUBSCRIPTION ---
  useEffect(() => {
    // Connect to MQTT broker
    const newClient = mqtt.connect(broker);

    newClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      newClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`);
        } else {
          console.error("Subscription error:", err);
        }
      });
    });

    newClient.on("message", (t, message) => {
      // Parse and store the latest message
      try {
        const parsed = JSON.parse(message.toString());
        setLiveData(parsed);
      } catch (e) {
        console.error("Error parsing message:", e);
        setLiveData({ raw: message.toString() });
      }
    });

    newClient.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    setClient(newClient);

    return () => {
      console.log("Unsubscribing and disconnecting MQTT client");
      newClient.unsubscribe(topic);
      newClient.end();
    };
  }, [topic]); 

  // --- CHART UPDATE ---
  useEffect(() => {
    if (activeTab === "graph" && selectedSensorIndex !== null) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Current"],
          datasets: [
            {
              label: "Sensor Value",
              data: liveData && liveData.data ? [Number(liveData.data)] : [0], 
              borderColor: "#f06e4b",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 10,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activeTab, selectedSensorIndex, purchasedSensors, liveData]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const cartItems = JSON.parse(storedCartItems);
      setCartCount(cartItems.length);
    } else {
      setCartCount(0);
    }
  }, []);

  const Cart = () => {
    navigate("/cart");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProviderLogin = () => {
    navigate("/provider");
  };

  const selectedSensor = purchasedSensors[selectedSensorIndex];

  // Incrementing topic for each sensor
  const getTopicForSensor = (index) => {
    return `out/wmsaOr0eXoc4jcgUx1ectq9ICjASf-dBw-qdYlrqs1k=/${index}`;
  };

  useEffect(() => {
    if (selectedSensorIndex !== null && purchasedSensors.length > 0) {
      const newTopic = getTopicForSensor(selectedSensorIndex);
      console.log(`Changing topic to: ${newTopic}`);
      setTopic(newTopic);
    }
  }, [selectedSensorIndex, purchasedSensors]);

  return (
    <div className="app">
      <header className="header">
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
        <div className="cart-profile">
          <div className="cart-container">
            <div onClick={Cart} className="cart-icon-container">
              <img src="/f7_cart.png" alt="Cart Icon" className="cart-icon" />
              <span className="cart-count">{cartCount}</span>
            </div>
          </div>

          <div className="separator">|</div>
          <div className="profile-container" onClick={toggleDropdown}>
            <img src="/profile.png" alt="Profile Icon" className="profile-icon" />
            <span className="dropdown-arrow">⌄</span>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <button>Check Profile</button>
                <button onClick={handleProviderLogin}>Log in as a Provider</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="sensor-selection">
          <label htmlFor="sensor-dropdown">Select Sensor:</label>
          <select
            id="sensor-dropdown"
            value={selectedSensorIndex === null ? "" : selectedSensorIndex}
            onChange={(e) => setSelectedSensorIndex(Number(e.target.value))}
            disabled={purchasedSensors.length === 0}
          >
            {purchasedSensors.length === 0 ? (
              <option>No sensors purchased</option>
            ) : (
              purchasedSensors.map((sensor, index) => (
                <option key={index} value={index}>
                  {sensor.sensor_name}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedSensor && (
          <div className="sensor-info-container">
            <div className="sensor-info">
              <h3>Sensor Information</h3>
              <p>
                <strong>Name:</strong> {selectedSensor.sensor_name}
              </p>
              <p>
                <strong>ID:</strong> {selectedSensor.sensor_hash}
              </p>
              <p>
                <strong>Type:</strong> {selectedSensor.measures}
              </p>
              <p>
                <strong>Location:</strong> {`${selectedSensor.lat}, ${selectedSensor.long}`}
              </p>
            </div>
            <div className="sensor-info">
              <h3>Purchase Details</h3>
              <p>
                <strong>Amount:</strong> {selectedSensor.amount}
              </p>
              <p>
                <strong>Duration:</strong> {selectedSensor.duration}
              </p>
              <p>
                <strong>Duty Cycle:</strong> {selectedSensor.dutyCycle}
              </p>
              <p>
                <strong>Purchase Date:</strong> {selectedSensor.purchaseDate}
              </p>
              <p>
                <strong>Invoice:</strong> {selectedSensor.invoiceNumber}
              </p>
            </div>
          </div>
        )}

        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${activeTab === "graph" ? "active" : ""}`}
            onClick={() => setActiveTab("graph")}
          >
            Graph
          </button>
          <button
            className={`toggle-btn ${activeTab === "raw-data" ? "active" : ""}`}
            onClick={() => setActiveTab("raw-data")}
          >
            Raw Data
          </button>
          <button
            className={`toggle-btn ${activeTab === "data-access" ? "active" : ""}`}
            onClick={() => setActiveTab("data-access")}
          >
            Data Access Information
          </button>
        </div>

        <div className="toggle-content">
          {activeTab === "graph" && (
            <div id="graph-section">
              <h2>Sensor Data</h2>
              <p>
                {liveData && liveData.data
                  ? `${liveData.data} (Live)`
                  : "No live data yet"}
              </p>
              <canvas ref={chartRef} className="sensor-chart"></canvas>
            </div>
          )}
          {activeTab === "raw-data" && (
            <div id="raw-data-section">
              <h2>Raw Data</h2>
              <pre>{liveData ? JSON.stringify(liveData, null, 2) : "No live data yet"}</pre>
            </div>
          )}
          {activeTab === "data-access" && (
            <div id="data-access-section">
              <h2>Data Access Information</h2>
              <p>Protocol: MQTT</p>
              <p>Broker IP: mqtt://136.186.108.94:5003</p>
              <p>
                Topic: {purchasedSensors.length > 0 && selectedSensorIndex !== null
                  ? getTopicForSensor(selectedSensorIndex)
                  : "N/A"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SensorDataPage;
