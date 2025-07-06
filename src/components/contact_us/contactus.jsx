import React from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import './ContactUs.css'; // Import the CSS file for styling

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact-details">
        <h2>Contact Details</h2>
        <p><FaEnvelope />Email: <a href="mailto:yantrik_club@students.iitmandi.ac.in">yantrik_club@students.iitmandi.ac.in</a></p>
        <p><FaMapMarkerAlt /> Address: Yantrik Club Room A19 SAC Building ground floor IIT Mandi North campus Salgi 170095 </p>
        <p><FaPhoneAlt /> Phone : Coordinator : Gunjeet Kumawat +91 7296978817</p>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        </div>
      </div>
      <div className="contact-content">
        <h1 className="contact-title">Contact Us</h1>
        <p style={{alignItems : 'center' , color : 'rgba(255, 255, 255, 0.25)'}}>This is entirely dummy at the moment and we don't intend to give you any special treatment should you subscribe.
        </p>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
