/* eslint-disable */
import React, { forwardRef, useEffect, useRef } from 'react';
import { MOUSE, Vector2, Vector3, Vector4, Quaternion, Matrix4, Spherical, Box3, Sphere, Raycaster, MathUtils, } from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import CameraControlsDefault from 'camera-controls';
const subsetOfTHREE = {
    MOUSE: MOUSE,
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    Quaternion: Quaternion,
    Matrix4: Matrix4,
    Spherical: Spherical,
    Box3: Box3,
    Sphere: Sphere,
    Raycaster: Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp,
    },
};
CameraControlsDefault.install({ THREE: subsetOfTHREE });
extend({ CameraControlsDefault });
export const CameraControls = forwardRef((_, ref) => {
    const cameraControls = useRef(null);
    const camera = useThree((state) => state.camera);
    const renderer = useThree((state) => state.gl);
    useFrame((_, delta) => { var _a; return (_a = cameraControls.current) === null || _a === void 0 ? void 0 : _a.update(delta); });
    useEffect(() => () => { var _a; return (_a = cameraControls.current) === null || _a === void 0 ? void 0 : _a.dispose(); }, []);
    return (React.createElement("cameraControlsDefault", { ref: mergeRefs(cameraControls, ref), args: [camera, renderer.domElement] }));
});
function mergeRefs(...refs) {
    return (instance) => {
        for (const ref of refs) {
            if (typeof ref === 'function') {
                ref(instance);
            }
            else if (ref) {
                ref.current = instance;
            }
        }
    };
}