import React from 'react';

import Login from './components/login';
import Home from './components/home';
import Register from './components/register';
import Resumen from './components/resumen';
import Lala from './components/lala';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BasicSelect from './components/lala';
import Config from './components/config';


function App() {
  return (
    <Router>
        <div>
          <Routes>
              <Route exact path='/' element={<Login/>} />
              <Route path='/home' element={<Home/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/resumen' element={<Resumen/>} />
              <Route path='/lala' element={<BasicSelect/>} />
              <Route path='/config' element={<Config/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
