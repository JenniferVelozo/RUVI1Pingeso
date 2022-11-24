import React from 'react';

import Home from './components/home';

import Resumen from './components/resumen';
//import Lala from './components/lala';
import { BrowserRouter as Router} from 'react-router-dom';
import BasicSelect from './components/lala';
import Config from './components/config';
import Update from './components/update';
import Historico from './components/historico';
import Mensual from './components/mensual';



/* Intento de login */
import { Navigate, Route, Routes } from "react-router-dom";


import { useSelector } from "react-redux";
import UserLogin from './pages/auth/UserLogin';
import Registration from './pages/auth/Registration';
import { getToken, removeToken } from './services/LocalStorageService';


//----- LO QUE ESTABA ANTES -----------
function App() {
  const { access_token } = getToken()
  return (
    <Router>
        <div>
          <Routes>
              <Route path='/' element={!access_token ? <UserLogin /> : <Navigate to="/home" />} />
              <Route path='/login' element={!access_token ? <UserLogin /> : <Navigate to="/home" />} />
              <Route path='/register' element={<Registration/>} />
              <Route path='/resumen' element={<Resumen/>} />
              <Route path='/lala' element={<BasicSelect/>} />
              <Route path='/config' element={<Config/>} />
              <Route path='/historico' element = {<Historico/>} />
              <Route path='/update' element={<Update/>} />
              <Route path='/dashboard' element={<Home/>} />
              <Route path='/home' element={access_token ? <Home /> : <Navigate to="/dashboard" />} />
              <Route path='/mensual' element={<Mensual/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
