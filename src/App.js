import React, { useRef, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { MeshPhysicalMaterial } from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment} from '@react-three/drei';
import { OrbitControls } from '@react-three/drei'
import { Vector3, Raycaster } from 'three'; 
import Model from './components/Model';
import './App.css'






export default function App() {

  const raycaster = useRef(new Raycaster());
  const [hoveredData, setHoveredData] = useState()
  const [hoveredObject, setHoveredObject] = useState();
  const [hoveredMaterial, setHoveredMaterial] = useState();
  const objectRef = useRef();
  const glRef = useRef();
  const canvasRef = useRef();
  const cameraRef = useRef();
  
  const getObjectRef = (object) => {
    objectRef.current = object;
  };

  const meshInfo = {
    Object_7: [
      { name: 'Ikkunat', operations: [
        { operation: 'Sävytys', price: '200€', detail:"& ylöspäin" },
        { operation: 'Tuulilasin vaihto', price: '200€', detail:"& ylöspäin"}
      ] }
    ],
    Object_15: [
      { name: 'Renkaat', operations: [
        { operation: "Renkaiden vaihto", price: "40€"},
        { operation: "Renkaiden kumitus", price: "20€", detail:"& ylöspäin"}
      ] }
    ],
    Object_6: [
      { name: 'Runko', operations: [
        { operation: "Ruostekorjaus", price: "50€", detail: "& ylöspäin"},
      ] }
    ],
    Object_14: [
      { name: 'Jarrut', operations: [
        { operation: "Jarrulevyjen ja -palojen vaihto", price: "200€ akselilta", detail: "+ varaosat" },
      ] }
    ],
    Object_13: [
      { name: 'Jarrut', operations: [
        { operation: "Jarrulevyjen ja -palojen vaihto", price: "200€ akselilta", detail: "+ varaosat" },
      ] }
    ],

  };

  const handleMouseMove = (event) => {
    if (objectRef.current && cameraRef.current) {
    const { clientX, clientY } = event;
    const mouseVector = new Vector3(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    raycaster.current.setFromCamera(mouseVector, cameraRef.current);

    const intersects = raycaster.current.intersectObjects(
      objectRef.current.children,
      true
    );

    if (intersects.length > 0) {
      console.log('Intersected object:', intersects[0].object.name, intersects[0].object.material.name );

      const hoveredObjectName = intersects[0].object.name;
      setHoveredData(meshInfo[hoveredObjectName]);

      setHoveredObject(intersects[0].object)
      setHoveredMaterial(intersects[0].object.material)
      //cleanup for raycast intersecting
    } else {
      setHoveredObject()
      setHoveredMaterial()
      setHoveredData(null);
    }

  }
};
//handle highlighting
useEffect(() => {
  if (hoveredObject) {
    hoveredObject.material = new MeshPhysicalMaterial({ color: 0xd29321 }); //highlight hovered object
    return () => {
      if (hoveredMaterial) {
        hoveredObject.material = hoveredMaterial;
      }
    };
  }
}, [hoveredObject]);

const formatHoveredMeshInfo = () => {
  return (
    <AnimatePresence>
      {hoveredData && (
        <motion.table
          key="table"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.5 }}
          className='table'
          style={{
            backgroundColor: "#0c4641",
            borderSpacing: "0"
          }}
        >
          {hoveredData.map((item, index) => (
            <React.Fragment key={index}>
              <thead style={{ backgroundColor: "#d29321", color: "#0c4641" }}>
                <tr>
                  <th colSpan="3">{item.name}</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#0c4641" }}>
                {item.operations.map((operation, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "bold", color: "white", paddingRight: "1em" }}>{operation.operation}</td>
                    <td style={{ color: "white", paddingRight: "1em" }}>{operation.price}</td>
                    <td style={{ color: "white", paddingRight: "1em" }}>{operation.detail}</td>
                  </tr>
                ))}
              </tbody>
            </React.Fragment>
          ))}
        </motion.table>
      )}
    </AnimatePresence>
  );
};

  
  return (
    <>
        <Canvas 
          onMouseMove={handleMouseMove}
          id="myCanvas"
          gl={{ alpha:true, antialias: true }}
          style={{ width: '100vw', height: '100vh' } }
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
            <Model id="model" onObjectLoad={getObjectRef} camRef={cameraRef} glRef={glRef} />
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI - Math.PI / 3}
            enableDamping={false}
          />
        </Canvas>

        <div className='infoWrapper'>
          {hoveredData && (
            <div>
              {formatHoveredMeshInfo()}
            </div>
          )}
        </div>
    </>
  );
}

