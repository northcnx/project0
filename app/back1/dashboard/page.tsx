import dynamic from "next/dynamic";
import "../back1.css";
const Scene2 = dynamic(() => import("@/app/back1/backpage1"), { ssr: false });

export default function Main() {
  return (
    <main className="h-full">
      <Scene2 />
    </main>
  );
}