import React from 'react';

import Home from './components/home';

import Resumen from './components/resumen';
//import Lala from './components/lala';
import { BrowserRouter as Router} from 'react-router-dom';
import BasicSelect from './components/lala';
import Config from './components/config';
import Update from './components/update';



/* Intento de login */
import { Navigate, Route, Routes } from "react-router-dom";


import { useSelector } from "react-redux";
import UserLogin from './pages/auth/UserLogin';
import Registration from './pages/auth/Registration';


//----- LO QUE ESTABA ANTES ----------- 
function App() {
  const { access_token } = useSelector(state => state.auth)
  return (
    <Router>
        <div>
          <Routes>
              <Route path='/login' element={!access_token ? <UserLogin /> : <Navigate to="/home" />} />
              
              <Route path='/register' element={<Registration/>} />
              <Route path='/resumen' element={<Resumen/>} />
              <Route path='/lala' element={<BasicSelect/>} />
              <Route path='/config' element={<Config/>} />
              <Route path='/update' element={<Update/>} />
              <Route path="/home" element={access_token ? <Home /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
