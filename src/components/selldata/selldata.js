"use client"

import { useState, useCallback } from "react";
import { Info, Pencil, Trash2, Bell, User, ChevronDown } from "lucide-react";
import styles from "./selldata.module.css";

// Test environment API base (no miner, UI at /wallet.html)
const API_BASE = "http://136.186.108.87:7001";

export default function SellDataPage() {
  // Form state
  const [formData, setFormData] = useState({
    sensorName: "",
    providerID: "",
    costPerMinute: "",
    costPerKByte: "",
    unit: "",
    location: "",
    extraMetadata: "",
    broker: "",
  });

  
  // Sensors list state
  const [sensors, setSensors] = useState([
    {
      sensorName: "Sample Sensor Name",
      providerID: "provider123",
      sensorID: "1216548",
      costPerMinute: "5",
      costPerKByte: "3",
      unit: "Room Temperature Sensor",
      location: "Australia",
    },
    {
      sensorName: "Sample Sensor Name",
      providerID: "provider123",
      sensorID: "1216549",
      costPerMinute: "5",
      costPerKByte: "3",
      unit: "Room Temperature Sensor",
      location: "Australia",
    },
  ]);

  const [walletKeypair] = useState(
        "MHQCAQEEIKaHMfh7znw+YmIVPePU2f80mUpi6BKiUYNaAaTN02zJoAcGBSuBBAAKoUQDQgAEWHLcJyFezAjJkaM7Gy/khGCZUcBA0MViZUd3JEA7kFilrWWSPhT7rhfd5qKHAp+3WrEWQXjo0ewJFxIzCHe2fA=="
    );

 const registerSensor = useCallback(async () => {
   if (!walletKeypair) return;

   alert(`Registering ${sensors.length} sensors`);
   for (let i = 0; i < sensors.length; i++) {
     const sensor = sensors[i];
     if (!sensor?.sensorName || sensor.registered) continue;

     try {
       const payload = {
         keyPair: walletKeypair,
         sensorName: sensor.sensorName,
         costPerMinute: Number(sensor.costPerMinute),
         costPerKB: Number(sensor.costPerKByte),
         integrationBroker: sensor.broker || null,
         interval: null,
         rewardAmount: 0,
         extraNodeMetadata: [],
         extraLiteralMetadata: [],
       };

       if (sensor.extraMetadata) {
         const meta = JSON.parse(sensor.extraMetadata);
         if (Array.isArray(meta.node)) payload.extraNodeMetadata = meta.node;
         if (Array.isArray(meta.literal))
           payload.extraLiteralMetadata = meta.literal;
       }

       const res = await fetch(`${API_BASE}/SensorRegistration/Register`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       });

       const result = await res.json();
       if (result.result) {
         alert("Registration Successful", result);
         setSensors((prev) => {
           const copy = [...prev];
           copy[i] = {
             ...copy[i],
             registered: true,
             txHash: result.tx.transactionHash,
             brokerIp: result.brokerIp,
           };
           return copy;
         });
       } else {
         alert("Registration failed", result);
         console.error("Registration failed", result);
       }
     } catch (err) {
       console.error("Error registering sensor", err);
     }
   }

   alert("All sensors attempted on testnet (miner off)");
 }, [walletKeypair, sensors]);

  // UI state
  const [editingIndex, setEditingIndex] = useState(null);
  // Update the preference level state to start at level 1 (RDF Triples)
  const [preferenceLevel, setPreferenceLevel] = useState(1);

  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newSensor = {
      ...formData,
      sensorID:
        editingIndex !== null
          ? sensors[editingIndex].sensorID
          : Math.floor(Math.random() * 1000000).toString(),
    };

    if (editingIndex !== null) {
      // Update existing sensor
      const updatedSensors = [...sensors];
      updatedSensors[editingIndex] = newSensor;
      setSensors(updatedSensors);
      setEditingIndex(null);
    } else {
      // Add new sensor
      setSensors([...sensors, newSensor]);
    }

    // Reset form
    resetForm();
  };

  // Edit a sensor
  const handleEdit = (index) => {
    const sensor = sensors[index];
    setFormData({
      sensorName: sensor.sensorName,
      providerID: sensor.providerID,
      costPerMinute: sensor.costPerMinute,
      costPerKByte: sensor.costPerKByte,
      unit: sensor.unit,
      location: sensor.location,
      extraMetadata: sensor.extraMetadata || "",
      broker: sensor.broker || "",
    });
    setEditingIndex(index);
  };

  // Delete a sensor
  const handleDelete = (index) => {
    const updatedSensors = sensors.filter((_, i) => i !== index);
    setSensors(updatedSensors);
    if (editingIndex === index) {
      resetForm();
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      sensorName: "",
      providerID: "",
      costPerMinute: "",
      costPerKByte: "",
      unit: "",
      location: "",
      extraMetadata: "",
      broker: "",
    });
    setEditingIndex(null);
  };

  // Toggle user preference level
  const handlePreferenceChange = (e) => {
    e.preventDefault();
    setPreferenceLevel((prev) => (prev < 2 ? prev + 1 : 0));
  };

  // Preference text based on level
  const preferenceText = [
    "Based on your profile, we assume you have no prior experience in coding.",
    "Based on your profile, we assume you are familiar with RDF Triples.",
    "Based on your profile, we assume you are familiar with RDF Triples and MQTT Broker.",
  ];

  // // // Register all sensors
  // const handleRegisterAll = () => {
  //   alert(`Registering ${sensors.length} sensors`);
  //   // Implementation would connect to backend API
  // };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <a href="/provider" className="logo-link">
          <h1 className="logo">
            <span className="logo-part blue">Sen</span>
            <span className="logo-part orange">Sha</span>
            <span className="logo-part blue">Mart</span>
          </h1>
        </a>
        <nav className="nav">
          <a href="sell-data" className={styles.active}>
            Sell Data
          </a>
          <a href="my-marketplace">My Marketplace</a>
          <a href="blog">Blog</a>
          <a href="help">Help</a>
        </nav>

        <div className={styles.profileSection}>
          <button className={styles.iconButton} aria-label="Notifications">
            <Bell size={20} />
          </button>
          <div className={styles.profileDropdown}>
            <User size={20} />
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Title */}
          <h1 className={styles.title}>
            {editingIndex !== null
              ? "Edit IoT Sensor"
              : "Register New IoT Sensors"}
          </h1>

          {/* Preference Text */}
          <p className={styles.preferenceText}>
            {preferenceText[preferenceLevel]}
            <a
              href="#as"
              onClick={(e) => handlePreferenceChange(e)}
              className={styles.changePreference}
            >
              {" "}
              Click here to change preference.
            </a>
          </p>

          {/* Sensor Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              {/* Row 1: Sensor Name & Provider ID */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="sensorName">Sensor Name*</label>
                  <input
                    id="sensorName"
                    type="text"
                    value={formData.sensorName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="providerID">Username (Provider ID)*</label>
                  <input
                    id="providerID"
                    type="text"
                    value={formData.providerID}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Cost per Minute & Cost per KByte */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="costPerMinute">
                    Cost per Minute (SenSha Coin)*
                  </label>
                  <input
                    id="costPerMinute"
                    type="number"
                    value={formData.costPerMinute}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="costPerKByte">
                    Cost per KByte (SenSha Coin)*
                  </label>
                  <input
                    id="costPerKByte"
                    type="number"
                    value={formData.costPerKByte}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Unit & Location */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="unit">Unit of Measurement*</label>
                  <input
                    id="unit"
                    type="text"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="location">Location (Google Maps Link)*</label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Row 4: Broker & Extra Metadata - Only shown based on preference level */}
              {preferenceLevel >= 1 && (
                <div className={styles.formRow}>
                  {preferenceLevel >= 2 && (
                    <div className={styles.formGroup}>
                      <label htmlFor="broker" className={styles.labelWithInfo}>
                        Broker
                        <Info className={styles.infoIcon} size={16} />
                      </label>
                      <input
                        id="broker"
                        type="text"
                        value={formData.broker}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                  <div className={styles.formGroup}>
                    <label
                      htmlFor="extraMetadata"
                      className={styles.labelWithInfo}
                    >
                      Extra Metadata
                      <Info className={styles.infoIcon} size={16} />
                    </label>
                    <input
                      id="extraMetadata"
                      type="text"
                      value={formData.extraMetadata}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className={styles.formActions}>
                <button type="submit" className={styles.addButton}>
                  {editingIndex !== null ? "Update Sensor" : "Add Sensor"}
                </button>
              </div>
            </form>
          </div>

          {/* Sensor List */}
          <div className={styles.sensorList}>
            {sensors.map((sensor, index) => (
              <div className={styles.sensorItem} key={index}>
                <div className={styles.sensorDetails}>
                  <div className={styles.sensorDetail}>
                    <span className={styles.detailLabel}>Sensor Name:</span>
                    <span className={styles.detailValue}>
                      {sensor.sensorName}
                    </span>
                  </div>
                  <div className={styles.sensorDetail}>
                    <span className={styles.detailLabel}>Location:</span>
                    <span className={styles.detailValue}>
                      {sensor.location}
                    </span>
                  </div>
                  <div className={styles.sensorDetail}>
                    <span className={styles.detailLabel}>Sensor ID:</span>
                    <span className={styles.detailValue}>
                      {sensor.sensorID}
                    </span>
                  </div>
                  <div className={styles.sensorDetail}>
                    <span className={styles.detailLabel}>Cost Per Minute:</span>
                    <span className={styles.detailValue}>
                      {sensor.costPerMinute} SenSha Coin
                    </span>
                  </div>
                  <div className={styles.sensorDetail}>
                    <span className={styles.detailLabel}>Sensor Type:</span>
                    <span className={styles.detailValue}>{sensor.unit}</span>
                  </div>
                  <div className={styles.sensorDetail}>
                    <span className={styles.detailLabel}>Cost Per KByte:</span>
                    <span className={styles.detailValue}>
                      {sensor.costPerKByte} SenSha Coin
                    </span>
                  </div>
                </div>
                <div className={styles.sensorActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(index)}
                    aria-label="Edit sensor"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(index)}
                    aria-label="Delete sensor"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Register Button */}
          {sensors.length > 0 && (
            <div className={styles.registerButtonContainer}>
              <button
                className={styles.registerButton}
                onClick={registerSensor}
              >
                Register IoT Sensor(s)
              </button>
            </div>
          )}
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
