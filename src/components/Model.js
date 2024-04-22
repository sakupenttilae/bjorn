import React, { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from 'gsap';
import { useGLTF } from '@react-three/drei';
import LaatikkoModel from "./lemans.glb"
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
//https://sketchfab.com/3d-models/low-poly-car-pontiac-le-mans-1971-86ec22eeceee4cd78ef10352c8d0e6d9 Model for low poly car, thanks Calipo;

gsap.registerPlugin(ScrollTrigger); 

export default function Model(props, glRef, camRef ) {

    const object = useGLTF(LaatikkoModel); 
    const lastScrollDeltaRef = useRef(0);
    const previousTimeRef = useRef(0);

    const handleObjectRef = (p) => {
     props.onObjectLoad(p)
    }

    useEffect(() => {
      // Preload the GLTF model if necessary
      useGLTF.preload(LaatikkoModel);

      object.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // Log the name of the mesh
            console.log('Mesh Name:', child.name);
            if (child.name === "Object_6") { 
              child.material.color.set("#0c4641")
            } 
          }})
      }, [object]);


  
    useEffect(() => {
      if (object.scene) {
        object.scene.position.set(0, 0.77, 0);
        object.scene.rotation.set(0.2, 1.8, 0);
        object.scene.scale.set(0.75, 0.75, 0.75);
        handleObjectRef(object.scene);
      }
    }, [props.name]);

    // Function to update lastScrollDeltaRef
    const updateLastScrollDelta = (delta) => {
      lastScrollDeltaRef.current = delta;
    };

    const handleMouseWheel = (event) => {
      const scrollDirection = event.deltaY > 0 ? 1 : -1; // Determine scroll direction
      updateLastScrollDelta(scrollDirection); // Update the last scroll delta
    };
    
    useEffect(() => {
      window.addEventListener('wheel', handleMouseWheel);
      
      return () => {
        window.removeEventListener('wheel', handleMouseWheel);
      };
    }, [object]);

    useFrame(() => {

      const currentTime = performance.now();
      const deltaTime = (currentTime - previousTimeRef.current) / 1000;
      previousTimeRef.current = currentTime;

      // Spin the model with a constant speed based on delta time and the last scroll delta
      if (object.scene) {
          const rotationSpeed = 0.1 * lastScrollDeltaRef.current * deltaTime;
          object.scene.rotation.y += rotationSpeed;
      }

  });

  return (
    <primitive object={object.scene} />
  );
}