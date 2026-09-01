import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Rebranding from './Rebranding';
import Web from './Web';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Rebranding />} />
        <Route path="/web" element={<Web />} />
      </Routes>
    </Router>
  );
}