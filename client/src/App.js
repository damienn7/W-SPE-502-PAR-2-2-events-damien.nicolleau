
import './App.css';
import './navbar.css';
import './home.css';
import { Home } from './pages/Home';
import { EventDetail } from './pages/EventDetail';
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';


function App() {
  const [isLogged,setIsLogged] = useState(null);
  const location = useLocation();
  const uid = location.pathname.split('/')[3];

  return (
    <Routes>
      <Route path="/" element={<Home isLogged={isLogged} />} />
      <Route path="/event/:uid" element={<EventDetail isLogged={isLogged} uid={uid} />} />
    </Routes>
  );
}

export default App;
