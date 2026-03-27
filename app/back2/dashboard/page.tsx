import dynamic from "next/dynamic";
import "../back2.css";
const Scene2 = dynamic(() => import("@/app/back2/backpage2"), { ssr: false });

export default function Main() {
  return (
    <main className="h-full">
      <Scene2 />
    </main>
  );
}