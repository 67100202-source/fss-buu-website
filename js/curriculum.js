/* =====================================================================
   ไฟล์: js/curriculum.js
   ตรรกะของหน้าหลักสูตรที่เปิดสอน (แยกตามระดับการศึกษาด้วยแท็บ)
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) โหลดรายการหลักสูตรจาก fetchCourses() (data.js)
   2) แยกหลักสูตรเป็นแท็บ: ปริญญาตรี / ปริญญาโท / ปริญญาเอก
   3) รองรับ 2 ภาษา (TH/EN)
   ===================================================================== */

// ระดับการศึกษา (ลำดับแท็บ)
const CURRICULUM_LEVELS = [
  { key: "bachelor", th: "ปริญญาตรี", en: "Bachelor's", match: "ตรี" },
  { key: "master", th: "ปริญญาโท", en: "Master's", match: "โท" },
  { key: "doctoral", th: "ปริญญาเอก", en: "Doctoral", match: "เอก" },
];

let curriculumCoursesCache = [];
let currentLevelKey = CURRICULUM_LEVELS[0].key;

document.addEventListener("DOMContentLoaded", () => {
  // ทำงานเฉพาะหน้าที่มี #course-list เท่านั้น
  if (!document.getElementById("course-list")) return;
  initCurriculumPage();
});

async function initCurriculumPage() {
  const courses = await fetchCourses();
  curriculumCoursesCache = courses;
  renderCoursesView(courses);

  // เมื่อเปลี่ยนภาษา ให้ re-render ทันที
  window.addEventListener("languagechange", () => {
    renderCoursesView(curriculumCoursesCache);
  });
}

/** คืน key ของระดับการศึกษาของหลักสูตร (จากชื่อระดับภาษาไทย) */
function getLevelKey(course) {
  const text = String(course.level || "");
  const found = CURRICULUM_LEVELS.find((l) => text.indexOf(l.match) !== -1);
  return found ? found.key : null;
}

/** วาดแท็บระดับการศึกษา + รายการหลักสูตรของแท็บที่เลือก */
function renderCoursesView(items) {
  renderLevelTabs(items);
  renderCourses(items);
}

function renderLevelTabs(items) {
  const box = document.getElementById("level-tabs");
  if (!box) return;
  box.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";

  CURRICULUM_LEVELS.forEach((l) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dept-tab" + (l.key === currentLevelKey ? " is-active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", l.key === currentLevelKey ? "true" : "false");
    btn.textContent = isEn ? l.en : l.th;
    btn.addEventListener("click", () => {
      currentLevelKey = l.key;
      renderCoursesView(items);
    });
    box.appendChild(btn);
  });
}

/** แสดงรายการหลักสูตรของระดับที่เลือก */
function renderCourses(items) {
  const box = document.getElementById("course-list");
  if (!box) return;
  box.innerHTML = "";

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  const list = (items || []).filter((c) => getLevelKey(c) === currentLevelKey);

  if (list.length === 0) {
    box.innerHTML = `<p class="text-meta">${isEn ? "No programs at this level" : "ยังไม่มีหลักสูตรในระดับนี้"}</p>`;
    return;
  }

  list.forEach((c) => {
    const name = (isEn && c.name_en) ? c.name_en : c.name;
    const level = (isEn && c.level_en) ? c.level_en : c.level;
    const degree = (isEn && c.degree_en) ? c.degree_en : c.degree;
    const detail = (isEn && c.detail_en) ? c.detail_en : (c.detail || "");
    const card = document.createElement("div");
    card.className = "info-item";
    card.innerHTML = `
      <p class="text-item-title">${name}</p>
      <p class="text-meta"><strong>${isEn ? "Level:" : "ระดับ:"}</strong> ${level} • <strong>${isEn ? "Degree:" : "วุฒิการศึกษา:"}</strong> ${degree}</p>
      <p class="text-meta"><strong>${isEn ? "Curriculum years:" : "ปีหลักสูตร:"}</strong> ${c.years || "-"}</p>
      <p class="text-meta"><strong>${isEn ? "Chairperson:" : "ประธานหลักสูตร:"}</strong> ${c.chairperson || "-"}</p>
      <p class="text-meta">${detail}</p>
      ${
        c.source_url
          ? `<a href="${c.source_url}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:0.9rem;margin-top:0.5rem;">${isEn ? "View details on faculty website" : "ดูรายละเอียดจากเว็บคณะ"}</a>`
          : ""
      }
    `;
    box.appendChild(card);
  });
}
