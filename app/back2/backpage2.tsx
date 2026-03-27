"use client";

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronRight, Eye, PlusCircle, Trash2, FilePlusCorner, Camera, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import ChangeProfile from "./components/ChangeProfile";


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
type YearD = {
  id: number;
  year: number;
  affiliation_id?: number;
  year_id?: number;
};

type YearItem = {
  id: number;
  year: number;
  affiliation_id?: number;
  year_id?: number;
};

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
  const [inputYear, setInputYear] = useState<number | "">("");
  const [years, setYears] = useState<YearItem[]>([]);
  const [yearsd, setYeard] = useState<YearItem[]>([]);
  const currentYear = new Date().getFullYear() + 543;
  const c_years: number[] = Array.from(
    { length: 11 },
    (_, i: number) => currentYear - i
  );
  const [usedYears, setUsedYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const usedYears1 = new Set(years.map((y) => y.year));
  /*================================*/
  const [active, setActive] = useState(true);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);
  const [active5, setActive5] = useState(false);
  /*================================*/
  const [active6, setActive6] = useState(true);
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
  const [showbuttonscope, setbuttonscope] = useState(false);
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
  const [showstart4_11, setshowstart4_11] = useState(false);
  const [button_scope11, setbutton_scope11] = useState(true);
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
  /*=================================*/
  /* ===== upload modal ===== */
  const [uploadModalItemId, setUploadModalItemId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileManagerItemId, setFileManagerItemId] = useState<number | null>(null);

  /* ===== Confirm Modal ===== */
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'delete' | 'save';
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    type: 'delete',
    title: "",
    description: "",
    onConfirm: () => { },
  });
  const showConfirm = (title: string, description: string, onConfirm: () => void, type: 'delete' | 'save' = 'delete') => {
    setConfirmModal({ open: true, type, title, description, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, open: false }));
  };

  /* ===== Success Modal ===== */
  const [successModal, setSuccessModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const showSuccess = (message: string) => {
    setSuccessModal({ open: true, message });
    setTimeout(() => setSuccessModal({ open: false, message: "" }), 2500);
  };

  /** แปลง pdf_import (JSON string หรือ string เดี่ยว) → string[] */
  const parseFiles = (raw: string | null): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [raw];
    }
  };

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
  /*====================================================================================*/
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
        showSuccess("เปลี่ยนรูปโปรไฟล์สำเร็จ");
      }
    } catch {
      // silent fail
    } finally {
      setIsUploadingProfile(false);
    }
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
        // เก็บข้อมูลจาก API
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
      setshowstart1(false);
      setbutton3(false);

      setbutton1(false);
      setbutton2(false);
      setIsVisible(false);
    }
  }, [active]);
  useEffect(() => {
    if (active2) {
      setActive(false);
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
      setbutton4f(false);
    }
  }, [active3]);

  useEffect(() => {
    if (active4) {
      setbutton2(true);
      setActive3(false);
      setbutton1(false);
      setshowstart4(true);
      setbutton4(false);
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
  /*------------------------------------------------------------*/
  useEffect(() => {
    if (!showbutton4f) {
      setbutton55(false);
      setbutton5(false);
    }
  }, [!showbutton4f]);
  useEffect(() => {
    if (showbutton4f) {
      setbutton55(false);
      setbutton5(false);
      setbutton4(true);
    }
  }, [showbutton4f]);
  /*------------------------------------------------------------*/
  useEffect(() => {
    if (showbutton5) {
      setbutton55(true);
      setbutton4(false);
    }
  }, [showbutton5]);
  /*------------------------------------------------------------*/
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
  /*------------------------------------------------------------*/
  const [closing, setClosing] = useState(false);
  /*------------------------------------------------------------*/
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
    const loadYears = async () => {
      try {
        const res = await fetch("/api/admin-year");
        const data: { id: number; year: number }[] = await res.json();
        setYears(data);

        // เก็บปีที่ใช้แล้ว
        setUsedYears(data.map((y) => y.year));

      } catch (err) {
        console.error("โหลดปีไม่สำเร็จ", err);
      }
    };

    loadYears();
  }, []);

  const addYear = async () => {
    const yearId = Number(inputYear);
    if (!yearId) return;

    if (usedYears.includes(yearId)) {
      alert("ปีนี้มีข้อมูลอยู่แล้ว");
      return;
    }

    const res = await fetch("/api/userItem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year_id: yearId }),
    });
    const data = await res.json();
    setYears([
      ...years,
      {
        id: yearId,
        year: yearId
      }
    ]);
    setUsedYears([...usedYears, yearId]);
    setInputYear("");
    settab_y(false);
  };
  /*--------------------------------------------------------*/
  /*------------------------------------------------------------*/
  useEffect(() => {
    const fetchYears = async () => {
      const res = await fetch("/api/userItem/years");
      const data = await res.json();
      setYears(data);
    };
    fetchYears();
  }, []);
  /*------------------------------------------------------------*/
  useEffect(() => {
    fetch("/api/userItem/years")
      .then(res => res.json())
      .then((data: { year: number }[]) => {
        setUsedYears(data.map(d => d.year));
      })
      .catch(console.error);
  }, []);

  const isYearExist =
    inputYear !== "" && usedYears.includes(Number(inputYear));
  /*------------------------------------------------------------*/
  type UserItem = {
    id: number;
    admin_item_id: number;
    Vol: number;
    pdf_import: string | null;
    create_year: string;
    year: number;
    affiliation_id: number;
    scope: number;
    name_tiem: string;
    unit: string;
    AD: number;
  };
  const [items, setItems] = useState<UserItem[]>([]);
  /*------------------------------------------------------------*/
  type YearTotal = {
    year: number
    total: number | null
  }
  /* ---------------- totals ---------------- */
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

  /* ---------------- observer ---------------- */
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ---------------- move total when year changes ---------------- */
  useEffect(() => {
    if (!selectedYear || inputYear === "" || Number(inputYear) === Number(selectedYear)) return

    setYearTotals(prev => {
      if (!(selectedYear in prev)) return prev

      const copy = { ...prev }
      copy[inputYear] = prev[selectedYear]
      delete copy[selectedYear]
      return copy
    })
  }, [selectedYear, inputYear])

  /*------------------------------------------------------------*/
  const [availableYears, setAvailableYears] = useState<YearItem[]>([]);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchYears = async () => {
      try {
        const response = await fetch('/api/adminitem/years');
        const data = await response.json();
        // สมมติว่า API คืนค่าเป็น Array ของตัวเลข เช่น [2565, 2566, 2567]
        setAvailableYears(data);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);
  /*------------------------------------------------------------*/
  useEffect(() => {
    if (!faculty || !selectedYear) return;

    const loadData = async () => {
      const res = await fetch("/api/userItem/loaddata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: selectedYear }),
      });

      const result = await res.json();
      setItems(result.data || []);
    };

    loadData();
  }, [faculty, selectedYear]);

  /*------------------------------------------------------------*/
  const [volumes, setVolumes] = useState<Record<number, string>>({});
  const saveAllVolumes = () => {
    const payload = Object.entries(volumes)
      .filter(([_, vol]) => vol !== "" && vol != null)
      .map(([id, vol]) => ({
        id: Number(id),
        Vol: Number(vol),
      }));

    if (payload.length === 0) {
      showSuccess("ไม่มีข้อมูลที่ต้องบันทึก");
      return;
    }

    showConfirm(
      "ยืนยันการบันทึกข้อมูล",
      `ต้องการบันทึกข้อมูล ${payload.length} รายการใช่หรือไม่?`,
      async () => {
        closeConfirm();
        const res = await fetch("/api/userItem/updateVolAll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payload }),
        });
        const result = await res.json();
        if (result.success) {
          showSuccess("บันทึกข้อมูลทั้งหมดสำเร็จ!");
          setItems((prev) =>
            prev.map((item) => {
              const found = payload.find(p => p.id === item.id);
              return found ? { ...item, Vol: found.Vol } : item;
            })
          );
        } else {
          showSuccess("บันทึกไม่สำเร็จ กรุณาลองใหม่");
        }
      },
      'save'
    );
  };
  /*------------------------------------------------------------*/
  const toggleCheck = (key: keyof CheckListType) => {
    setCheckedList(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  /*------------------------------------------------------------*/
  const deleteYear = (id: number) => {
    showConfirm(
      "ยืนยันการลบข้อมูล",
      "คุณต้องการลบข้อมูลปีนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้",
      async () => {
        closeConfirm();
        const res = await fetch("/api/userItem/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          alert("ลบไม่สำเร็จ");
          return;
        }
        setYears(prev => prev.filter(y => y.id !== id));
      }
    );
  };
  /*------------------------------------------------------------*/
  const [editingYear, setEditingYear] = useState<number | "">("")
  const updateYear = async () => {
    if (!selectedYear || editingYear === "") return

    const res = await fetch("/api/userItem/editYear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldYear: selectedYear,
        newYear: editingYear,
      }),
    })

    if (!res.ok) return alert("แก้ไขไม่สำเร็จ")

    // อัปเดต years
    setYears(prev =>
      prev.map(item =>
        item.year === selectedYear
          ? { ...item, year: editingYear }
          : item
      )
    )

    // อัปเดต usedYears
    setUsedYears(prev =>
      prev.map(y => (y === selectedYear ? editingYear : y))
    )

    // 🔥 ย้าย total ตอนกดยืนยันเท่านั้น
    setYearTotals(prev => {
      const copy = { ...prev }
      copy[editingYear] = copy[selectedYear] ?? 0
      delete copy[selectedYear]
      return copy
    })

    setSelectedYear(null)
    setEditingYear("")
    settab_e(false)
  };
  /*------------------------------------------------------------*/
  const handleUpload_pdf = async (
    e: React.ChangeEvent<HTMLInputElement>,
    userItemId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_item_id", String(userItemId));

    const res = await fetch("/api/userItem/uploadFile", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === userItemId
            ? { ...item, pdf_import: file.name }
            : item
        )
      );

      alert("อัปโหลดสำเร็จ");
    } else {
      alert("อัปโหลดไม่สำเร็จ");
    }

    e.target.value = "";
  };
  /*-----------------------------------------------------------*/
  const deleteFile = (userItemId: number, fileName?: string) => {
    const title = fileName ? `ลบไฟล์` : "ลบไฟล์ทั้งหมด";
    const desc = fileName
      ? `ต้องการลบไฟล์ "${fileName.replace(/^\d+-\d+-/, "")}" ใช่หรือไม่?`
      : "ต้องการลบไฟล์ทั้งหมดใช่หรือไม่?";
    showConfirm(title, desc, async () => {
      closeConfirm();
      const res = await fetch("/api/userItem/deleteFile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_item_id: userItemId, file_name: fileName }),
      });
      const result = await res.json();
      if (result.success) {
        const remaining: string[] = result.files ?? [];
        setItems(prev => prev.map(item =>
          item.id === userItemId
            ? { ...item, pdf_import: remaining.length > 0 ? JSON.stringify(remaining) : null }
            : item
        ));
      } else {
        alert("ลบไฟล์ไม่สำเร็จ");
      }
    });
  };
  const confirmUpload = async () => {
    if (selectedFiles.length === 0 || uploadModalItemId === null) return;
    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(f => formData.append("file", f));
    formData.append("user_item_id", String(uploadModalItemId));
    const res = await fetch("/api/userItem/uploadFile", { method: "POST", body: formData });
    const result = await res.json();
    if (result.success) {
      setItems(prev => prev.map(item =>
        item.id === uploadModalItemId
          ? { ...item, pdf_import: JSON.stringify(result.files) }
          : item
      ));
      setUploadModalItemId(null);
      setSelectedFiles([]);
    } else {
      alert("อัปโหลดไม่สำเร็จ");
    }
    setIsUploading(false);
  };
  /*===================================================*/
  if (loading) {

    return <div>Loading555 ...</div>;
  }
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet" />
      {/* ===== Confirm Modal ===== */}
      {confirmModal.open && (
        <>
          {/* พื้นหลังมืด */}
          <div className="confirm-overlay" onClick={closeConfirm} />

          {/* ตัวกล่อง Modal */}
          <div className="confirm-modal">
            <div className="confirm-icon-wrap">
              <div className={`confirm-icon ${confirmModal.type === 'save' ? 'confirm-icon--save' : ''}`}>
                {confirmModal.type === 'save' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                )}
              </div>
            </div>

            <h3 className="confirm-title">{confirmModal.title}</h3>
            <p className="confirm-desc">{confirmModal.description}</p>

            <div className="confirm-actions">
              <button className="confirm-btn-cancel" onClick={closeConfirm}>
                ยกเลิก
              </button>
              <button
                className={confirmModal.type === 'save' ? 'confirm-btn-save' : 'confirm-btn-delete'}
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.type === 'save' ? 'ยืนยันการบันทึก' : 'ยืนยันการลบ'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== Success Toast ===== */}
      {successModal.open && (
        <div className="success-toast">
          <div className="success-toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="success-toast-msg">{successModal.message}</span>
        </div>
      )}
      {/* ===== Upload Modal ===== */}
      {uploadModalItemId !== null && (
        <>
          <div
            className="modal-overlay"
            onClick={() => { setUploadModalItemId(null); setSelectedFiles([]); }}
          />
          <div className="modal-container">
            <h3 className="modal-title">แนบไฟล์หลักฐาน</h3>

            {/* Custom File Input */}
            <label className="file-drop-area">
              <span style={{ fontSize: "24px" }}>📄</span>
              <span className="file-drop-text">คลิกเพื่อเลือกไฟล์ (PDF, JPG, PNG)</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="file-input-hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setSelectedFiles(prev => [...prev, ...files]);
                  e.target.value = ""; // รีเซ็ตค่าเพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้าจำเป็น
                }}
              />
            </label>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <ul className="file-list">
                {selectedFiles.map((f, i) => (
                  <li key={i} className="file-item">
                    <span className="file-name">{f.name}</span>
                    <button
                      type="button"
                      className="btn-icon-remove"
                      onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                      title="ลบไฟล์นี้"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Action Buttons */}
            <div className="btn-group">
              <button
                className="btn btn-cancel"
                onClick={() => { setUploadModalItemId(null); setSelectedFiles([]); }}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-primary"
                onClick={confirmUpload}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? "กำลังอัปโหลด..." : `ยืนยันการแนบ (${selectedFiles.length} ไฟล์)`}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===== File Manager Modal ===== */}
      {fileManagerItemId !== null && (() => {
        const fmItem = items.find(i => i.id === fileManagerItemId);
        const fmFiles = parseFiles(fmItem?.pdf_import ?? null);
        return (
          <>
            <div
              className="modal-overlay"
              onClick={() => setFileManagerItemId(null)}
            />
            <div className="modal-container">
              <h3 className="modal-title">
                ไฟล์แนบ <span style={{ color: "#6b7280", fontSize: "16px", fontWeight: "normal" }}>({fmFiles.length} ไฟล์)</span>
              </h3>

              {fmFiles.length === 0 ? (
                <p style={{ margin: "10px 0", color: "#9ca3af", fontSize: "14px", textAlign: "center" }}>
                  ยังไม่มีไฟล์แนบ
                </p>
              ) : (
                <ul className="file-list">
                  {fmFiles.map((fname, fi) => (
                    <li key={fi} className="file-item">
                      <span className="file-name">
                        {fname.replace(/^\d+-\d+-/, "")}
                      </span>
                      <a
                        href={`/uploads/${fname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sm-view"
                      >
                        ดู
                      </a>
                      <button
                        type="button"
                        className="btn-sm-delete"
                        onClick={async () => {
                          await deleteFile(fileManagerItemId, fname);
                          // ลบเสร็จแล้วอาจจะไม่ต้องปิด Modal ก็ได้ ถ้าต้องการให้ลบไฟล์อื่นต่อได้ (ปรับได้ตามต้องการ)
                          // setFileManagerItemId(null); 
                        }}
                      >
                        ลบ
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="btn-group">
                <button
                  className="btn btn-success"
                  onClick={() => { setFileManagerItemId(null); setUploadModalItemId(fileManagerItemId); setSelectedFiles([]); }}
                >
                  + เพิ่มไฟล์
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={() => setFileManagerItemId(null)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </>
        );
      })()}
      {/*============================================================ */}
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

                {availableYears.length > 0 ? (
                  availableYears
                    .filter((item) => !usedYears1.has(item.year))
                    .map((item) => (
                      <option key={item.year_id} value={item.year}>
                        {item.year}
                      </option>
                    ))
                ) : (
                  <option disabled>กำลังโหลดข้อมูลปี...</option>
                )}
              </select>
              <div className="dis">
                <button
                  type="submit"
                  disabled={
                    !editingYear ||
                    editingYear === selectedYear ||
                    usedYears.includes(editingYear)
                  }
                >
                  ยืนยัน
                </button>
                <button
                  type="button"
                  onClick={() => settab_e(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {/*============================================================ */}
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
      {showtab_y && (
        <>
          <div className="back-b" onClick={() => settab_y(!showtab_y)}></div>
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
                value={inputYear}
                onChange={(e) => {
                  const value_5 = e.target.value;
                  setInputYear(value_5 === "" ? "" : Number(value_5));
                }}
                required
              >
                <option value="" disabled hidden>เลือกปี (พ.ศ.)</option>

                {availableYears.length > 0 ? (
                  availableYears
                    .filter((item) => !usedYears1.has(item.year))
                    .map((item) => (
                      <option key={item.year_id} value={item.year}>
                        {item.year}
                      </option>
                    ))
                ) : (
                  <option disabled>กำลังโหลดข้อมูลปี...</option>
                )}
              </select>
              <div className="dis">
                <button type="submit" disabled={isYearExist}>ยืนยัน</button>
                <button
                  type="button"
                  onClick={() => settab_y(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      <div className="bg-data">.</div>
      <div className="boxuser">
        <div className="logonetzero">
          <img src="/imj/back/logol.png" className="imglogo-1l" />
        </div>

        {/* =========================================================================================================== */}
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
            <div className={`profile-overlay ${isUploadingProfile ? 'is-uploading' : ''}`}>
              {isUploadingProfile ? (
                <Loader2 className="spinner-icon" style={{ width: "2.5vh", height: "100%", color: "white" }} />
              ) : (
                <Camera className="camera-icon" style={{ width: "2.5vh", height: "100%", color: "white" }} />
              )}
            </div>
          </div>
        </div>
        {/* =========================================================================================================== */}
        <div className="Usern">
          <h1 className="Usern-text">{fullName}</h1>
        </div>
        <div className="button-dashborad">
          {active && (
            <button className={`button-dashborad-c ${active ? "active" : ""}`} onClick={() => setActive(active)}><img src="/imj/back/logodash.png" /><p>Dashboard</p></button>
          )}
          {!active && (
            <button className={`button-dashborad-c ${active ? "active" : ""}`} onClick={() => setActive(!active)}><img src="/imj/back/logodash.png" /><p>Dashboard</p></button>
          )}
        </div>
        <div className="button1">
          <div className="button1-text">กรอกข้อมูล</div>
          {active2 && (
            <button className={`button1-c ${active2 ? "active" : ""}`} onClick={() => setActive2(active2)}><img src="/imj/back/logoscan.png" /><p>กรอกข้อมูล</p></button>
          )}
          {!active2 && (
            <button className={`button1-c ${active2 ? "active" : ""}`} onClick={() => setActive2(!active2)}><img src="/imj/back/logoscan.png" /><p>กรอกข้อมูล</p></button>
          )}
        </div>
        {isVisible && (
          <div className={`button1-tab ${show1 ? "show" : "hide"}`}>
            <div className="button1-tab-button1">
              {showbutton1 ? (
                <>
                  <div className="box-s1-show"></div>
                  <button className={`button1-tab-taxt ${active3 ? "active" : ""}`} onClick={() => setActive3(active3)}><img src="/imj/back/logo2.png" alt="logo" /><p>UP Net Zero</p></button>
                </>
              ) : (
                <>
                  <div className="box-s1"></div>
                  <button className={`button1-tab-taxt ${active3 ? "active" : ""}`} onClick={() => setActive3(!active3)}><img src="/imj/back/logo2.png" alt="logo" /><p>UP Net Zero</p></button>
                </>
              )}
            </div>
            <div className="button1-tab-button2">
              {showbutton2 ? (
                <>
                  <div className="box-s2-show"></div>
                  <button className={`button2-tab-taxt ${active4 ? "active" : ""}`} onClick={() => setActive4(active4)} ><img src="/imj/back/logo2.png" alt="logo" /><p>การคำนวณกิจกรรม</p></button>
                </>
              ) : (
                <>
                  <div className="box-s2"></div>
                  <button className={`button2-tab-taxt ${active4 ? "active" : ""}`} onClick={() => setActive4(!active4)} ><img src="/imj/back/logo2.png" alt="logo" /><p>การคำนวณกิจกรรม</p></button>
                </>
              )}
            </div>
          </div>
        )}
        <div className="button3">
          <div className="button3-text">LABELS</div>
          {active7 && (
            <button className={`button3-c ${active7 ? "active" : ""}`} onClick={() => setActive7(active7)}><img src="/imj/back/logouser.png" /><p>เปลี่ยนโปรไฟล์</p></button>
          )}
          {!active7 && (
            <button className={`button3-c ${active7 ? "active" : ""}`} onClick={() => setActive7(!active7)}><img src="/imj/back/logouser.png" /><p>เปลี่ยนโปรไฟล์</p></button>
          )}
          {active8 && (
            <button className={`button4-c ${active8 ? "active" : ""}`} onClick={() => setActive8(active8)}><img src="/imj/back/refresh.png" /><p>ประวัติการทำรายการ</p></button>
          )}
          {!active8 && (
            <button className={`button4-c ${active8 ? "active" : ""}`} onClick={() => setActive8(!active8)}><img src="/imj/back/refresh.png" /><p>ประวัติการทำรายการ</p></button>
          )}
          {active9 && (
            <button className={`button5-c ${active9 ? "active" : ""}`} onClick={() => handleLogout()}><img src="/imj/back/logout.png" /><p>ลงชื่อออก</p></button>
          )}
          {!active9 && (
            <button className={`button5-c ${active9 ? "active" : ""}`} onClick={() => handleLogout()}><img src="/imj/back/logout.png" /><p>ลงชื่อออก</p></button>
          )}
        </div>
      </div>
      {showstart1 && (
        <div className="databox">
          <div className="Tab1box1-textdash">Dash</div>
          <div className="Tabdatabox1">
            <div className="Tabdatabox1-group">
              <div className="boxdata1"><a href="/">1</a></div>
              <div className="boxdata1">2</div>
              <div className="boxdata1">3</div>
              <div className="boxdata1">4</div>
            </div>
            <div aria-hidden className="Tabdatabox1-group">
              <div className="boxdata1"><a href="/">11</a></div>
              <div className="boxdata1">2</div>
              <div className="boxdata1">3</div>
              <div className="boxdata1">4</div>
            </div>
          </div>
          <div className="Tabdatabox2">hello</div>
          <div className="Tabdatabox3">hello</div>
        </div>)}
      {active3 && (
        <div className="data-upnetzero1">
          {/* ================================================================================================================================================================= */}
          {!showbutton4f && (
            <>
              <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>UP Net Zero</h2><p>|</p><h2>{faculty_name}</h2></div>
              <div className="data4-tab1"></div>
              <div className="data3-tab2">ชื่อหน่วยงาน : {faculty_name}</div>
              <div className="postdata4-p">
                {/* ---------------------------------------------------------------------------- */}
                <div className="postdata3-dis"><div className="postdata4-tab-1">รายงานการปล่อยและการดูดกลับก๊าซเรือนกระจก<div className="postdata3-tabbg-p"></div></div><button className="data3-tab2-b1-y" onClick={() => settab_y(!showtab_y)}><img src="/imj/back/logoscan.png" />เพิ่มปี</button></div>
                {/* ---------------------------------------------------------------------------- */}
                {/* ---------------------------------------------------------------------------- */}
                <div className="postdata3-dis-y">
                  {[...new Map(years.map(y => [y.id, y])).values()]
                    .sort((a, b) => b.year - a.year)
                    .map((item: YearItem) => {
                      const total = Number(yearTotals?.[item.year] ?? 0);
                      return (
                        <div
                          className="postdata3-dis-y-box fade-in"
                          key={item.id}
                        >
                          <div className="box-y">
                            <div className="d-box-y">
                              <img
                                src="/imj/back/edit_y.png"
                                onClick={() => {
                                  setSelectedYear(item.year);
                                  setInputYear("");
                                  settab_e(true);
                                }}
                              />
                              <img
                                src="/imj/back/del_y.png"
                                onClick={() => deleteYear(item.id)}
                              />
                            </div>
                            <p>การปล่อยก๊าซเรือนกระจก</p>
                            <h1>ปี {item.year}</h1>
                            <div className="number-y">
                              {total.toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 4,
                              })} tCO2e
                            </div>

                            <button
                              onClick={() => {
                                setSelectedYear(item.year);
                                setInputYear(item.year);
                                setbutton4f(!showbutton4f);
                              }}
                            >
                              แก้ไขข้อมูล
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
          {/* ================================================================================================================================================================= */}
          {showbutton4 && (
            <>
              <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>UP Net Zero</h2><p>|</p><h2>{faculty_name}</h2><p>|</p><h2>เลือกขอบเขตกิจกรรม</h2></div>
              <div className="data4-tab1"></div>
              <div className="data3-tab2">เลือกขอบเขตกิจกรรม</div>
              <div className="postdata4">
                <div className="postdata3-dis"><div className="postdata4-tab-1">ขอบเขตกิจกรรม<div className="postdata3-tabbg"></div></div></div>
                <div className="postdata3-dis"><div className="postdata4-tab-2">เลือก
                  <label className="custom-check2">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c1}
                      onChange={() => handleChange1("c1")}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <label className="custom-check2">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c2}
                      onChange={() => handleChange1("c2")}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <label className="custom-check2">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c3}
                      onChange={() => handleChange1("c3")}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <label className="custom-check2">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c4}
                      onChange={() => handleChange1("c4")}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <label className="custom-check2">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c5}
                      onChange={() => handleChange1("c5")}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <label className="custom-check2">
                    <input
                      type="checkbox"
                      className="postdata4-c"
                      checked={checkedList.c6}
                      onChange={() => handleChange1("c6")}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                  <div className="postdata4-tab-3">
                    <div className="postdata3-dis"><div className="postdata4-tabbgh">.</div><p>ขอบเขต</p></div>
                    <div className="postdata4-tab-3-1">ขอบเขตที่ 1 การเผาไหม้ที่อยู่กับที่ (Stationary Combustion)</div>
                    <div className="postdata4-tab-3-11">ขอบเขตที่ 1 การเผาไหม้ที่มีการเคลื่อนที่ On Road (Mobile Combustion : On Road)</div>
                    <div className="postdata4-tab-3-11">ขอบเขตที่ 1 การเผาไหม้ที่มีการเคลื่อนที่ Off Road (Mobile Combustion : Off Road)</div>
                    <div className="postdata4-tab-3-2">ขอบเขตที่ 2 การใช้ไฟฟ้า (Electricity)</div>
                    <div className="postdata4-tab-3-3">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services)</div><div className="postdata4-tab-3-3">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services)</div>
                  </div>
                </div>
                <div className="postdata4-tab-4"><button onClick={() => setbutton5(!showbutton5)}><div className="postdata3-dis"><p>ถัดไป</p><img src="/imj/back/ArrowRight.png" /></div></button></div>

              </div></>)}
          {/*=============================================*/}
          {showbutton5 && (
            <>
              <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>UP Net Zero</h2><p>|</p><h2>{faculty_name}</h2><p>|</p><h2>เลือกขอบเขตกิจกรรม</h2></div>
              <div className="data4-tab1"></div>
              <div className="dis-j">
                <div className="data3-tab2">กรอกข้อมูลขอบเขตกิจกรรม</div><div className="data3-tab3">
                  <div role="button" onClick={saveAllVolumes} className="data3-tab2-b5" ><img src="/imj/back/iconsave.png" />บันทึกข้อมูล</div>
                  <div role="button" onClick={() => setbuttonscope(!showbuttonscope)} className="data3-tab2-b3" ><img src="/imj/back/add-circle.png" />เพิ่มกิจกรรม</div>
                  <div role="button" onClick={() => setbutton555(!showbutton555)} className="data3-tab2-b4" ><img src="/imj/back/computing.png" />คำนวณผลกิจกรรม</div>
                </div></div>

              {/*-------------------------------------------------------*/}
              <div className="postdata3-dis-t">
                {checkedList.c1 && (<>
                  <div className="postdata4-t fade-in">
                    <div className="postdata3-dis"><div className="postdata4-data3-tab2">ขอบเขตที่ 1: การเผาไหม้ที่อยู่กับที่ (Stationary Combustion) <div className="postdata-tabbg-y"></div></div><button className="data3-tab2-b1" onClick={() => toggleCheck("c1")} ><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button><button className={`data3-tab2-b ${showstart4_1 ? "active" : ""}`} onClick={handleClick1} ><img src="/imj/back/arrow-circle-down.png" /></button></div>
                    {!showbutton55 && (<>
                      <div className="postdata4-tab3 fade-in2">
                        <div className="postdata3-dis-tab3"><div className="postdata4-data3-tab3">รายการ</div><div className="postdata4-data3-tab3-1">หน่วย</div><div className="postdata4-data3-tab3-2">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                          <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div><div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div><div className="postdata4-data3-tab3-5">แนบไฟล์</div></div>
                        {/*-------------------------------------------------------*/}
                        {items.length === 0 && (
                          <p>ยังไม่มีข้อมูลของปีนี้</p>
                        )}

                        {items
                          .filter(
                            (item) =>
                              Number(item.scope) === 1 &&
                              Number(item.year) === Number(selectedYear)
                          )
                          .map(item => (
                            <div key={item.id} className="postdata3-dis-tab3">
                              <div className="postdata4-data3-tab3-i">
                                {item.name_tiem}
                              </div>
                              <div className="postdata4-data3-tab3-1-i">
                                {item.unit}
                              </div>

                              <div className="postdata4-data3-tab3-2-i-y">
                                {Number(item.AD).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                              <input
                                type="number"
                                className="postdata4-data3-tab3-3"
                                placeholder={Number(item.Vol ?? 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                                value={volumes[item.id] ?? ""}
                                onChange={(e) =>
                                  setVolumes(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="postdata4-data3-tab3-4-6">
                                {(
                                  (volumes[item.id] !== undefined && volumes[item.id] !== ""
                                    ? Number(volumes[item.id])
                                    : Number(item.Vol ?? 0)
                                  ) * item.AD
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>

                              {(() => {
                                const fileList = parseFiles(item.pdf_import);
                                return fileList.length > 0 ? (
                                  <div className="postdata4-data3-tab3-5-i-o">
                                    {/* ปุ่ม 1: ดู — icon ตา */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-w"
                                      title={`ดูไฟล์ (${fileList.length})`}
                                      onClick={() => setFileManagerItemId(item.id)}
                                      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Eye style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#eb2525ff", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 }}>{fileList.length}</span>
                                    </button>
                                    {/* ปุ่ม 2: เพิ่มไฟล์ — icon + วงกลม */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-e"
                                      title="เพิ่มไฟล์"
                                      onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                    >
                                      <FilePlusCorner
                                        style={{ width: "2.5vh", height: "100%", color: "white" }}
                                      />
                                    </button>
                                    {/* ปุ่ม 3: ลบทั้งหมด — icon ถังขยะ */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-d"
                                      title="ลบไฟล์ทั้งหมด"
                                      onClick={() => deleteFile(item.id)}
                                    >
                                      <Trash2 style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="postdata4-data3-tab3-5-i"
                                    title="แนบไฟล์"
                                    onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                  >
                                    <FilePlusCorner
                                      style={{ width: "2.5vh", height: "100%", color: "white" }}
                                    />
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                      </div>
                    </>)}
                  </div>
                </>)}
                {/*=====================================================================================*/}
                {checkedList.c2 && (<>
                  <div className="postdata4-t fade-in">
                    <div className="postdata3-dis"><div className="postdata4-data3-tab2">ขอบเขตที่ 1: การเผาไหม้ที่มีการเคลื่อนที่ On Road (Mobile Combustion : On Road) <div className="postdata-tabbg-y"></div></div><button className="data3-tab2-b1" onClick={() => toggleCheck("c2")} ><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button><button className={`data3-tab2-b ${showstart4_11 ? "active" : ""}`} onClick={handleClick2} ><img src="/imj/back/arrow-circle-down.png" /></button></div>
                    {!button_scope11 && (<>
                      <div className="postdata4-tab3 fade-in2">
                        <div className="postdata3-dis-tab3"><div className="postdata4-data3-tab3">รายการ</div><div className="postdata4-data3-tab3-1">หน่วย</div><div className="postdata4-data3-tab3-2">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                          <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div><div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div><div className="postdata4-data3-tab3-5">แนบไฟล์</div></div>
                        {/*-------------------------------------------------------*/}
                        {items.length === 1 && (
                          <p>ยังไม่มีข้อมูลของปีนี้</p>
                        )}

                        {items
                          .filter(
                            (item) =>
                              Number(item.scope) === 2 &&
                              Number(item.year) === Number(selectedYear)

                          )
                          .map(item => (
                            <div key={item.id} className="postdata3-dis-tab3">
                              <div className="postdata4-data3-tab3-i">
                                {item.name_tiem}
                              </div>
                              <div className="postdata4-data3-tab3-1-i">
                                {item.unit}
                              </div>

                              <div className="postdata4-data3-tab3-2-i-y">
                                {Number(item.AD).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                              <input
                                type="number"
                                className="postdata4-data3-tab3-3"
                                placeholder={Number(item.Vol ?? 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                                value={volumes[item.id] ?? ""}
                                onChange={(e) =>
                                  setVolumes(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="postdata4-data3-tab3-4-6">
                                {(
                                  (volumes[item.id] !== undefined && volumes[item.id] !== ""
                                    ? Number(volumes[item.id])
                                    : Number(item.Vol ?? 0)
                                  ) * item.AD
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>

                              {(() => {
                                const fileList = parseFiles(item.pdf_import);
                                return fileList.length > 0 ? (
                                  <div className="postdata4-data3-tab3-5-i-o">
                                    {/* ปุ่ม 1: ดู — icon ตา */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-w"
                                      title={`ดูไฟล์ (${fileList.length})`}
                                      onClick={() => setFileManagerItemId(item.id)}
                                      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Eye style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#eb2525ff", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 }}>{fileList.length}</span>
                                    </button>
                                    {/* ปุ่ม 2: เพิ่มไฟล์ — icon + วงกลม */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-e"
                                      title="เพิ่มไฟล์"
                                      onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                    >
                                      <FilePlusCorner
                                        style={{ width: "2.5vh", height: "100%", color: "white" }}
                                      />
                                    </button>
                                    {/* ปุ่ม 3: ลบทั้งหมด — icon ถังขยะ */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-d"
                                      title="ลบไฟล์ทั้งหมด"
                                      onClick={() => deleteFile(item.id)}
                                    >
                                      <Trash2 style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="postdata4-data3-tab3-5-i"
                                    title="แนบไฟล์"
                                    onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                  >
                                    <FilePlusCorner
                                      style={{ width: "2.5vh", height: "100%", color: "white" }}
                                    />
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                      </div>
                    </>)}
                  </div>
                </>)}
                {/*=====================================================================================*/}
                {checkedList.c3 && (<>
                  <div className="postdata4-t fade-in">
                    <div className="postdata3-dis"><div className="postdata4-data3-tab2">ขอบเขตที่ 1 การเผาไหม้ที่มีการเคลื่อนที่ Off Road (Mobile Combustion : Off Road) <div className="postdata-tabbg-y"></div></div><button className="data3-tab2-b1" onClick={() => toggleCheck("c3")} ><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button><button className={`data3-tab2-b ${showstart4_111 ? "active" : ""}`} onClick={handleClick3} ><img src="/imj/back/arrow-circle-down.png" /></button></div>
                    {button_scope111 && (<>
                      <div className="postdata4-tab3 fade-in2">
                        <div className="postdata3-dis-tab3"><div className="postdata4-data3-tab3">รายการ</div><div className="postdata4-data3-tab3-1">หน่วย</div><div className="postdata4-data3-tab3-2">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                          <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div><div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div><div className="postdata4-data3-tab3-5">แนบไฟล์</div></div>
                        {/*-------------------------------------------------------*/}
                        {items.length === 2 && (
                          <p>ยังไม่มีข้อมูลของปีนี้</p>
                        )}

                        {items
                          .filter(
                            (item) =>
                              Number(item.scope) === 3 &&
                              Number(item.year) === Number(selectedYear)

                          )
                          .map(item => (
                            <div key={item.id} className="postdata3-dis-tab3">
                              <div className="postdata4-data3-tab3-i">
                                {item.name_tiem}
                              </div>
                              <div className="postdata4-data3-tab3-1-i">
                                {item.unit}
                              </div>

                              <div className="postdata4-data3-tab3-2-i-y">
                                {Number(item.AD).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                              <input
                                type="number"
                                className="postdata4-data3-tab3-3"
                                placeholder={Number(item.Vol ?? 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                                value={volumes[item.id] ?? ""}
                                onChange={(e) =>
                                  setVolumes(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="postdata4-data3-tab3-4-6">
                                {(
                                  (volumes[item.id] !== undefined && volumes[item.id] !== ""
                                    ? Number(volumes[item.id])
                                    : Number(item.Vol ?? 0)
                                  ) * item.AD
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>

                              {(() => {
                                const fileList = parseFiles(item.pdf_import);
                                return fileList.length > 0 ? (
                                  <div className="postdata4-data3-tab3-5-i-o">
                                    {/* ปุ่ม 1: ดู — icon ตา */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-w"
                                      title={`ดูไฟล์ (${fileList.length})`}
                                      onClick={() => setFileManagerItemId(item.id)}
                                      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Eye style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#eb2525ff", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 }}>{fileList.length}</span>
                                    </button>
                                    {/* ปุ่ม 2: เพิ่มไฟล์ — icon + วงกลม */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-e"
                                      title="เพิ่มไฟล์"
                                      onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                    >
                                      <FilePlusCorner
                                        style={{ width: "2.5vh", height: "100%", color: "white" }}
                                      />
                                    </button>
                                    {/* ปุ่ม 3: ลบทั้งหมด — icon ถังขยะ */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-d"
                                      title="ลบไฟล์ทั้งหมด"
                                      onClick={() => deleteFile(item.id)}
                                    >
                                      <Trash2 style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="postdata4-data3-tab3-5-i"
                                    title="แนบไฟล์"
                                    onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                  >
                                    <FilePlusCorner
                                      style={{ width: "2.5vh", height: "100%", color: "white" }}
                                    />
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                      </div>
                    </>)}
                  </div>
                </>)}
                {/*=====================================================================================*/}
                {checkedList.c4 && (<>
                  <div className="postdata4-t fade-in">
                    <div className="postdata3-dis"><div className="postdata4-data3-tab2-pl">ขอบเขตที่ 2: การใช้ไฟฟ้า (Electricity) <div className="postdata-tabbg-pl"></div></div><button className="data3-tab2-b1" onClick={() => toggleCheck("c4")} ><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button><button className={`data3-tab2-b ${showstart4_2 ? "active" : ""}`} onClick={handleClick4} ><img src="/imj/back/arrow-circle-down.png" /></button></div>
                    {button_scope2 && (<>
                      <div className="postdata4-tab3 fade-in2">
                        <div className="postdata3-dis-tab3"><div className="postdata4-data3-tab3-pl">รายการ</div><div className="postdata4-data3-tab3-1-pl">หน่วย</div><div className="postdata4-data3-tab3-2-pl">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                          <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div><div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div><div className="postdata4-data3-tab3-5">แนบไฟล์</div></div>
                        {/*-------------------------------------------------------*/}
                        {items.length === 3 && (
                          <p>ยังไม่มีข้อมูลของปีนี้</p>
                        )}

                        {items
                          .filter(
                            (item) =>
                              Number(item.scope) === 4 &&
                              Number(item.year) === Number(selectedYear)

                          )
                          .map(item => (
                            <div key={item.id} className="postdata3-dis-tab3">
                              <div className="postdata4-data3-tab3-pl-i">
                                {item.name_tiem}
                              </div>
                              <div className="postdata4-data3-tab3-1-pl-i">
                                {item.unit}
                              </div>

                              <div className="postdata4-data3-tab3-2-i-pl">
                                {Number(item.AD).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                              <input
                                type="number"
                                className="postdata4-data3-tab3-3"
                                placeholder={Number(item.Vol ?? 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                                value={volumes[item.id] ?? ""}
                                onChange={(e) =>
                                  setVolumes(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="postdata4-data3-tab3-4-6">
                                {(
                                  (volumes[item.id] !== undefined && volumes[item.id] !== ""
                                    ? Number(volumes[item.id])
                                    : Number(item.Vol ?? 0)
                                  ) * item.AD
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>

                              {(() => {
                                const fileList = parseFiles(item.pdf_import);
                                return fileList.length > 0 ? (
                                  <div className="postdata4-data3-tab3-5-i-o">
                                    {/* ปุ่ม 1: ดู — icon ตา */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-w"
                                      title={`ดูไฟล์ (${fileList.length})`}
                                      onClick={() => setFileManagerItemId(item.id)}
                                      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Eye style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#eb2525ff", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 }}>{fileList.length}</span>
                                    </button>
                                    {/* ปุ่ม 2: เพิ่มไฟล์ — icon + วงกลม */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-e"
                                      title="เพิ่มไฟล์"
                                      onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                    >
                                      <FilePlusCorner
                                        style={{ width: "2.5vh", height: "100%", color: "white" }}
                                      />
                                    </button>
                                    {/* ปุ่ม 3: ลบทั้งหมด — icon ถังขยะ */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-d"
                                      title="ลบไฟล์ทั้งหมด"
                                      onClick={() => deleteFile(item.id)}
                                    >
                                      <Trash2 style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="postdata4-data3-tab3-5-i"
                                    title="แนบไฟล์"
                                    onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                  >
                                    <FilePlusCorner
                                      style={{ width: "2.5vh", height: "100%", color: "white" }}
                                    />
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                      </div>
                    </>)}
                  </div>
                </>)}
                {/*=====================================================================================*/}
                {checkedList.c5 && (<>
                  <div className="postdata4-t fade-in">
                    <div className="postdata3-dis"><div className="postdata4-data3-tab2-b">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services) <div className="postdata-tabbg-b"></div></div><button className="data3-tab2-b1" onClick={() => toggleCheck("c5")} ><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button><button className={`data3-tab2-b ${showstart4_3 ? "active" : ""}`} onClick={handleClick5} ><img src="/imj/back/arrow-circle-down.png" /></button></div>
                    {button_scope3 && (<>
                      <div className="postdata4-tab3 fade-in2">
                        <div className="postdata3-dis-tab3"><div className="postdata4-data3-tab3-b">รายการ</div><div className="postdata4-data3-tab3-1-b">หน่วย</div><div className="postdata4-data3-tab3-2-b">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                          <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div><div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div><div className="postdata4-data3-tab3-5">แนบไฟล์</div></div>
                        {/*-------------------------------------------------------*/}
                        {items.length === 4 && (
                          <p>ยังไม่มีข้อมูลของปีนี้</p>
                        )}

                        {items
                          .filter(
                            (item) =>
                              Number(item.scope) === 5 &&
                              Number(item.year) === Number(selectedYear)

                          )
                          .map(item => (
                            <div key={item.id} className="postdata3-dis-tab3">
                              <div className="postdata4-data3-tab3-b-i">
                                {item.name_tiem}
                              </div>
                              <div className="postdata4-data3-tab3-1-b-i">
                                {item.unit}
                              </div>

                              <div className="postdata4-data3-tab3-2-b-i">
                                {Number(item.AD).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                              <input
                                type="number"
                                className="postdata4-data3-tab3-3"
                                placeholder={Number(item.Vol ?? 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                                value={volumes[item.id] ?? ""}
                                onChange={(e) =>
                                  setVolumes(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="postdata4-data3-tab3-4-6">
                                {(
                                  (volumes[item.id] !== undefined && volumes[item.id] !== ""
                                    ? Number(volumes[item.id])
                                    : Number(item.Vol ?? 0)
                                  ) * item.AD
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>

                              {(() => {
                                const fileList = parseFiles(item.pdf_import);
                                return fileList.length > 0 ? (
                                  <div className="postdata4-data3-tab3-5-i-o">
                                    {/* ปุ่ม 1: ดู — icon ตา */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-w"
                                      title={`ดูไฟล์ (${fileList.length})`}
                                      onClick={() => setFileManagerItemId(item.id)}
                                      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Eye style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#eb2525ff", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 }}>{fileList.length}</span>
                                    </button>
                                    {/* ปุ่ม 2: เพิ่มไฟล์ — icon + วงกลม */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-e"
                                      title="เพิ่มไฟล์"
                                      onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                    >
                                      <FilePlusCorner
                                        style={{ width: "2.5vh", height: "100%", color: "white" }}
                                      />
                                    </button>
                                    {/* ปุ่ม 3: ลบทั้งหมด — icon ถังขยะ */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-d"
                                      title="ลบไฟล์ทั้งหมด"
                                      onClick={() => deleteFile(item.id)}
                                    >
                                      <Trash2 style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="postdata4-data3-tab3-5-i"
                                    title="แนบไฟล์"
                                    onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                  >
                                    <FilePlusCorner
                                      style={{ width: "2.5vh", height: "100%", color: "white" }}
                                    />
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                      </div>
                    </>)}
                  </div>
                </>)}
                {/*=====================================================================================*/}
                {checkedList.c6 && (<>
                  <div className="postdata4-t fade-in">
                    <div className="postdata3-dis"><div className="postdata4-data3-tab2-b">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services) <div className="postdata-tabbg-b"></div></div><button className="data3-tab2-b1" onClick={() => toggleCheck("c6")} ><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button><button className={`data3-tab2-b ${showstart4_33 ? "active" : ""}`} onClick={handleClick6} ><img src="/imj/back/arrow-circle-down.png" /></button></div>
                    {button_scope33 && (<>
                      <div className="postdata4-tab3 fade-in2">
                        <div className="postdata3-dis-tab3"><div className="postdata4-data3-tab3-b">รายการ</div><div className="postdata4-data3-tab3-1-b">หน่วย</div><div className="postdata4-data3-tab3-2-b">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                          <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div><div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div><div className="postdata4-data3-tab3-5">แนบไฟล์</div></div>
                        {/*-------------------------------------------------------*/}
                        {items.length === 5 && (
                          <p>ยังไม่มีข้อมูลของปีนี้</p>
                        )}

                        {items
                          .filter(
                            (item) =>
                              Number(item.scope) === 6 &&
                              Number(item.year) === Number(selectedYear)

                          )
                          .map(item => (
                            <div key={item.id} className="postdata3-dis-tab3">
                              <div className="postdata4-data3-tab3-b-i">
                                {item.name_tiem}
                              </div>
                              <div className="postdata4-data3-tab3-1-b-i">
                                {item.unit}
                              </div>

                              <div className="postdata4-data3-tab3-2-b-i">
                                {Number(item.AD).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>
                              <input
                                type="number"
                                className="postdata4-data3-tab3-3"
                                placeholder={Number(item.Vol ?? 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                                value={volumes[item.id] ?? ""}
                                onChange={(e) =>
                                  setVolumes(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                              />
                              <div className="postdata4-data3-tab3-4-6">
                                {(
                                  (volumes[item.id] !== undefined && volumes[item.id] !== ""
                                    ? Number(volumes[item.id])
                                    : Number(item.Vol ?? 0)
                                  ) * item.AD
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 4,
                                })}
                              </div>

                              {(() => {
                                const fileList = parseFiles(item.pdf_import);
                                return fileList.length > 0 ? (
                                  <div className="postdata4-data3-tab3-5-i-o">
                                    {/* ปุ่ม 1: ดู — icon ตา */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-w"
                                      title={`ดูไฟล์ (${fileList.length})`}
                                      onClick={() => setFileManagerItemId(item.id)}
                                      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                    >
                                      <Eye style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                      <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#eb2525ff", color: "#fff", borderRadius: "50%", fontSize: "10px", minWidth: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 }}>{fileList.length}</span>
                                    </button>
                                    {/* ปุ่ม 2: เพิ่มไฟล์ — icon + วงกลม */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-e"
                                      title="เพิ่มไฟล์"
                                      onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                    >
                                      <FilePlusCorner
                                        style={{ width: "2.5vh", height: "100%", color: "white" }}
                                      />
                                    </button>
                                    {/* ปุ่ม 3: ลบทั้งหมด — icon ถังขยะ */}
                                    <button
                                      type="button"
                                      className="postdata4-data3-tab3-5-i-d"
                                      title="ลบไฟล์ทั้งหมด"
                                      onClick={() => deleteFile(item.id)}
                                    >
                                      <Trash2 style={{ width: "2.5vh", height: "100%", color: "white" }} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="postdata4-data3-tab3-5-i"
                                    title="แนบไฟล์"
                                    onClick={() => { setUploadModalItemId(item.id); setSelectedFiles([]); }}
                                  >
                                    <FilePlusCorner
                                      style={{ width: "2.5vh", height: "100%", color: "white" }}
                                    />
                                  </button>
                                );
                              })()}
                            </div>
                          ))}
                      </div>
                    </>)}
                  </div>
                </>)}
                {/*=====================================================================================*/}
              </div>
              <div>
              </div>
            </>
          )}
        </div>
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