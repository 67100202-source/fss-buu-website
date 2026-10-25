/* =====================================================================
   ไฟล์: js/faculty.js
   ตรรกะของหน้าอาจารย์และเจ้าหน้าที่
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) โหลดทำเนียบอาจารย์จาก fetchFaculty() (data.js)
   2) โหลดบุคลากรสำนักงานคณบดีจาก fetchStaff() (data.js)
   3) ค้นหาอาจารย์ด้วยภาษาไทยได้จริง (ฟีเจอร์บังคับ)
   4) รองรับ 2 ภาษา (TH/EN)
   ===================================================================== */

let facultyCache = [];
let staffCache = [];

function __initFacultyWhenReady() {
  if (!document.getElementById("faculty-list")) return;
  initFacultyPage();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", __initFacultyWhenReady);
} else {
  __initFacultyWhenReady();
}

async function initFacultyPage() {
  const faculty = await fetchFaculty();
  facultyCache = faculty;
  renderFacultyList(faculty);

  // ระบบค้นหาอาจารย์ (ค้นสดทุกครั้งที่พิมพ์)
  const searchInput = document.getElementById("faculty-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = facultyCache.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        (f.expertise || "").toLowerCase().includes(q) ||
        (f.role || "").toLowerCase().includes(q) ||
        (f.name_en || "").toLowerCase().includes(q)
      );
      renderFacultyList(filtered);
    });
  }

  // re-render เมื่อเปลี่ยนภาษา
  window.addEventListener("languagechange", () => {
    renderFacultyList(facultyCache);
  });
}

function renderFacultyList(items) {
  const box = document.getElementById("faculty-list");
  if (!box) return;
  box.innerHTML = "";

  if (!items || items.length === 0) {
    box.innerHTML = '<p class="text-meta">ไม่พบอาจารย์ที่ค้นหา</p>';
    return;
  }

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  items.forEach((f) => {
    const name = (isEn && f.name_en) ? f.name_en : f.name;
    const expertise = (isEn && f.expertise_en) ? f.expertise_en : (f.expertise || "-");
    const card = document.createElement("div");
    card.className = "info-item";
    card.innerHTML = `
      <p class="text-item-title">${name}</p>
      <p class="text-meta"><strong>${isEn ? "Position:" : "ตำแหน่ง:"}</strong> ${f.position || "-"}</p>
      <p class="text-meta"><strong>${isEn ? "Role:" : "บทบาท:"}</strong> ${f.role || "-"}</p>
      <p class="text-meta"><strong>${isEn ? "Department:" : "สาขาวิชา:"}</strong> ${expertise}</p>
      <p class="text-meta">📞 ${f.phone || "-"} • ✉️ ${f.email || "-"}</p>
    `;
    box.appendChild(card);
  });
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
    card.className = "info-item";
    card.innerHTML = `
      <p class="text-item-title">${s.name || "-"}</p>
      <p class="text-meta"><strong>ตำแหน่ง:</strong> ${s.position || "-"}</p>
      <p class="text-meta">📞 ${s.phone || "-"} • ✉️ ${s.email || "-"}</p>
    `;
    box.appendChild(card);
  });
}
