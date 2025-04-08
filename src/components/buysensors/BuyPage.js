// IoT Sensor Marketplace - Styled without Bootstrap
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BuyPage.module.css';

const sensors = [
  { id: 1211111, name: 'Temperature Alpha', type: 'Room Temperature Sensor', location: 'Australia', date: 'Apr-05-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1212222, name: 'Humidity Beta', type: 'Humidity Sensor', location: 'USA', date: 'Apr-06-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1213333, name: 'Pressure Gamma', type: 'Pressure Sensor', location: 'Germany', date: 'Apr-07-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1214444, name: 'Light Delta', type: 'Light Sensor', location: 'Japan', date: 'Apr-08-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1215555, name: 'Motion Epsilon', type: 'Motion Sensor', location: 'Canada', date: 'Apr-09-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1216666, name: 'CO2 Zeta', type: 'Gas Sensor', location: 'UK', date: 'Apr-10-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1217777, name: 'Temperature Eta', type: 'Room Temperature Sensor', location: 'Singapore', date: 'Apr-11-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1218888, name: 'Humidity Theta', type: 'Humidity Sensor', location: 'India', date: 'Apr-12-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1219999, name: 'Pressure Iota', type: 'Pressure Sensor', location: 'Brazil', date: 'Apr-13-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" },
  { id: 1220000, name: 'Light Kappa', type: 'Light Sensor', location: 'South Africa', date: 'Apr-14-2024', price: 284.35, amount: 12482, duration: 600, dutyCycle: 21, invoiceNumber: "423463455" }
];

function BuyPage() {
  const [filter, setFilter] = useState({ name: '', type: '', location: '', measurement: '' });
  const [filteredSensors, setFilteredSensors] = useState(sensors);
  const [cart, setCart] = useState([]);

  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [notification, setNotification] = useState('');

  const [amount, setAmount] = useState(1);
  const [duration, setDuration] = useState(1);
  const [dutyCycle, setDutyCycle] = useState(1);

  const navigate = useNavigate();
  const Cart = () => {
    navigate("/cart");
  };

  const handleProviderLogin = () => {
    navigate("/provider");
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const COST_PER_MINUTE = 5;

  const subtotal = amount * duration * dutyCycle * COST_PER_MINUTE;

  const countAppliedFilters = () => Object.values(filter).filter(Boolean).length;
  const cartTotal = cart.reduce((total, item) => total + (item.subtotal || 0), 0);

  // Handle input changes for the filter (but do not filter immediately)
  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  // Apply filters only when the "Filter" button is clicked
  const handleApplyFilter = () => {
    const filtered = sensors.filter(sensor =>
      (filter.name === '' || sensor.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (filter.type === '' || sensor.type.toLowerCase().includes(filter.type.toLowerCase())) &&
      (filter.location === '' || sensor.location.toLowerCase().includes(filter.location.toLowerCase()))
    );
    setFilteredSensors(filtered);
  };

  const handleReset = () => {
    setFilter({ name: '', type: '', location: '', measurement: '' });
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
    const cartItem = { ...selectedSensor, amount, duration, dutyCycle, subtotal: subtotal };
    setCart([...cart, cartItem]);
    setNotification(`${selectedSensor.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
    setShowModal(false);
  };

  const removeSensor = useCallback((id) => {
    setCart(cart.filter((item) => item.id !== id));
  }, []);

  return (
    <div className={styles.app}>
      {/* Notification */}
      {notification && <div className={styles.notification}>{notification}</div>}

      {/* Header */}
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
          {/* Cart Section */}
          <div className={styles["cart-container"]}>
            <div onClick={Cart} className={styles["cart-icon-container"]}>
              <img src="/f7_cart.png" alt="Cart Icon" className={styles["cart-icon"]} />
              <span className={styles["cart-count"]}>{cart.length}</span>
            </div>
          </div>

          {/* Separator */}
          <div className={styles.separator}>|</div>

          {/* Profile Section */}
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

      <main className={styles.container}>
        {/* Filter Section */}
        <div className={styles["filter-section"]}>
          <div className={styles["filter-row"]}>
            <input type="text" className={styles["filter-input"]} placeholder="Sensor Name" value={filter.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
            <input type="text" className={styles["filter-input"]} placeholder="Sensor Type" value={filter.type} onChange={(e) => handleFilterChange('type', e.target.value)} />
            <input type="text" className={styles["filter-input"]} placeholder="Location" value={filter.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
          </div>
          <div className={styles["filter-actions"]}>
            <button className={styles["reset-button"]} onClick={handleReset}>Reset</button>
            <button className={styles["apply-button"]} onClick={handleApplyFilter}>Filter</button>
          </div>
          <div className={styles["filter-count"]}>{countAppliedFilters()} filters applied.</div>
        </div>

        {/* Sensor List */}
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
                  <button className={styles["add-to-cart-button"]} onClick={() => openModal(sensor)}>
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Cart Modal */}
        {showCartModal && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
              <div className={styles["modal-header"]}>
                <h5>Cart Details</h5>
                <button className={styles["close-button"]} onClick={() => setShowCartModal(false)}>
                  &times;
                </button>
              </div>
              <div className={styles["modal-body"]}>
                {cart.length === 0 ? (
                  <p>No items in cart.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className={styles["cart-item"]}>
                      <p><b>Sensor Name:</b> {item.name}</p>
                      <p><b>Sensor ID:</b> {item.id}</p>
                      <p><b>Sensor Type:</b> {item.type}</p>
                      <p><b>Location:</b> {item.location}</p>
                      <p><b>Last Updated:</b> {item.date}</p>
                      <p><b>Subtotal:</b> {item.subtotal.toFixed(2)}senshacoins</p>
                      <button onClick={() => removeSensor(item.id)} className={styles["remove-button"]}>⨉</button>
                    </div>
                  ))
                )}
              </div>
              <div className={styles["modal-footer"]}>
                <div className={styles["cart-total"]}>Total: {cartTotal.toFixed(2)}senshacoins</div>
              </div>
            </div>
          </div>
        )}

        {/* Add to Cart Modal */}
        {showModal && selectedSensor && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
              <h5 className={styles["modal-title"]}>Add to Cart</h5>
              <div className={styles["modal-row"]}>
                <label>Amount*</label>
                <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
              </div>
              <div className={styles["modal-row"]}>
                <label>Duration (Minutes)*</label>
                <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
              </div>
              <div className={styles["modal-row"]}>
                <label>Duty Cycle*</label>
                <input type="number" value={dutyCycle} onChange={(e) => setDutyCycle(parseInt(e.target.value))} />
              </div>
              <div className={styles["modal-subtotal"]}><b>Subtotal: {subtotal.toFixed(2)}senshacoins</b></div>
              <div className={styles["modal-actions"]}>
                <button className={styles["cancel-button"]} onClick={() => setShowModal(false)}>Cancel</button>
                <button className={styles["confirm-button"]} onClick={handleConfirmAdd}>Add to Cart</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BuyPage;
