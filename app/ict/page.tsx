import dynamic from "next/dynamic"

const Scene1 = dynamic(() => import("@/app/ict/Scene"), { ssr: false })

export default function main() {
  return (
    <main className="h-full">
      <Scene1 />
    </main>
  )
}
