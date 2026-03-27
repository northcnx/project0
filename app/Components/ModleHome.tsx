"use client"

import { useGLTF } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"
import { useRouter } from "next/navigation"

interface ModelProps {
  speed?: number
  loop?: boolean
  hoverict?: (hovered: boolean) => void
}

export default function Model({
  speed = 1,
  loop = true,
  hoverict,
}: ModelProps) {
  const router = useRouter()

  const group = useRef<THREE.Group>(null!)
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const ictMesh = useRef<THREE.Mesh | null>(null)

  const clicked = useRef(false)
  const hoverState = useRef(false)

  const { scene, animations } = useGLTF("/map2.glb")
  const { camera, mouse } = useThree()

  /* -------------------- MATERIAL + SHADOW -------------------- */
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }

      if (obj.name === "ict") {
        ictMesh.current = obj as THREE.Mesh
      }
    })
  }, [scene])

  /* -------------------- ANIMATION -------------------- */
  useEffect(() => {
    if (!group.current || animations.length === 0) return

    mixer.current = new THREE.AnimationMixer(group.current)

    animations.forEach((clip) => {
      const action = mixer.current!.clipAction(clip)
      action.reset()
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
      action.play()
    })

    return () => {
      mixer.current?.stopAllAction()
      mixer.current = null
    }
  }, [animations, loop])

  /* -------------------- FRAME UPDATE -------------------- */
  useFrame((_, delta) => {
    mixer.current?.update(delta * speed)

    if (!ictMesh.current) return

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    const hit = raycaster.intersectObject(ictMesh.current, true).length > 0

    if (hoverState.current !== hit) {
      hoverState.current = hit
      hoverict?.(hit)

      gsap.to(ictMesh.current.scale, {
        x: hit ? 1.3 : 1,
        y: 1,
        z: hit ? 1.3 : 1,
        duration: hit ? 0.2 : 0.3,
        ease: hit ? "power2.out" : "elastic.out",
      })
    }
  })

  /* -------------------- CLICK -------------------- */
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (clicked.current || !ictMesh.current) return

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(pointer, camera)

    if (raycaster.intersectObject(ictMesh.current, true).length > 0) {
      clicked.current = true
      router.push("/ict")
    }
  }

  return (
    <group ref={group} onPointerDown={handlePointerDown}>
      <primitive object={scene} />
    </group>
  )
}
