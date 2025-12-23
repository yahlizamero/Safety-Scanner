import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css'; 
import App from './App.jsx';
import { DuckProvider } from './context/DuckContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DuckProvider>
        <App />
      </DuckProvider>
    </BrowserRouter>
  </React.StrictMode>
);