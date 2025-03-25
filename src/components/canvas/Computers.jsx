import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      {/* Soft ambient lighting for overall visibility */}
      <ambientLight intensity={2.5} />

      {/* Directional light to mimic natural lighting */}
      <directionalLight
        position={[10, 40, 10]} // Position from above and slightly in front
        intensity={1.5} // Stronger intensity
        castShadow
      />

      {/* Spotlight for highlights */}
      <spotLight
        position={[-20, 50, 10]} // Focus from above
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Point light for added effect and depth */}
      <pointLight intensity={1.2} />

      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75} // Slightly larger model
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]} // Adjusted for better fit
        rotation={[-0.01, -0.2, -0.1]} // Slight tweak for natural perspective
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: isMobile ? 30 : 25 }} // Adjusted for better framing
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
