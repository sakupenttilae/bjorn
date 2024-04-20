import React, { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from 'gsap';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import LaatikkoModel from "./lemans.glb"
//https://sketchfab.com/3d-models/low-poly-car-pontiac-le-mans-1971-86ec22eeceee4cd78ef10352c8d0e6d9 Model for low poly car, thanks Calipo;

gsap.registerPlugin(ScrollTrigger); 

export default function Model(props, glRef, camRef ) {

    const objectRef = useRef();
    const object = useGLTF(LaatikkoModel); 

    const handleObjectRef = (p) => {
     props.onObjectLoad(p)
    }

    useEffect(() => {
      // Preload the GLTF model if necessary
      useGLTF.preload(LaatikkoModel);
  }, [object]);


  
    useEffect(() => {
      if (object.scene) {
        object.scene.position.set(-10, 0.5, 0);
        object.scene.rotation.set(0.2, 1.8, 0);
        handleObjectRef(object.scene);
      }
    }, [props.name]);

    

    useEffect(() => {

        const tlPos = gsap.timeline({
            scrollTrigger: {
              scrub: 1,
              trigger: "#myCanvas",
              start: "top-=150%",
              end: "bottom-=150%",
            },
          });
          tlPos.to(object.scene.position, {
            x: 0,
            onUpdate: ()=> {console.log("vitut")},
            onComplete: ()=> {console.log("vittu")}
          })

          /* Move camera
          tlRot.to(cameraRef.current.position, {
            x:4,
            duration: 3
          }) */
    
        return () => {
          // Cleanup
          ScrollTrigger.getAll().forEach((trigger) => {
            trigger.kill(); // Kill all ScrollTriggers to prevent memory leaks
          });
        };
      }, [objectRef.current]);

  return (
    <primitive object={object.scene} />
  );
}