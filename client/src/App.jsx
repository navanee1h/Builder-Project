import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainWebsite from './MainWebsite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
      </Routes>
    </Router>
  );
}

export default App;
