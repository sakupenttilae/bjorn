import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei'
import Model from './components/Model';





export default function App() {
  const objectRef = useRef();
  const glRef = useRef();
  const canvasRef = useRef();
  const cameraRef = useRef();
  
  const getObjectRef = (object) => {
    objectRef.current = object;
  };
  
  
  return (
      <Canvas
        id="myCanvas"
        gl={{ alpha:true, antialias: true }}
        style={{ width: '100vw', height: '50vh' } }
        camera={{  position: [0, 0, 4], fov: 60, near: 0.1, far: 20 }}
        onCreated={({ gl, camera }) => {
          glRef.current = gl; // Save gl to useRef
          cameraRef.current = camera; // Save camera to useRef
        }}
        ref={canvasRef}
      >
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 3, 5]} />
        <Suspense fallback={null}>
          <Environment preset='forest' />
          <Model id="model" onObjectLoad={getObjectRef} camRef={cameraRef} glRef={glRef}/>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
  );
}

