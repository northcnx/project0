"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// ================= Loader =================
import { Suspense } from "react"
import { useProgress, Html } from "@react-three/drei"

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

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [error, setError] = useState({ username: false, password: false });

    useEffect(() => {
        const savedUser = localStorage.getItem("username");
        const savedPass = localStorage.getItem("password");
        if (savedUser && savedPass) {
            setUsername(savedUser);
            setPassword(savedPass);
            setRemember(true);
        }
    }, []);

    const handleLogin = async () => {
        let hasError = false;

        if (!username) {
            setError((prev) => ({ ...prev, username: true }));
            hasError = true;
        }
        if (!password) {
            setError((prev) => ({ ...prev, password: true }));
            hasError = true;
        }

        if (hasError) return;

        // reset error
        setError({ username: false, password: false });
        if (!username || !password) {
            setLoginFail(true);
            return;
        }

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });


            const data = await res.json();

            if (!data.success) {
                setLoginFail(true);
                return;
            }


            console.log("Login success! Token:", data.token);


            localStorage.setItem("token", data.token);

            if (remember) {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
            } else {
                localStorage.removeItem("username");
                localStorage.removeItem("password");
            }

            // Redirect ตาม role
            if (data.role === "admin") {
                window.location.href = "/back1/dashboard";
                localStorage.setItem("token", data.token);
                window.location.href = "/back1/dashboard";
            }

            else {
                window.location.href = "/back2/dashboard";
                localStorage.setItem("token", data.token);
                window.location.href = "/back2/dashboard";
            }


        } catch (err) {
            console.error(err);
            setLoginFail(true);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                handleLogin();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [username, password, remember]);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Kanit&display=swap"
                rel="stylesheet"
            />
            <div className="box fade-in">
                {loginFail && (
                    <div className="boxlogin-ck-b" onClick={() => setLoginFail(!loginFail)}>
                        <div className="boxlogin-ck">
                            <p>ชื่อผู้ใช่และรหัสผ่านไม่ถูกต้อง</p>
                            <button onClick={() => setLoginFail(!loginFail)}>ตกลง</button>
                        </div>
                    </div>
                )}
                <div className="boxlogin">
                    <img src="/imj/logoup1.png" className="imglogo-1l" />
                    <img src="/imj/logoup2.png" className="imglogo-2l" />
                    <div className="login-text"><p>ศูนย์สิ่งแวดล้อมและการจัดการที่ยั่งยืน</p></div>
                    <div className="boxlogin-user">
                        <div className="boxlogin-user-tab1">
                            <div className="boxlogin-user-h">ลงชื่อเพื่อเข้าใช้งานระบบ</div>
                            <div className="boxlogin-user-hu">Username</div>
                            <div className={`boxlogin-user-img1 ${error.username ? "shake" : ""}`}>
                                <img src="/imj/username.png" className="imglogo-3l" />
                                <input
                                    type="text"
                                    className={`boxlogin-user-id ${error.username ? "error" : ""}`}
                                    placeholder="Username"
                                    autoComplete="off"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="boxlogin-user-hp">Password</div>
                            <div className={`boxlogin-user-img2 ${error.password ? "shake" : ""}`}>
                                <img src="/imj/password.png" className="imglogo-4l" />
                                <input
                                    type="password"
                                    className={`boxlogin-user-password ${error.password ? "error" : ""}`}
                                    placeholder="Password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="boxlogin-user-tab2">
                                <input
                                    type="checkbox"
                                    className="boxlogin-user-ch"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <p>จำรหัสผ่าน</p>
                            </div>
                        </div>
                    </div>
                    <div className="tab-b">
                        <div className="reg" onClick={handleLogin}>เข้าสู่ระบบ</div>
                    </div>
                </div>
            </div>
        </>
    )
}
