import React, { useEffect, useRef, useState } from 'react';
import ThreeScene from './Threescene';
import logo from '../assets/logobgr.png';
import '../stylings/Home.css';
import axios from 'axios';

import { useTextScramble } from './TextScramleHook';
import { RiH5 } from 'react-icons/ri';

const contentItems = [
  {
    title: "Active College Participation",
    text: "Our club regularly participates in tech-fests and competitions at prestigious institutions across India, including IIT Kanpur, IIT Bombay, IIT Ropar, IIT Delhi, and IIT Jammu. We also host our own hardware hackathons, fostering innovation and hands-on experience."
  },
  {
    title: "Engaging Regular Sessions",
    text: "We conduct frequent sessions and hackathons focusing on 3D modeling, animation, and MATLAB, offering our juniors and newcomers an opportunity to enhance their skills. We also provide guidance to freshers for their first-year projects, ensuring a strong foundation."
  },
  {
    title: "Innovative Projects",
    text: "Our club is at the forefront of innovation, working on exciting projects like RC Cars, RC Planes, Unicycles, and Battle Bots. These projects not only provide practical experience but also nurture creativity and teamwork among members."
  }
];

const LandingPage = () => {
  const [currentContent, setCurrentContent] = useState(0);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]); // Keep as array, not Set

  useEffect(() => {
    axios.get('http://localhost:5000/api/sessions')
      .then(res => {
        setSessions(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch sessions", err);
      });
  }, []);

  useTextScramble(titleRef, contentItems.map(item => item.title));
  useTextScramble(textRef, contentItems.map(item => item.text));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % contentItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fixed intersection observer effect
  useEffect(() => {
    // Only set up observer if sessions are loaded
    if (sessions.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleItems(prev => {
            // Check if item is already in the array to avoid duplicates
            if (!prev.includes(entry.target.id)) {
              return [...prev, entry.target.id];
            }
            return prev;
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Optional: trigger slightly before element is fully visible
    });

    // Small delay to ensure DOM elements are rendered
    const timeoutId = setTimeout(() => {
      const items = document.querySelectorAll('.session-item');
      items.forEach(item => {
        if (item) observer.observe(item);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const items = document.querySelectorAll('.session-item');
      items.forEach(item => {
        if (item) observer.unobserve(item);
      });
      observer.disconnect();
    };
  }, [sessions]); // Add sessions as dependency

  return (
    <>
      <div className="App">
        <ThreeScene />
        <div className="overlay">
          <div className="typewriter" style={{ marginLeft: "25px" }}>
            <h1 className='font-800'>We Brings Ideas to Life</h1>
          </div>
          <div className="scroll-link">
            <a href="#container" className='font-400' style={{ textDecoration: "none" }} >Scroll to know more</a>
          </div>
        </div>
      </div>

      <div className="container" id="container">
        <div className="intro">
          <img src={logo} alt="Yantrik Logo" className="logo" />
          <div className=" text ">
            <h4 >
              Yantrik is one of the amazing student clubs of IIT Mandi. Under the Science and Technology Council, the club is showing its charm. Yantrik conducts various interesting events, makes amazing projects, and teaches a lot to get the learnings into action. With the contribution of new members, the family of Yantrik is growing:
            </h4>
          </div>
        </div>
      </div>

      <div className="idc">
        <div className="info-section">
          <div className="info-item">
            <h2 ref={titleRef} ></h2>
            <p ref={textRef}></p>
          </div>
        </div>
      </div>

      <div className="container" id="container2">
        <div className="ls" >
          <h1 style={{ color: 'white', border: "2px", fontSize: '2.8em', marginTop: '20px' }}>
            Sessions</h1>
        </div>
      </div>

      <div className='session'>
        <div className="container mt-5 mb-3">
          <div className="inner-child">
            <div className="col-md-8 col-sm-12 col-xs-12 col-lg-8 col-xl-8 font-400">
              <ul className="timeline">
                {sessions.map((session) => (
                  <li
                    key={session._id}
                    id={session._id}
                    className={`session-item ${visibleItems.includes(session._id) ? 'visible' : ''}`}
                  >
                    <a href="#">{session.title}</a>
                    <a href="#" className="float-right">{session.date}</a>
                    <p dangerouslySetInnerHTML={{ __html: session.description }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;