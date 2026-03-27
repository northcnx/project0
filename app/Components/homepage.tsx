"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useState, useRef, useEffect } from "react"
import { useProgress, Html } from "@react-three/drei"
import * as THREE from "three"
import Model from "./ModleHome"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";

// ===== Loader =====
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ color: "white", fontFamily: "'Kanit', sans-serif", fontSize: "16px" }}>
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
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [showHud, setShowHud] = useState(false)
  const [animateHide, setAnimateHide] = useState(false)

  useEffect(() => {
    if (hoverict) {
      setShowHud(true)
      setAnimateHide(false)
    } else if (showHud) {
      setAnimateHide(true)
    }
  }, [hoverict])


//===================================================================
// ============================================================
// ✅ DATA 1
// ============================================================
const data1 = [
  { year: "2025", ขอบเขตที่1: 30, ขอบเขตที่2: 25, ขอบเขตที่3: 15, รวมทั้งหมด: 70 },
  { year: "2024", ขอบเขตที่1: 25, ขอบเขตที่2: 20, ขอบเขตที่3: 15, รวมทั้งหมด: 60 },
  { year: "2023", ขอบเขตที่1: 20, ขอบเขตที่2: 15, ขอบเขตที่3: 15, รวมทั้งหมด: 50 },
];

// ============================================================
// ✅ DATA 2
// ============================================================
const data2 = [
  { year: "2025", tCO2e: 15, รวมทั้งหมด: 15 },
  { year: "2024", tCO2e: 30, รวมทั้งหมด: 30 },
  { year: "2023", tCO2e: 50, รวมทั้งหมด: 50 },
];

// ============================================================
// ✅ DATA 3 (DOUGHNUT)
// ============================================================
const doughnutData = [
  { name: "ขอบเขตที่1", value: 60, color: "#FEA500" },
  { name: "ขอบเขตที่2", value: 22, color: "#FF339A" },
  { name: "ขอบเขตที่3", value: 18, color: "#0066CB" },
];

// ============================================================
// ✅ Custom Tooltip 1
// ============================================================
const CustomTooltip1 = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sorted = payload
      .filter((p: any) => p.dataKey !== "รวมทั้งหมด")
      .sort((a: any, b: any) => {
        const order = ["ขอบเขตที่1", "ขอบเขตที่2", "ขอบเขตที่3"];
        return order.indexOf(a.dataKey) - order.indexOf(b.dataKey);
      });

    return (
      <div
        style={{
          background: "#fff",
          padding: 10,
          borderRadius: 15,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          fontFamily: "Kanit",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 20 }}>{label}</div>
        {sorted.map((entry: any, i: number) => (
          <div key={i} style={{ fontWeight: "bold", color: entry.fill }}>
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================
// ✅ Custom Tooltip 2
// ============================================================
const CustomTooltip2 = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload.find((p: any) => p.dataKey === "tCO2e");
    return (
      <div
        style={{
          background: "#fff",
          padding: 10,
          borderRadius: 15,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          fontFamily: "Kanit",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 20 }}>{label}</div>
        {item && (
          <div style={{ fontWeight: "bold", color: "#0066CB" }}>
            {item.name}: {item.value}%
          </div>
        )}
      </div>
    );
  }
  return null;
};
  useEffect(() => {
    if (show1) {
      setShow2(false);
      setShow3(false);
    }
  }, [show1]);

  // ---- เมื่อ show2 เปิด ----
  useEffect(() => {
    if (show2) {
      setShow1(false);
      setShow3(false);
    }
  }, [show2]);

  // ---- เมื่อ show3 เปิด ----
  useEffect(() => {
    if (show3) {
      setShow1(false);
      setShow2(false);
    }
  }, [show3]);

  return (
    <>
    <div className="b-test">
      <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet" />
      <div className="camera-hud">
        <div className="Tab">
          <img src="./imj/m.png" className="camera-logo-m" />
        <a href="/">
          <img src="./imj/Logoup.png" className="camera-logo" />
        </a>
        <img src="./imj/s.png" className="camera-logo-m" />
        </div>
      </div>

      {showHud && (
        <div>
          <div
            className={`camera-hud3 ${animateHide ? "hide" : "show"}`}
            onAnimationEnd={() => {
              if (animateHide) {
                setShowHud(false)
                setAnimateHide(false)
              }
            }}
          >
            <img src="./imj/BICT2.png" className="camera-logo" />
          </div>
        </div>
      )}

      {/* ===== Bar Chart ===== */}
      <div className="plot1">
        <div className="YS">
          <select className="YCC">
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
          <span className="title1"> </span>
          <i className="fa-solid fa-chevron-down icon" ></i>
        </div>
        <div className="titplot1">
          <div className="T20">TOTAL<div className="T16">EMISSION</div><div className="TC">.........................................</div></div>
          <div className="T20">12,456<div className="T16">tCO2e</div><div className="TC">.............................................................................................</div></div>
        </div>
        <div className="item1">
          <div className="legend">
            <div className="item"><span className="dot orange"></span>60.00 %</div>
            <div className="item"><span className="dot pink"></span>22.00 %</div>
            <div className="item"><span className="dot blue"></span>18.00 %</div>
          </div>
          </div>
        <div className="plot11">
          <ResponsiveContainer width="70%" height="100%" >
            <PieChart>
              <Pie
              data={[
                { name: "ขอบเขตที่1", value: 60, color: "#FEA500" },
                { name: "ขอบเขตที่2", value: 22, color: "#FF339A" },
                { name: "ขอบเขตที่3", value: 18, color: "#0066CB" },
              ]}
              dataKey="value"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={180}
              endAngle={-180}
              paddingAngle={5}
              cornerRadius={30}
            >
              {["#FEA500", "#FF339A", "#0066CB"].map((color, i) => (
                <Cell key={i} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>        
       </div>
      </div>
      {/*============================*/}
      <div className="plot2">
        <div className="titplot1">
          <div className="T20">TOTAL Emission<div className="TC">........................................................................................................................................................................................................................</div></div>
        </div>
        <div className="plot22">
        <ResponsiveContainer>
            <ComposedChart
              data={[
                { year: "2025", ขอบเขตที่1: 30, ขอบเขตที่2: 25, ขอบเขตที่3: 15, รวมทั้งหมด: 70 },
                { year: "2024", ขอบเขตที่1: 25, ขอบเขตที่2: 20, ขอบเขตที่3: 15, รวมทั้งหมด: 60 },
                { year: "2023", ขอบเขตที่1: 20, ขอบเขตที่2: 15, ขอบเขตที่3: 15, รวมทั้งหมด: 50 },
              ]}
            >
              <XAxis
                dataKey="year"
                tick={{ fill: "#545454", fontSize: 14, fontFamily: "Kanit", fontWeight: "bold" }}
              />
              <YAxis
                tick={{ fill: "#545454", fontSize: 14, fontFamily: "Kanit", fontWeight: "bold" }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const sorted = payload
                      .filter((p) => p.dataKey !== "รวมทั้งหมด")
                      .sort((a, b) => {
                        const order = ["ขอบเขตที่1", "ขอบเขตที่2", "ขอบเขตที่3"];
                        return order.indexOf(a.dataKey) - order.indexOf(b.dataKey);
                      });
                    return (
                      <div className="plontbar1">
                        
                        <div style={{ fontWeight: "bold", fontSize: 18, padding:1,}}>{label}</div>
                        <div className="TC1">..................................................................................</div>
                        {sorted.map((item, i) => (
                          <div key={i} style={{ fontWeight: "bold", color: item.fill }}>
                            {item.name}: {item.value}
                          </div>
                        ))}
                        
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Bar dataKey="ขอบเขตที่3" stackId="a" fill="#FF339A" />
              <Bar dataKey="ขอบเขตที่2" stackId="a" fill="#0066CB" />
              <Bar dataKey="ขอบเขตที่1" stackId="a" fill="#FEA500"  radius={[6, 6, 0, 0]}/>
              <Line
                type="monotone"
                dataKey="รวมทั้งหมด"
                stroke="#545454"
                strokeWidth={4}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/*============================*/}
      <div className="plot3">
         <div className="titplot1">
          <div className="T20">TOTAL<div className="T16">GHG Removal</div><div className="TC">.........................................</div></div>
          <div className="T20">12,456<div className="T16">tCO2e</div><div className="TC">.............................................................................................</div></div>
        </div>
        <div className="plot33 ">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={[
              { year: "2025", tCO2e: 12456, รวมทั้งหมด: 12456 },
              { year: "2024", tCO2e: 22456, รวมทั้งหมด: 22456 },
              { year: "2023", tCO2e: 32456, รวมทั้งหมด: 32456 },
            ]}
          >
            <XAxis
              dataKey="year"
              tick={{ fill: "#545454", fontSize: 14, fontFamily: "Kanit", fontWeight: "bold" }}
            />
            <YAxis
              tick={{ fill: "#545454", fontSize: 14, fontFamily: "Kanit", fontWeight: "bold" }}
              domain={[0, 50000]}
              ticks={[0,10000, 30000, 50000]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload.find((p) => p.dataKey === "tCO2e");
                  return (
                    <div className="plontbar1">
                      <div style={{ fontWeight: "bold", fontSize: 18,}}>{label}</div>
                      {item && (
                        <div style={{ fontWeight: "bold", color: "#0066CB" }}>
                          <div className="TC1">..................................................................................</div>
                          <div className="TC2">{item.value}</div>
                          <div className="TC3">tCO2e</div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="tCO2e" fill="#59E717" radius={[8, 8, 0, 0]} />
            <Line
              type="monotone"
              dataKey="รวมทั้งหมด"
              stroke="#545454"
              strokeWidth={4}
              dot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        </div>
      </div>
      {/*============================*/}
      <div className="plot4">
        <div className="titplot1">
          <img src="./imj/TE.png"/>
        </div>
      </div>
      {/*============================*/}
      <img src="./imj/2.png" className="camera-logo2" />
      <div className="plot5">
        <div className="titplot1">
          <div className="T20_S">การปล่อยก๊าซ<br />เรือนกระจกทางตรง
          <div className="T20_S1">Scope 1</div>
          <div className="S2"><div className="T20_S2">12,456</div><div className="T20_S22">tCO2e</div></div>
          </div>
        </div>
      </div>
      {/*============================*/}
      <img src="./imj/3.png" className="camera-logo3" />
      <div className="plot6">
        <div className="titplot1">
          <div className="T20_S">การปล่อยก๊าซ<br />เรือนกระจกทางอ้อม
          <div className="T20_S1">Scope 2</div>
          <div className="S2"><div className="T20_S2">12,456</div><div className="T20_S22">tCO2e</div></div>
          </div>
        </div>
      </div>
      {/*============================*/}
      <img src="./imj/6.png" className="camera-logo4" />
      <div className="plot7">
        <div className="titplot1">
          <div className="T20_S">การปล่อยก๊าซ<br />เรือนกระจกทางอ้อม
          <div className="T20_S1">Scope 3</div>
          <div className="S2"><div className="T20_S2">12,456</div><div className="T20_S22">tCO2e</div></div>
          </div>
        </div>
      </div>
      {/*============================*/}
      
      <div className="BF">
        <button onClick={() => setShow(!show)}>ดูข้อมูลเพิ่มเติม</button>
      </div>
      {show && (
        <div className="BFM_B">
        <div className="BFM" onClick={() => setShow(!show)}></div>
        <div className="BFF">
          <div className="BFF_Tab">
            <div className="BFF1-1" onClick={() => setShow1(!show1)}></div>
            {show2 && (
              <div className="BFF2-1S"></div>
            )}
            {show3 && (
              <div className="BFF3-1S"></div>
            )}
            {show1 && (
              <div className="BFF1-1S"></div>
            )}
            <div className="BFF2-1" onClick={() => setShow2(!show2)}></div>
            <div className="BFF3-1" onClick={() => setShow3(!show3)}></div>
              <div className="BFF1">
                <div className="BFF111">
                  <div className="BFF1_T1">การปล่อยก๊าซ<br />เรือนกระจกทางตรง</div><div className="BFF1_T2">Scope 1</div><div className="BFF1_T3">12,345<div className="BFF1_T4">tCO₂e</div></div>
                </div>
                <img src="./imj/2.png" className="logo-m" />
              </div>
          <div className="BFF1">
            <div className="BFF111">
              <div className="BFF1_T11">การปล่อยก๊าซ<br />เรือนกระจกทางอ้อม</div><div className="BFF1_T22">Scope 2</div><div className="BFF1_T33">12,345<div className="BFF1_T44">tCO₂e</div></div>
            </div>
              <img src="./imj/5.png" className="logo-m1" /></div>
          <div className="BFF1">
            <div className="BFF111">
              <div className="BFF1_T111">การปล่อยก๊าซ<br />เรือนกระจกทางอ้อม</div><div className="BFF1_T222">Scope 3</div><div className="BFF1_T333">12,345<div className="BFF1_T444">tCO₂e</div></div>
            </div>
            <img src="./imj/6.png" className="logo-m2" /></div>
        </div>
        <div className="BFF_Tab2">
        <div className="BFF2">

         </div>
        </div>
          <div className="BFF3">
          </div>
        </div>
        </div>
      )}
      </div>
    </>
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
        <CameraTracker onUpdate={() => {}} />
        <Suspense fallback={<Loader />}>
          <group position={[0, 0.5, 0]} scale={[1, 1, 1]}>
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
