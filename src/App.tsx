// Routes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Result from './Pages/Result';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const AppRoutes: React.FC = () => {
  return (
    <div>    
        <ToastContainer/>
   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />

    </Routes>
    </div>
  );
};

export default AppRoutes;
