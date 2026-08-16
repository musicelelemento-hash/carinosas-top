"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VIP3DToken() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // ── 3D GOLDEN COIN CYLINDER ──
    const cylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.18, 64);
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D4A843"),
      emissive: new THREE.Color("#1B1200"),
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const coin = new THREE.Mesh(cylinderGeo, goldMat);
    coin.rotation.x = Math.PI / 6;
    scene.add(coin);

    // ── 3D STAR / CROWN EMBOSSED EMBLEM ──
    const starGeo = new THREE.OctahedronGeometry(0.55, 0);
    const starMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFF2C6"),
      emissive: new THREE.Color("#D4A843"),
      emissiveIntensity: 0.3,
      metalness: 0.95,
      roughness: 0.08,
    });
    const starFront = new THREE.Mesh(starGeo, starMat);
    starFront.position.y = 0.12;
    starFront.scale.set(1, 0.4, 1);
    coin.add(starFront);

    // ── OUTER CONCENTRIC GOLD RINGS ──
    const outerRingGeo = new THREE.TorusGeometry(1.5, 0.02, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFE088"),
      transparent: true,
      opacity: 0.6,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    scene.add(outerRing);

    // ── LIGHTS ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4a843, 2.0);
    dirLight2.position.set(-4, -2, -2);
    scene.add(dirLight2);

    // Mouse Tracking
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

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      coin.rotation.y = elapsed * 0.9 + targetX * 1.2;
      coin.rotation.z = Math.sin(elapsed * 0.8) * 0.15 + targetY * 0.4;

      outerRing.rotation.x = elapsed * 0.3;
      outerRing.rotation.y = elapsed * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      cylinderGeo.dispose();
      goldMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      outerRingGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div ref={containerRef} className="w-48 h-48 sm:w-60 sm:h-60" />
    </div>
  );
}
