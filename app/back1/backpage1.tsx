"use client";

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation";
import { ChevronRight, Eye, PlusCircle, Trash2, FilePlusCorner, Camera, Loader2 } from "lucide-react"
import UserManagement from "./components/UserManagement";
import ChangeProfile from "../back2/components/ChangeProfile";
import Sidebar from "./components/Sidebar";
import UpNetZeroContent from "./components/UpNetZeroContent";
import DashboardContent from "./components/DashboardContent";

/*====================================================================================*/
type UserCalculation = {
  id: number;
  item_name: string;
  unit: string;
  gas_per_unit: number;
  quantity: number | null;
  total_gas: number;
};

interface MeResponse {
  firstname: string;
  lastname: string;
  Affiliation: number | string;
  profile_image: string | null;
}
type Scope = {
  id: number;
  scope: number;
  name_tiem: string;
};
type YearTotal = {
  year: number
  total: number | string
}
type YearItem = {
  id: number;
  year: number;
}
/*====================================================================================*/
export default function Scene() {
  const router = useRouter();
  /*================================*/
  const [user, setUser] = useState<MeResponse | null>(null);
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [faculty_name, setFaculty_name] = useState<string>("");
  const [faculty, setfaclty] = useState<number>(0);
  const [facultiesMap, setFacultiesMap] = useState<Record<number, string>>({});
  /*================================*/
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  /*================================*/
  const [inputYear, setInputYear] = useState<number | null>(null);
  const [years, setYears] = useState<YearItem[]>([]);
  const [usedYears, setUsedYears] = useState<number[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const currentYear = new Date().getFullYear() + 543;
  const c_years = Array.from({ length: 11 }, (_, i) => currentYear - i);
  const isYearExist = inputYear !== null && usedYears.includes(inputYear);
  const availableYears = c_years.filter(
    (year) => !years.some((item) => item.year === year)
  );
  const availableYears1 = c_years.map((year, index) => ({ id: index + 1, year })) // แปลงให้เป็น YearItem
    .filter((yearObj) => !years.some((item) => item.year === yearObj.year));
  /*================================*/
  const [active, setActive] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);
  const [active5, setActive5] = useState(false);
  /*================================*/
  const [active6, setActive6] = useState(false);
  const [active7, setActive7] = useState(false);
  const [active8, setActive8] = useState(false);
  const [active9, setActive9] = useState(false);
  /*================================*/
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showbutton1, setbutton1] = useState(false);
  const [showbutton2, setbutton2] = useState(false);
  /*=================================*/
  const [showstart1, setshowstart1] = useState(false);
  const [showstart4, setshowstart4] = useState(false);
  const [showstart4_1, setshowstart4_1] = useState(false);
  /*=================================*/
  const [showstart4_1_b, setshowstart4_1_b] = useState(false);
  /*=================================*/
  const [showbutton3, setbutton3] = useState(false);
  /*=================================*/
  const [value, setValue] = useState(0);
  const base = [3.93, 1.12, 0.217, 0.1464, 0.131, 0.1596];
  const [inputs, setInputs] = useState(Array(6).fill(0));
  /*=================================*/
  const [showbutton4f, setbutton4f] = useState(false);
  const [showbutton4, setbutton4] = useState(false);
  const [showbutton5, setbutton5] = useState(false);
  const [showbutton55, setbutton55] = useState(false);
  const [showbutton555, setbutton555] = useState(false);
  /*=================================*/
  const [showtab_y, settab_y] = useState(false);
  const [showtab_e, settab_e] = useState(false);
  /*=================================*/
  const [rows, setRows] = useState<UserCalculation[]>([]);
  const [loading1, setLoading1] = useState<boolean>(true);
  /*=================================*/
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [display, setDisplay] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedScope, setSelectedScope] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<Record<number, string>>({});
  /* ===== admin_item ===== */
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [AD, setAD] = useState("");
  /*-----------------------------------*/
  const [showstart4_11, setshowstart4_11] = useState(false);
  const [button_scope11, setbutton_scope11] = useState(false);
  /*---*/
  const [showstart4_111, setshowstart4_111] = useState(false);
  const [button_scope111, setbutton_scope111] = useState(false);
  /*---*/
  const [showstart4_2, setshowstart4_2] = useState(false);
  const [button_scope2, setbutton_scope2] = useState(false);
  /*---*/
  const [showstart4_3, setshowstart4_3] = useState(false);
  const [button_scope3, setbutton_scope3] = useState(false);
  /*---*/
  const [showstart4_33, setshowstart4_33] = useState(false);
  const [button_scope33, setbutton_scope33] = useState(false);
  /*---*/
  /*-------------------------------------------*/
  const [showbuttonscope, setbuttonscope] = useState(false);
  /*-------------------------------------------*/
  const [items, setItems] = useState<any[]>([]);
  /*=================================*/
  const [closing, setClosing] = useState(false);

  type CheckListType = {
    c1: boolean;
    c2: boolean;
    c3: boolean;
    c4: boolean;
    c5: boolean;
    c6: boolean;
  };
  const [checkedList, setCheckedList] = useState<CheckListType>({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
    c6: false,
  });

  const toggleCheck = (key: keyof CheckListType) => {
    setCheckedList(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /*====================================================================================*/
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);
  const handleChange1 = (key: keyof CheckListType) => {
    setCheckedList((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /*=================================*/
  const handleChange = (index: number, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);
    }
  };
  /*=================================*/
  /* ===== Upload Profile Picture ===== */
  const uploadProfile = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token || isUploadingProfile) return;
    setIsUploadingProfile(true);
    const formData = new FormData();
    formData.append("profile", file);
    try {
      const res = await fetch("/api/upload-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.profile_image) {
        setProfileImage(data.profile_image);
      }
    } catch {
      // silent fail
    } finally {
      setIsUploadingProfile(false);
    }
  };

  /*=================================*/
  useEffect(() => {
    const token = localStorage.getItem("token");

    // ไม่มี token = ยังไม่ login
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token ไป
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data: MeResponse) => {
        setUser(data);
        setFullName(`${data.firstname} ${data.lastname}`);
        setfaclty(Number(data.Affiliation));
        setProfileImage(data.profile_image);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  /*=================================*/
  const toggleShow = () => {
    if (show1) {
      setShow1(false);
      setTimeout(() => setIsVisible(false), 300);
      setIsVisible(false);
    } else {
      setIsVisible(true);
      setShow1(true);
    }
  };
  useEffect(() => {
    if (active) {
      setShow1(false);
      setActive2(false);
      setActive3(false);
      setActive4(false);
      setActive5(false);
      setActive6(false);
      setActive7(false);
      setActive8(false);
      setActive9(false);
      setshowstart1(true);
      setbutton3(false);

      setbutton1(false);
      setbutton2(false);
      setIsVisible(false);
    }
  }, [active]);
  useEffect(() => {
    if (active2) {
      setActive(false);
      setActive2(false);
      setActive3(true);
      setActive5(false);
      setActive6(false);
      setActive7(false);
      setActive8(false);
      setActive9(false);
      setshowstart1(false);
      setbutton3(false);

      setShow1(true);
      setIsVisible(true);
      setbutton1(true);
      setbutton2(false);
    }

  }, [active2]);
  useEffect(() => {
    if (active3) {
      setbutton1(true);
      setActive4(false);
      setbutton2(false);
      setshowstart4(false);
      setbutton4f(true);
    }
  }, [active3]);

  useEffect(() => {
    if (active4) {
      setbutton2(true);
      setActive3(false);
      setbutton1(false);
      setshowstart4(true);
      setbutton4f(false);
    }
  }, [active4]);

  useEffect(() => {
    if (active5) {
      setShow1(false);
      setActive(false);
      setActive2(false);
      setActive3(false);
      setActive4(false);
      setActive5(true);
      setActive6(false);
      setActive7(false);
      setActive8(false);
      setActive9(false);
      setbutton3(false);
      setshowstart4(false);

      setbutton1(false);
      setbutton2(false);
      setIsVisible(false);
    }
  }, [active5]);

  useEffect(() => {
    if (active6) {
      setShow1(false);
      setActive(false);
      setActive2(false);
      setActive3(false);
      setActive4(false);
      setActive5(false);
      setActive6(true);
      setActive7(false);
      setActive8(false);
      setActive9(false);
      setbutton3(true);
      setshowstart4(false);
      setshowstart1(false);

      setbutton1(false);
      setbutton2(false);
      setIsVisible(false);
    }
  }, [active6]);

  useEffect(() => {
    if (active7) {
      setShow1(false);
      setActive(false);
      setActive2(false);
      setActive3(false);
      setActive4(false);
      setActive5(false);
      setActive6(false);
      setActive7(true);
      setActive8(false);
      setActive9(false);
      setbutton3(false);
      setshowstart1(false);
      setshowstart4(false);
      setshowstart4_11(false);
      setshowstart4_2(false);
      setshowstart4_3(false);
      setshowstart4_33(false);
      setshowstart4_111(false);

      setbutton1(false);
      setbutton2(false);
      setIsVisible(false);
    }
  }, [active7]);

  useEffect(() => {
    if (active8) {
      setShow1(false);
      setActive(false);
      setActive2(false);
      setActive3(false);
      setActive4(false);
      setActive5(false);
      setActive6(false);
      setActive7(false);
      setActive8(true);
      setActive9(false);
      setbutton3(false);

      setbutton1(false);
      setbutton2(false);
      setIsVisible(false);
    }
  }, [active8]);
  useEffect(() => {
    if (active9) {

      fetch("/api/logout");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [active9]);
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  };
  /*----------------------------------------------------------*/
  useEffect(() => {
    if (!showbutton4f) {
      setbutton55(false);
      setbutton5(false);
      setbutton4(true);
    }
  }, [!showbutton4f]);
  useEffect(() => {
    if (showbutton4f) {
      setbutton55(false);
      setbutton5(false);
      setbutton4(false);
    }
  }, [showbutton4f]);
  /*------------------------------------------------------------*/
  useEffect(() => {
    if (showbutton5) {
      setbutton55(true);
      setbutton4(false);
    }
  }, [showbutton5]);
  /*-----------------------------------------------------------*/

  useEffect(() => {
    fetch("/api/affiliations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.affiliations) {
          const map: Record<number, string> = {};
          data.affiliations.forEach((aff: any) => {
            map[aff.id] = aff.affiliation_item;
          });
          setFacultiesMap(map);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setFaculty_name(facultiesMap[faculty] || "");
  }, [faculty, facultiesMap]);
  /*------------------------------------------------------------*/
  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    const res = await fetch("/api/upload-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setProfileImage(data.profile_image);
    }
  };
  /*------------------------------------------------------------*/
  useEffect(() => {
    fetch("/api/adminitem/years")
      .then((res) => res.json())
      .then((data: YearItem[]) => {
        setYears(data);
      });
  }, []);

  /*------------------------------------------------------------*/
  const addYear = async () => {

    if (inputYear === null) return;

    if (usedYears.includes(inputYear)) {
      alert("ปีนี้ถูกสร้างแล้ว");
      return;
    }

    try {

      const res = await fetch("/api/adminitem/years", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year: inputYear }),
      });

      if (!res.ok) {
        throw new Error("create year failed");
      }

      // Refetch the full years list to ensure correct state
      const refreshed = await fetch("/api/adminitem/years").then(r => r.json());
      setYears(refreshed);
      setUsedYears(refreshed.map((y: YearItem) => y.year));

      setSelectedYear(inputYear);

      setInputYear(null);

      setShowAddModal(false);

      settab_y(false);

      // Refresh yearTotals too
      setRefreshKey(k => k + 1);

    } catch (err) {

      console.error(err);

      alert("เกิดข้อผิดพลาดในการสร้างปี");

    }
  };

  /*------------------------------------------------------------*/
  useEffect(() => {
    const fetchScopes = async () => {
      const res = await fetch("/api/scopes");
      const data = await res.json();
      setScopes(data);
    };
    fetchScopes();
  }, []);
  /* =======================*/
  useEffect(() => {
    fetch("/api/scopes")
      .then(res => res.json())
      .then(data => setScopes(data));
  }, []);
  /*--------------------------------------------------*/
  const fetchItems = async () => {
    const res = await fetch("/api/admin-item");
    const data = await res.json();
    setItems(data);
  };
  const handleSubmit = async () => {
    if (!selectedYearId || !selectedId || !itemName) {
      alert("ข้อมูลไม่ครบ");
      return;
    }

    const res = await fetch("/api/admin-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year_id: selectedYearId,
        scope: selectedId,
        name_tiem: itemName,
        unit,
        AD: Number(AD),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "บันทึกไม่สำเร็จ");
      return;
    }
    setItems((prev) => [...prev, data]);
    setbutton555(false);
    setDisplay("");
    setSelectedId(null);
    setItemName("");
    setUnit("");
    setAD("");
    await fetchItems();
  };
  /*--------------------------------------------------*/
  useEffect(() => {
    fetch("/api/admin-item")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);
  /*--------------------------------------------------*/
  const deleteItem = async (id: number) => {
    if (!confirm("ยืนยันการลบข้อมูล ?")) return; //*

    await fetch(`/api/admin-item/${id}`, {
      method: "DELETE",
    });
    setItems(prev => prev.filter(item => item.id !== id));
  };
  /*--------------------------------------------------*/
  const handleClick1 = () => {
    setClosing(true);
    setTimeout(() => {
      setshowstart4_1(prev => !prev);
      setbutton55(prev => !prev);
      setClosing(false);
    }, 300);
  };
  const handleClick2 = () => {
    setshowstart4_11(prev => !prev);
    setbutton_scope11(prev => !prev);
  };
  const handleClick3 = () => {
    setshowstart4_111(prev => !prev);
    setbutton_scope111(prev => !prev);
  };
  const handleClick4 = () => {
    setshowstart4_2(prev => !prev);
    setbutton_scope2(prev => !prev);
  };
  const handleClick5 = () => {
    setshowstart4_3(prev => !prev);
    setbutton_scope3(prev => !prev);
  };
  const handleClick6 = () => {
    setshowstart4_33(prev => !prev);
    setbutton_scope33(prev => !prev);
  };

  /* ====================================================== */
  const [editingYear, setEditingYear] = useState<number | "">("")
  const updateYear = async () => {
    if (selectedYear === null || editingYear === "") {
      alert("กรุณาเลือกปี")
      return
    }

    try {
      const res = await fetch("/api/admin/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldYear: selectedYear,
          newYear: editingYear,
        }),
      })

      const data = await res.json()
      console.log(data)

      if (!res.ok) {
        alert(data.message)
        return
      }

      // update state
      setYears(prev =>
        prev.map(item =>
          item.year === selectedYear
            ? { ...item, year: editingYear }
            : item
        )
      )

      setUsedYears(prev =>
        prev.map(y => (y === selectedYear ? editingYear : y))
      )

      setYearTotals(prev => {
        const copy = { ...prev }
        copy[editingYear] = copy[selectedYear] ?? 0
        delete copy[selectedYear]
        return copy
      })

      setSelectedYear(null)
      setEditingYear("")
      settab_e(false)

    } catch (err) {
      console.error(err)
      alert("เกิดข้อผิดพลาด")
    }
  }
  /*-------------------------------------------------------*/
  const [yearTotals, setYearTotals] = useState<Record<number, number>>({})
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetch("/api/userItem/total")
      .then(res => res.json())
      .then((result: { success: boolean; data: YearTotal[] }) => {
        if (!result.success) return

        const map: Record<number, number> = {}
        result.data.forEach(d => {
          map[d.year] = Number(d.total) || 0
        })
        setYearTotals(map)
      })
      .catch(console.error)
  }, [refreshKey])
  /*------------------------------------------------------------*/
  const deleteYear = async (year: number) => {
    if (!confirm("ยืนยันการลบปี " + year + " ?")) return;

    const yearObj = years.find(y => y.year === year);
    if (!yearObj) return alert("ไม่พบปีนี้ในฐานข้อมูล");

    try {
      const res = await fetch("/api/adminitem/deleteYear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "ลบไม่สำเร็จ");
        return;
      }

      setYears(prev => prev.filter(y => y.id !== yearObj.id));
      setUsedYears(prev => prev.filter(y => y !== year));
      if (selectedYear === year) setSelectedYear(null);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบปี");
    }
  };
  /*========================================================*/
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit&display=swap"
        rel="stylesheet"
      />
      {showtab_e && (
        <>
          <div className="back-b" onClick={() => settab_e(false)} />
          <div className="back-g">
            <form
              className="box-w fade-in"
              onSubmit={(e) => {
                e.preventDefault()
                updateYear()
              }}
            >
              <h1>แก้ไขปี {selectedYear}</h1>
              <select
                className="year-select"
                value={editingYear || ""}
                onChange={(e) => setEditingYear(Number(e.target.value))}
                required
              >
                <option value="" disabled hidden>
                  เลือกปีใหม่
                </option>

                {c_years
                  .filter((y) => !years.some(item => item.year === y))
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
              <div className="dis">
                <button type="submit" disabled={!editingYear || editingYear === selectedYear}>ยืนยัน</button>
                <button type="button" onClick={() => settab_e(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </>
      )}
      {showtab_y && (
        <>
          <div
            className="back-b"
            onClick={() => settab_y(false)}
          ></div>

          <div className="back-g">
            <form
              className="box-w fade-in"
              onSubmit={(e) => {
                e.preventDefault();
                addYear();
              }}
            >
              <h1>ระบุปี เพื่อทำการคำนวณการใช้คาร์บอน</h1>

              <select
                className="year-select"
                value={inputYear ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputYear(value === "" ? null : Number(value));
                }}
              >

                <option value="" disabled hidden>
                  เลือกปี (พ.ศ.)
                </option>

                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>


              <button type="submit" disabled={inputYear === null}>
                ยืนยัน
              </button>
            </form>
          </div>
        </>
      )}

      {showbuttonscope && (
        <>
          <div className="back-b" onClick={() => setbuttonscope(!showbuttonscope)}></div>
          <div className="back-g">
            <form className="box-w-1 fade-in" onSubmit={(e) => { e.preventDefault(); addYear(); }} >

              <div className="postdata3-dis-i"><div className="postdata4-data3-tab2-i">เพิ่มรายละเอียดสำหรับขอบเขต
                <div className="postdata-tabbg-p"></div></div>
                <div role="button" className="data3-tab2-b1-i" ><img src="/imj/back/X.png" onClick={() => setbuttonscope(!showbuttonscope)} /></div>
              </div>
              <div className="box-tab-1"><div className="dis-nogap"><div className="box-tab-1-b1">เลือก</div><div className="box-tab-1-b2">กลุ่มขอบเขต</div><div className="box-tab-1-b3">ชื่อกิจกรรม</div></div></div>
              <div className="dis-nogap">
                <div className="box-tab-1-b1">
                  <label className="custom-check3">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c1}
                      onChange={() => handleChange1("c1")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="box-tab-1-b2-y">กลุ่มขอบเขตที่1</div><div className="box-tab-1-b3-y">การเผาไหม้ที่อยู่กับที่ (Stationary Combustion)</div>
              </div>
              <div className="dis-nogap">
                <div className="box-tab-1-b1">
                  <label className="custom-check3">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c2}
                      onChange={() => handleChange1("c2")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="box-tab-1-b2-y">กลุ่มขอบเขตที่1</div><div className="box-tab-1-b3-y">การเผาไหม้ที่มีการเคลื่อนที่ On Road (Mobile Combustion : On Road)</div>
              </div>
              <div className="dis-nogap">
                <div className="box-tab-1-b1">
                  <label className="custom-check3">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c3}
                      onChange={() => handleChange1("c3")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="box-tab-1-b2-y">กลุ่มขอบเขตที่1</div><div className="box-tab-1-b3-y">การเผาไหม้ที่มีการเคลื่อนที่ Off Road (Mobile Combustion : Off Road)</div>
              </div>
              <div className="dis-nogap">
                <div className="box-tab-1-b1">
                  <label className="custom-check3">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c4}
                      onChange={() => handleChange1("c4")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="box-tab-1-b2-p">กลุ่มขอบเขตที่2</div><div className="box-tab-1-b3-p">การใช้ไฟฟ้า (Electricity)</div>
              </div>
              <div className="dis-nogap">
                <div className="box-tab-1-b1">
                  <label className="custom-check3">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c5}
                      onChange={() => handleChange1("c5")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="box-tab-1-b2-b">กลุ่มขอบเขตที่3</div><div className="box-tab-1-b3-b">การซื้อวัตถุดิบและบริการ (Purchased Goods and Services)</div>
              </div>
              <div className="dis-nogap">
                <div className="box-tab-1-b1">
                  <label className="custom-check3">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c6}
                      onChange={() => handleChange1("c6")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="box-tab-1-b2-b">กลุ่มขอบเขตที่3</div><div className="box-tab-1-b3-b">สินค้าทุน (Capital Good)</div>
              </div>

            </form>
          </div>
        </>
      )}
      {showbutton555 && (
        <>
          <div className="back-b" onClick={() => setbutton555(!showbutton555)}></div>

          <div className="back-g">
            <form className="box-w fade-in" onSubmit={(e) => { e.preventDefault(); addYear(); }} >

              <div className="postdata3-dis-i"><div className="postdata4-data3-tab2-i">เพิ่มรายละเอียดสำหรับขอบเขต
                <div className="postdata-tabbg-p"></div></div>
                <div role="button" className="data3-tab2-b1-i" ><img src="/imj/back/X.png" onClick={() => setbutton555(!showbutton555)} /></div>
              </div>

              <div className="datascope-i">
                <p>ขอบเขต :</p>
                <input
                  value={display}
                  placeholder="เลือกขอบเขต"
                  readOnly
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 150)}
                />

                {open && (
                  <ul className="dropdown">
                    {scopes.map(s => (
                      <li
                        key={s.id}
                        onMouseDown={() => {
                          setDisplay(`ขอบเขต ${s.scope} ${s.name_tiem}`);
                          setSelectedId(s.id);
                        }}
                      >
                        ขอบเขต {s.scope} {s.name_tiem}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="datascope-i">
                <p>รายการ :</p>
                <input value={itemName} onChange={e => setItemName(e.target.value)} />
              </div>

              <div className="datascope-i">
                <p>หน่วย :</p>
                <input value={unit} onChange={e => setUnit(e.target.value)} />
              </div>

              <div className="datascope-i">
                <p>kgCO2e / หน่วย :</p>
                <input
                  type="number"
                  step="0.0001"
                  value={AD}
                  onChange={e => setAD(e.target.value)}
                />
              </div>

              <div className="datascope-i-b">
                <button type="button" onClick={handleSubmit}>
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      <div className="bg-data">.</div>
      <Sidebar
        fullName={fullName}
        profileImage={profileImage}
        isUploadingProfile={isUploadingProfile}
        profileInputRef={profileInputRef}
        uploadProfile={uploadProfile}
        active={active}
        setActive={setActive}
        active2={active2}
        setActive2={setActive2}
        active3={active3}
        setActive3={setActive3}
        active4={active4}
        setActive4={setActive4}
        active6={active6}
        setActive6={setActive6}
        active7={active7}
        setActive7={setActive7}
        active8={active8}
        setActive8={setActive8}
        active9={active9}
        isVisible={isVisible}
        show1={show1}
        showbutton1={showbutton1}
        showbutton2={showbutton2}
        handleLogout={handleLogout}
      />
      {showstart1 && (
        <div className="databox">
          <DashboardContent />
        </div>
      )}
      {active3 && (
        <UpNetZeroContent
          faculty_name={faculty_name}
          years={years}
          yearTotals={yearTotals}
          selectedYearId={selectedYearId}
          setSelectedYearId={setSelectedYearId}
          settab_y={settab_y}
          showtab_y={showtab_y}
          settab_e={settab_e}
          setSelectedYear={setSelectedYear}
          setInputYear={setInputYear}
          deleteYear={deleteYear}
          showbutton4f={showbutton4f}
          setbutton4f={setbutton4f}
          showbutton4={showbutton4}
          checkedList={checkedList}
          handleChange1={handleChange1}
          setbutton5={setbutton5}
          showbutton5={showbutton5}
          showbutton55={showbutton55}
          showbutton555={showbutton555}
          setbutton555={setbutton555}
          showbuttonscope={showbuttonscope}
          setbuttonscope={setbuttonscope}
          toggleCheck={toggleCheck}
          showstart4_1={showstart4_1}
          handleClick1={handleClick1}
          closing={closing}
          items={items}
          qty={qty}
          setQty={setQty}
          deleteItem={deleteItem}
          showstart4_11={showstart4_11}
          handleClick2={handleClick2}
          button_scope11={button_scope11}
          showstart4_111={showstart4_111}
          handleClick3={handleClick3}
          button_scope111={button_scope111}
          showstart4_2={showstart4_2}
          handleClick4={handleClick4}
          button_scope2={button_scope2}
          showstart4_3={showstart4_3}
          handleClick5={handleClick5}
          button_scope3={button_scope3}
          showstart4_33={showstart4_33}
          handleClick6={handleClick6}
          button_scope33={button_scope33}
        />
      )}
      {showbutton555 && (
        <>

        </>
      )}
      {showstart4 && (
        <div className="databox">
          <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>การคำนวณกิจกรรม</h2></div>
          <div className="data4-tab1"></div>
          <div className="data4-tab2">เครื่องมือคำนวณ ปริมาณคาร์บอนฟุตพริ้นท์ (kgCO2e)</div>
          <div className="postdata4">
            <div className="postdata4-h">ขอบเขตที่ 1: การเผาไหม้ที่อยู่กับที่ (Stationary Combustion)</div>
            <div className="postdata4-tab1"></div>
            <div className="postdata4-tabm">
              <div className="postdata4-m2">ประเภท</div>
              <div className="postdata4-m2">รายการ</div>
              <div className="postdata4-m2">คำอธิบาย</div>
              <div className="postdata4-m1-t">หน่วย</div>
              <div className="postdata4-m1">ปริมาณคาร์บอนฟุตพริ้นท์<br />(kgCo2e)</div>
              <div className="postdata4-m1">หน่วย<br />kgCO2e</div>
              <div className="postdata4-m1-t">ปริมาณ</div>
              <div className="postdata4-m1">ค่าการปล่อยก๊าซเรือนกระจก(EF)</div>
            </div>
            <div className="setpostdata4-tap2"><div className="postdata4-tap2">อาหารและเครืองดื่ม</div><button className={`postdata4-tap2-b ${showstart4_1 ? "active" : ""}`} onClick={() => setshowstart4_1(!showstart4_1)}><ChevronRight className="arrow-icon" /></button></div>
            {!showstart4_1 && (
              <div className="postdata4-tabm-1">
                <div className="postdata4-m2-1-1">1.อาหารและเครืองดื่ม</div>
                <div className="postdata4-m2-1">
                  <div className="postdata4-n2">อาหารหลักปกติ</div>
                  <div className="postdata4-n2">อาหารหลักมังสวิรัติ</div>
                  <div className="postdata4-n2">อาหารว่างปกติและเครื่องดื่ม</div>
                  <div className="postdata4-n2">อาหารว่างมังสวิรัติและเครื่องดื่ม</div>
                  <div className="postdata4-n2">ภาชนะบรรจุอาหารที่ใช้แล้วทิ้ง (พลาสติก)</div>
                  <div className="postdata4-n2">ภาชนะบรรจุเครื่องดื่มที่ใช้แล้วทิ้ง (พลาสติก)</div>
                </div>
                <div className="postdata4-m2-1">
                  <div className="postdata4-n2">จำนวนชุดอาหารรวมตลอดการจัดงาน</div>
                  <div className="postdata4-n2">จำนวนชุดอาหารรวมตลอดการจัดงาน</div>
                  <div className="postdata4-n2">จำนวนชุดอาหารรวมตลอดการจัดงาน</div>
                  <div className="postdata4-n2">จำนวนชุดอาหารรวมตลอดการจัดงาน</div>
                  <div className="postdata4-n2">จำนวนอาหารตลอดการจัดงานที่ใช้ภาชนะบรรจุอาหารแบบใช้แล้วทิ้ง</div>
                  <div className="postdata4-n2">จำนวนอาหารตลอดการจัดงานที่ใช้ภาชนะบรรจุอาหารแบบใช้แล้วทิ้ง</div>
                </div>
                <div className="postdata4-m1-t-1">
                  <div className="postdata4-n1">ชุด</div>
                  <div className="postdata4-n1">ชุด</div>
                  <div className="postdata4-n1">ชุด</div>
                  <div className="postdata4-n1">ชุด</div>
                  <div className="postdata4-n1">ชุด</div>
                  <div className="postdata4-n1">ชุด</div>
                </div>
                <div className="postdata4-m1-t-1">
                  <div className="postdata4-n1">786.00</div>
                  <div className="postdata4-n1">0</div>
                  <div className="postdata4-n1">65.10</div>
                  <div className="postdata4-n1">0</div>
                  <div className="postdata4-n1">0</div>
                  <div className="postdata4-n1">0</div>
                </div>


                <div className="postdata4-m1-t-1">
                  {base.map((v, i) => (
                    <div key={i} className="postdata4-n1">
                      {v.toFixed(4)}
                    </div>
                  ))}
                </div>

                <div className="postdata4-m1-t-1">
                  {inputs.map((v, i) => (
                    <input
                      key={i}
                      type="text"
                      className="postdata4-n1-input"
                      value={v}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
                    />
                  ))}
                </div>

                <div className="postdata4-m1-t-1">
                  {inputs.map((v, i) => (
                    <div key={i} className="postdata4-n1">
                      {(base[i] * (parseFloat(v) || 0)).toFixed(4)}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
      {showbutton3 && <UserManagement />}      {/* Change Profile Component */}
      {active7 && (
        <ChangeProfile
          profileImage={profileImage}
          fullName={fullName}
          facultyName={faculty_name}
          onImageChange={(url) => setProfileImage(url)}
          onProfileUpdate={(newName) => setFullName(newName)}
        />
      )}

    </>
  );
}
