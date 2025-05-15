import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BuyPage.module.css";

function BuyPage() {
    const [filter, setFilter] = useState({ name: "", type: "", location: "" });
    const [filteredSensors, setFilteredSensors] = useState([]);
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
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [isFilterSectionOpen] = useState(true);
    const [walletKeypair] = useState(
        "MHQCAQEEIKaHMfh7znw+YmIVPePU2f80mUpi6BKiUYNaAaTN02zJoAcGBSuBBAAKoUQDQgAEWHLcJyFezAjJkaM7Gy/khGCZUcBA0MViZUd3JEA7kFilrWWSPhT7rhfd5qKHAp+3WrEWQXjo0ewJFxIzCHe2fA=="
    );
    const [hasSearched, setHasSearched] = useState(false);
    // --- New for search mode toggle ---
    const [searchMode, setSearchMode] = useState("keyword"); // or "sparql"
    const [sparqlQuery, setSparqlQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (selectedSensor) {
            const newSubtotal =
                amount * duration * dutyCycle * selectedSensor.sensor_cpm;
            setSubtotal(newSubtotal);
        }
    }, [amount, duration, dutyCycle, selectedSensor]);

    // --- Keyword search handler ---
    const fetchSensors = async (searchFilter) => {
        if (
            !searchFilter.name.trim() &&
            !searchFilter.type.trim() &&
            !searchFilter.location.trim()
        ) {
            setFilteredSensors([]);
            setHasSearched(true);
            return;
        }
        let filterClauses = [];
        if (searchFilter.name.trim()) {
            filterClauses.push(`FILTER(CONTAINS(LCASE(?sensor_name), "${searchFilter.name.trim().toLowerCase()}"))`);
        }
        if (searchFilter.type.trim()) {
            filterClauses.push(`FILTER(CONTAINS(LCASE(?measures), "${searchFilter.type.trim().toLowerCase()}"))`);
        }
        if (searchFilter.location.trim()) {
            filterClauses.push(`FILTER(CONTAINS(LCASE(?broker_name), "${searchFilter.location.trim().toLowerCase()}"))`);
        }
        const sparql = `
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
              FILTER (
                xsd:decimal(?long) > 113.338953078
                && xsd:decimal(?long) < 153.569469029
                && xsd:decimal(?lat) > -43.6345972634
                && xsd:decimal(?lat) < -10.6681857235
              )
              ${filterClauses.join('\n')}
            }
        `;
        try {
            const response = await fetch("http://136.186.108.87:7001/sparql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: sparql,
                    walletKeypair: walletKeypair,
                }),
            });
            if (!response.ok) {
                setNotification("Failed to load sensors.");
                setTimeout(() => setNotification(""), 5000);
                return;
            }
            const data = await response.json();
            if (!data.headers || !Array.isArray(data.headers)) {
                setNotification("Invalid API response.");
                setTimeout(() => setNotification(""), 5000);
                return;
            }
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
                id: item[1],
            }));
            setFilteredSensors(parsedData);
            setHasSearched(true);
        } catch (error) {
            setNotification("Error loading sensors.");
            setTimeout(() => setNotification(""), 5000);
        }
    };

    // --- SPARQL search handler ---
    const handleSparqlSearch = async () => {
        if (!sparqlQuery.trim()) {
            setNotification("Please enter a SPARQL query.");
            setTimeout(() => setNotification(""), 3000);
            return;
        }
        try {
            const response = await fetch("http://136.186.108.87:7001/sparql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: sparqlQuery,
                    walletKeypair: walletKeypair,
                }),
            });
            if (!response.ok) {
                setNotification("Failed to run SPARQL query.");
                setTimeout(() => setNotification(""), 5000);
                return;
            }
            const data = await response.json();
            if (!data.headers || !Array.isArray(data.headers)) {
                setNotification("Invalid SPARQL response format.");
                setTimeout(() => setNotification(""), 5000);
                return;
            }
            const parsedData = data.values.map((item) => {
                // Map by header index, fallback to array index
                const headerIndex = (header) => data.headers.indexOf(header);
                return {
                    sensor_name: item[headerIndex("sensor_name")] || item[0] || "",
                    sensor_hash: item[headerIndex("sensor_hash")] || item[1] || "",
                    broker_name: item[headerIndex("broker_name")] || item[2] || "",
                    broker_hash: item[headerIndex("broker_hash")] || item[3] || "",
                    broker_endpoint: item[headerIndex("broker_endpoint")] || item[4] || "",
                    lat: parseFloat(item[headerIndex("lat")] || item[5] || 0),
                    long: parseFloat(item[headerIndex("long")] || item[6] || 0),
                    measures: item[headerIndex("measures")] || item[7] || "",
                    sensor_cpm: parseFloat(item[headerIndex("sensor_cpm")] || item[8] || 0),
                    sensor_cpkb: parseFloat(item[headerIndex("sensor_cpkb")] || item[9] || 0),
                    id: item[headerIndex("sensor_hash")] || item[1] || Math.random().toString(),
                };
            });
            setFilteredSensors(parsedData);
            setHasSearched(true);
        } catch (error) {
            setNotification("Error running SPARQL query.");
            setTimeout(() => setNotification(""), 5000);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilter({ ...filter, [field]: value });
    };

    const handleSearch = () => {
        fetchSensors(filter);
    };

    const handleReset = () => {
        setFilter({ name: "", type: "", location: "" });
        setFilteredSensors([]);
        setHasSearched(false);
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
            amount: Number(amount),
            duration: Number(duration),
            dutyCycle: Number(dutyCycle),
            subtotal: Number(amount) * Number(duration) * Number(dutyCycle) * Number(selectedSensor.sensor_cpm),
        };
        setCart([...cart, cartItem]);
        setNotification(`${selectedSensor.sensor_name} added to cart!`);
        setTimeout(() => setNotification(""), 3000);
        setShowModal(false);
    };

    const Cart = () => {
        navigate("/cart");
    };

    const handleProviderLogin = () => {
        navigate("/provider");
    };
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const isSensorInCart = (sensorId) => {
        return cart.some((item) => item.id === sensorId);
    };

    // --- Reset state on mode switch ---
    useEffect(() => {
        setFilteredSensors([]);
        setHasSearched(false);
        setSparqlQuery("");
    }, [searchMode]);

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
                    <a href="help">Help</a>
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
                {/* Search Mode Toggle */}
                <div className={styles["search-mode-toggle"]}>
                    <button
                        className={searchMode === "keyword" ? styles.active : ""}
                        onClick={() => setSearchMode("keyword")}
                    >
                        Keyword Search
                    </button>
                    <button
                        className={searchMode === "sparql" ? styles.active : ""}
                        onClick={() => setSearchMode("sparql")}
                    >
                        SPARQL Query
                    </button>
                </div>
                {/* Shared filter box */}
                <div className={styles["filter-section"]}>
                    <div className={styles["filter-header"]}>
                        <h2>Select IoT Sensors</h2>
                    </div>
                    {searchMode === "keyword" ? (
                        isFilterSectionOpen && (
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
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </button>
                                </div>
                            </>
                        )
                    ) : (
                        <>
                            <textarea
                                className={styles["sparql-textarea"]}
                                value={sparqlQuery}
                                onChange={e => setSparqlQuery(e.target.value)}
                                placeholder="Enter your SPARQL query here"
                                rows={8}
                            />
                            <div className={styles["filter-actions"]}>
                                <button
                                    className={styles["apply-button"]}
                                    onClick={handleSparqlSearch}
                                >
                                    Run Query
                                </button>
                            </div>
                        </>
                    )}
                </div>
                {/* Results */}
                {hasSearched ? (
                    filteredSensors.length === 0 ? (
                        <p>No sensors found.</p>
                    ) : (
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
                    )
                ) : (
                    <p>Enter a search term and click Search.</p>
                )}
                {/* Modal */}
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
                            <div>
                                <p>
                                    <strong>Sensor:</strong> {selectedSensor.sensor_name}
                                </p>
                                <p>
                                    <strong>Broker:</strong> {selectedSensor.broker_name}
                                </p>
                                <p>
                                    <strong>Measures:</strong> {selectedSensor.measures}
                                </p>
                                <p>
                                    <strong>CPM:</strong> {selectedSensor.sensor_cpm}
                                </p>
                                <div className={styles["modal-inputs"]}>
                                    <label>
                                        Amount:
                                        <input
                                            type="number"
                                            min={1}
                                            value={amount}
                                            onChange={e => setAmount(Number(e.target.value))}
                                        />
                                    </label>
                                    <label>
                                        Duration (minutes):
                                        <input
                                            type="number"
                                            min={1}
                                            value={duration}
                                            onChange={e => setDuration(Number(e.target.value))}
                                        />
                                    </label>
                                    <label>
                                        Duty Cycle:
                                        <input
                                            type="number"
                                            min={1}
                                            value={dutyCycle}
                                            onChange={e => setDutyCycle(Number(e.target.value))}
                                        />
                                    </label>
                                </div>
                                <div className={styles["modal-subtotal"]}>
                                    <strong>Subtotal:</strong> {subtotal}
                                </div>
                                <button
                                    className={styles["confirm-button"]}
                                    onClick={handleConfirmAdd}
                                >
                                    Confirm Add
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
