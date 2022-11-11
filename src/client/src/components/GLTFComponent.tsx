import { useLoader } from '@react-three/fiber'
import React, { Reducer, Suspense, useEffect, useReducer, useState } from 'react'
import { Group, Matrix4, Quaternion, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import GltfTree, { GltfNode } from '../data/GltfTree'
import { degrees_to_radians } from '../test/util/DegreesToRadian'
import { part, transform } from '../types'

type props = {
  gltf: GltfTree
}
function reducer(state: any, action: any) {
  switch (action.type) {
    case 'append':
      return [...state, action.payload]
  }
}

const GLTFComponent = (props: props) => {
  const gltfLoader = new GLTFLoader()
  const [model, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    const gltf = async (part: GltfNode, gltf: string) => {
      gltfLoader.parse(gltf, '',
        (gltf) => { // onLoad

          document.body.style.cursor = 'default';
          const gltfScene = gltf.scene || gltf.scenes[0];
          let matrix = new Matrix4();
          
          matrix.set(
            part.value?.occurence.transform[0] as number,
            part.value?.occurence.transform[1] as number,
            part.value?.occurence.transform[2] as number,
            part.value?.occurence.transform[3] as number,
            part.value?.occurence.transform[4] as number,
            part.value?.occurence.transform[5] as number,
            part.value?.occurence.transform[6] as number,
            part.value?.occurence.transform[7] as number,
            part.value?.occurence.transform[8] as number,
            part.value?.occurence.transform[9] as number,
            part.value?.occurence.transform[10] as number,
            part.value?.occurence.transform[11] as number,
            part.value?.occurence.transform[12] as number,
            part.value?.occurence.transform[13] as number,
            part.value?.occurence.transform[14] as number,
            part.value?.occurence.transform[15] as number,
          );
          gltfScene.applyMatrix4(matrix);

          // gltfScene.position.set((part.occurence.transform[3] *= -1), (part.occurence.transform[11]), part.occurence.transform[7]);
          // gltfScene.rotation.set(0,part.occurence.transform[2],0);
          gltfScene.position.set((part.value?.occurence.transform[3] as number), (part.value?.occurence.transform[7] as number), part.value?.occurence.transform[11] as number);
          dispatch({ type: 'append', payload: gltfScene })
        },
        (err) => { // onError
          throw new Error(`Error loading GLTF: ${err}`);
        });
    }
    // props.gltf.forEach(async (p) => {
    //   await p.gltf.then(async (m) => {
    //     await gltf(p, m);
    //   })
    // })
    for (let node of props.gltf.preOrderTraversal()) {
      if (node.type === 'Part') {
        (node as GltfNode).value?.gltf.then(async (m: any) => {
          await gltf(node, m);
        })
      }
    }

  }, [props.gltf]);

  return (
    <group>

      {model?.map((m, i) => {

        return (
          <Suspense key={i} fallback={null}>
            <primitive object={m} />
          </Suspense>
        )
      })}
    </group>
  )
}

export default GLTFComponent