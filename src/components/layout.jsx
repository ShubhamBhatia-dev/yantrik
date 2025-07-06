import React from 'react';
import Sidebar from './sidebar'; // Adjust path as needed
import Footer from './footer';   // Adjust path as needed

import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  // List of routes where you don't want the footer to appear
  const noFooterRoutes = ['/gallery', '/Events' , '/gallery/solidworks' , '/gallery/water-rocket-2k17'];

  return (
    <div>
      <Sidebar/>

      <main>
        {children}
      </main>
      {!noFooterRoutes.includes(location.pathname) && <Footer>/* Footer component */</Footer>}
    </div>
  );
};

export default Layout;
