// BuyPage.js
import React, { useState } from 'react';
import './BuyPage.css';

const BuyPage = () => {
  const [filter, setFilter] = useState({ name: '', type: '', location: '' });
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [amount, setAmount] = useState(1);
  const [duration, setDuration] = useState(1);
  const [dutyCycle, setDutyCycle] = useState(1);

  const COST_PER_MINUTE = 5;

  const items = [
    { id: 1, name: 'Temperature Alpha', type: 'Room Temperature Sensor', location: 'Australia' },
    { id: 2, name: 'Humidity Beta', type: 'Humidity Sensor', location: 'USA' },
    { id: 3, name: 'Motion Detector', type: 'Motion Sensor', location: 'Germany' },
  ];

  const handleFilterChange = (field, value) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const filtered = items.filter(item =>
      (filter.name === '' || item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (filter.type === '' || item.type.toLowerCase().includes(filter.type.toLowerCase())) &&
      (filter.location === '' || item.location.toLowerCase().includes(filter.location.toLowerCase()))
    );
    setFilteredItems(filtered);
  };

  const resetFilters = () => {
    setFilter({ name: '', type: '', location: '' });
    setFilteredItems([]);
  };

  const openAddModal = (sensor) => {
    setSelectedSensor(sensor);
    setAmount(1);
    setDuration(1);
    setDutyCycle(1);
    setShowAddModal(true);
  };

  const confirmAddToCart = () => {
    const subtotal = amount * duration * dutyCycle * COST_PER_MINUTE;
    const newItem = { ...selectedSensor, amount, duration, dutyCycle, subtotal };
    setCart([...cart, newItem]);
    setNotification(`${selectedSensor.name} added to cart!`);
    setShowAddModal(false);
    setTimeout(() => setNotification(''), 3000);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.subtotal || 0), 0);
  const displayItems = filteredItems.length > 0 ? filteredItems : items;

  return (
    <div className="buy-page">
      <header className="page-header">
        <h3>
          <span className="logo-primary">Sen</span>
          <span className="logo-accent">Sha</span>
          <span className="logo-primary">Mart</span>
        </h3>
        <nav>
          <a href="#">Search Sensors</a>
          <a href="#">Purchase History</a>
          <a href="#">Blog</a>
          <a href="#">Help</a>
        </nav>
        <div className="cart-icon" onClick={() => setShowCartModal(true)}>
          🛒 {cart.length} items ({cartTotal.toFixed(2)} SenshaCoin)
        </div>
      </header>

      {notification && <div className="notification">{notification}</div>}

      <div className="filter-section">
        <input type="text" placeholder="Sensor Name" value={filter.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
        <input type="text" placeholder="Sensor Type" value={filter.type} onChange={(e) => handleFilterChange('type', e.target.value)} />
        <input type="text" placeholder="Location" value={filter.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
        <button onClick={applyFilters}>Apply Filter</button>
        <button onClick={resetFilters}>Reset</button>
      </div>

      <table className="sensor-table">
        <thead>
          <tr>
            <th>Sensor Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((sensor) => (
            <tr key={sensor.id}>
              <td>{sensor.name}</td>
              <td>{sensor.type}</td>
              <td>{sensor.location}</td>
              <td><button onClick={() => openAddModal(sensor)}>Add to Cart</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cart</h3>
            {cart.length === 0 ? <p>No items in cart.</p> : (
              cart.map((item, i) => (
                <div key={i} className="cart-item">
                  <p><b>{item.name}</b></p>
                  <p>Amount: {item.amount}</p>
                  <p>Duration: {item.duration} min</p>
                  <p>Duty Cycle: {item.dutyCycle}</p>
                  <p>Subtotal: {item.subtotal.toFixed(2)} SenshaCoin</p>
                </div>
              ))
            )}
            <p className="total">Total: {cartTotal.toFixed(2)} SenshaCoin</p>
          </div>
        </div>
      )}

      {showAddModal && selectedSensor && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add {selectedSensor.name} to Cart</h3>
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
            <label>Duration (min)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
            <label>Duty Cycle</label>
            <input type="number" value={dutyCycle} onChange={(e) => setDutyCycle(parseInt(e.target.value))} />
            <p>Subtotal: {(amount * duration * dutyCycle * COST_PER_MINUTE).toFixed(2)} SenshaCoin</p>
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={confirmAddToCart}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2025 SenShaMart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BuyPage;
