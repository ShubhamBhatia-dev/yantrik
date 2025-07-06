import React, { useEffect, useState } from 'react';
import leftDoorImage from '../assets/ld2.png';
import rightDoorImage from '../assets/rd2.png'; 
import logoImage from '../assets/Untitled2.png';
import App from '../App';

const FortDoor = () => {
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorsVisible, setDoorsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(1);

  useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');

    if (!hasSeenAnimation) {
      const openTimeout = setTimeout(() => {
        setDoorOpen(true);
        setLogoScale(1.5);
      }, 800);

      const hideTimeout = setTimeout(() => {
        setDoorsVisible(false);
        sessionStorage.setItem('hasSeenAnimation', 'true');
      }, 3000);

      const hideLogoTimeout = setTimeout(() => {
        setLogoScale(2.5);
      }, 2500);

      return () => {
        clearTimeout(openTimeout);
        clearTimeout(hideTimeout);
        clearTimeout(hideLogoTimeout);
      };
    } else {
      setDoorsVisible(false);
    }
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      .fort-door.open .left-door {
        transform: translateX(-100%);
      }
      .fort-door.open .right-door {
        transform: translateX(100%);
      }

      @media (max-width: 768px) {
        .logo {
          display: none; /* Hide logo on small screens */
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div style={styles.container}>
      {doorsVisible && (
        <>
          <div className="logo" style={{ ...styles.logo, transform: `scale(${logoScale})` }} />
          <div className={`fort-door ${doorOpen ? 'open' : ''}`} style={styles.fortDoor}>
            <div className="door left-door" style={{ ...styles.door, ...styles.leftDoor }}></div>
            <div className="door right-door" style={{ ...styles.door, ...styles.rightDoor }}></div>
          </div>
        </>
      )}
      {(!doorsVisible || doorOpen) && (
        <div className="content" style={styles.content}>
          <App />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  },
  fortDoor: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  door: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    border: '5px solid #7f8c8d',
    transition: 'transform 2s ease-in-out',
    zIndex: 2,
  },
  leftDoor: {
    left: 0,
    transformOrigin: 'left',
    backgroundImage: `url(${leftDoorImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  rightDoor: {
    right: 0,
    transformOrigin: 'right',
    backgroundImage: `url(${rightDoorImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  logo: {
    position: 'absolute',
    transform: 'translate(-50%, -50%) scale(1)',
    backgroundImage: `url(${logoImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: '200px',  // Adjust size as needed
    height: '200px', // Adjust size as needed
    zIndex: 3,
    transition: 'transform 2s ease-in-out',
    borderRadius: '100%' , 
  },
  content: {
    position: 'absolute',
    textAlign: 'center',
    overflow: 'auto',
    maxHeight: '100vh', 
    height: '100vh',
    width: '100vw',
  },
};

export default FortDoor;
