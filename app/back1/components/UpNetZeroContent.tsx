"use client";

type CheckListType = {
  c1: boolean;
  c2: boolean;
  c3: boolean;
  c4: boolean;
  c5: boolean;
  c6: boolean;
};

type YearItem = {
  id: number;
  year: number;
};

interface UpNetZeroContentProps {
  faculty_name: string;
  years: YearItem[];
  yearTotals: Record<number, number>;
  selectedYearId: number | null;
  setSelectedYearId: (id: number) => void;
  settab_y: (v: boolean) => void;
  showtab_y: boolean;
  settab_e: (v: boolean) => void;
  setSelectedYear: (y: number) => void;
  setInputYear: (y: null) => void;
  deleteYear: (year: number) => void;
  showbutton4f: boolean;
  setbutton4f: (v: boolean) => void;

  showbutton4: boolean;
  checkedList: CheckListType;
  handleChange1: (key: keyof CheckListType) => void;
  setbutton5: (v: boolean) => void;
  showbutton5: boolean;

  showbutton55: boolean;
  showbutton555: boolean;
  setbutton555: (v: boolean) => void;
  showbuttonscope: boolean;
  setbuttonscope: (v: boolean) => void;
  toggleCheck: (key: keyof CheckListType) => void;

  showstart4_1: boolean;
  handleClick1: () => void;
  closing: boolean;
  items: any[];
  qty: Record<number, string>;
  setQty: (q: Record<number, string>) => void;
  deleteItem: (id: number) => void;

  showstart4_11: boolean;
  handleClick2: () => void;
  button_scope11: boolean;

  showstart4_111: boolean;
  handleClick3: () => void;
  button_scope111: boolean;

  showstart4_2: boolean;
  handleClick4: () => void;
  button_scope2: boolean;

  showstart4_3: boolean;
  handleClick5: () => void;
  button_scope3: boolean;

  showstart4_33: boolean;
  handleClick6: () => void;
  button_scope33: boolean;
}

export default function UpNetZeroContent({
  faculty_name,
  years,
  yearTotals,
  selectedYearId,
  setSelectedYearId,
  settab_y,
  showtab_y,
  settab_e,
  setSelectedYear,
  setInputYear,
  deleteYear,
  showbutton4f,
  setbutton4f,
  showbutton4,
  checkedList,
  handleChange1,
  setbutton5,
  showbutton5,
  showbutton55,
  showbutton555,
  setbutton555,
  showbuttonscope,
  setbuttonscope,
  toggleCheck,
  showstart4_1,
  handleClick1,
  closing,
  items,
  qty,
  setQty,
  deleteItem,
  showstart4_11,
  handleClick2,
  button_scope11,
  showstart4_111,
  handleClick3,
  button_scope111,
  showstart4_2,
  handleClick4,
  button_scope2,
  showstart4_3,
  handleClick5,
  button_scope3,
  showstart4_33,
  handleClick6,
  button_scope33,
}: UpNetZeroContentProps) {
  return (
    <div className="data-upnetzero1">
      {/* ===== showbutton4f: Year list ===== */}
      {showbutton4f && (
        <>
          <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>UP Net Zero</h2><p>|</p><h2>{faculty_name}</h2></div>
          <div className="data4-tab1"></div>
          <div className="data3-tab2">ชื่อหน่วยงาน : {faculty_name}</div>
          <div className="postdata4-p">
            <div className="postdata3-dis">
              <div className="postdata4-tab-1">รายงานการปล่อยและการดูดกลับก๊าซเรือนกระจก<div className="postdata3-tabbg-p"></div></div>
              <button className="data3-tab2-b1-y" onClick={() => settab_y(!showtab_y)}><img src="/imj/back/logoscan.png" />เพิ่มปี</button>
            </div>

            <div className="postdata3-dis-y">
              {[...years]
                .sort((a, b) => b.year - a.year)
                .map((item) => (
                  <div className="postdata3-dis-y-box fade-in" key={item.id}>
                    <div className="box-y">
                      <div className="d-box-y">
                        <img
                          src="/imj/back/edit_y.png"
                          onClick={() => {
                            setSelectedYear(item.year);
                            setInputYear(null);
                            settab_e(true);
                          }}
                        />
                        <img src="/imj/back/del_y.png" onClick={() => deleteYear(item.year)} />
                      </div>
                      <p>การปล่อยก๊าซเรือนกระจก</p>
                      <h1>ปี {item.year}</h1>
                      <div className="number-y">
                        {Number(yearTotals[item.year] ?? 0).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 4,
                        })}{" "}
                        tCO2e
                      </div>
                      <button onClick={() => { setSelectedYearId(item.id); setbutton4f(!showbutton4f); }}>
                        แก้ไขข้อมูล
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* ===== showbutton4: Select scope ===== */}
      {showbutton4 && (
        <>
          <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>UP Net Zero</h2><p>|</p><h2>{faculty_name}</h2><p>|</p><h2>เลือกขอบเขตกิจกรรม</h2></div>
          <div className="data4-tab1"></div>
          <div className="data3-tab2">เลือกขอบเขตกิจกรรม</div>
          <div className="postdata4">
            <div className="postdata3-dis"><div className="postdata4-tab-1">ขอบเขตกิจกรรม<div className="postdata3-tabbg"></div></div></div>
            <div className="postdata3-dis">
              <div className="postdata4-tab-2">เลือก
                {(["c1", "c2", "c3", "c4", "c5", "c6"] as (keyof CheckListType)[]).map((key) => (
                  <label key={key} className="custom-check2">
                    <input type="checkbox" className="postdata4-c" checked={checkedList[key]} onChange={() => handleChange1(key)} />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
              <div className="postdata4-tab-3">
                <div className="postdata3-dis"><div className="postdata4-tabbgh">.</div><p>ขอบเขต</p></div>
                <div className="postdata4-tab-3-1">ขอบเขตที่ 1 การเผาไหม้ที่อยู่กับที่ (Stationary Combustion)</div>
                <div className="postdata4-tab-3-11">ขอบเขตที่ 1 การเผาไหม้ที่มีการเคลื่อนที่ On Road (Mobile Combustion : On Road)</div>
                <div className="postdata4-tab-3-11">ขอบเขตที่ 1 การเผาไหม้ที่มีการเคลื่อนที่ Off Road (Mobile Combustion : Off Road)</div>
                <div className="postdata4-tab-3-2">ขอบเขตที่ 2 การใช้ไฟฟ้า (Electricity)</div>
                <div className="postdata4-tab-3-3">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services)</div>
                <div className="postdata4-tab-3-3">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services)</div>
              </div>
            </div>
            <div className="postdata4-tab-4"><button onClick={() => setbutton5(!showbutton5)}><div className="postdata3-dis"><p>ถัดไป</p><img src="/imj/back/ArrowRight.png" /></div></button></div>
          </div>
        </>
      )}

      {/* ===== showbutton5: Data entry per scope ===== */}
      {showbutton5 && (
        <>
          <div className="data4-texth"><h1>กรอกข้อมูล</h1><p>|</p><h2>UP Net Zero</h2><p>|</p><h2>{faculty_name}</h2><p>|</p><h2>เลือกขอบเขตกิจกรรม</h2></div>
          <div className="data4-tab1"></div>
          <div className="dis-j">
            <div className="data3-tab2">กรอกข้อมูลขอบเขตกิจกรรม</div>
            <div className="data3-tab3">
              <div role="button" onClick={() => setbutton555(!showbutton555)} className="data3-tab2-b2"><img src="/imj/back/edit.png" />กำหนดกิจกรรมอื่นๆ</div>
              <div role="button" onClick={() => setbuttonscope(!showbuttonscope)} className="data3-tab2-b3"><img src="/imj/back/add-circle.png" />เพิ่มกิจกรรม</div>
              <div role="button" onClick={() => setbutton555(!showbutton555)} className="data3-tab2-b4"><img src="/imj/back/computing.png" />คำนวณผลกิจกรรม</div>
            </div>
          </div>
          <div className="postdata3-dis-t">

            {/* scope 1 */}
            {checkedList.c1 && (
              <div className="postdata4-t fade-in">
                <div className="postdata3-dis">
                  <div className="postdata4-data3-tab2">ขอบเขตที่ 1: การเผาไหม้ที่อยู่กับที่ (Stationary Combustion) <div className="postdata-tabbg-y"></div></div>
                  <button className="data3-tab2-b1" onClick={() => toggleCheck("c1")}><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button>
                  <button className={`data3-tab2-b ${showstart4_1 ? "active" : ""}`} onClick={handleClick1}><img src="/imj/back/arrow-circle-down.png" /></button>
                </div>
                {!showbutton55 && (
                  <div className={`postdata4-tab3 ${closing ? "fade-out2" : "fade-in2"}`}>
                    <div className="postdata3-dis-tab3">
                      <div className="postdata4-data3-tab3">รายการ</div><div className="postdata4-data3-tab3-1">หน่วย</div>
                      <div className="postdata4-data3-tab3-2">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                      <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div>
                      <div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div>
                      <div className="postdata4-data3-tab3-5">ลบ</div>
                    </div>
                    {Array.isArray(items) && items
                      .filter((item) => Number(item.scope) === 1 && Number(item.year_id) === Number(selectedYearId))
                      .map((item) => (
                        <div className="postdata3-dis-tab3 fade-in2" key={item.id}>
                          <div className="postdata4-data3-tab3-i">{item.name_tiem}</div>
                          <div className="postdata4-data3-tab3-1-i">{item.unit ?? ""}</div>
                          <div className="postdata4-data3-tab3-2-i-y">{Number(item.AD ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                          <input className="postdata4-data3-tab3-3" type="number" placeholder="0" value={qty[item.id] ?? ""} onChange={(e) => setQty({ ...qty, [item.id]: e.target.value })} />
                          <div className="postdata4-data3-tab3-4">{(!qty[item.id] ? 0 : Number(qty[item.id]) * Number(item.AD ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                          <div className="postdata4-data3-tab3-5-i"><img src="/imj/back/X.png" style={{ cursor: "pointer" }} onClick={() => deleteItem(item.id)} /></div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* scope 2 */}
            {checkedList.c2 && (
              <div className="postdata4-t fade-in">
                <div className="postdata3-dis">
                  <div className="postdata4-data3-tab2">ขอบเขตที่ 1: การเผาไหม้ที่มีการเคลื่อนที่ On Road (Mobile Combustion : On Road) <div className="postdata-tabbg-y"></div></div>
                  <button className="data3-tab2-b1" onClick={() => toggleCheck("c2")}><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button>
                  <button className={`data3-tab2-b ${showstart4_11 ? "active" : ""}`} onClick={handleClick2}><img src="/imj/back/arrow-circle-down.png" /></button>
                </div>
                {button_scope11 && (
                  <div className="postdata4-tab3 fade-in2">
                    <div className="postdata3-dis-tab3">
                      <div className="postdata4-data3-tab3">รายการ</div><div className="postdata4-data3-tab3-1">หน่วย</div>
                      <div className="postdata4-data3-tab3-2">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                      <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div>
                      <div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div>
                      <div className="postdata4-data3-tab3-5">ลบ</div>
                    </div>
                    {Array.isArray(items) && items.filter((item) => Number(item.scope) === 2).map(item => (
                      <div className="postdata3-dis-tab3 fade-in2" key={item.id}>
                        <div className="postdata4-data3-tab3-i">{item.name_tiem}</div>
                        <div className="postdata4-data3-tab3-1-i">{item.unit}</div>
                        <div className="postdata4-data3-tab3-2-i-y">{Number(item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <input className="postdata4-data3-tab3-3" type="number" placeholder="0" value={qty[item.id] ?? ""} onChange={(e) => setQty({ ...qty, [item.id]: e.target.value })} />
                        <div className="postdata4-data3-tab3-4">{(qty[item.id] === "" || qty[item.id] == null ? 0 : Number(qty[item.id]) * item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <div className="postdata4-data3-tab3-5-i"><img src="/imj/back/X.png" style={{ cursor: "pointer" }} onClick={() => deleteItem(item.id)} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* scope 3 */}
            {checkedList.c3 && (
              <div className="postdata4-t fade-in">
                <div className="postdata3-dis">
                  <div className="postdata4-data3-tab2">ขอบเขตที่ 1 การเผาไหม้ที่มีการเคลื่อนที่ Off Road (Mobile Combustion : Off Road) <div className="postdata-tabbg-y"></div></div>
                  <button className="data3-tab2-b1" onClick={() => toggleCheck("c3")}><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button>
                  <button className={`data3-tab2-b ${showstart4_111 ? "active" : ""}`} onClick={handleClick3}><img src="/imj/back/arrow-circle-down.png" /></button>
                </div>
                {button_scope111 && (
                  <div className="postdata4-tab3 fade-in2">
                    <div className="postdata3-dis-tab3">
                      <div className="postdata4-data3-tab3">รายการ</div><div className="postdata4-data3-tab3-1">หน่วย</div>
                      <div className="postdata4-data3-tab3-2">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                      <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div>
                      <div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div>
                      <div className="postdata4-data3-tab3-5">ลบ</div>
                    </div>
                    {items.filter(item => item.scope === 3).map(item => (
                      <div className="postdata3-dis-tab3 fade-in2" key={item.id}>
                        <div className="postdata4-data3-tab3-i">{item.name_tiem}</div>
                        <div className="postdata4-data3-tab3-1-i">{item.unit}</div>
                        <div className="postdata4-data3-tab3-2-i-y">{Number(item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <input className="postdata4-data3-tab3-3" type="number" placeholder="0" value={qty[item.id] ?? ""} onChange={(e) => setQty({ ...qty, [item.id]: e.target.value })} />
                        <div className="postdata4-data3-tab3-4">{(qty[item.id] === "" || qty[item.id] == null ? 0 : Number(qty[item.id]) * item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <div className="postdata4-data3-tab3-5-i"><img src="/imj/back/X.png" style={{ cursor: "pointer" }} onClick={() => deleteItem(item.id)} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* scope 4 */}
            {checkedList.c4 && (
              <div className="postdata4-t fade-in">
                <div className="postdata3-dis">
                  <div className="postdata4-data3-tab2-pl">ขอบเขตที่ 2: การใช้ไฟฟ้า (Electricity) <div className="postdata-tabbg-pl"></div></div>
                  <button className="data3-tab2-b1" onClick={() => toggleCheck("c4")}><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button>
                  <button className={`data3-tab2-b ${showstart4_2 ? "active" : ""}`} onClick={handleClick4}><img src="/imj/back/arrow-circle-down.png" /></button>
                </div>
                {button_scope2 && (
                  <div className="postdata4-tab3 fade-in2">
                    <div className="postdata3-dis-tab3">
                      <div className="postdata4-data3-tab3-pl">รายการ</div><div className="postdata4-data3-tab3-1-pl">หน่วย</div>
                      <div className="postdata4-data3-tab3-2-pl">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                      <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div>
                      <div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div>
                      <div className="postdata4-data3-tab3-5">ลบ</div>
                    </div>
                    {items.filter(item => item.scope === 4).map(item => (
                      <div className="postdata3-dis-tab3 fade-in2" key={item.id}>
                        <div className="postdata4-data3-tab3-pl-i">{item.name_tiem}</div>
                        <div className="postdata4-data3-tab3-1-pl-i">{item.unit}</div>
                        <div className="postdata4-data3-tab3-2-pl-i">{Number(item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <input className="postdata4-data3-tab3-3" type="number" placeholder="0" value={qty[item.id] ?? ""} onChange={(e) => setQty({ ...qty, [item.id]: e.target.value })} />
                        <div className="postdata4-data3-tab3-4">{(qty[item.id] === "" || qty[item.id] == null ? 0 : Number(qty[item.id]) * item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <div className="postdata4-data3-tab3-5-i"><img src="/imj/back/X.png" style={{ cursor: "pointer" }} onClick={() => deleteItem(item.id)} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* scope 5 */}
            {checkedList.c5 && (
              <div className="postdata4-t fade-in">
                <div className="postdata3-dis">
                  <div className="postdata4-data3-tab2-b">ขอบเขตที่ 3 การซื้อวัตถุดิบและบริการ (Purchased Goods and Services) <div className="postdata-tabbg-b"></div></div>
                  <button className="data3-tab2-b1" onClick={() => toggleCheck("c5")}><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button>
                  <button className={`data3-tab2-b ${showstart4_3 ? "active" : ""}`} onClick={handleClick5}><img src="/imj/back/arrow-circle-down.png" /></button>
                </div>
                {button_scope3 && (
                  <div className="postdata4-tab3 fade-in2">
                    <div className="postdata3-dis-tab3">
                      <div className="postdata4-data3-tab3-b">รายการ</div><div className="postdata4-data3-tab3-1-b">หน่วย</div>
                      <div className="postdata4-data3-tab3-2-b">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                      <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div>
                      <div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div>
                      <div className="postdata4-data3-tab3-5">ลบ</div>
                    </div>
                    {items.filter(item => item.scope === 5).map(item => (
                      <div className="postdata3-dis-tab3 fade-in2" key={item.id}>
                        <div className="postdata4-data3-tab3-b-i">{item.name_tiem}</div>
                        <div className="postdata4-data3-tab3-1-b-i">{item.unit}</div>
                        <div className="postdata4-data3-tab3-2-b-i">{Number(item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <input className="postdata4-data3-tab3-3" type="number" placeholder="0" value={qty[item.id] ?? ""} onChange={(e) => setQty({ ...qty, [item.id]: e.target.value })} />
                        <div className="postdata4-data3-tab3-4">{(qty[item.id] === "" || qty[item.id] == null ? 0 : Number(qty[item.id]) * item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <div className="postdata4-data3-tab3-5-i"><img src="/imj/back/X.png" style={{ cursor: "pointer" }} onClick={() => deleteItem(item.id)} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* scope 6 */}
            {checkedList.c6 && (
              <div className="postdata4-t fade-in">
                <div className="postdata3-dis">
                  <div className="postdata4-data3-tab2-b">ขอบเขตที่ 3: สินค้าทุน (Capital Good) <div className="postdata-tabbg-b"></div></div>
                  <button className="data3-tab2-b1" onClick={() => toggleCheck("c6")}><img src="/imj/back/minus-cirlce.png" />ลบกิจกรรม</button>
                  <button className={`data3-tab2-b ${showstart4_33 ? "active" : ""}`} onClick={handleClick6}><img src="/imj/back/arrow-circle-down.png" /></button>
                </div>
                {button_scope33 && (
                  <div className="postdata4-tab3 fade-in2">
                    <div className="postdata3-dis-tab3">
                      <div className="postdata4-data3-tab3-b">รายการ</div><div className="postdata4-data3-tab3-1-b">หน่วย</div>
                      <div className="postdata4-data3-tab3-2-b">ปริมาณก๊าซเรือนกระจก(kgCO2e/หน่วย)</div>
                      <div className="postdata4-data3-tab3-3">ปริมาณ / ปี</div>
                      <div className="postdata4-data3-tab3-4">ปริมาณก๊าซเรือนกระจก(tCO2e/ต่อปี)</div>
                      <div className="postdata4-data3-tab3-5">ลบ</div>
                    </div>
                    {items.filter(item => item.scope === 6).map(item => (
                      <div className="postdata3-dis-tab3 fade-in2" key={item.id}>
                        <div className="postdata4-data3-tab3-b-i">{item.name_tiem}</div>
                        <div className="postdata4-data3-tab3-1-b-i">{item.unit}</div>
                        <div className="postdata4-data3-tab3-2-b-i">{Number(item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <input className="postdata4-data3-tab3-3" type="number" placeholder="0" value={qty[item.id] ?? ""} onChange={(e) => setQty({ ...qty, [item.id]: e.target.value })} />
                        <div className="postdata4-data3-tab3-4">{(qty[item.id] === "" || qty[item.id] == null ? 0 : Number(qty[item.id]) * item.AD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}</div>
                        <div className="postdata4-data3-tab3-5-i"><img src="/imj/back/X.png" style={{ cursor: "pointer" }} onClick={() => deleteItem(item.id)} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
