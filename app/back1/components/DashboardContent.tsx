"use client";

import { Bell } from "lucide-react";

export default function DashboardContent() {
  return (
    <div className="dashboard-content fade-up" style={{ height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <div className="dash-bell">

        </div>
      </div>
      <div className="dash-divider"></div>

      {/* Top 2 Cards */}
      <div className="dash-row dash-top-cards">
        <div className="dash-card dash-card-purple">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value">123 <span className="dash-unit">ครั้ง</span></div>
              <div className="dash-card-desc">จำนวนครั้งที่รายงาน</div>
            </div>
            <div className="dash-card-icon">
            </div>
          </div>
          <button className="dash-card-btn dash-btn-purple">
            ดูรายละเอียด <span>▶</span>
          </button>
        </div>

        <div className="dash-card dash-card-purple">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value">123 <span className="dash-unit">tCO<sub>2</sub>e</span></div>
              <div className="dash-card-desc">การปล่อยก๊าซเรือนกระจกสะสม</div>
            </div>
            <div className="dash-card-icon">

            </div>
          </div>
          <button className="dash-card-btn dash-btn-purple">
            จำนวน tCO<sub>2</sub>e <span>▶</span>
          </button>
        </div>
      </div>

      {/* Year Title */}
      <h2 className="dash-section-title">การปล่อยและดูดกลับก๊าซเรือนกระจก ปี 2568</h2>

      {/* List Box */}
      <div className="dash-list-box">
        <h3>คณะที่รายงาน</h3>
        <ul>
          <li>admin -</li>
          <li>กองอาคารสถานที่ มพ</li>
          <li>ดร.ปรัชญ์ ปิงเมืองเหล็ก</li>
          <li>น้องเหมียว คนสวย</li>
        </ul>
      </div>

      {/* Middle 2 Cards */}
      <div className="dash-row dash-mid-cards">
        <div className="dash-card dash-card-purple">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value">123</div>
              <div className="dash-card-desc">การปล่อยก๊าซเรือนกระจกทั้งหมด</div>
              <div className="dash-card-subdesc">TOTAL EMISSION</div>
            </div>
            <div className="dash-card-icon">

            </div>
          </div>
          <button className="dash-card-btn dash-btn-purple">
            0 tCO<sub>2</sub>e <span>▶</span>
          </button>
        </div>

        <div className="dash-card dash-card-purple">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value">123</div>
              <div className="dash-card-desc">GHG Removal</div>
              <div className="dash-card-subdesc">การดูดกลับก๊าซเรือนกระจกทั้งหมด</div>
            </div>
            <div className="dash-card-icon">

            </div>
          </div>
          <button className="dash-card-btn dash-btn-purple">
            0 tCO<sub>2</sub>e <span>▶</span>
          </button>
        </div>
      </div>

      {/* Bottom 3 Cards */}
      <div className="dash-row dash-bottom-cards">
        {/* Scope 1 */}
        <div className="dash-card dash-card-orange">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value color-orange">123,456</div>
              <div className="dash-card-desc color-orange">Scope 1</div>
            </div>
            <div className="dash-card-icon">

            </div>
          </div>
          <button className="dash-card-btn dash-btn-orange">
            การปล่อยก๊าซเรือนกระจกทางตรง <span>▶</span>
          </button>
        </div>

        {/* Scope 2 */}
        <div className="dash-card dash-card-pink">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value color-pink">123,456</div>
              <div className="dash-card-desc color-pink">Scope 2</div>
            </div>
            <div className="dash-card-icon">

            </div>
          </div>
          <button className="dash-card-btn dash-btn-pink">
            การปล่อยก๊าซเรือนกระจกทางอ้อม <span>▶</span>
          </button>
        </div>

        {/* Scope 3 */}
        <div className="dash-card dash-card-blue">
          <div className="dash-card-body">
            <div className="dash-card-info">
              <div className="dash-card-value color-blue">123,456</div>
              <div className="dash-card-desc color-blue">Scope 3</div>
            </div>
            <div className="dash-card-icon">

            </div>
          </div>
          <button className="dash-card-btn dash-btn-blue">
            การปล่อยก๊าซเรือนกระจกทางอ้อม <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
