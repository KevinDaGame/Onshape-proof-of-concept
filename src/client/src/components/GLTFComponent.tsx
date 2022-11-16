import { Suspense, useEffect, useReducer } from 'react'
import { Matrix4 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import GltfTree, { GltfNode } from '../data/GltfTree'
import { parsedPart } from '../types'

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
          let occ = (part.value as parsedPart).occurrence
          matrix.set(
            occ.transform[0],
            occ.transform[1],
            occ.transform[2],
            occ.transform[3],
            occ.transform[4],
            occ.transform[5],
            occ.transform[6],
            occ.transform[7],
            occ.transform[8],
            occ.transform[9],
            occ.transform[10],
            occ.transform[11],
            occ.transform[12],
            occ.transform[13],
            occ.transform[14],
            occ.transform[15],
          );
          gltfScene.applyMatrix4(matrix);
          dispatch({ type: 'append', payload: gltfScene })
        },
        (err) => { // onError
          throw new Error(`Error loading GLTF: ${err}`);
        });
    }
    for (let node of props.gltf.preOrderTraversal()) {
      
      if (node.type === 'Part') {
        console.log(`rendering ${(node.value as parsedPart).elementId}`);
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