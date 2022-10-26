import React from 'react';


import Login from './components/login';
//import Home from './components/home';
import Register from './components/register';
import Resumen from './components/resumen';
//import Lala from './components/lala';
import { BrowserRouter as Router,  Link } from 'react-router-dom';
import BasicSelect from './components/lala';
import Config from './components/config';



/* Intento de login */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginReg from "./pages/auth/LoginReg";
import ResetPassword from "./pages/auth/ResetPassword";
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import { useSelector } from "react-redux";
import UserLogin from './pages/auth/UserLogin';
import Registration from './pages/auth/Registration';

/*
function App() {
  const { access_token } = useSelector(state => state.auth)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={!access_token ? <UserLogin /> : <Navigate to="/dashboard" />} />
            <Route path="register" element={<Registration />} />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/dashboard" element={access_token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
*/


//----- LO QUE ESTABA ANTES ----------- 
function App() {
  const { access_token } = useSelector(state => state.auth)
  return (
    <Router>
        <div>
          <Routes>
              <Route path='/' element={!access_token ? <UserLogin /> : <Navigate to="/dashboard" />} />
              <Route path='/home' element={<Home/>} />
              <Route path='/register' element={<Registration/>} />
              <Route path='/resumen' element={<Resumen/>} />
              <Route path='/lala' element={<BasicSelect/>} />
              <Route path='/config' element={<Config/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
