"use client"

import { useGLTF, useAnimations } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ModelProps {
  speed?: number
  loop?: boolean
  sequential?: boolean
  totalFrames?: number
  [key: string]: any
}

export default function Model({
  speed = 1,
  loop = true,
  sequential = false,
  totalFrames = 1000,
  ...props
}: ModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF("/ICT5_2.glb")
  const { actions } = useAnimations(animations, group)
  const timeRef = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    scene?.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        // ✅ ปิด normal map ถ้ามี
        if ((mesh.material as any).normalMap) {
          (mesh.material as any).normalMap = null
        }

        // ✅ คำนวณ normal ใหม่ให้เรียบ
        mesh.geometry.computeVertexNormals()

        // ✅ เปลี่ยนวัสดุให้เรียบ
        mesh.material = new THREE.MeshStandardMaterial({
          color: (mesh.material as any)?.color || 0xffffff,
          roughness: 0.8,
          metalness: 0,
          flatShading: false, // false = เรียบเนียน
        })
      }
    })
  }, [scene])

  useEffect(() => {
    animations.forEach((clip) => {
      const action = actions[clip.name]
      if (!action) return
      action.reset()
      action.paused = true
      action.play()
    })
  }, [animations, actions])

  useFrame((_, delta) => {
    if (!animations.length) return
    timeRef.current += delta * speed

    if (sequential) {
      const clip = animations[currentIndex]
      const clipFrames = totalFrames / animations.length
      const frameDuration = clip.duration / clipFrames
      let frameIndex = Math.floor(timeRef.current / frameDuration)

      if (frameIndex >= clipFrames) {
        const nextIndex = (currentIndex + 1) % animations.length
        if (nextIndex === 0 && !loop) return
        setCurrentIndex(nextIndex)
        timeRef.current = 0
        return
      }
      actions[clip.name]!.time = frameIndex * frameDuration
    } else {
      animations.forEach((clip) => {
        const frameDuration = clip.duration / totalFrames
        let frameIndex = Math.floor(timeRef.current / frameDuration)
        if (!loop && frameIndex >= totalFrames) frameIndex = totalFrames - 1
        actions[clip.name]!.time = frameIndex * frameDuration
      })
      if (loop && timeRef.current / totalFrames >= 1) timeRef.current = 0
    }
  })

  return <primitive ref={group} object={scene} {...props} />
}
