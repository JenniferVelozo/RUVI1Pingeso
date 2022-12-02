import React, { Fragment, useState, useRef, useEffect,  Component} from "react";

import Home from './components/home';
import Resumen from './components/resumen';

import { BrowserRouter as Router} from 'react-router-dom';

import Config from './components/config';
import Update from './components/update';
import Historico from './components/historico';
import Mensual from './components/mensual';
import {Ruteo} from './Ruteo';



import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from './pages/auth/UserLogin';
import aux from './pages/auth/UserLogin';

import Registration from './pages/auth/Registration';
import { getToken, removeToken } from './services/LocalStorageService';

const KEY = "App.rol";
export class App extends React.Component {

  

  render() {
    const { access_token } = getToken()
    console.log(aux)
    
    return (
        <React.Fragment>
        <Router>
            <div>
            <Routes>
              <Route path='/' element={!access_token ? <UserLogin /> : <Navigate to="/home" />} />
              <Route path='/login' element={!access_token ? <UserLogin /> : <Navigate to="/home" />} />
              
            </Routes>
            <Ruteo/>
            </div>
        </Router> 
        
        </React.Fragment>
    );
  }
}


