import React, { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from 'gsap';
import { useGLTF } from '@react-three/drei';
import LaatikkoModel from "./lemans.glb"
import { useFrame } from '@react-three/fiber';
//https://sketchfab.com/3d-models/low-poly-car-pontiac-le-mans-1971-86ec22eeceee4cd78ef10352c8d0e6d9 Model for low poly car, thanks Calipo;

gsap.registerPlugin(ScrollTrigger); 

export default function Model(props, glRef, camRef ) {

    const objectRef = useRef();
    const object = useGLTF(LaatikkoModel); 
    const [lastScrollDelta, setLastScrollDelta] = useState(-1);
    const [useScrollRotation, setUseScrollRotation] = useState(true);
    const lastScrollDeltaRef = useRef(0);
    const previousTimeRef = useRef(0);

    const handleObjectRef = (p) => {
     props.onObjectLoad(p)
    }

    useEffect(() => {
      // Preload the GLTF model if necessary
      useGLTF.preload(LaatikkoModel);
  }, [object]);


  
    useEffect(() => {
      if (object.scene) {
        object.scene.position.set(0, 1.5, 0);
        object.scene.rotation.set(0.4, 1.8, 0);
        object.scene.scale.set(0.5, 0.5, 0.5);
        handleObjectRef(object.scene);

      }
    }, [props.name]);

        //start spinning the bottle instantly
        useEffect(() => {
          updateLastScrollDelta(lastScrollDelta);
        }, [lastScrollDelta]);
    
        // Function to update lastScrollDeltaRef
        const updateLastScrollDelta = (delta) => {
          lastScrollDeltaRef.current = delta;
        };
    
        const handleMouseWheel = (event) => {

          // Determine scroll direction
          const scrollDirection = event.deltaY > 0 ? 1 : -1;
      
          // Update rotation of the bottle object based on scroll
          if (object.scene) {
            const delta = event.deltaY > 0 ? 0.01 : -0.01; // Set rotation direction based on scroll direction
            object.scene.rotation.y += delta; // Rotate along the y-axis
            updateLastScrollDelta(scrollDirection); // Update the last scroll delta
          }
      
        };
    
        useEffect(() => {
          if (useScrollRotation) {
            window.addEventListener('wheel', handleMouseWheel);
          }
          return () => {
            window.removeEventListener('wheel', handleMouseWheel);
          };
        }, [useScrollRotation]);

    useFrame(() => {

      const currentTime = performance.now();
      const deltaTime = (currentTime - previousTimeRef.current) / 1000;
      previousTimeRef.current = currentTime;

      // Spin the bottle with a constant speed based on delta time and the last scroll delta
      if (object.scene) {
          const rotationSpeed = 0.3 * lastScrollDeltaRef.current * deltaTime;
          object.scene.rotation.y += rotationSpeed;
      }

  });

  return (
    <primitive object={object.scene} />
  );
}