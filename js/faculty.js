/* =====================================================================
   ไฟล์: js/faculty.js
   ตรรกะของหน้าอาจารย์ (แยกตามสาขาวิชาด้วยแท็บ)
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) โหลดทำเนียบอาจารย์จาก fetchFaculty() (data.js)
   2) แยกอาจารย์ตามสาขาวิชาที่สอนเป็น 3 แท็บ
      - อาจารย์ที่สอนหลายสาขา จะแสดงในทุกแท็บของสาขานั้น
   3) ค้นหาอาจารย์ด้วยภาษาไทยได้จริง (ฟีเจอร์บังคับ)
   4) รองรับ 2 ภาษา (TH/EN)
   ===================================================================== */

// สาขาวิชาทั้ง 3 (ลำดับแท็บ)
const FACULTY_DEPARTMENTS = [
  { key: "exercise", th: "สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา", en: "Exercise and Sport Science", match: "ออกกำลังกาย" },
  { key: "mgmt", th: "สาขาวิชาการจัดการและการสอนกีฬา", en: "Sport Management and Coaching", match: "การจัดการ" },
  { key: "comm", th: "สาขาวิชาสื่อสารมวลชนทางกีฬา", en: "Sport Communication", match: "สื่อสาร" },
];

let facultyCache = [];
let currentDeptKey = FACULTY_DEPARTMENTS[0].key;

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
  renderFacultyView(faculty);

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
      renderFacultyView(filtered);
    });
  }

  // re-render เมื่อเปลี่ยนภาษา
  window.addEventListener("languagechange", () => {
    renderFacultyView(facultyCache);
  });
}

/** คืนรายการ key ของสาขาที่อาจารย์คนนี้สอน (ช่อง expertise อาจคั่นด้วย "/") */
function getDepartmentKeys(expertise) {
  const keys = [];
  String(expertise || "")
    .split("/")
    .forEach((part) => {
      FACULTY_DEPARTMENTS.forEach((d) => {
        if (part.indexOf(d.match) !== -1 && keys.indexOf(d.key) === -1) keys.push(d.key);
      });
    });
  return keys;
}

/** วาดแท็บสาขาวิชา + รายการอาจารย์ของแท็บที่เลือก */
function renderFacultyView(items) {
  renderDeptTabs(items);
  renderFacultyList(items);
}

function renderDeptTabs(items) {
  const box = document.getElementById("dept-tabs");
  if (!box) return;
  box.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";

  FACULTY_DEPARTMENTS.forEach((d) => {
    const count = (items || []).filter((f) => getDepartmentKeys(f.expertise).indexOf(d.key) !== -1).length;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dept-tab" + (d.key === currentDeptKey ? " is-active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", d.key === currentDeptKey ? "true" : "false");
    btn.textContent = `${isEn ? d.en : d.th} (${count})`;
    btn.addEventListener("click", () => {
      currentDeptKey = d.key;
      renderFacultyView(items);
    });
    box.appendChild(btn);
  });
}

function renderFacultyList(items) {
  const box = document.getElementById("faculty-list");
  if (!box) return;
  box.innerHTML = "";

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  const list = (items || []).filter((f) => getDepartmentKeys(f.expertise).indexOf(currentDeptKey) !== -1);

  if (list.length === 0) {
    box.innerHTML = `<p class="text-meta">${isEn ? "No instructors found" : "ไม่พบอาจารย์ในสาขานี้"}</p>`;
    return;
  }

  list.forEach((f) => {
    const name = (isEn && f.name_en) ? f.name_en : f.name;
    const expertise = (isEn && f.expertise_en) ? f.expertise_en : (f.expertise || "-");
    const card = document.createElement("div");
    card.className = "info-item faculty-card";
    // กรอบรูป: ถ้ามีรูปจากฐานข้อมูลจะแสดงรูป ถ้าไม่มีแสดงตัวอักษรแรกของชื่อแทน
    const photo = f.image_url
      ? `<img src="${f.image_url}" alt="${name}" loading="lazy" />`
      : `<span class="faculty-photo-placeholder">${(name || "?").charAt(0)}</span>`;
    card.innerHTML = `
      <div class="faculty-photo">${photo}</div>
      <div class="faculty-info">
        <p class="text-item-title">${name}</p>
        <p class="text-meta"><strong>${isEn ? "Position:" : "ตำแหน่ง:"}</strong> ${f.position || "-"}</p>
        <p class="text-meta"><strong>${isEn ? "Role:" : "บทบาท:"}</strong> ${f.role || "-"}</p>
        <p class="text-meta"><strong>${isEn ? "Department:" : "สาขาวิชา:"}</strong> ${expertise}</p>
        <p class="text-meta">📞 ${f.phone || "-"} • ✉️ ${f.email || "-"}</p>
      </div>
    `;
    box.appendChild(card);
  });
}
