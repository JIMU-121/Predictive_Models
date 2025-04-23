import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PropertyPricePrediction from './pages/PropertyPricePrediction';
import CustomerChurnAnalysis from './pages/CustomerChurnAnalysis';
import DiseaseDetection from './pages/DiseaseDetection';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/property" element={<PropertyPricePrediction />} />
          <Route path="/churn" element={<CustomerChurnAnalysis />} />
          <Route path="/disease" element={<DiseaseDetection />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;