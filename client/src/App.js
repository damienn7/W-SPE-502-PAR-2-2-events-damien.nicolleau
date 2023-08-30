import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import EventDetail from './components/EventDetail';
import React, { useEffect, useState } from "react";
import {useLocation, Routes, Route} from 'react-router-dom';

function App() {
  const [isLogged,setIsLogged] = useState(null);
  const location = useLocation();
  const uid = location.pathname.split('/')[3];

  return (
    <Routes>
      <Route path="/home" element={<Home isLogged={isLogged} />} />
      <Route path="/event/:uid" element={<EventDetail isLogged={isLogged} uid={uid} />} />
    </Routes>
  );
}

export default App;
