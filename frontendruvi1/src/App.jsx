import React from 'react';

import Login from './components/login';
import Home from './components/home';
import Register from './components/register';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <Router>
        <div>
          <Routes>
              <Route exact path='/' element={<Login/>} />
              <Route path='/home' element={<Home/>} />
              <Route path='/register' element={<Register/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;