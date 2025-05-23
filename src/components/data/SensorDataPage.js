import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import mqtt from "mqtt";
import "./SensorDataPage.css";
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "sensorDataHistory";

function SensorDataPage() {
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("graph");
  const [purchasedSensors, setPurchasedSensors] = useState([]);
  const [selectedSensorIndex, setSelectedSensorIndex] = useState(null);
  const [liveDataList, setLiveDataList] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // MQTT connection details
  const broker = "ws://test.mosquitto.org:8081";
  const defaultTopic = "out/test";
  const [topic, setTopic] = useState(defaultTopic);

  // Default test sensor object
  const defaultSensor = {
    sensor_name: "Default Test Sensor",
    sensor_hash: "test-sensor-001",
    measures: "Temperature",
    lat: "0",
    long: "0",
    amount: "-",
    duration: "-",
    dutyCycle: "-",
    purchaseDate: "-",
    invoiceNumber: "-"
  };

  // Load purchase history on mount
  useEffect(() => {
    const storedPurchaseHistory = localStorage.getItem("purchaseHistory");
    if (storedPurchaseHistory) {
      const parsedHistory = JSON.parse(storedPurchaseHistory);
      setPurchasedSensors(parsedHistory);
      setSelectedSensorIndex(parsedHistory.length > 0 ? 0 : null);
    } else {
      setPurchasedSensors([]);
      setSelectedSensorIndex(null);
    }
  }, []);

  // Set topic based on sensor selection
  useEffect(() => {
    if (purchasedSensors.length > 0 && selectedSensorIndex !== null) {
      setTopic(getTopicForSensor(selectedSensorIndex));
    } else {
      setTopic(defaultTopic);
    }
    // Don't clear liveDataList here, so data persists on navigation
  }, [selectedSensorIndex, purchasedSensors]);

  // MQTT SUBSCRIPTION
  useEffect(() => {
    const client = mqtt.connect(broker);

    client.on("connect", () => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", (t, message) => {
      try {
        const parsed = JSON.parse(message.toString());
        setLiveDataList(prev => {
          const next = [...prev.slice(-19), parsed]; // keep last 20 points
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      } catch (e) {
        setLiveDataList(prev => {
          const next = [...prev.slice(-19), { raw: message.toString() }];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    return () => {
      client.unsubscribe(topic);
      client.end();
    };
  }, [topic]);

  // CHART UPDATE
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    const labels = liveDataList.map(
      d => d.Timestamp
        ? new Date(Number(d.Timestamp) * 1000).toLocaleTimeString()
        : ""
    );
    const dataPoints = liveDataList.map(
      d => Number(d.Value || d.data || 0)
    );
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sensor Value",
            data: dataPoints,
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
            max: 40,
            ticks: {
              stepSize: 5,
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
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [liveDataList]);

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

  // Get selected sensor or default
  const selectedSensor =
    purchasedSensors.length > 0 && selectedSensorIndex !== null
      ? purchasedSensors[selectedSensorIndex]
      : defaultSensor;

  // Incrementing topic for each sensor
  const getTopicForSensor = (index) => {
    return `out/wmsaOr0eXoc4jcgUx1ectq9ICjASf-dBw-qdYlrqs1k=/${index}`;
  };

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
          <a href="#help">Help</a>
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
            value={
              purchasedSensors.length > 0 && selectedSensorIndex !== null
                ? selectedSensorIndex
                : "default"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "default") {
                setSelectedSensorIndex(null);
              } else {
                setSelectedSensorIndex(Number(val));
              }
            }}
            disabled={purchasedSensors.length === 0}
          >
            {purchasedSensors.length === 0 ? (
              <option value="default">Default Test Sensor</option>
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
              <h2>Temperature Data</h2>
              <p>
                {liveDataList.length > 0 && (liveDataList[liveDataList.length - 1].Value || liveDataList[liveDataList.length - 1].data)
                  ? `${liveDataList[liveDataList.length - 1].Value || liveDataList[liveDataList.length - 1].data}°C (Live)`
                  : "No live data yet"}
              </p>
              <canvas ref={chartRef} className="sensor-chart"></canvas>
            </div>
          )}
          {activeTab === "raw-data" && (
            <div id="raw-data-section">
              <h2>Raw Data</h2>
              <pre>
                {liveDataList.length > 0
                  ? JSON.stringify(liveDataList, null, 2)
                  : "No live data yet"}
              </pre>
            </div>
          )}
          {activeTab === "data-access" && (
            <div id="data-access-section">
              <h2>Data Access Information</h2>
              <p>Protocol: MQTT</p>
              <p>Broker IP: ws://test.mosquitto.org:8081</p>
              <p>
                Topic: {purchasedSensors.length > 0 && selectedSensorIndex !== null
                  ? getTopicForSensor(selectedSensorIndex)
                  : defaultTopic}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SensorDataPage;
