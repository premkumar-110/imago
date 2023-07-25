import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from './login/login';
import Signup from './signup/signup';
import Home from './dashboard/home';
import { useState,useEffect } from 'react';
import axios from 'axios';
function App() {
  
  
  return (
    <>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/home' element={<Home/>}/>
    </Routes>
    </>
  );
}

export default App;
 