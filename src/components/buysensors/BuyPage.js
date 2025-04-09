import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./BuyPage.module.css";
import Papa from "papaparse";
import sensorsCSV from "./sensors.csv";

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

  useEffect(() => {
    fetchSensors();
  }, []);

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
    Papa.parse(sensorsCSV, {
      header: true,
      download: true,
      complete: (results) => {
        // Convert numeric fields to numbers
        const parsedData = results.data.map((sensor) => ({
          ...sensor,
          id: sensor.id ? parseInt(sensor.id, 10) : 0, 
          price: sensor.price ? parseFloat(sensor.price) : 0.0, 
          amount: sensor.amount ? parseInt(sensor.amount, 10) : 0,
          duration: sensor.duration ? parseInt(sensor.duration, 10) : 0, 
          dutyCycle: sensor.dutyCycle ? parseInt(sensor.dutyCycle, 10) : 0, 
          costPerMinute: sensor.costPerMinute
            ? parseInt(sensor.costPerMinute, 10)
            : 0,
          costPerKByte: sensor.costPerKByte
            ? parseInt(sensor.costPerKByte, 10)
            : 0,
        }));
        setSensors(parsedData);
        setFilteredSensors(parsedData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error.message);
        setNotification("Failed to load sensors.");
        setTimeout(() => setNotification(""), 5000);
      },
    });
  };

  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const handleApplyFilter = () => {
    const filtered = sensors.filter(
      (sensor) =>
        (filter.name === "" ||
          sensor.name.toLowerCase().includes(filter.name.toLowerCase())) &&
        (filter.type === "" ||
          sensor.type.toLowerCase().includes(filter.type.toLowerCase())) &&
        (filter.location === "" ||
          sensor.location.toLowerCase().includes(filter.location.toLowerCase()))
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
    setNotification(`${selectedSensor.name} added to cart!`);
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
              <th>Sensor ID</th>
              <th>Sensor Type</th>
              <th>Location</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSensors.map((sensor, index) => (
              <tr key={index}>
                <td className={styles["sensor-name"]}>{sensor.name}</td>
                <td>{sensor.id}</td>
                <td>{sensor.type}</td>
                <td>{sensor.location}</td>
                <td>{sensor.date}</td>
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
                <span>{selectedSensor.name}</span>
              </div>
              <div className={styles["modal-row"]}>
                <label>Sensor ID:</label>
                <span>{selectedSensor.id}</span>
              </div>
              <div className={styles["modal-row"]}>
                <label>Sensor Type:</label>
                <span>{selectedSensor.type}</span>
              </div>
              <div className={styles["modal-row"]}>
                <label>Location:</label>
                <span>{selectedSensor.location}</span>
              </div>
              <div className={styles["modal-row"]}>
                <label>Last Updated:</label>
                <span>{selectedSensor.date}</span>
              </div>
              <div className={styles["modal-row"]}>
                <label>Cost Per Minute:</label>
                <span>{selectedSensor.costPerMinute} Sensha Coin</span>
              </div>
              <div className={styles["modal-row"]}>
                <label>Cost Per KByte:</label>
                <span>{selectedSensor.costPerKByte} USD</span>
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
                <b>Subtotal: {subtotal.toFixed(2)}senshacoins</b>
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
      </main>
    </div>
  );
}

export default BuyPage;
