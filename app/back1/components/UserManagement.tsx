"use client";

import { useState, useEffect, useMemo } from "react";
import { PlusCircle, Eye, EyeOff, Pencil, Trash2, ChevronLeft, ChevronRight, Columns } from "lucide-react";

/*====================================================================================*/
type Affiliation = { id: number; affiliation_item: string };
type UserRow = {
  id: number;
  username: string;
  password: string;
  email: string | null;
  firstname: string;
  lastname: string;
  Affiliation: number;
  role: string;
  created_at: string;
};
type FormState = {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  Affiliation: number;
  role: string;
};
const EMPTY_FORM: FormState = { username: "", password: "", email: "", firstname: "", lastname: "", Affiliation: 1, role: "user" };

const ALL_COLS = ["อีเมล", "ชื่อ-สกุล", "Username", "Password", "ตำแหน่ง", "Status"] as const;
type ColName = typeof ALL_COLS[number];

/*====================================================================================*/
export default function UserManagement() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loading, setLoading] = useState(true);

  /* ─── Pagination / Search ─── */
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  /* ─── Column visibility ─── */
  const [visibleCols, setVisibleCols] = useState<Set<ColName>>(new Set(ALL_COLS));
  const [showColMenu, setShowColMenu] = useState(false);

  /* ─── Add modal ─── */
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM);
  const [addSub, setAddSub] = useState(false);
  const [addErr, setAddErr] = useState("");
  const [showAddPw, setShowAddPw] = useState(false);

  /* ─── Edit modal ─── */
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [editSub, setEditSub] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [showEditPw, setShowEditPw] = useState(false);

  /* ─── Delete modal ─── */
  const [delId, setDelId] = useState<number | null>(null);
  const [delName, setDelName] = useState("");

  /*──── Fetch ────*/
  const fetchUsers = async () => { setLoading(true); try { const r = await fetch("/api/users"); const d = await r.json(); if (d.success) setUsers(d.users); } catch { } finally { setLoading(false); } };
  const fetchAff = async () => { try { const r = await fetch("/api/affiliations"); const d = await r.json(); if (d.success) setAffiliations(d.affiliations); } catch { } };
  useEffect(() => { fetchUsers(); fetchAff(); }, []);

  const affName = (id: number) => affiliations.find(a => a.id === id)?.affiliation_item ?? String(id);

  /*──── Derived ────*/
  const filtered = useMemo(() =>
    users.filter(u =>
      (u.firstname + " " + u.lastname + u.username).toLowerCase().includes(search.toLowerCase())
    ), [users, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  /*──── Add ────*/
  const handleAdd = async () => {
    setAddErr("");
    if (!addForm.username || !addForm.password || !addForm.firstname || !addForm.lastname) { setAddErr("กรุณากรอกข้อมูลให้ครบถ้วน"); return; }
    setAddSub(true);
    try {
      const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addForm) });
      const d = await res.json();
      if (d.success) { setShowAdd(false); setAddForm(EMPTY_FORM); fetchUsers(); } else setAddErr(d.message || "เกิดข้อผิดพลาด");
    } finally { setAddSub(false); }
  };

  /*──── Edit ────*/
  const openEdit = (u: UserRow) => { setEditUser(u); setEditForm({ username: u.username, password: "", email: u.email || "", firstname: u.firstname, lastname: u.lastname, Affiliation: u.Affiliation, role: u.role }); setEditErr(""); setShowEditPw(false); };
  const handleEdit = async () => {
    if (!editUser) return; setEditErr("");
    if (!editForm.username || !editForm.firstname || !editForm.lastname) { setEditErr("กรุณากรอกข้อมูลให้ครบถ้วน"); return; }
    setEditSub(true);
    try {
      const res = await fetch(`/api/users/${editUser.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
      const d = await res.json();
      if (d.success) { setEditUser(null); fetchUsers(); } else setEditErr(d.message || "เกิดข้อผิดพลาด");
    } finally { setEditSub(false); }
  };

  /*──── Delete ────*/
  const confirmDel = async () => { if (delId === null) return; try { const r = await fetch(`/api/users/${delId}`, { method: "DELETE" }); const d = await r.json(); if (d.success) { setDelId(null); fetchUsers(); } } catch { } };

  /*──── Export CSV ────*/
  const exportCSV = () => {
    const h = ["#", "อีเมล", "ชื่อ-สกุล", "Username", "Password", "ตำแหน่ง", "Status", "วันที่สร้าง"];
    const rows = users.map((u, i) => [i + 1, u.email || "-", `${u.firstname} ${u.lastname}`, u.username, u.password, affName(u.Affiliation), u.role.toUpperCase(), new Date(u.created_at).toLocaleDateString("th-TH")]);
    const csv = [h, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "users_export.csv"; a.click(); URL.revokeObjectURL(url);
  };

  /*──── Col toggle ────*/
  const toggleCol = (c: ColName) => setVisibleCols(prev => { const s = new Set(prev); s.has(c) ? s.delete(c) : s.add(c); return s; });

  /*──── Form helper ────*/
  const formFields = (form: FormState, setForm: (f: FormState) => void, showPw: boolean, togglePw: () => void, isEdit = false) => (
    <>
      <div className="um-form-grid ">
        <div className="um-form-row"><label>ชื่อ</label><input className="um-input" placeholder="ชื่อ" value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })} /></div>
        <div className="um-form-row"><label>นามสกุล</label><input className="um-input" placeholder="นามสกุล" value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })} /></div>
      </div>
      <div className="um-form-row"><label>อีเมล</label><input className="um-input" type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
      <div className="um-form-row"><label>Username</label><input className="um-input" placeholder="username" autoComplete="off" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
      <div className="um-form-row">
        <label>{isEdit ? "รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)" : "รหัสผ่าน"}</label>
        <div className="um-pass-wrap">
          <input className="um-input" type={showPw ? "text" : "password"} placeholder={isEdit ? "เว้นว่างถ้าไม่ต้องการเปลี่ยน" : "password"} autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="button" className="um-pass-eye" onClick={togglePw}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
        </div>
      </div>
      <div className="um-form-grid">
        <div className="um-form-row"><label>หน่วยงาน / ตำแหน่ง</label><select className="um-select" value={form.Affiliation} onChange={e => setForm({ ...form, Affiliation: Number(e.target.value) })}>{affiliations.map(a => <option key={a.id} value={a.id}>{a.affiliation_item}</option>)}</select></div>
        <div className="um-form-row"><label>บทบาท</label><select className="um-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="user">USER</option><option value="admin">ADMIN</option></select></div>
      </div>
    </>
  );

  /*====================================================================================*/
  return (
    <div className="body-button3">
      <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>ข้อมูลผู้ใช้งาน</h2></div>
      <div className="data4-tab1"></div>
      <div className="data4-tab2">ข้อมูลผู้ใช้งาน</div>

      {/* ── Main card ── */}
      <div className="um-car  fade-in">

        {/* ── Toolbar row 1 ── */}
        <div className="um-toolbar-top ">
          <div className="um-card-title">ข้อมูลผู้ใช้งาน</div>
          <div className="um-toolbar-top-right">
            <button className="um-btn-export" onClick={exportCSV}>
              Export <img src="/imj/back/direct-send.png" alt="" style={{ width: "1.8vh", height: "1.8vh", filter: "brightness(0) invert(1)" }} />
            </button>
            <div style={{ position: "relative" }}>
              <button className="um-btn-colvis" onClick={() => setShowColMenu(v => !v)}>
                <Columns size={14} /> Column visibility
              </button>
              {showColMenu && (
                <div className="um-colvis-menu" onClick={e => e.stopPropagation()}>
                  {ALL_COLS.map(c => (
                    <label key={c} className="um-colvis-item">
                      <input type="checkbox" checked={visibleCols.has(c)} onChange={() => toggleCol(c)} />
                      {c}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button className="um-add-btn" onClick={() => { setAddForm(EMPTY_FORM); setAddErr(""); setShowAdd(true); }}>
              <PlusCircle size={14} /> เพิ่มสมาชิก
            </button>
          </div>
        </div>

        {/* ── Toolbar row 2: search + entries ── */}
        <div className="um-toolbar-bottom">
          <div className="um-search-group">
            <span className="um-search-label">Search :</span>
            <input className="um-search" type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="um-entries-group">
            <span>Show</span>
            <select className="um-entries-select" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>Entries</span>
            <div className="um-pagination">
              <button className="um-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
              <span className="um-page-num">{page}</span>
              <button className="um-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="um-table-wrap">
          {loading ? (
            <div className="um-loading">กำลังโหลด...</div>
          ) : (
            <table className="um-table">
              <thead>
                <tr>
                  <th className="um-th-num"># <span className="um-sort-icon">↑↓</span></th>
                  {visibleCols.has("อีเมล") && <th>อีเมล</th>}
                  {visibleCols.has("ชื่อ-สกุล") && <th>ชื่อ-สกุล</th>}
                  {visibleCols.has("Username") && <th>Username</th>}
                  {visibleCols.has("Password") && <th>Password</th>}
                  {visibleCols.has("ตำแหน่ง") && <th>ตำแหน่ง</th>}
                  {visibleCols.has("Status") && <th className="um-th-status">Status</th>}
                  <th className="um-th-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="um-empty">ไม่พบข้อมูลผู้ใช้งาน</td></tr>
                )}
                {paginated.map((u, i) => (
                  <tr key={u.id} className="um-row">
                    <td className="um-td-num">{(page - 1) * pageSize + i + 1}</td>
                    {visibleCols.has("อีเมล") && <td>{u.email || "-"}</td>}
                    {visibleCols.has("ชื่อ-สกุล") && <td>{u.firstname}<br /><span className="um-sub">{u.lastname}</span></td>}
                    {visibleCols.has("Username") && <td>{u.username}</td>}
                    {visibleCols.has("Password") && <td>{u.password}</td>}
                    {visibleCols.has("ตำแหน่ง") && <td><span className="um-affil">{affName(u.Affiliation)}</span></td>}
                    {visibleCols.has("Status") && (
                      <td className="um-td-status">
                        <span className={`um-status-pill ${u.role === "admin" ? "um-status-admin" : "um-status-user"}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                    )}
                    <td className="um-td-action">
                      <button className="um-edit-btn" title="แก้ไข" onClick={() => openEdit(u)}><Pencil className="w-[2vh] h-[2vh] m-[0.7vh]" /></button>
                      <button className="um-del-btn" title="ลบ" onClick={() => { setDelId(u.id); setDelName(`${u.firstname} ${u.lastname}`); }}><Trash2 className="w-[2vh] h-[2vh] m-[0.7vh]" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* foot info */}
        <div className="um-table-foot">
          แสดง {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} จาก {filtered.length} รายการ
        </div>
      </div>

      {/* ======== Add Modal ======== */}
      {showAdd && (
        <div className="um-modal-bg" >
          <div className="um-modal  fade-in" onClick={e => e.stopPropagation()}>
            <div className="um-modal-header"><span>เพิ่มสมาชิกใหม่</span><button className="um-modal-close" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="um-modal-body">{addErr && <div className="um-error">{addErr}</div>}{formFields(addForm, setAddForm, showAddPw, () => setShowAddPw(v => !v))}</div>
            <div className="um-modal-footer"><button className="um-cancel-btn" onClick={() => setShowAdd(false)}>ยกเลิก</button><button className="um-save-btn" onClick={handleAdd} disabled={addSub}>{addSub ? "กำลังบันทึก..." : "บันทึก"}</button></div>
          </div>
        </div>
      )}

      {/* ======== Edit Modal ======== */}
      {editUser && (
        <div className="um-modal-bg" >
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <div className="um-modal-header"><span>แก้ไขข้อมูล — {editUser.firstname} {editUser.lastname}</span><button className="um-modal-close" onClick={() => setEditUser(null)}>✕</button></div>
            <div className="um-modal-body">{editErr && <div className="um-error">{editErr}</div>}{formFields(editForm, setEditForm, showEditPw, () => setShowEditPw(v => !v), true)}</div>
            <div className="um-modal-footer"><button className="um-cancel-btn" onClick={() => setEditUser(null)}>ยกเลิก</button><button className="um-save-btn um-save-edit-btn" onClick={handleEdit} disabled={editSub}>{editSub ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}</button></div>
          </div>
        </div>
      )}

      {/* ======== Delete Confirm Modal ======== */}
      {delId !== null && (
        <div className="um-modal-bg" >
          <div className="um-modal um-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="um-modal-header"><span>ยืนยันการลบ</span><button className="um-modal-close" onClick={() => setDelId(null)}>✕</button></div>
            <div className="um-modal-body"><p style={{ textAlign: "center", padding: "0.5rem 0" }}>ต้องการลบผู้ใช้ <strong>{delName}</strong> ออกจากระบบหรือไม่?</p></div>
            <div className="um-modal-footer"><button className="um-cancel-btn" onClick={() => setDelId(null)}>ยกเลิก</button><button className="um-del-confirm-btn" onClick={confirmDel}>ลบ</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
