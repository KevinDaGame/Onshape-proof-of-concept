import { useLoader } from '@react-three/fiber'
import React, { Reducer, Suspense, useEffect, useReducer, useState } from 'react'
import { Group } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { part } from '../types'

type props = {
  gltf: part[]
}
function reducer(state: any, action: any) {
  switch(action.type) {
    case 'append':
      return [...state, action.payload]
  }
}

const GLTFComponent = (props: props) => {
  const gltfLoader = new GLTFLoader()
  const[model, dispatch] = useReducer(reducer, [])
  
  useEffect( () => {
    const modelsTemp: Group[] = []
    const gltf = async (part: part, gltf: string) => {
      gltfLoader.parse(gltf, '',
      (gltf) => { // onLoad
        
        document.body.style.cursor = 'default';
        const gltfScene = gltf.scene || gltf.scenes[0];
        
        gltfScene.position.set(part.occurence.transform[3], part.occurence.transform[7], part.occurence.transform[11]);
        dispatch({type: 'append', payload: gltfScene})
      },
      (err) => { // onError
        throw new Error(`Error loading GLTF: ${err}`);
      });
    }
      props.gltf.forEach(async (p) => {
        await p.gltf.then(async (m) => {
          await gltf(p, m);
        })
      })
  }, [props.gltf]);

  return (
    <group>
      
      {model?.map((m, i) => {
      console.log("rendering");
        
        return (
          <Suspense key={i} fallback={null}>
            <primitive object={m} />
          </Suspense>
      )})}
      </group>
  )
}

export default GLTFComponent