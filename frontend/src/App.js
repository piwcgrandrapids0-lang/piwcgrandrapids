import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import UnderConstructionModal from './components/UnderConstructionModal/UnderConstructionModal';

// Pages
import Home from './pages/Home';
import ImNew from './pages/ImNew';
import AboutUs from './pages/AboutUs';
import OurBeliefs from './pages/OurBeliefs';
import MissionVision from './pages/MissionVision';
import Tenets from './pages/Tenets';
import Leadership from './pages/Leadership';
import Ministries from './pages/Ministries';
import Watch from './pages/Watch';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Give from './pages/Give';
import Contact from './pages/Contact';
import LocationTimes from './pages/LocationTimes';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/im-new" element={<ImNew />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/beliefs" element={<OurBeliefs />} />
                <Route path="/mission-vision" element={<MissionVision />} />
                <Route path="/tenets" element={<Tenets />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/ministries" element={<Ministries />} />
                <Route path="/watch" element={<Watch />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events" element={<Events />} />
                <Route path="/give" element={<Give />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/location-times" element={<LocationTimes />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
            <UnderConstructionModal />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

