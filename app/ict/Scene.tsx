"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useState, useRef, useEffect } from "react"
import { useProgress, Html } from "@react-three/drei"
import * as THREE from "three"
import Model from "./Model"

// ================= Loader =================
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontFamily: "monospace",
          fontSize: "16px",
        }}
      >
        {progress.toFixed(1)} % loaded
      </div>
    </Html>
  )
}

// ================= Camera Tracker =================
function CameraTracker({ onUpdate }: { onUpdate: (info: any) => void }) {
  useFrame(({ camera }) => {
    const lookAt = new THREE.Vector3()
    camera.getWorldDirection(lookAt)
    const lookAtPos = new THREE.Vector3().addVectors(camera.position, lookAt)

    const info = {
      pos: [camera.position.x, camera.position.y, camera.position.z],
      rot: [
        THREE.MathUtils.radToDeg(camera.rotation.x),
        THREE.MathUtils.radToDeg(camera.rotation.y),
        THREE.MathUtils.radToDeg(camera.rotation.z),
      ],
      lookAt: [lookAtPos.x, lookAtPos.y, lookAtPos.z],
    }
    onUpdate(info)
  })

  return null
}

// ================= Light =================
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-9.1, 119.75, 21.75]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </>
  )
}

// ================= Ground =================
function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.4} />
    </mesh>
  )
}

// ================= HUD Panel =================
function CameraHUD({ info }: { info: any }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "14px",
        zIndex: 1000,
      }}
    >
      <div><strong>Camera Position</strong></div>
      <div>
        X: {info.pos[0].toFixed(2)} | Y: {info.pos[1].toFixed(2)} | Z:{" "}
        {info.pos[2].toFixed(2)}
      </div>
      <div><strong>Camera Rotation</strong></div>
      <div>
        X: {info.rot[0].toFixed(1)}° | Y: {info.rot[1].toFixed(1)}° | Z:{" "}
        {info.rot[2].toFixed(1)}°
      </div>
      <div><strong>Camera LookAt</strong></div>
      <div>
        X: {info.lookAt[0].toFixed(2)} | Y: {info.lookAt[1].toFixed(2)} | Z:{" "}
        {info.lookAt[2].toFixed(2)}
      </div>
    </div>
  )
}

// ================= CameraWithMouse =================
function CameraWithMouse() {
  const { camera } = useThree()
  const target = { x: -8.13, y: 52.93, z: -4.57 } // จุดที่กล้องหันไป
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: -8.56, y: 53.61 }) // ตำแหน่ง smooth ปัจจุบัน

  // ตั้งตำแหน่งเริ่มต้น
  useEffect(() => {
    camera.position.set(-8.56, 53.61, -5.19)
    camera.lookAt(target.x, target.y, target.z)
  }, [camera])

  // อ่านตำแหน่งเมาส์
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      let deltaX = e.clientX - centerX
      let deltaY = e.clientY - centerY

      deltaX = (deltaX / centerX) * 0.24 // ขอบเขต X
      deltaY = (deltaY / centerY) * 0.23 // ขอบเขต Y

      mouse.current = { x: deltaX, y: deltaY }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // อัปเดตตำแหน่งกล้องทุก frame
  useFrame(() => {
    smooth.current.x = THREE.MathUtils.lerp(
      smooth.current.x,
      -8.56 + mouse.current.x,
      0.01
    )
    smooth.current.y = THREE.MathUtils.lerp(
      smooth.current.y,
      53.74 + mouse.current.y,
      0.01
    )

    camera.position.x = THREE.MathUtils.clamp(smooth.current.x, -8.63, -8.28)
    camera.position.y = THREE.MathUtils.clamp(smooth.current.y, 53.55, 53.67)
    camera.lookAt(target.x, target.y, target.z)
  })

  return null
}

// ================= Main Scene =================
export default function Scene() {
  const [cameraInfo, setCameraInfo] = useState({
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    lookAt: [0, 0, 0],
  })

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* HUD Debug */}
      <CameraHUD info={cameraInfo} />

      <Canvas
        shadows
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [-8.56, 53.61, -5.19], fov: 50 }}
      >
        {/* Light */}
        <SceneLights />

        {/* กล้องขยับตามเมาส์ */}
        <CameraWithMouse />

        {/* Model */}
        <Suspense fallback={<Loader />}>
          <group position={[0, 0, 0]} scale={[1, 1, 1]}>
            <Model speed={1} loop sequential totalFrames={1000} />
          </group>
        </Suspense>

        {/* Ground */}
        <Ground />

        {/* Camera Tracker */}
        <CameraTracker onUpdate={setCameraInfo} />
      </Canvas>
    </div>
  )
}
