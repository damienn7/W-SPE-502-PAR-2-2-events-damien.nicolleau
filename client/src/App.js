
import './App.css';
import './navbar.css';
import './home.css';
import './eventd.css';
import './organize.css';
import './member.css';
import { Home } from './pages/Home';
import { EventDetail } from './pages/EventDetail';
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Organize } from './pages/Organize';
import { Member } from './pages/Member';


function App() {
  const [isLogged,setIsLogged] = useState(null);
  const location = useLocation();
  const uid = location.pathname.split('/')[3];

  return (
    <Routes>
      <Route path="/" element={<Home isLogged={isLogged} />} />
      <Route path="/event/:uid" element={<EventDetail isLogged={isLogged}  />} />
      <Route path="/organize/:id" element={<Organize />}  />
      <Route path="/member/:id" element={< Member />} />
      {/* <Route path="/event" element={<EventDetail isLogged={isLogged} />} /> */}
    </Routes>
  );
}

export default App;
