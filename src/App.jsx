import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import ScanRedirect from './pages/ScanRedirect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/candles" element={<Home />} /> {/* Temporary for demo */}
      <Route path="/soaps" element={<Home />} />    {/* Temporary for demo */}
      <Route path="/about" element={<Home />} />    {/* Temporary for demo */}
      <Route path="/shop" element={<Home />} />     {/* Temporary for demo */}
      <Route path="/scan" element={<ScanRedirect />} />
    </Routes>
  );
}

export default App;
