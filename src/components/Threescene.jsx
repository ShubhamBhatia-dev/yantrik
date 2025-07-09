import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let angle = 0;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = false; // Disable zoom if causing issues

    camera.position.z = 10;

    // Function to position and scale gears and text
    const setupScene = () => {
      scene.clear(); // Clear previous content

      // Load the gears model
      const gearLoader = new GLTFLoader();
      gearLoader.load('./src/ImageToStl.com_gear.glb', (gltf) => {
        // Determine if the screen is mobile
        const isMobile = window.innerWidth <= 1200;

        // Scale factors for mobile and desktop
        const gearScale = isMobile ? 0.8 : 1.4; // Smaller gears on mobile
        const gearScale2 = isMobile ? 0.8 : 1.04;
        const gear1Pos = isMobile ? { x: 0, y: 3, z: 2.5 } : { x: 7.5, y: -0.3, z: 2.5 };
        const gear2Pos = isMobile ? { x: 0, y: -3, z: 2.5 } : { x: -7.5, y: -0.5, z: 2.5 };

        const gear1 = gltf.scene.clone();
        scene.add(gear1);
        gear1.position.set(gear1Pos.x, gear1Pos.y, gear1Pos.z);
        gear1.scale.set(gearScale, gearScale, gearScale);

        const gear2 = gltf.scene.clone();
        scene.add(gear2);
        gear2.position.set(gear2Pos.x, gear2Pos.y, gear2Pos.z);
        gear2.scale.set(gearScale2, gearScale2, gearScale2);

        // Animate the gears
        function animateGears() {
          gear1.children.forEach((gear, index) => {
            if (index % 2 === 0) {
              gear.rotation.z += 0.01; // Rotate one direction
            } else {
              gear.rotation.z -= 0.01; // Rotate the other direction
            }
          });

          gear2.children.forEach((gear, index) => {
            if (index % 2 === 0) {
              gear.rotation.z -= 0.01; // Rotate in opposite direction
            } else {
              gear.rotation.z += 0.01; // Rotate the other direction
            }
          });
        }

        const animate = () => {
          requestAnimationFrame(animate);
          animateGears();
          angle += 0.0005; // Adjust speed here

          // Set camera position in a circle
          const radius = 10; // Adjust orbit radius
          camera.position.x = Math.sin(angle) * radius;
          camera.position.z = Math.cos(angle) * radius;
          camera.lookAt(0, 0, 0); // Always look at center

          // Optional: still rotate particles


          controls.update(); // (can be disabled if full auto)
          renderer.render(scene, camera);
          controls.update();
          renderer.render(scene, camera);
        };

        animate();
      }, undefined, (error) => {
        console.error(error);
      });

      // Create particles
      const particleCount = 500;
      const particles = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() * 2 - 1) * 10;
        particlePositions[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
        particlePositions[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: false,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      // Load font and create 3D text
      const loader = new FontLoader();
      loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const createTextMesh = (content, position) => {
          const textGeometry = new TextGeometry(content, {
            font: font,
            size: 10,
            depth: 0.3,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
          });
          const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff001a, specular: 0xffffff });
          textMaterial.color.set('orangered');
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(position.x, position.y, position.z);
          return textMesh;
        };
        const isMobile = window.innerWidth <= 1200;
        const textMesh = createTextMesh('YANTRIK CLUB', isMobile ? { x: -2.7, y: 0, z: 0 } : { x: -4.5, y: 0, z: 0 });
        scene.add(textMesh);

        let currentText = '';
        let index = 0;

        var fontsize = isMobile ? 0.6 : 1;

        // Typing effect function
        const typingEffect = () => {

          if (index < 'YANTRIK CLUB'.length) {
            currentText += 'YANTRIK CLUB'[index];
            textMesh.geometry.dispose(); // Dispose of old geometry
            textMesh.geometry = new TextGeometry(currentText, {
              font: font,
              size: fontsize,
              depth: 0.3,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 5,
            });
            index++;
            setTimeout(typingEffect, 200); // Adjust typing speed here
          }
        };

        typingEffect(); // Start typing effect
      });

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 1, 1).normalize();
      scene.add(light);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate particles
        particleSystem.rotation.y += 0.001;

        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    setupScene(); // Initial setup

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupScene(); // Re-setup scene on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }} />;
};

export default ThreeScene;
