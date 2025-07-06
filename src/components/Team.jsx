import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5';
import styled from 'styled-components';
import '../stylings/Team.css';

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/user/inverted.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
`;

const ContentWrapper = styled.div`
  min-height: 100vh;
  z-index: 1;
`;

const Team = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/team') // Update with your backend URL
      .then(res => setMembers(res.data))
      .catch(err => console.error('Error fetching team members:', err));
  }, []);

  return (
    <>
      <BackgroundDiv />
      <ContentWrapper>
        <div className="team_glow-border" />
        <header>
          <h2 className="team_flicker-text">Yantrik Team</h2>
          <div className="team_team-section">
            {members.map((member, index) => (
              <div className="team_card" key={index}>
                <img className="team_bg" src="/user/photo1.jpg" alt="bg" />
                <img className="team_person" src={member.image} alt={member.name} />
                <div className="team_info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                </div>
                <div className="team_icon">
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                    <IoLogoInstagram />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <IoLogoLinkedin />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </header>
      </ContentWrapper>
    </>
  );
};

export default Team;
