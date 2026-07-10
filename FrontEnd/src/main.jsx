import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { AuthProvider } from './features/login_user/AuthContext'; // Importe o seu provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* O PROVIDER ENVOLVE TODO O APP */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);