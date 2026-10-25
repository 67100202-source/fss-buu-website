/* =====================================================================
   ไฟล์: js/staff.js
   ตรรกะของหน้าบุคลากรสำนักงานคณบดี
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("staff-list")) return;
  initStaffPage();
});

async function initStaffPage() {
  const staff = await fetchStaff();
  renderStaffList(staff);
}

function renderStaffList(items) {
  const box = document.getElementById("staff-list");
  if (!box) return;
  box.innerHTML = "";

  if (!items || items.length === 0) {
    box.innerHTML = '<p class="text-meta">ไม่พบบุคลากร</p>';
    return;
  }

  (items || []).forEach((s) => {
    const card = document.createElement("div");
    card.className = "info-item faculty-card";
    // กรอบรูป: มีรูปจากฐานข้อมูลก็แสดงรูป ไม่มีก็แสดงตัวอักษรแรกของชื่อแทน
    const photo = s.image_url
      ? `<img src="${s.image_url}" alt="${s.name || ""}" loading="lazy" />`
      : `<span class="faculty-photo-placeholder">${(s.name || "?").charAt(0)}</span>`;
    card.innerHTML = `
      <div class="faculty-photo">${photo}</div>
      <div class="faculty-info">
        <p class="text-item-title">${s.name || "-"}</p>
        <p class="text-meta"><strong>ตำแหน่ง:</strong> ${s.position || "-"}</p>
        <p class="text-meta">📞 ${s.phone || "-"} • ✉️ ${s.email || "-"}</p>
      </div>
    `;
    box.appendChild(card);
  });
}
