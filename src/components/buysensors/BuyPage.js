import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BuyPage.module.css";

function BuyPage() {
  const [sensors, setSensors] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    type: "",
    location: "",
    measurement: "",
  });
  const [filteredSensors, setFilteredSensors] = useState(sensors);
  const [cart, setCart] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [amount, setAmount] = useState(1);
  const [duration, setDuration] = useState(1);
  const [dutyCycle, setDutyCycle] = useState(1);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [isFilterSectionOpen, setIsFilterSectionOpen] = useState(true);
  const [walletKeypair] = useState(
    "MHQCAQEEIKaHMfh7znw+YmIVPePU2f80mUpi6BKiUYNaAaTN02zJoAcGBSuBBAAKoUQDQgAEWHLcJyFezAjJkaM7Gy/khGCZUcBA0MViZUd3JEA7kFilrWWSPhT7rhfd5qKHAp+3WrEWQXjo0ewJFxIzCHe2fA=="
  );

  useEffect(() => {
    fetchSensors();
  }, [walletKeypair]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (selectedSensor) {
      const newSubtotal =
        amount * duration * dutyCycle * selectedSensor.costPerMinute;
      setSubtotal(newSubtotal);
    }
  }, [amount, duration, dutyCycle, selectedSensor]);

  const fetchSensors = async () => {
    try {
      const response = await fetch("http://136.186.108.87:7001/sparql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            PREFIX ssm: <ssm://>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX sosa: <http://www.w3.org/ns/sosa/>
            PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            SELECT ?sensor_name ?sensor_hash ?broker_name ?broker_hash ?broker_endpoint ?lat ?long ?measures ?sensor_cpm ?sensor_cpkb WHERE { 
              ?sensor_tx ssm:Defines ?sensor_name.
              ?sensor_tx rdf:type "ssm://SensorRegistration".
              ?sensor_tx ssm:HasHash ?sensor_hash.
              ?sensor_tx ssm:UsesBroker ?broker_name.
              ?sensor_tx ssm:CostsPerMinute ?sensor_cpm.
              ?sensor_tx ssm:CostsPerKB ?sensor_cpkb.
              FILTER NOT EXISTS { ?x ssm:Supercedes ?sensor_tx }.
              
              ?broker_tx ssm:Defines ?broker_name.
              ?broker_tx rdf:type "ssm://BrokerRegistration".
              ?broker_tx ssm:HasHash ?broker_hash.
              ?broker_tx ssm:HasEndpoint ?broker_endpoint.
              FILTER NOT EXISTS { ?x ssm:Supercedes ?broker_tx }.
              
              ?sensor_tx sosa:observes ?observes.
              ?sensor_tx sosa:hasFeatureOfInterest ?location.
              ?observes rdfs:label ?measures.
              ?location geo:lat ?lat.
              ?location geo:long ?long.
            }`,
          walletKeypair: walletKeypair,
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch sensors:", response.statusText);
        setNotification("Failed to load sensors.");
        setTimeout(() => setNotification(""), 5000);
        return;
      }

      const data = await response.json();

      if (data.result === false) {
        console.error("API Error:", data.reason);
        setNotification(`API Error: ${data.reason}`);
        setTimeout(() => setNotification(""), 5000);
        return;
      }

      // Check if 'data.results' exists and is an array
      if (!data.headers || !Array.isArray(data.headers)) {
        console.error("Invalid API response:", data);
        setNotification(
          "Failed to load sensors due to invalid API response format."
        );
        setTimeout(() => setNotification(""), 5000);
        return;
      }

      // Process 'data.values' array instead of 'data.results.bindings'
      const parsedData = data.values.map((item) => ({
        sensor_name: item[0],
        sensor_hash: item[1],
        broker_name: item[2],
        broker_hash: item[3],
        broker_endpoint: item[4],
        lat: parseFloat(item[5]),
        long: parseFloat(item[6]),
        measures: item[7],
        sensor_cpm: parseFloat(item[8]),
        sensor_cpkb: parseFloat(item[9]),
        id: item[1], // Using sensor_hash as ID
      }));

      setSensors(parsedData);
      setFilteredSensors(parsedData);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      setNotification("Error loading sensors.");
      setTimeout(() => setNotification(""), 5000);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const handleApplyFilter = () => {
    const filtered = sensors.filter(
      (sensor) =>
        (filter.name === "" ||
          sensor.sensor_name.toLowerCase().includes(filter.name.toLowerCase())) &&
        (filter.type === "" ||
          sensor.measures.toLowerCase().includes(filter.type.toLowerCase())) &&
        (filter.location === "" ||
          sensor.broker_name.toLowerCase().includes(filter.location.toLowerCase()))
    );
    setFilteredSensors(filtered);
  };

  const handleReset = () => {
    setFilter({ name: "", type: "", location: "", measurement: "" });
    setFilteredSensors(sensors);
  };

  const openModal = (sensor) => {
    setSelectedSensor(sensor);
    setAmount(1);
    setDuration(1);
    setDutyCycle(1);
    setShowModal(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedSensor) return;

    const cartItem = {
      ...selectedSensor,
      amount,
      duration,
      dutyCycle,
      subtotal: subtotal,
    };
    setCart([...cart, cartItem]);
    setNotification(`${selectedSensor.sensor_name} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
    setShowModal(false);
  };

  const removeSensor = useCallback((id) => {
    setCart(cart.filter((item) => item.id !== id));
  }, []);

  const Cart = () => {
    navigate("/cart");
  };

  const handleProviderLogin = () => {
    navigate("/provider");
  };
  
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const countAppliedFilters = () =>
    Object.values(filter).filter(Boolean).length;

  const isSensorInCart = (sensorId) => {
    return cart.some((item) => item.id === sensorId);
  };

  const toggleFilterSection = () => {
    setIsFilterSectionOpen(!isFilterSectionOpen);
  };

  return (
    <div className={styles.app}>
      {notification && <div className={styles.notification}>{notification}</div>}
      <header className={styles.header}>
        <a href="/client" className={styles["logo-link"]}>
          <h1 className={styles.logo}>
            <span className="logo-part blue">Sen</span>
            <span className="logo-part orange">Sha</span>
            <span className="logo-part blue">Mart</span>
          </h1>
        </a>
        <nav className={styles.nav}>
          <a href="search-sensors">Search Sensors</a>
          <a href="purchasehistory">Purchase History</a>
          <a href="#blog">Blog</a>
          <a href="#help">Help</a>
        </nav>
        <div className={styles["cart-profile"]}>
          <div className={styles["cart-container"]}>
            <div onClick={Cart} className={styles["cart-icon-container"]}>
              <img
                src="/f7_cart.png"
                alt="Cart Icon"
                className={styles["cart-icon"]}
              />
              <span className={styles["cart-count"]}>{cart.length}</span>
            </div>
          </div>
          <div className={styles.separator}>|</div>
          <div className={styles["profile-container"]} onClick={toggleDropdown}>
            <img
              src="/profile.png"
              alt="Profile Icon"
              className={styles["profile-icon"]}
            />
            <span className={styles["dropdown-arrow"]}>&#x25BE;</span>
            {dropdownVisible && (
              <div className={styles["dropdown-menu"]}>
                <button>Check Profile</button>
                <button onClick={handleProviderLogin}>
                  Log in as a Provider
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className={styles.container}>

        <div>
          <div className={styles["filter-section"]}>
            <div className={styles["filter-header"]}>
              <h2>Select IoT Sensors</h2>
            </div>
            {isFilterSectionOpen && (
              <>
                <div className={styles["filter-row"]}>
                  <input
                    type="text"
                    className={styles["filter-input"]}
                    placeholder="Sensor Name"
                    value={filter.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles["filter-input"]}
                    placeholder="Sensor Type"
                    value={filter.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles["filter-input"]}
                    placeholder="Location"
                    value={filter.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                  />
                </div>
                <div className={styles["filter-actions"]}>
                  <button className={styles["reset-button"]} onClick={handleReset}>
                    Reset
                  </button>
                  <button
                    className={styles["apply-button"]}
                    onClick={handleApplyFilter}
                  >
                    Filter
                  </button>
                </div>
                <div className={styles["filter-count"]}>
                  {countAppliedFilters()} filters applied.
                </div>
              </>
            )}
          </div>
          <table className={styles["sensor-table"]}>
            <thead>
              <tr>
                <th>Sensor Name</th>
                <th>Sensor Hash</th>
                <th>Broker Name</th>
                <th>Broker Hash</th>
                <th>Broker Endpoint</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Measures</th>
                <th>Sensor CPM</th>
                <th>Sensor Cpkb</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map((sensor, index) => (
                <tr key={index}>
                  <td>{sensor.sensor_name}</td>
                  <td>{sensor.sensor_hash}</td>
                  <td>{sensor.broker_name}</td>
                  <td>{sensor.broker_hash}</td>
                  <td>{sensor.broker_endpoint}</td>
                  <td>{sensor.lat}</td>
                  <td>{sensor.long}</td>
                  <td>{sensor.measures}</td>
                  <td>{sensor.sensor_cpm}</td>
                  <td>{sensor.sensor_cpkb}</td>
                  <td>
                    {isSensorInCart(sensor.id) ? (
                      <button className={styles["added-to-cart-button"]} disabled>
                        Added to Cart
                      </button>
                    ) : (
                      <button
                        className={styles["add-to-cart-button"]}
                        onClick={() => openModal(sensor)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && selectedSensor && (
            <div className={styles["modal-overlay"]}>
              <div className={styles["modal-content"]}>
                <button
                  className={styles["close-button"]}
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h5 className={styles["modal-title"]}>Add to Cart</h5>
                <div className={styles["modal-row"]}>
                  <label>Sensor Name:</label>
                  <span>{selectedSensor.sensor_name}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Sensor Hash:</label>
                  <span>{selectedSensor.sensor_hash}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Broker Name:</label>
                  <span>{selectedSensor.broker_name}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Broker Endpoint:</label>
                  <span>{selectedSensor.broker_endpoint}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Latitude:</label>
                  <span>{selectedSensor.lat}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Longitude:</label>
                  <span>{selectedSensor.long}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Measures:</label>
                  <span>{selectedSensor.measures}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Cost Per Minute:</label>
                  <span>{selectedSensor.sensor_cpm}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Cost Per KByte:</label>
                  <span>{selectedSensor.sensor_cpkb}</span>
                </div>
                <div className={styles["modal-row"]}>
                  <label>Amount*</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                  />
                </div>
                <div className={styles["modal-row"]}>
                  <label>Duration (Minutes)*</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                  />
                </div>
                <div className={styles["modal-row"]}>
                  <label>Duty Cycle*</label>
                  <input
                    type="number"
                    value={dutyCycle}
                    onChange={(e) => setDutyCycle(parseInt(e.target.value))}
                  />
                </div>
                <div className={styles["modal-subtotal"]}>
                  <b>Subtotal: {subtotal.toFixed(2)}</b>
                </div>
                <div className={styles["modal-actions"]}>
                  <button
                    className={styles["cancel-button"]}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles["confirm-button"]}
                    onClick={handleConfirmAdd}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default BuyPage;
