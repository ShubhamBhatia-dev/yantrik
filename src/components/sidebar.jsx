import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaUser, FaEnvelope, FaProjectDiagram, FaCalendarAlt, FaImage } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../stylings/sidebar.css';
import logo from '../assets/grey_logo.png'; // Path to your image

function Sidebar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Track sidebar toggle for small screens

  useEffect(() => {
    const path = location.pathname.split('/')[1]; // Get the path after the "/"
    setActiveItem(path);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Toggle button for small screens */}
      <div className="toggle-button" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Sidebar as dropdown for small screens */}
      <div className={`sidebar ${isSidebarOpen ? 'dropdown' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <ul>
          <li className={activeItem === '' || activeItem === 'home' ? 'active' : ''} onClick={() => setActiveItem('home')}>
            <a href="/home">
              <FaHome />
              <span>Home</span>
            </a>
          </li>
          <li className={activeItem === 'Events' ? 'active' : ''} onClick={() => setActiveItem('Events')}>
            <a href="/Events">
              <FaCalendarAlt />
              <span>Events</span>
            </a>
          </li>
          <li className={activeItem === 'Project' ? 'active' : ''} onClick={() => setActiveItem('Project')}>
            <a href="/Project">
              <FaProjectDiagram />
              <span>Project</span>
            </a>
          </li>
          <li className={activeItem === 'gallery' ? 'active' : ''} onClick={() => setActiveItem('gallery')}>
            <a href="/gallery">
              <FaImage />
              <span>Gallery</span>
            </a>
          </li>
          <li className={activeItem === 'profile' ? 'active' : ''} onClick={() => setActiveItem('profile')}>
            <a href="/profile">
              <FaUser />
              <span>Team</span>
            </a>
          </li>
          <li className={activeItem === 'contact' ? 'active' : ''} onClick={() => setActiveItem('contact')}>
            <a href="/contact">
              <FaEnvelope />
              <span>Contact</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
