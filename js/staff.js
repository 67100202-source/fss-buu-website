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
    // กรอบรูป: ใช้รูปจากฐานข้อมูล (image_url) ถ้ามี
    // ถ้าไม่มี ลองใช้รูปจากโฟลเดอร์ image/บุคลากร/<ชื่อ>.png
    // ถ้าโหลดไม่สำเร็จ จะ fallback เป็นตัวอักษรแรกของชื่อ
    const fallbackInitial = (s.name || "?").charAt(0);
    const photo = s.image_url
      ? `<img src="${encodeURI(s.image_url)}" alt="${s.name || ""}" loading="lazy" onerror="this.outerHTML='<span class=\\'faculty-photo-placeholder\\'>${fallbackInitial}</span>'" />`
      : `<img src="image/บุคลากร/${encodeURIComponent(s.name || "")}.png" alt="${s.name || ""}" loading="lazy" onerror="this.outerHTML='<span class=\\'faculty-photo-placeholder\\'>${fallbackInitial}</span>'" />`;
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
