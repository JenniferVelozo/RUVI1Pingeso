import React, { Fragment, useState, useRef, useEffect,  Component} from "react";


import Home from './components/home';
import Resumen from './components/resumen';

import { BrowserRouter as Router} from 'react-router-dom';

import Config from './components/config';
import Update from './components/update';
import Historico from './components/historico';
import Mensual from './components/mensual';



/* Intento de login */
import { Navigate, Route, Routes } from "react-router-dom";


import { useSelector } from "react-redux";
import UserLogin from './pages/auth/UserLogin';
import aux from './pages/auth/UserLogin';

import Registration from './pages/auth/Registration';
import { getToken, removeToken } from './services/LocalStorageService';
const KEY = "App.rol";

export function Ruteo() {
    const storedRol = JSON.parse(localStorage.getItem(KEY));
    const { access_token } = getToken()
    console.log(aux)
    return (
        <Fragment>
            <Routes>
                <Route path='/register' element={storedRol.flag ? <Registration/>:<Home/>} />
                <Route path='/home' element={access_token ? <Home /> : <Navigate to="/dashboard" />} />
                <Route path='/dashboard' element={<Home/>} />
                <Route path='/resumen' element={<Resumen/>} />
                <Route path='/config' element={storedRol.flag ? <Config/>:<Home/>} />
                <Route path='/historico' element = {<Historico/>} />
                <Route path='/update' element={storedRol.flagJ ? <Home/>:<Update/>} />
                <Route path='/mensual' element={storedRol.flagJ ? <Home/>:<Mensual/>} />
            </Routes>
        </Fragment>
    );
}
