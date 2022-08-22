import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Popover } from 'antd';
import {
  OrbitControls, useGLTF, Sphere, Html, Bounds, useBounds,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  Outline, EffectComposer,
} from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import { StatisticCard } from '@ant-design/pro-card';
import { CloseCircleOutlined } from '@ant-design/icons';
// import { useSpring, a } from "@react-spring/three";
// import { useDrag } from '@use-gesture/react';
import { Func } from '$utils';
import boxStyle from './style.css';

// 布点展示组件
function LockSceneBox(props) {
  const {
    hotSpot, spotSize, gltfSize, selectedStation, onCloseHtml,
  } = props;

  return (
    <Sphere
      name={`${hotSpot.id}`}
      position={[hotSpot.position.hotspot.position.x, hotSpot.position.hotspot.position.y, hotSpot.position.hotspot.position.z]}
      args={[spotSize * gltfSize / 1000, 32, 16]}
    >
      <meshPhongMaterial attach="material" color="#01cd88" transparent />
      {
        selectedStation?.hotSpot?.id === hotSpot.id && (
          <Html>
            <div className={boxStyle['html-popover-div']}>
              <i className={boxStyle['html-popover-div-i']} />
              <StatisticCard.Group title={selectedStation?.name} direction="column" extra={<CloseCircleOutlined onClick={onCloseHtml} />}>
                <StatisticCard
                  statistic={{
                    title: '标签部位',
                    value: selectedStation?.labels?.toString() || '无',
                  }}
                />
                {
                  selectedStation?.lastData?.map((v) => (
                    <>
                      <StatisticCard.Divider type="horizontal" />
                      <StatisticCard
                        statistic={{
                          title: v.name,
                          value: v.value,
                          description: v.time,
                          suffix: v.unit,
                        }}
                      />
                    </>
                  ))
                }

              </StatisticCard.Group>
            </div>
          </Html>
        )
      }

    </Sphere>

  );
}

// 模型加载组件
function Model(props) {
  const {
    heatMap, orbitControls, changedCameraInfo, onGltfInfo,
  } = props;
  const gltf = useGLTF(Func.downloadFile(`${heatMap.portrait}`));

  const { camera } = useThree();

  // 切换截面设置相机
  useEffect(() => {
    if (changedCameraInfo) {
      const { current: control } = orbitControls;
      if (changedCameraInfo.position) {
        camera.position.x = changedCameraInfo.position.x;
        camera.position.y = changedCameraInfo.position.y;
        camera.position.z = changedCameraInfo.position.z;
      }

      if (changedCameraInfo.target) {
        control.target.x = changedCameraInfo.target.x;
        control.target.y = changedCameraInfo.target.y;
        control.target.z = changedCameraInfo.target.z;
      }
    }
  }, [changedCameraInfo]);

  // 加载后回调用于截面获取three相关对象
  useEffect(() => {
    // 计算加载模型的包围盒，重新定义相机位置
    const boxHelper = new THREE.BoxHelper();
    const { scene: geometry } = gltf;
    boxHelper.setFromObject(geometry);
    const { center } = boxHelper.geometry.boundingSphere;
    const { radius } = boxHelper.geometry.boundingSphere;

    onGltfInfo && onGltfInfo(Math.ceil(radius));
    const cameraPosition = heatMap?.model?.camera?.position;
    if (cameraPosition?.x && cameraPosition?.y && cameraPosition?.z) {
      camera.position.x = cameraPosition.x;
      camera.position.y = cameraPosition.y;
      camera.position.z = cameraPosition.z;
    } else {
      const cameraPos = new THREE.Vector3(center.x + geometry.position.x, center.y + geometry.position.y, radius * 2 + center.z + geometry.position.z);

      camera.position.x = cameraPos.x;
      camera.position.y = cameraPos.y;
      camera.position.z = cameraPos.z;

      const lookPos = new THREE.Vector3(center.x + geometry.position.x, center.y + geometry.position.y, center.z + geometry.position.z);
      const { current: control } = orbitControls;
      control.target.x = lookPos.x;
      control.target.y = lookPos.x;
      control.target.z = lookPos.x;
      camera.lookAt(lookPos);
    }
  }, []);

  return (
    <primitive object={gltf.scene} dispose={null} />
  );
}

// 处理相机平滑切换
function SelectToZoom({ selectedStation, children }) {
  const api = useBounds();
  const { scene } = useThree();

  // 设备漫游
  useEffect(() => {
    if (selectedStation?.hotSpot?.id) {
      const threeObject = scene.getObjectByName(`${selectedStation.hotSpot.id}`);
      if (threeObject) {
        api.refresh(threeObject).fit();
        // onShowLabel && onShowLabel(threeObject, false);
      }
    }
  }, [selectedStation]);

  return (
    <group>
      {children}
    </group>
  );
}

export default function HeatModel(props) {
  const groupRef = useRef();
  const orbitControls = React.useRef(null);
  const [gltfSize, setGltfSize] = useState(1);
  const { heatMap, selectedStation, onCloseHtml } = props;

  const hotSpotMap = Array.isArray(heatMap.hotspots) ? heatMap.hotspots : [];
  const { scene } = useThree();
  const outLineSelection = [];
  hotSpotMap.forEach((f) => {
    const mesh = scene.getObjectByName(`${f.id}`);
    mesh && outLineSelection.push(mesh);
  });

  const onGltfInfo = (size) => {
    setGltfSize(size);
  };
  return (
    <group ref={groupRef} dispose={null}>
      <Model {...props} onGltfInfo={onGltfInfo} orbitControls={orbitControls} />
      <Bounds margin={8.8}>
        <SelectToZoom selectedStation={selectedStation}>
          {
            hotSpotMap.map((spot) => (
              <LockSceneBox
                selectedStation={selectedStation}
                key={spot.id}
                hotSpot={spot}
                gltfSize={gltfSize}
                spotSize={parseInt(heatMap.hotspotsSize) || 5}
                orbitControls={orbitControls}
                onCloseHtml={onCloseHtml}
                {...props}
              />
            ))
          }
        </SelectToZoom>

      </Bounds>

      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          blur
          selection={outLineSelection.length > 0 ? outLineSelection : undefined}
          visibleEdgeColor={0x4169E1}
          hiddenEdgeColor={0x6495ED}
          edgeStrength={20}
          width={920}
          pulseSpeed={0.6}
          kernelSize={KernelSize.SMALL}
        />
      </EffectComposer>
      <OrbitControls ref={orbitControls} makeDefault />
    </group>
  );
}
