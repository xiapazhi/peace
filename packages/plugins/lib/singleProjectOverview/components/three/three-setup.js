/**
 * Created by Xumeng
 * on 2021/3/17. 初始化3d渲染器插槽组件
 */
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, OrbitControls } from '@react-three/drei';

function ThreeSetup({
  children,
  cameraFov = 75,
  cameraPosition = [-5, 5, 7],
  controls = true,
  ...restProps
}) {
  const canvasRef = useRef(null);

  return (
    <>
      <Canvas
        colorManagement
        shadowMap
        camera={{
          position: cameraPosition, // 相机初始配置
          fov: cameraFov,
          near: 0.001,
          far: 1000,
          zoom: 1,
        }}
        pixelRatio={window.devicePixelRatio}
        ref={canvasRef}
        {...restProps}
      >
        {children}
        <ambientLight intensity={0.8} />
        <pointLight intensity={1} position={[0, 6, 0]} />
        {controls && <OrbitControls />}
      </Canvas>
      <Loader />
    </>
  );
}
export default ThreeSetup;
