import React from "react";

import Home from './components/home';
import Resumen from './components/resumen';

import { BrowserRouter as Router} from 'react-router-dom';

import Config from './components/config';
import Update from './components/update';
import UpdateCG from './components/updateCG';
import UpdateP from './components/updateP';
import Historico from './components/historico';
import HistoricoP from './components/historicoPorP';
import Mensual from './components/mensual';
import GestionUser from './components/gestionUser';
import Reportes from './components/reportes';



import { Navigate, Route, Routes } from "react-router-dom";
import UserLogin from './pages/auth/UserLogin';

import Registration from './pages/auth/Registration';
import { getToken} from './services/LocalStorageService';

const KEY = "App.rol";
export class App extends React.Component {

  

  render() {
    const { access_token } = getToken()
    let storedRol = JSON.parse(localStorage.getItem(KEY));
    if (storedRol){
        console.log("Rol encontrado")
    }
    else {
      storedRol = {rol: "", flag: false, flagJ:false, servicio: "", servicio_id:""}
      localStorage.setItem(KEY, JSON.stringify(storedRol));
    }
    
    return (
        <React.Fragment>
        <Router>
            <div>
            <Routes>
              <Route path='/' element={access_token ? <Navigate to="/home" />: <UserLogin /> } />
              <Route path='/login' element={access_token ? <Navigate to="/home" />: <UserLogin />} />
              
              <Route path='/home' element={{access_token} ? <Home /> : <Navigate to="/out" />} />
              <Route path='/dashboard' element={<Home />} />
              <Route path='/out' element={<UserLogin />} />
              <Route path='/resumen' element={access_token ? <Resumen/>: <UserLogin />} />
              <Route path='/historico' element = {access_token ? <Historico/> : <Navigate to="/out" />} />
              <Route path='/historicoP' element = {access_token ? <HistoricoP/> : <Navigate to="/out" />} />
              <Route path='/reportes' element={access_token ? <Reportes/>:<Navigate to="/out" />} />

              <Route path='/config' element={access_token ? <Navigate to="/configAccess" />:<Navigate to="/out" />} />
              <Route path='/configAccess' element={storedRol.flag ? <Config/>:<Home/>} />

              <Route path='/register' element={access_token ? <Navigate to="/registerAccess" />:<Navigate to="/out" />} />
              <Route path='/registerAccess' element={storedRol.flag ? <Registration/>:<Home/>} />
              

              <Route path='/update' element={access_token ? <Navigate to="/updateAccess" />:<Navigate to="/out" />} />
              <Route path='/updateAccess' element={storedRol.flagJ ? <Home/>:<Update/>} />

              <Route path='/updateCG' element={access_token ? <Navigate to="/updateCGAccess" />:<Navigate to="/out" />} />
              <Route path='/updateCGAccess' element={storedRol.flagJ ? <Home/>:<UpdateCG/>} />

              <Route path='/updateP' element={access_token ? <Navigate to="/updatePAccess" />:<Navigate to="/out" />} />
              <Route path='/updatePAccess' element={storedRol.flagJ ? <Home/>:<UpdateP/>} />


              <Route path='/mensual' element={access_token ? <Navigate to="/mensualAccess" />:<Navigate to="/out" />} />               
              <Route path='/mensualAccess' element={storedRol.flagJ ? <Home/>:<Mensual/>} />

              <Route path='/gestionUser' element={access_token ? <Navigate to="/gestionUserAccess" />:<Navigate to="/out" />} />
              <Route path='/gestionUserAccess' element={storedRol.flag ? <GestionUser/>:<Home/>} />

              
            </Routes>
            
            </div>
        </Router> 
        
        </React.Fragment>
    );
  }
}


