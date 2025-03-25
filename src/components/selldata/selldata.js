import React, { useState } from "react";
import "./home.css"; // Import custom CSS for styling
import logo from "../../assets/images/logo.png"; // Import logo image
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
  const [sensorName, setSensorName] = useState("");
  const [providerID, setProviderID] = useState("");
  const [costPerMinute, setCostPerMinute] = useState("");
  const [costPerKByte, setCostPerKByte] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [extraMetadata, setExtraMetadata] = useState("");
  const [sensorData, setSensorData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Track which sensor is being edited

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSensor = {
      sensorName,
      providerID,
      sensorID:
        editingIndex !== null
          ? sensorData[editingIndex].sensorID
          : Math.floor(Math.random() * 1000000),
      costPerMinute,
      costPerKByte,
      unit,
      location,
      extraMetadata,
    };

    if (editingIndex !== null) {
      // Update existing sensor data
      const updatedData = [...sensorData];
      updatedData[editingIndex] = newSensor;
      setSensorData(updatedData);
      setEditingIndex(null);
    } else {
      // Add new sensor
      setSensorData([...sensorData, newSensor]);
    }

    // Clear input fields after submission
    resetForm();
  };

  const handleEdit = (index) => {
    const sensor = sensorData[index];
    setSensorName(sensor.sensorName);
    setProviderID(sensor.providerID);
    setCostPerMinute(sensor.costPerMinute);
    setCostPerKByte(sensor.costPerKByte);
    setUnit(sensor.unit);
    setLocation(sensor.location);
    setExtraMetadata(sensor.extraMetadata);
    setEditingIndex(index);
  };

  
  const handleDelete = (index) => {
    const updatedData = sensorData.filter((_, i) => i !== index);
    setSensorData(updatedData);
    if (editingIndex === index) resetForm(); // If deleting the sensor being edited, reset form
  };

  const resetForm = () => {
    setSensorName("");
    setProviderID("");
    setCostPerMinute("");
    setCostPerKByte("");
    setUnit("");
    setLocation("");
    setExtraMetadata("");
    setEditingIndex(null);
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="navbar-links">
          <ul>
            <li>
              <a href="#sell-data" onClick={() => navigate("/")}>
                Sell Data
              </a>
            </li>
            <li>
              <a href="#my-marketplace" onClick={() => navigate("/market")}>
                My Marketplace
              </a>
            </li>
            <li>
              <a href="#blog" onClick={() => navigate("/blog")}>
                Blog
              </a>
            </li>
            <li>
              <a href="#help" onClick={() => navigate("/help")}>
                Help
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-icons">
          <i className="fas fa-bell icon"></i>
          <i className="fas fa-user-circle icon"></i>
        </div>
      </nav>

      <section>
        <h1>
          {editingIndex !== null ? "Edit Sensor" : "Register New IoT Sensors"}
        </h1>
        <p>
          Based on your profile, we assume you are familiar with RDF Triples.{" "}
          <a href="#">Click here to change preference.</a>
        </p>

        {/* Main Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Sensor Name*"
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Username (Provider ID)*"
                value={providerID}
                onChange={(e) => setProviderID(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Cost per Minute (SensorCoin)*"
                value={costPerMinute}
                onChange={(e) => setCostPerMinute(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Cost per KByte (SensorCoin)*"
                value={costPerKByte}
                onChange={(e) => setCostPerKByte(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Unit of Measurement*"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Location (Google Maps Link)*"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <button className="primary-btn" type="submit">
              {editingIndex !== null ? "Update Sensor" : "Add Sensor"}
            </button>
          </form>
        </div>
        {/* Registered Sensors List */}
        <div className="sensor-list">
          {sensorData.map((sensor, index) => (
            <div className="sensor-item" key={index}>
              <p>
                <strong>Sensor Name:</strong> {sensor.sensorName}
              </p>
              <p>
                <strong>Location:</strong> {sensor.location}
              </p>
              <p>
                <strong>Sensor ID:</strong> {sensor.sensorID}
              </p>

              <p>
                <strong>Cost per Minute:</strong> {sensor.costPerMinute}{" "}
                SensorCoin
              </p>
              <p>
                <strong>Unit:</strong> {sensor.unit}
              </p>
              <p>
                <strong>Cost per KByte:</strong> {sensor.costPerKByte}{" "}
                SensorCoin
              </p>

              <div class="button-group">
                <button className="edit-btn" onClick={() => handleEdit(index)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="register-btn">Register IoT Sensor(s)</button>
      </section>
    </div>
  );
};

export default HomePage;
