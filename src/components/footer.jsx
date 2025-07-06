import React from 'react';
import '../stylings/Footer.css'; // Ensure you import the CSS
import YantrikLogo from '../assets/logobgr.png'; // Import the logo image

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section logo">
          <img src={YantrikLogo} alt="Yantrik Club Logo" className="footer-logo" />
        </div>
        <div className='idk'>
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/Events">Events</a></li>
              <li><a href="/Project">Project</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="social-links">
          <div>
            <h2>Follow us</h2>
          </div>
          <div className='tags'>
            <a href="https://www.facebook.com/groups/1643392312602100" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com/yantrik_club/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/channel/UChsq9TRLeyPJwahs9x3EzUA" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://github.com/YantrikIITMandi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>

        </div>

        <div className="footer-section map">
          <h2>Our Location</h2>
          <iframe
            title="Map Location"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d515.431842869992!2d76.99947486930995!3d31.781242405592813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sIndian%20Institute%20of%20Technology%20Mandi%20A19!5e0!3m2!1sen!2sin!4v1723207905004!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Yantrik Club , IIT Mandi.</p>
        <p> All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
