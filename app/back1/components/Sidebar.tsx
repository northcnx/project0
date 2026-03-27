"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

interface SidebarProps {
  fullName: string;
  profileImage: string | null;
  isUploadingProfile: boolean;
  profileInputRef: React.RefObject<HTMLInputElement>;
  uploadProfile: (file: File) => void;

  active: boolean;
  setActive: (v: boolean) => void;
  active2: boolean;
  setActive2: (v: boolean) => void;
  active3: boolean;
  setActive3: (v: boolean) => void;
  active4: boolean;
  setActive4: (v: boolean) => void;
  active6: boolean;
  setActive6: (v: boolean) => void;
  active7: boolean;
  setActive7: (v: boolean) => void;
  active8: boolean;
  setActive8: (v: boolean) => void;
  active9: boolean;

  isVisible: boolean;
  show1: boolean;
  showbutton1: boolean;
  showbutton2: boolean;

  handleLogout: () => void;
}

export default function Sidebar({
  fullName,
  profileImage,
  isUploadingProfile,
  profileInputRef,
  uploadProfile,
  active,
  setActive,
  active2,
  setActive2,
  active3,
  setActive3,
  active4,
  setActive4,
  active6,
  setActive6,
  active7,
  setActive7,
  active8,
  setActive8,
  active9,
  isVisible,
  show1,
  showbutton1,
  showbutton2,
  handleLogout,
}: SidebarProps) {
  return (
    <div className="boxuser">
      <div className="logonetzero">
        <img src="/imj/back/logol.png" className="imglogo-1l" />
      </div>

      {/* =============================================================================== */}
      <div className="profile-container">
        {/* Hidden file input */}
        <input
          ref={profileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                alert("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
                return;
              }
              uploadProfile(file);
            }
            e.target.value = "";
          }}
        />

        {/* Clickable profile image */}
        <div
          className="profile-wrapper"
          onClick={() => profileInputRef.current?.click()}
          title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
        >
          <img
            className="profile-img"
            src={profileImage ? profileImage : "/imj/back/profile-circle.png"}
            onError={(e) => {
              e.currentTarget.src = "/imj/back/profile-circle.png";
            }}
            alt="Profile"
          />

          {/* Overlay (Camera or Spinner) */}
          <div className={`profile-overlay ${isUploadingProfile ? "is-uploading" : ""}`}>
            {isUploadingProfile ? (
              <Loader2 className="spinner-icon" style={{ width: "2.5vh", height: "100%", color: "white" }} />
            ) : (
              <Camera className="camera-icon" style={{ width: "2.5vh", height: "100%", color: "white" }} />
            )}
          </div>
        </div>
      </div>

      {/* =============================================================================== */}
      <div className="Usern">
        <h1 className="Usern-text">{fullName}</h1>
      </div>

      <div className="button-dashborad">
        {active && (
          <button className={`button-dashborad-c ${active ? "active" : ""}`} onClick={() => setActive(active)}>
            <img src="/imj/back/logodash.png" /><p>Dashboard</p>
          </button>
        )}
        {!active && (
          <button className={`button-dashborad-c ${active ? "active" : ""}`} onClick={() => setActive(!active)}>
            <img src="/imj/back/logodash.png" /><p>Dashboard</p>
          </button>
        )}
      </div>

      <div className="button1">
        <div className="button1-text">กรอกข้อมูล</div>
        {active2 && (
          <button className={`button1-c ${active2 ? "active" : ""}`} onClick={() => setActive2(active2)}>
            <img src="/imj/back/logoscan.png" /><p>กรอกข้อมูล</p>
          </button>
        )}
        {!active2 && (
          <button className={`button1-c ${active2 ? "active" : ""}`} onClick={() => setActive2(!active2)}>
            <img src="/imj/back/logoscan.png" /><p>กรอกข้อมูล</p>
          </button>
        )}
      </div>

      {isVisible && (
        <div className={`button1-tab ${show1 ? "show" : "hide"}`}>
          <div className="button1-tab-button1">
            {showbutton1 ? (
              <>
                <div className="box-s1-show"></div>
                <button className={`button1-tab-taxt ${active3 ? "active" : ""}`} onClick={() => setActive3(active3)}>
                  <img src="/imj/back/logo2.png" alt="logo" /><p>UP Net Zero</p>
                </button>
              </>
            ) : (
              <>
                <div className="box-s1"></div>
                <button className={`button1-tab-taxt ${active3 ? "active" : ""}`} onClick={() => setActive3(!active3)}>
                  <img src="/imj/back/logo2.png" alt="logo" /><p>UP Net Zero</p>
                </button>
              </>
            )}
          </div>
          <div className="button1-tab-button2">
            {showbutton2 ? (
              <>
                <div className="box-s2-show"></div>
                <button className={`button2-tab-taxt ${active4 ? "active" : ""}`} onClick={() => setActive4(active4)}>
                  <img src="/imj/back/logo2.png" alt="logo" /><p>การคำนวณกิจกรรม</p>
                </button>
              </>
            ) : (
              <>
                <div className="box-s2"></div>
                <button className={`button2-tab-taxt ${active4 ? "active" : ""}`} onClick={() => setActive4(!active4)}>
                  <img src="/imj/back/logo2.png" alt="logo" /><p>การคำนวณกิจกรรม</p>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="button2">
        <div className="button2-text">ตั้งค่า</div>
        {active6 && (
          <button className={`button2-c ${active6 ? "active" : ""}`} onClick={() => setActive6(active6)}>
            <img src="/imj/back/setting.png" /><p>ตั้งค่าการใช้งาน</p>
          </button>
        )}
        {!active6 && (
          <button className={`button2-c ${active6 ? "active" : ""}`} onClick={() => setActive6(!active6)}>
            <img src="/imj/back/setting.png" /><p>ตั้งค่าการใช้งาน</p>
          </button>
        )}
      </div>

      <div className="button3">
        <div className="button3-text">LABELS</div>
        {active7 && (
          <button className={`button3-c ${active7 ? "active" : ""}`} onClick={() => setActive7(active7)}>
            <img src="/imj/back/logouser.png" /><p>เปลี่ยนโปรไฟล์</p>
          </button>
        )}
        {!active7 && (
          <button className={`button3-c ${active7 ? "active" : ""}`} onClick={() => setActive7(!active7)}>
            <img src="/imj/back/logouser.png" /><p>เปลี่ยนโปรไฟล์</p>
          </button>
        )}
      </div>

      <div className="button4">
        {active8 && (
          <button className={`button4-c ${active8 ? "active" : ""}`} onClick={() => setActive8(active8)}>
            <img src="/imj/back/refresh.png" /><p>ประวัติการทำรายการ</p>
          </button>
        )}
        {!active8 && (
          <button className={`button4-c ${active8 ? "active" : ""}`} onClick={() => setActive8(!active8)}>
            <img src="/imj/back/refresh.png" /><p>ประวัติการทำรายการ</p>
          </button>
        )}
      </div>

      <div className="button5">
        {active9 && (
          <button className={`button5-c ${active9 ? "active" : ""}`} onClick={() => handleLogout()}>
            <img src="/imj/back/logout.png" /><p>ลงชื่อออก</p>
          </button>
        )}
        {!active9 && (
          <button className={`button5-c ${active9 ? "active" : ""}`} onClick={() => handleLogout()}>
            <img src="/imj/back/logout.png" /><p>ลงชื่อออก</p>
          </button>
        )}
      </div>
    </div>
  );
}
