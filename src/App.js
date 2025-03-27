// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import ClientHomePage from './components/ClientHomePage';
import SensorProviderHomePage from './components/SensorProviderHomePage';
import BlogPage from './components/blog/blog';
import HelpPage from './components/help/help';
import MarketPage from './components/market/market';
import SelldataPage from './components/selldata/selldata';
import SignInPage from './SignInPage';        
import RegisterPage from './RegisterPage';       
import PreferencesPage from './PreferencesPage';  
import BuyPage from './BuyPage'; 
import SensorDataPage from './SensorDataPage';
import Cart from './components/cart/Cart';
import PurchaseHistory from './components/purchasehistory/purchasehistory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/client" element={<ClientHomePage />} />
              <Route path='search-sensors' element={<BuyPage />} />
              <Route path='data' element={<SensorDataPage/>} />
              <Route path='cart' element={<Cart/>} />
              <Route path='purchasehistory' element={<PurchaseHistory/>} />
          <Route path="/provider" element={<SensorProviderHomePage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path='help' element={<HelpPage />} />
              <Route path='my-marketplace' element={<MarketPage />} />
              <Route path='sell-data' element={<SelldataPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

