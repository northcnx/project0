"use client"
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react"
import { useProgress, Html } from "@react-three/drei"
import * as THREE from "three"
import Model from "./ModleHome" // อย่าลืมบีบอัดไฟล์ 3D (Draco) ที่อยู่ในนี้ด้วยนะครับ
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import dynamic from 'next/dynamic'
import { Kanit } from 'next/font/google'

// โหลด Font ผ่าน Server ของเราเอง ลด Request ไป Google
const kanit = Kanit({
  weight: ['400', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
})

// โหลด Component กราฟแบบ Lazy Load (โหลดเมื่อจำเป็นเท่านั้น)
const DashboardCharts = dynamic(() => import('./DashboardCharts'), {
  ssr: false,
  loading: () => <div style={{ color: 'white', padding: '20px' }}>กำลังโหลดข้อมูลกราฟ...</div>
})

// ===== Loader =====
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className={kanit.className} style={{ color: "white", fontSize: "16px" }}>
        {progress.toFixed(1)} % loaded
      </div>
    </Html>
  )
}

// ===== Camera Tracker =====
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

// ===== Lights =====
function SceneLights() {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(0, 0, 0)
      lightRef.current.target.updateMatrixWorld()
    }
  }, [])
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        ref={lightRef}
        position={[-9.1, 119.75, 67.99]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={10000}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={110}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />
    </>
  )
}

// ===== Camera HUD =====
function CameraHUD({ hoverict }: { hoverict: boolean }) {
  const [show, setShow] = useState(false);
  const [showall, setShowall] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [showHud, setShowHud] = useState(false);
  const [animateHide, setAnimateHide] = useState(false);

  useEffect(() => {
    if (hoverict) {
      setShowHud(true)
      setAnimateHide(false)
    } else if (showHud) {
      setAnimateHide(true)
    }
  }, [hoverict])

  useEffect(() => {
    if (show1) { setShow2(false); setShow3(false); }
  }, [show1]);

  useEffect(() => {
    if (show2) { setShow1(false); setShow3(false); }
  }, [show2]);

  useEffect(() => {
    if (show3) { setShow1(false); setShow2(false); }
  }, [show3]);

  return (
    <div className={kanit.className}>
      <div className="tab-ict">
        {showHud && (
          <div
            className={`camera-hud3 ${animateHide ? "hide" : "show"}`}
            onAnimationEnd={() => {
              if (animateHide) {
                setShowHud(false)
                setAnimateHide(false)
              }
            }}
          >
            {/* ใช้ next/image แทน img */}
            <Image src="/imj/BICT2.png" alt="BICT" width={200} height={100} className="camera-logo" />
          </div>
        )}
      </div>
      
      {show && (
        <>
          <div className="BFM_BO" onClick={() => setShow(!show)}></div>
          <div className="BFM_B" >
            <div className="Tab1">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="C1" >
                  <p className="C1-text1">การปล่อยก๊าซ<br />เรือนกระจกทางตรง</p>
                  <div className="C1-text2">Scope1</div>
                  <div className="C1-text3">12,345</div>
                  <p className="C1-text4">tCO₂e</p>
                  <Image src="/imj/2.png" alt="Icon 2" width={50} height={50} className="C1-img" />
                </div>
                <div className="C2" >
                  <p className="C1-text1">การปล่อยก๊าซ<br />เรือนกระจกทางตรง</p>
                  <div className="C1-text2">Scope1</div>
                  <div className="C1-text3">12,345</div>
                  <p className="C2-text4">tCO₂e</p>
                  <Image src="/imj/3.png" alt="Icon 3" width={50} height={50} className="C2-img" />
                </div>
                <div className="C3" >
                  <p className="C1-text1">การปล่อยก๊าซ<br />เรือนกระจกทางตรง</p>
                  <div className="C1-text2">Scope1</div>
                  <div className="C1-text3">12,345</div>
                  <p className="C3-text4">tCO₂e</p>
                  <Image src="/imj/6.png" alt="Icon 6" width={50} height={50} className="C3-img" />
                </div>
                <div className="C1-h" onClick={() => setShow1(!show1)}></div>
                <div className="C2-h" onClick={() => setShow2(!show2)}></div>
                <div className="C3-h" onClick={() => setShow3(!show3)}></div>
                {show1 && <div className="C1-br" onClick={() => setShow1(!show1)}></div>}
                {show2 && <div className="C2-br" onClick={() => setShow2(!show2)}></div>}
                {show3 && <div className="C3-br" onClick={() => setShow3(!show3)}></div>}
              </div>
              <div className="Tab2">TabShow</div>
            </div>
          </div>
        </>
      )}

      <div className="b-test1">
        <div className="tab">
          <Image src="/imj/m.png" alt="Menu" width={40} height={40} className="camera-logo-1" />
          <a href="/">
            <Image src="/imj/Logoup.png" alt="Logo Up" width={80} height={80} className="camera-logo-2" />
          </a>
          <Image src="/imj/s.png" alt="Search" width={40} height={40} className="camera-logo-1" />
        </div>
      </div>

      <div className="b-test2">
        <button className="bsh" onClick={() => setShowall(!showall)}>
          ซ่อน <ChevronRight className="arrow-icon" />
        </button>
        {!showall && (
          <>
            <button className="bsh2" onClick={() => setShow(!show)}>
              ดูข้อมูลเพิ่มเติม
            </button>
            {/* เรียกใช้ Component กราฟแยกตรงนี้ จะลด Bundle size ตอนเปิดเว็บครั้งแรกได้เยอะมาก */}
            <DashboardCharts />
          </>
        )}
      </div>
      <div className="b-test3"></div>
    </div>
  )
}

// ===== Camera With Mouse =====
function CameraWithMouse() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: -11.11, y: 80.6 })

  const initPos = { x: -11.11, y: 80.6, z: 68.81 }
  const initLookAt = { x: -10.47, y: 80.18, z: 67.99 }
  const initRot = { x: -26.8, y: -23.7, z: -11.5 }
  const clampX = { min: -15, max: -9 }
  const clampY = { min: 80.3, max: 80.9 }
  const speed = 0.05

  useEffect(() => {
    camera.position.set(initPos.x, initPos.y, initPos.z)
    camera.lookAt(initLookAt.x, initLookAt.y, initLookAt.z)
    camera.rotation.set(
      THREE.MathUtils.degToRad(initRot.x),
      THREE.MathUtils.degToRad(initRot.y),
      THREE.MathUtils.degToRad(initRot.z)
    )
  }, [camera])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      let deltaX = e.clientX - centerX
      let deltaY = e.clientY - centerY
      deltaX = ((deltaX / centerX) * (clampX.max - clampX.min)) / 2
      deltaY = ((deltaY / centerY) * (clampY.max - clampY.min)) / 2
      mouse.current = { x: deltaX, y: deltaY }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, initPos.x + mouse.current.x, speed)
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, initPos.y + mouse.current.y, speed)
    const clampedX = THREE.MathUtils.clamp(smooth.current.x, clampX.min, clampX.max)
    const clampedY = THREE.MathUtils.clamp(smooth.current.y, clampY.min, clampY.max)
    camera.position.set(clampedX, clampedY, initPos.z)
    camera.lookAt(initLookAt.x, initLookAt.y, initLookAt.z)
    camera.rotation.set(
      THREE.MathUtils.degToRad(initRot.x),
      THREE.MathUtils.degToRad(initRot.y),
      THREE.MathUtils.degToRad(initRot.z)
    )
  })
  return null
}

// ===== Main Scene =====
export default function Scene() {
  const [hoverict, setHoverict] = useState(false)
  const router = useRouter();
  
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <CameraHUD hoverict={hoverict} />

      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [-8.56, 53.61, -5.19], fov: 50 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        <SceneLights />
        <CameraWithMouse />
        <CameraTracker onUpdate={() => { }} />
        <Suspense fallback={<Loader />}>
          <group
            position={[0, 0.5, 0]}
            scale={[1, 1, 1]}
            onClick={(e) => {
              if (hoverict) {
                e.stopPropagation(); 
                router.push("/ict");
              }
            }}
          >
            <Model
              speed={1}
              loop
              hoverict={(v: boolean) => setHoverict(v)}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}