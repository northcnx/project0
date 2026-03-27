"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Loader2, Eye, EyeOff, Check } from "lucide-react";

/*====================================================================================*/
interface Props {
  profileImage: string | null;
  fullName: string;
  facultyName: string;
  onImageChange: (newUrl: string) => void;
  onProfileUpdate: (newFullName: string) => void;
}

export default function ChangeProfile({
  profileImage,
  fullName,
  facultyName,
  onImageChange,
  onProfileUpdate,
}: Props) {
  /* ── Profile image ── */
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Profile info form ── */
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  /* ── UI state ── */
  const [saving, setSaving] = useState(false);
  const [successImg, setSuccessImg] = useState(false);
  const [successInfo, setSuccessInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  /* ── Load current profile data ── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/profile/update", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error();

        const d = await res.json();
        if (d.success && d.user) {
          setFirstname(d.user.firstname ?? "");
          setLastname(d.user.lastname ?? "");
          setEmail(d.user.email ?? "");
        }
      } catch {
        console.log("โหลดข้อมูลไม่สำเร็จ");
      }
    };

    fetchProfile();
  }, []);

  /* ── Cleanup preview ── */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ── Upload profile image ── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setSuccessImg(false);
    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profile", file);

      const res = await fetch("/api/upload-profile", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.profile_image) {
        onImageChange(data.profile_image);
        setSuccessImg(true);
        setTimeout(() => setSuccessImg(false), 3000);
      } else {
        throw new Error();
      }
    } catch {
      alert("อัปโหลดรูปไม่สำเร็จ");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  /* ── Save profile info ── */
  const handleSave = async () => {
    if (!firstname.trim() || !lastname.trim()) {
      setErrorInfo("กรุณากรอกชื่อและนามสกุล");
      return;
    }

    setErrorInfo("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const body: any = {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
      };

      // ส่ง password เฉพาะตอนมีค่า
      if (password.trim()) {
        body.password = password;
      }

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.success) {
        setPassword("");
        setSuccessInfo(true);
        onProfileUpdate(`${firstname.trim()} ${lastname.trim()}`);
        setTimeout(() => setSuccessInfo(false), 3000);
      } else {
        setErrorInfo(data.message || "เกิดข้อผิดพลาด");
      }
    } catch {
      setErrorInfo("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  const currentImage = preview || profileImage;

  /*====================================================================================*/
  return (
    <div className="cp-page  fade-in">
      <div className="cp-grid">

        {/* LEFT */}
        <div className="cp-card cp-card-avatar">
          <div className="cp-avatar-ring">
            {currentImage ? (
              <img
                src={currentImage}
                alt={fullName || "profile"}
                className="cp-avatar-img"
              />
            ) : (
              <div className="cp-avatar-placeholder">
                {firstname ? firstname.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            {isUploading && (
              <div className="cp-avatar-overlay">
                <Loader2 className="cp-spinner" />
              </div>
            )}
          </div>

          <div className="cp-name-display">
            {firstname} {lastname}
          </div>
          <div className="cp-faculty-display">
            {facultyName || "—"}
          </div>

          <button
            className="cp-upload-btn"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera size={14} />
            {isUploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          {successImg && (
            <div className="cp-success">
              <Check size={14} /> เปลี่ยนรูปสำเร็จ
            </div>
          )}

          <p className="cp-hint">รองรับ .jpg .png .webp ≤ 5MB</p>
        </div>

        {/* RIGHT */}
        <div className="cp-card cp-card-form">
          <div className="cp-form-title">แก้ไขข้อมูลส่วนตัว</div>

          <div className="cp-form-grid">
            <input
              className="cp-input"
              placeholder="ชื่อ"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              className="cp-input"
              placeholder="นามสกุล"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <input
            className="cp-input"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="cp-pw-wrap">
            <input
              className="cp-input"
              type={showPw ? "text" : "password"}
              placeholder="รหัสผ่านใหม่"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {errorInfo && <div className="cp-error">{errorInfo}</div>}
          {successInfo && (
            <div className="cp-success">
              <Check size={14} /> บันทึกข้อมูลสำเร็จ
            </div>
          )}

          <button
            className="cp-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={15} className="cp-spinner-sm" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกข้อมูล"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}