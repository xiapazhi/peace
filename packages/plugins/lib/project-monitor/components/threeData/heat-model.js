import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls, useGLTF, TransformControls, Sphere, Html, Select,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  Outline, EffectComposer,
} from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
// import { useSpring, a } from "@react-spring/three";
// import { useDrag } from '@use-gesture/react';
import { Func } from '$utils';
import boxStyle from './style.css';

// 布点展示组件
function LockSceneBox(props) {
  const {
    hotSpot, spotSize, gltfSize, setSelected, selected, changeData, isSetup = false, orbitControls,
  } = props;
  const { camera, scene } = useThree();

  // let mark = 0;
  // // 布点动画处理
  // useFrame(() => {
  //   let rot = 0;
  //   if (mark === 1) {
  //     const speed = 1 - 1 * 0.1;
  //     rot = 0.012 * speed;
  //     if (groupRef.current.scale.x <= 1) {
  //       mark = 0;
  //     }
  //     groupRef.current.scale.x -= rot;
  //     groupRef.current.scale.y -= rot;
  //     groupRef.current.scale.z -= rot;
  //   } else {
  //     const speed = 1 + 1 * 0.1;
  //     rot = 0.012 * speed;
  //     if (groupRef.current.scale.x > 1.4) {
  //       mark = 1;
  //     }
  //     groupRef.current.scale.x += rot;
  //     groupRef.current.scale.y += rot;
  //     groupRef.current.scale.z += rot;
  //   }
  // });
  const onSphereClick = (e) => {
    e.stopPropagation();
    isSetup && setSelected(`${hotSpot.id}`);
  };

  const draggingChanged = () => {
    const cameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const cameraRotation = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };
    const { current: { target } } = orbitControls;
    const controlsTarget = { x: target.x, y: target.y, z: target.z };
    const box = scene.getObjectByName(selected);
    const spot = { ...hotSpot };
    spot.SpotInfo = {
      position: { x: box.position.x, y: box.position.y, z: box.position.z },
      intersection: { x: box.position.x, y: box.position.y, z: box.position.z },
      face: { x: hotSpot.position.hotspot.face.x, y: hotSpot.position.hotspot.face.y, z: hotSpot.position.hotspot.face.z },
    };

    changeData && changeData(spot, cameraPosition, cameraRotation, controlsTarget);
  };
  const onPointerMissed = (e) => {
    // 右键取消选中布点
    e.type === 'contextmenu' && isSetup && setSelected(null);
    if (isSetup && selected === `${hotSpot.id}`) {
      draggingChanged();
    }
  };
  return (
    <Sphere
      name={`${hotSpot.id}`}
      position={[hotSpot.position.hotspot.position.x, hotSpot.position.hotspot.position.y, hotSpot.position.hotspot.position.z]}
      args={[spotSize * gltfSize / 1000, 32, 16]}
      onClick={onSphereClick}
      onPointerMissed={onPointerMissed}
    >
      <meshPhongMaterial attach="material" color="#01cd88" transparent />
      <Html distanceFactor={spotSize * gltfSize / 10} className={boxStyle['html-text-block']}>{hotSpot.station.name}</Html>
    </Sphere>

  );
}
// 测点部署组件
function TransformControlsLockSceneBox(props) {
  const transformControls = useRef(null);
  const [selected, setSelected] = useState(null);
  const groupRef = useRef();
  const {
    orbitControls,
    hotSpot,
    curControlSpotId,
    hotspotMode,
    hotspotShowXYZ,
    spotSize,
    changeData,
    onShowModeControl,
    gltfSize,
    hotSpotMap,
    curSpotInfo,
    createSpot,
  } = props;

  const { scene } = useThree();
  useEffect(() => {
    if (!hotSpotMap.find((f) => `${f.id}` === selected)) {
      setSelected(null);
    }
  }, [hotSpotMap]);
  // const onSelectChange = (e) => {
  //   console.log('%c [ e ]-80', 'font-size:13px; background:pink; color:#bf2c9f;', e);
  //   setSelected(e);
  // };
  // const [wireframe, setWireframe] = useState(false);
  // const mark = 0;
  // 布点动画处理
  // useFrame(() => {
  //   let rot = 0;
  //   if (mark === 1) {
  //     const speed = 1 - 1 * 0.1;
  //     rot = 0.012 * speed;
  //     if (groupRef.current.scale.x <= 1) {
  //       mark = 0;
  //     }
  //     groupRef.current.scale.x -= rot;
  //     groupRef.current.scale.y -= rot;
  //     groupRef.current.scale.z -= rot;
  //   } else {
  //     const speed = 1 + 1 * 0.1;
  //     rot = 0.012 * speed;
  //     if (groupRef.current.scale.x > 1.4) {
  //       mark = 1;
  //     }
  //     groupRef.current.scale.x += rot;
  //     groupRef.current.scale.y += rot;
  //     groupRef.current.scale.z += rot;
  //   }
  // });
  // useEffect(() => {
  //   console.log('%c [ transformControls ]-102', 'font-size:13px; background:pink; color:#bf2c9f;', transformControls);
  //   if (transformControls.current) {
  //     const { current: controls } = transformControls;
  //     const { current: box } = groupRef;
  //     // 布点移动监听处理
  //     const callback = (event) => {
  //       const { camera } = controls;
  //       const cameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  //       const cameraRotation = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };
  //       const { current: { target } } = orbitControls;
  //       const controlsTarget = { x: target.x, y: target.y, z: target.z };
  //       const spot = { ...hotSpot };
  //       spot.SpotInfo = {
  //         position: { x: box.parent.position.x, y: box.parent.position.y, z: box.parent.position.z },
  //         intersection: { x: box.parent.position.x, y: box.parent.position.y, z: box.parent.position.z },
  //         face: { x: hotSpot.position.hotspot.face.x, y: hotSpot.position.hotspot.face.y, z: hotSpot.position.hotspot.face.z },
  //       };
  //       console.log('%c [ spot ]-118', 'font-size:13px; background:pink; color:#bf2c9f;', spot);
  //       changeData && changeData(spot, cameraPosition, cameraRotation, controlsTarget);

  //       return orbitControls.current.enabled = !event.value;
  //     };

  //     controls.addEventListener('dragging-changed', callback);
  //     return () => {
  //       controls.removeEventListener('dragging-changed', callback);
  //     };
  //   }
  //   return null;
  // });
  // 布点点击事件
  // const boxClick = (e) => {
  //   const spotId = hotSpot.id === curControlSpotId ? null : hotSpot.id;
  //   const show = !!spotId;
  //   // setWireframe(show)
  //   onShowModeControl && onShowModeControl(spotId, show);
  // };
  // showX={hotSpot.id === curControlSpotId && hotspotShowXYZ.includes('x')}
  // showY={hotSpot.id === curControlSpotId && hotspotShowXYZ.includes('y')}
  // showZ={hotSpot.id === curControlSpotId && hotspotShowXYZ.includes('z')}
  // position={[hotSpot.position.hotspot.position.x, hotSpot.position.hotspot.position.y, hotSpot.position.hotspot.position.z]}

  return (
    <>
      {
        selected && (
          <TransformControls
            ref={transformControls}
            object={scene.getObjectByName(selected)}
            mode={hotspotMode || 'translate'}
          />
        )
      }

      {hotSpotMap.map((spot) => (
        <LockSceneBox
          isSetup
          setSelected={setSelected}
          selected={selected}
          key={spot.id}
          hotSpot={spot}
          gltfSize={gltfSize}
          spotSize={spotSize}
          orbitControls={orbitControls}
          {...props}
        />
      ))}

    </>

  );
}

// 模型加载组件
function Model(props) {
  const {
    heatMap, onModelMounted, orbitControls, changedCameraInfo, onGltfInfo,
  } = props;
  const filePath = Func.downloadFile(heatMap.portrait);
  const gltf = useGLTF(filePath);
  // const gltf = useGLTF(`${heatMap.portrait}`);

  const { gl, scene, camera } = useThree();

  // 动画播放
  // const { scene, animations } = gltf;
  // const { ref, mixer, names, actions, clips } = useAnimations(animations);
  // useEffect(() => {
  //   actions && actions.geckoliblanding && actions.geckoliblanding.play()
  // })

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

    onModelMounted && onModelMounted(gl, gl.domElement, scene, camera, orbitControls);
  }, []);

  const modelClick = (e) => {
    e.stopPropagation();
    const { curSpotInfo, createSpot, orbitControls } = props;
    if (curSpotInfo) {
      const { camera: { position, rotation }, point, face } = e;
      const { current: { target } } = orbitControls;
      const camera = {
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
        target: { x: target.x, y: target.y, z: target.z },
      };
      const hotspot = {
        position: { x: point.x, y: point.y, z: point.z },
        // intersection: { x: intersection.x, y: intersection.y, z: intersection.z },
        face: { x: face.normal.x, y: face.normal.y, z: face.normal.z },
      };
      const spotData = {
        id: curSpotInfo.sensorId,
        position: {
          camera,
          hotspot,
        },
        station: {
          id: curSpotInfo.sensorId,
          name: curSpotInfo.location,
        },
      };
      createSpot && createSpot(spotData);
    }
  };
  return (
    // <mesh
    //   ref={ref}
    // // scale={[0.02, 0.02, 0.02]}
    // >
    <primitive onClick={modelClick} object={gltf.scene} dispose={null} />
    // </mesh>
  );
}

export default function HeatModel(props) {
  const groupRef = useRef();
  const orbitControls = React.useRef(null);
  const [gltfSize, setGltfSize] = useState(1);
  const { spotOnlyShow, heatMap } = props;
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
      {
        spotOnlyShow
          ? hotSpotMap.map((spot) => (
            <LockSceneBox
              key={spot.id}
              hotSpot={spot}
              gltfSize={gltfSize}
              spotSize={parseInt(heatMap.hotspotsSize) || 5}
              orbitControls={orbitControls}
              {...props}
            />
          ))
          : (
            <TransformControlsLockSceneBox
              hotSpotMap={hotSpotMap}
              gltfSize={gltfSize}
              spotSize={parseInt(heatMap.hotspotsSize) || 5}
              orbitControls={orbitControls}
              {...props}
            />
          )

      }
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
