// "use client";

// import dynamic from "next/dynamic";
// import "./test.css";

// const Scene = dynamic(() => import("@/app/Components/hometest"), { ssr: false });

// export default function Home() {
//   return (
//     <div>
//       <Scene />
//     </div>
//   );
// }

"use client";

import dynamic from "next/dynamic";
import "./login/login.css";

const Scene3 = dynamic(() => import("@/app/login/loginpage"), { ssr: false });

export default function Home() {
  return (
    <div>
      <Scene3 />
    </div>
  );
}
