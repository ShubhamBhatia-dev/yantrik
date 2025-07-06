import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout'; // Adjust path as needed
import Events from './components/Events';
import ContactUs from './components/contact_us/contactus.jsx';
import Home from './components/Home.jsx';
import Gallery from './components/Gallery.jsx';
import Project from './components/YantrikEvent.jsx';
import Team from './components/Team.jsx';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path='/gallery/*' element={<Gallery />} /> {/* Note the wildcard */}
          <Route path='/project' element={<Project />} />
          <Route path='/profile' element={<Team />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
