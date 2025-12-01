<<<<<<< HEAD:src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import  {BrowserRouter}  from 'react-router-dom';

=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
>>>>>>> 9783530f02cfc47aa8d4c7ca467a697d33dcd820:src/index.jsx
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

<<<<<<< HEAD:src/index.js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    </BrowserRouter>

);
=======
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
)
>>>>>>> 9783530f02cfc47aa8d4c7ca467a697d33dcd820:src/index.jsx

reportWebVitals(console.log);
