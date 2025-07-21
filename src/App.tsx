import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomePage from "./pages/HomePage"
import BlogPage from "./pages/BlogPage"
import ProgramrarePage from './pages/ProgramrarePage'
import Maroc from "./pages/MarocTripPage"
import China from "./pages/ChinaTripPage"
import Santiago from "./pages/SantiagoTripPage"
import InWork from "./pages/inwork"
import FAQ from './pages/FAQ'
import Reguli from './pages/reguli'
import CookieConsent from './components/cookie';

function App() {
  const [currentLang, setCurrentLang] = useState<'ro' | 'ru'>(() => {
    return (localStorage.getItem('lang') as 'ro' | 'ru') || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('lang', currentLang);
  }, [currentLang]);

  const handleCookieAccept = () => {
    console.log('User accepted cookies');
    // You can add analytics or other tracking here if needed
  };

  const handleCookieReject = () => {
    console.log('User rejected cookies');
    // Handle rejection - maybe disable certain features
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/blog" element={<BlogPage currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/calendar" element={<ProgramrarePage currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/maroc" element={<Maroc currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/china" element={<China currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/santiago" element={<Santiago />} />
        <Route path="/faq" element={<FAQ currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/reguli" element={<Reguli currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
        <Route path="/inwork" element={<InWork currentLang={currentLang} setCurrentLang={setCurrentLang} />} />
      </Routes>

      <CookieConsent 
        onAccept={handleCookieAccept}
        onReject={handleCookieReject}
      />
    </Router>
  )
}

export default App