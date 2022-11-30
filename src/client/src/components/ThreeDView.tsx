import { Canvas } from '@react-three/fiber'
import GLTFComponent from './GLTFComponent'
import { useRef, useState } from 'react'
import InputComponent from './InputComponent'
import Box from './Box'
import { AxesHelper, Vector3 } from 'three'
import GltfTree from '../data/GltfTree'
import { OrbitControls } from '@react-three/drei'

type props = {
  gltfTree: GltfTree
  cache: Array<{name: string, gltf: Promise<any>}>
}
const ThreeDView = (props: props) => {
  const [cameraPosition] = useState([0, -1, 0]);

  return (
    <div style={{ height: '100vh' }}>

      <Canvas shadows orthographic camera={{ position: cameraPosition }}>
      
        <OrbitControls />
        <color attach={"background"} args={[0xbbbbbb]} />
        <directionalLight intensity={1} position-x={1} position-z={0} position-y={-3}></directionalLight>
        <ambientLight intensity={0.4}></ambientLight>
        <primitive object={new AxesHelper(1)} />
        {props.gltfTree ? <GLTFComponent gltf={props.gltfTree} models={props.cache}/> : <Box></Box>}
      </Canvas>
    </div>
  )
}

export default ThreeDView
