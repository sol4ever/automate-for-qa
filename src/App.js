import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductProvider } from './components/context/ProductContext.jsx';
import { UserProvider } from './components/context/UserContext.jsx';
import AppContent from './AppContent.js';

function App() {
  return (
    <ProductProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ProductProvider>
  );
}

export default App;
