"use client"

import { useGLTF, useAnimations } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { useFrame, ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"
import { useRouter } from "next/navigation"

interface ModelProps {
  speed?: number
  loop?: boolean
  hoverict?: (hovered: boolean) => void
  [key: string]: any
}

export default function Model({
  speed = 1,
  loop = true,
  hoverict,
  ...props
}: ModelProps) {
  const router = useRouter()
  const groupRef = useRef<THREE.Group>(null)
  
  // 1. โหลด Model และ Animations
  const { scene, animations } = useGLTF("/map3.glb") as any
  
  // 2. ใช้ hook useAnimations จัดการ Animation (Best Practice)
  const { actions } = useAnimations(animations, groupRef)

  // 3. สั่งเล่น Animation ทุกตัวที่มีในไฟล์
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          // ตั้งค่า Loop
          action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
          action.clampWhenFinished = !loop
          
          // ตั้งค่า Speed
          action.timeScale = speed
          
          // เริ่มเล่น (reset เพื่อความชัวร์ว่าเริ่มจากเฟรม 0)
          action.reset().fadeIn(0.5).play()
        }
      })
    }
    
    // Cleanup function: หยุดเมื่อเปลี่ยนหน้า
    return () => {
      Object.values(actions).forEach((action) => action?.fadeOut(0.5))
    }
  }, [actions, loop, speed])

  // Optimize 1: Config Material & Shadows
  useEffect(() => {
    if (!scene) return
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.roughness = 0.8
          child.material.metalness = 0
        }
      }
    })
  }, [scene])

  // Event Handlers
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    // ⚠️ ตรวจสอบชื่อ Object ให้ตรงกับใน Blender (ตัวพิมพ์เล็ก/ใหญ่ มีผล)
    if (e.object.name === "ict") { 
      e.stopPropagation()
      document.body.style.cursor = "pointer"
      if (hoverict) hoverict(true)

      gsap.killTweensOf(e.object.scale)
      gsap.to(e.object.scale, { 
        x: 1.3, y: 1.3, z: 1.3, // ปรับให้ขยายเท่ากันทุกแกนจะดูสมจริงกว่า (หรือแล้วแต่ดีไซน์)
        duration: 0.2, 
        ease: "bounce.out" 
      })
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (e.object.name === "ict") {
      e.stopPropagation()
      document.body.style.cursor = "auto"
      if (hoverict) hoverict(false)

      gsap.killTweensOf(e.object.scale)
      gsap.to(e.object.scale, { 
        x: 1, y: 1, z: 1, 
        duration: 0.3, 
        ease: "elastic.out(1, 0.3)" 
      })
    }
  }

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    if (e.object.name === "ict") {
      e.stopPropagation()
      router.push("/ict")
    }
  }

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {scene && (
        <primitive 
          object={scene} 
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        />
      )}
    </group>
  )
}

// Preload เพื่อให้โหลดเสร็จก่อน render
useGLTF.preload("/map3.glb")