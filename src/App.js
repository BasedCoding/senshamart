// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import ClientHomePage from './components/ClientHomePage';
import SensorProviderHomePage from './components/SensorProviderHomePage';
import BlogPage from './components/blog/blog';
import HelpPage from './components/help/help';
import MarketPage from './components/market/market';
import SelldataPage from './components/selldata/selldata';
import SignInPage from './components/signin/SignInPage';        
import RegisterPage from './components/register/RegisterPage';       
import PreferencesPage from './components/preferencepage/PreferencesPage';  
import BuyPage from './components/buysensors/BuyPage'; 
import SensorDataPage from './components/data/SensorDataPage';
import Cart from './components/cart/Cart';
import PurchaseHistory from './components/purchasehistory/purchasehistory';
import ProfilePage from './components/profile/ProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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

