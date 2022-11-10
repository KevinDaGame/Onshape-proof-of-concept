import { Canvas } from '@react-three/fiber'
import GLTFComponent from './GLTFComponent'
import { CameraControls } from './camera-controls.js'
import { useEffect, useRef, useState } from 'react'
import DataComponent from './DataComponent'
import InputComponent from './InputComponent'
import Box from './Box'
import { part } from '../types'

type props = {
  gltf: part[]
  getModel: Function
}
const ThreeDView = (props: props) => {
  const cameraControls = useRef(null);
  const [cameraPosition, setCameraPosition] = useState([10, 10, 10]);
  const [crown_size, setCrown_size] = useState(1);

  const onConfirm = () => {
    props.getModel([{ key: 'crown_size', value: crown_size, unit: 'cm' }]);
  }
  return (
    <div style={{ height: '100vh' }}>

      <Canvas camera={{ position: cameraPosition }}>
        <CameraControls ref={cameraControls} />
        <color attach={"background"} args={[0x999999]} />
        <directionalLight intensity={1} position-x={10} position-z={3} position-y={2}></directionalLight>
        <ambientLight intensity={0.1}></ambientLight>
        {props.gltf ? <GLTFComponent gltf={props.gltf} /> : <Box></Box>}
      </Canvas>
      <div className='dataObj'>
        <DataComponent data={[
          { key: 'x', value: cameraPosition[0] },
          { key: 'y', value: cameraPosition[1] },
          { key: 'z', value: cameraPosition[2] }
        ]} />
        <InputComponent text="smile depth" onSet={setCrown_size} minVal={1} maxVal={20} defaultVal={crown_size} />
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  )
}

export default ThreeDView
