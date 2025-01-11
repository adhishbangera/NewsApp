// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from './context/PreferencesContext';
import Home from './pages/Home';
import Preferences from './pages/Preferences';

const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </Router>
    </PreferencesProvider>
  );
};

export default App;
