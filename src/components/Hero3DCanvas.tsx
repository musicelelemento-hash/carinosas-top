"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect WebGL availability
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Dimensions
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── 3D GOLDEN CRYSTAL CORE ──
    const geometry = new THREE.IcosahedronGeometry(1.2, 0);
    
    // Luxury Gold Physical Material
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4A843"),
      emissive: new THREE.Color("#2A1B00"),
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      flatShading: true,
    });

    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // ── WIREFRAME HALO OVERLAY ──
    const wireGeo = new THREE.IcosahedronGeometry(1.21, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFE088"),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframe);

    // ── ORBITAL GYROSCOPIC RINGS ──
    const ringGeo1 = new THREE.TorusGeometry(1.7, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#D4A843"),
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.95, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FF5E8A"),
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // ── GOLDEN AMBIENT DUST PARTICLES ──
    const particlesCount = 90;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = (Math.random() - 0.5) * 6;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: new THREE.Color("#F8E5AE"),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // ── LIGHTING SETUP ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xd4a843, 3.5, 10);
    goldPointLight.position.set(3, 4, 3);
    scene.add(goldPointLight);

    const pinkAccentLight = new THREE.PointLight(0xff0062, 2.5, 10);
    pinkAccentLight.position.set(-3, -3, 2);
    scene.add(pinkAccentLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 5, -3);
    scene.add(rimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Crystal rotations
      crystal.rotation.x = elapsedTime * 0.35 + targetY * 0.6;
      crystal.rotation.y = elapsedTime * 0.45 + targetX * 0.8;

      wireframe.rotation.x = crystal.rotation.x;
      wireframe.rotation.y = crystal.rotation.y;

      // Gyroscope rings rotation
      ring1.rotation.x = elapsedTime * 0.2 + targetY * 0.4;
      ring1.rotation.y = elapsedTime * 0.3 + targetX * 0.4;

      ring2.rotation.y = -elapsedTime * 0.25;
      ring2.rotation.z = elapsedTime * 0.15;

      // Floating particles slow vortex
      particles.rotation.y = elapsedTime * 0.08;
      particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      // Floating gentle bobbing
      crystal.position.y = Math.sin(elapsedTime * 1.2) * 0.1;
      wireframe.position.y = crystal.position.y;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div ref={containerRef} className="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80" />
    </div>
  );
}
