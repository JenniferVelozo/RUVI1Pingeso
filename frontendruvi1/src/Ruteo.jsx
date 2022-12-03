import React, { Fragment, useState, useRef, useEffect,  Component} from "react";


import Home from './components/home';
import Resumen from './components/resumen';

import { BrowserRouter as Router} from 'react-router-dom';

import Config from './components/config';
import Update from './components/update';
import Historico from './components/historico';
import Mensual from './components/mensual';
import GestionUser from './components/gestionUser';



/* Intento de login */
import { Navigate, Route, Routes } from "react-router-dom";


import { useSelector } from "react-redux";
import UserLogin from './pages/auth/UserLogin';
import aux from './pages/auth/UserLogin';

import Registration from './pages/auth/Registration';
import { getToken, removeToken } from './services/LocalStorageService';
const KEY = "App.rol";

export function Ruteo() {
    let storedRol = JSON.parse(localStorage.getItem(KEY));
    const { access_token } = getToken()
    if (storedRol){
        console.log('probando')
    }
    else {
        storedRol = {"flag": 0, "flagJ": 0 }
    }
    console.log(aux)
    return (
        <Fragment>
            <Routes>
                <Route path='/register' element={<Registration/>} />
                <Route path='/home' element={access_token ? <Home /> : <Navigate to="/dashboard" />} />
                <Route path='/dashboard' element={<Home/>} />
                <Route path='/resumen' element={<Resumen/>} />
                <Route path='/config' element={storedRol.flag ? <Config/>:<Home/>} />
                <Route path='/historico' element = {<Historico/>} />
                <Route path='/update' element={storedRol.flagJ ? <Home/>:<Update/>} />
                <Route path='/mensual' element={storedRol.flagJ ? <Home/>:<Mensual/>} />
                <Route path='/gestionUser' element={storedRol.flagJ ? <Home/>:<GestionUser/>} />
            </Routes>
        </Fragment>
    );
}
