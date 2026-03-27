"use client"
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from "recharts";
import Image from "next/image";

export default function DashboardCharts() {
  // รัศมีสำหรับจุดของกราฟ (ปรับให้คำนวณแบบปลอดภัยเมื่อโหลดฝั่ง Client)
  const radius = typeof window !== "undefined" ? window.innerHeight * 0.004 : 4;

  const data1 = [
    { year: "2025", ขอบเขตที่1: 30, ขอบเขตที่2: 25, ขอบเขตที่3: 15, รวมทั้งหมด: 70 },
    { year: "2024", ขอบเขตที่1: 25, ขอบเขตที่2: 20, ขอบเขตที่3: 15, รวมทั้งหมด: 60 },
    { year: "2023", ขอบเขตที่1: 20, ขอบเขตที่2: 15, ขอบเขตที่3: 15, รวมทั้งหมด: 50 },
  ];

  const data2 = [
    { year: "2025", tCO2e: 12456, รวมทั้งหมด: 12456 },
    { year: "2024", tCO2e: 22456, รวมทั้งหมด: 22456 },
    { year: "2023", tCO2e: 32456, รวมทั้งหมด: 32456 },
  ];

  const pieData = [
    { name: "ขอบเขตที่1", value: 60, color: "#FEA500" },
    { name: "ขอบเขตที่2", value: 22, color: "#FF339A" },
    { name: "ขอบเขตที่3", value: 18, color: "#0066CB" },
  ];

  return (
    <>
      <div className="plot1">
        <div className="YS">
          <select className="YCC">
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
          <i className="fa-solid fa-chevron-down icon" ></i>
        </div>
        <div className="titplot1">
          <div className="T20">TOTAL<div className="T16">EMISSION</div><div className="TCA">.........................................</div></div>
          <div className="T20">12,456<div className="T16">tCO2e</div><div className="TCA">.............................................................................................</div></div>
        </div>
        <div className="item1">
          <div className="legend">
            <div className="item"><span className="dot orange"></span>60.00 %</div>
            <div className="item"><span className="dot pink"></span>22.00 %</div>
            <div className="item"><span className="dot blue"></span>18.00 %</div>
          </div>
        </div>
        <div className="plot11">
          <ResponsiveContainer width="70%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={180}
                endAngle={-180}
                paddingAngle={5}
                cornerRadius="50%"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="plot2">
        <div className="titplot1">
          <div className="T20">TOTAL Emission<div className="TCA">........................................................................................................................................................................................................................</div></div>
        </div>
        <div className="plot22">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data1}>
              <XAxis dataKey="year" tick={{ fill: "#545454", fontSize: "1.5vh", fontFamily: "Kanit", fontWeight: "bold" }} />
              <YAxis tick={{ fill: "#545454", fontSize: "1.5vh", fontFamily: "Kanit", fontWeight: "bold" }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const sorted = [...payload]
                      .filter((p) => p.dataKey !== "รวมทั้งหมด")
                      .sort((a, b) => {
                        const order = ["ขอบเขตที่1", "ขอบเขตที่2", "ขอบเขตที่3"];
                        return order.indexOf(a.dataKey as string) - order.indexOf(b.dataKey as string);
                      });
                    return (
                      <div className="plontbar1">
                        <div style={{ fontWeight: "bold", fontSize: "1.4vh", padding: 1 }}>{label}</div>
                        <div className="TC1">..................................................................................</div>
                        {sorted.map((item, i) => (
                          <div key={i} style={{ fontWeight: "bold", fontSize: 14, color: item.fill }}>
                            {item.name}: {item.value}
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="ขอบเขตที่3" stackId="a" fill="#FF339A" />
              <Bar dataKey="ขอบเขตที่2" stackId="a" fill="#0066CB" />
              <Bar dataKey="ขอบเขตที่1" stackId="a" fill="#FEA500" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="รวมทั้งหมด" stroke="#545454" strokeWidth={"0.4vh"} dot={{ r: radius }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="plot3">
        <div className="titplot1">
          <div className="T20">TOTAL<div className="T16">GHG Removal</div><div className="TCA">.........................................</div></div>
          <div className="T20">12,456<div className="T16">tCO2e</div><div className="TCA">.............................................................................................</div></div>
        </div>
        <div className="plot33">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data2}>
              <XAxis dataKey="year" tick={{ fill: "#545454", fontSize: "1.4vh", fontFamily: "Kanit", fontWeight: "bold" }} />
              <YAxis tick={{ fill: "#545454", fontSize: "1.4vh", fontFamily: "Kanit", fontWeight: "bold" }} domain={[0, 50000]} ticks={[0, 10000, 30000, 50000]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload.find((p) => p.dataKey === "tCO2e");
                    return (
                      <div className="plontbar1">
                        <div style={{ fontWeight: "bold", fontSize: "2vh" }}>{label}</div>
                        {item && (
                          <div style={{ fontWeight: "bold", color: "#59E717" }}>
                            <div className="TC1">..................................................................................</div>
                            <div className="TC2">{item.value}</div>
                            <div className="TC3">tCO2e</div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="tCO2e" fill="#59E717" radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="รวมทั้งหมด" stroke="#545454" strokeWidth={"0.4vh"} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="plot4">
        <div className="titplot1">
          <Image src="/imj/TE.png" alt="TE" width={200} height={100} />
        </div>
      </div>
      <Image src="/imj/2.png" alt="Icon 2" width={50} height={50} className="camera-logo2" />
      <div className="plot5">
        <div className="titplot1">
          <div className="T20_S">การปล่อยก๊าซ<br />เรือนกระจกทางตรง
            <div className="T20_S1">Scope 1</div>
            <div className="S2"><div className="T20_S2">12,456</div><div className="T20_S22">tCO2e</div></div>
          </div>
        </div>
      </div>
      <Image src="/imj/3.png" alt="Icon 3" width={50} height={50} className="camera-logo3" />
      <div className="plot6">
        <div className="titplot1">
          <div className="T20_S">การปล่อยก๊าซ<br />เรือนกระจกทางอ้อม
            <div className="T20_S1">Scope 2</div>
            <div className="S2"><div className="T20_S2">12,456</div><div className="T20_S22">tCO2e</div></div>
          </div>
        </div>
      </div>
      <Image src="/imj/6.png" alt="Icon 6" width={50} height={50} className="camera-logo4" />
      <div className="plot7">
        <div className="titplot1">
          <div className="T20_S">การปล่อยก๊าซ<br />เรือนกระจกทางอ้อม
            <div className="T20_S1">Scope 3</div>
            <div className="S2"><div className="T20_S2">12,456</div><div className="T20_S22">tCO2e</div></div>
          </div>
        </div>
      </div>
    </>
  );
}