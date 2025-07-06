import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import AnimatedBackground from './AnimatedBackground';

const EpicProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (project) => setSelectedProject(project);
  const handleCloseDetail = () => setSelectedProject(null);

  return (
    <div className="epic-page">
      <AnimatedBackground />
      <div className="project-content">
        <div className="heading">
          <h1 className="header-title">Yantrik Ongoing Projects</h1>
          <p className="header-subtitle">Explore the cutting-edge innovations!</p>
        </div>

        <div className="projects">
          {projects.map((project) => (
            <div
              className="project-card"
              key={project._id}
              onClick={() => handleCardClick(project)}
            >
              <div
                className="project-image"
                style={{ backgroundImage: `url(${project.image})` }}
              ></div>
              <div className="project-info">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className="project-detail-overlay" onClick={handleCloseDetail}>
            <div className="project-detail-card" onClick={(e) => e.stopPropagation()}>
              <div className="close-button" onClick={handleCloseDetail}>×</div>
              <h2>{selectedProject.title}</h2>
              <div
                className="project-detail-image"
                style={{ backgroundImage: `url(${selectedProject.image})` }}
              ></div>
              <p>{selectedProject.details}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpicProjectPage;
