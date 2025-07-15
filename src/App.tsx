import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ElementLight } from './screens/ElementLight/ElementLight';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ElementLight />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
