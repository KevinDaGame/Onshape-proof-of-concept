import { Canvas } from '@react-three/fiber'
import GLTFComponent from './GLTFComponent'
import { CameraControls } from './camera-controls.js'
import { useRef, useState } from 'react'
import InputComponent from './InputComponent'
import Box from './Box'
import { AxesHelper } from 'three'
import GltfTree from '../data/GltfTree'
import { parsedPart } from '../types'

type props = {
  gltfTree: GltfTree
}
const ThreeDView = (props: props) => {
  const cameraControls = useRef(null);
  const [cameraPosition] = useState([0, -1, 0]);
  const [crown_size, setCrown_size] = useState(1);

  return (
    <div style={{ height: '100vh' }}>

      <Canvas orthographic camera={{ position: cameraPosition }}>
        <CameraControls ref={cameraControls} />
        <color attach={"background"} args={[0x999999]} />
        <directionalLight intensity={1} position-x={10} position-z={3} position-y={2}></directionalLight>
        <ambientLight intensity={0.4}></ambientLight>
        <primitive object={new AxesHelper(1)} />
        {props.gltfTree ? <GLTFComponent gltf={props.gltfTree} /> : <Box></Box>}
      </Canvas>
    </div>
  )
}

export default ThreeDView
