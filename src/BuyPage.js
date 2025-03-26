// IoT Sensor Marketplace - Updated with Cart Notification, Accurate Filter Count, and Total Cart Price
// Updated filter section appearance and functionality - filter applies only after button click

import React, { useState } from 'react';
import './BuyPage.css';


// Sample sensors data array
const sensors = [
  { id: 1211111, name: 'Temperature Alpha', type: 'Room Temperature Sensor', location: 'Australia', date: 'Apr-05-2024' },
  { id: 1212222, name: 'Humidity Beta', type: 'Humidity Sensor', location: 'USA', date: 'Apr-06-2024' },
  { id: 1213333, name: 'Pressure Gamma', type: 'Pressure Sensor', location: 'Germany', date: 'Apr-07-2024' },
  { id: 1214444, name: 'Light Delta', type: 'Light Sensor', location: 'Japan', date: 'Apr-08-2024' },
  { id: 1215555, name: 'Motion Epsilon', type: 'Motion Sensor', location: 'Canada', date: 'Apr-09-2024' },
  { id: 1216666, name: 'CO2 Zeta', type: 'Gas Sensor', location: 'UK', date: 'Apr-10-2024' },
  { id: 1217777, name: 'Temperature Eta', type: 'Room Temperature Sensor', location: 'Singapore', date: 'Apr-11-2024' },
  { id: 1218888, name: 'Humidity Theta', type: 'Humidity Sensor', location: 'India', date: 'Apr-12-2024' },
  { id: 1219999, name: 'Pressure Iota', type: 'Pressure Sensor', location: 'Brazil', date: 'Apr-13-2024' },
  { id: 1220000, name: 'Light Kappa', type: 'Light Sensor', location: 'South Africa', date: 'Apr-14-2024' }
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

  const COST_PER_MINUTE = 5;
  const COST_PER_KBYTE = 3;

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

  return (
    <div className="container py-5">
      {/* Notification */}
      {notification && <div className="alert alert-success">{notification}</div>}

      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <span style={{ color: '#253858', fontWeight: 'bold' }}>Sen</span>
          <span style={{ color: '#E17247', fontWeight: 'bold' }}>Sha</span>
          <span style={{ color: '#253858', fontWeight: 'bold' }}>Mart</span>
        </h3>
        <nav className="d-flex gap-4 text-primary fw-semibold">
          <a href="search-sensors">Search Sensors</a>
          <a href="#s">Purchase History</a>
          <a href="#s">Blog</a>
          <a href="#s">Help</a>
        </nav>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-pill px-3 py-1 text-white" style={{ backgroundColor: '#253858', cursor: 'pointer' }} onClick={() => setShowCartModal(true)}>
            {cart.length} 🛒 (${cartTotal.toFixed(2)})
          </div>
          <div className="border rounded-circle p-2">👤</div>
        </div>
      </header>

      {/* Updated Filter Section */}
      <div className="bg-light p-4 rounded mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input type="text" className="form-control rounded" placeholder="Sensor Name" value={filter.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control rounded" placeholder="Sensor Type" value={filter.type} onChange={(e) => handleFilterChange('type', e.target.value)} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control rounded" placeholder="Location" value={filter.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control rounded" placeholder="Measurement" value={filter.measurement} onChange={(e) => handleFilterChange('measurement', e.target.value)} />
          </div>
          <div className="col-md-12 d-flex align-items-center justify-content-end gap-3">
            <button className="btn text-secondary" onClick={handleReset}>Reset</button>
            <button className="btn btn-warning text-white rounded" onClick={handleApplyFilter}>Filter</button>
          </div>
        </div>
        <div className="mt-3">{countAppliedFilters()} filters applied.</div>
      </div>

      {/* Sensor List */}
      <table className="table table-hover align-middle">
        <thead className="table-light">
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
            <tr key={index} className="bg-white rounded-3">
              <td className="text-danger fw-semibold">{sensor.name}</td>
              <td>{sensor.id}</td>
              <td>{sensor.type}</td>
              <td>{sensor.location}</td>
              <td>{sensor.date}</td>
              <td>
                <span className="me-3 text-primary">🤍</span>
                <span className="text-warning" style={{ cursor: 'pointer' }} onClick={() => openModal(sensor)}>🛒</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white p-4 rounded shadow" style={{ width: '600px' }}>
            <div className="d-flex justify-content-between mb-3">
              <h5 style={{ color: '#253858' }}>Cart Details</h5>
              <button className="btn-close" onClick={() => setShowCartModal(false)}></button>
            </div>
            {cart.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="border rounded p-2 mb-2">
                  <p><b>Sensor Name:</b> {item.name}</p>
                  <p><b>Sensor ID:</b> {item.id}</p>
                  <p><b>Sensor Type:</b> {item.type}</p>
                  <p><b>Location:</b> {item.location}</p>
                  <p><b>Last Updated:</b> {item.date}</p>
                  <p><b>Subtotal:</b> {item.subtotal.toFixed(2)}$</p>
                </div>
              ))
            )}
            <div className="fw-bold">Total: {cartTotal.toFixed(2)}$</div>
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {showModal && selectedSensor && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white p-4 rounded shadow" style={{ width: '600px' }}>
            <h5 className="mb-3">Add to Cart</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Amount*</label>
                <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
              </div>
              <div className="col-md-6">
                <label>Duration (Minutes)*</label>
                <input type="number" className="form-control" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
              </div>
              <div className="col-md-6">
                <label>Duty Cycle*</label>
                <input type="number" className="form-control" value={dutyCycle} onChange={(e) => setDutyCycle(parseInt(e.target.value))} />
              </div>
              <div className="col-md-6">
                <p><b>Subtotal: {subtotal.toFixed(2)}$</b></p>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-warning text-white" onClick={handleConfirmAdd}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default BuyPage;