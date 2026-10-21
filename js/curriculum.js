/* =====================================================================
   ไฟล์: js/curriculum.js
   ตรรกะของหน้าหลักสูตรและอาจารย์
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) โหลดรายการหลักสูตรจาก fetchCourses() (data.js)
     2) โหลดทำเนียบอาจารย์จาก fetchFaculty() (data.js)
     3) ค้นหาอาจารย์ด้วยภาษาไทยได้จริง (ฟีเจอร์บังคับ)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ทำงานเฉพาะหน้าที่มี #course-list เท่านั้น
  if (!document.getElementById("course-list")) return;
  initCurriculumPage();
});

async function initCurriculumPage() {
  // 1) โหลดหลักสูตร
  const courses = await fetchCourses();
  renderCourses(courses);

  // 2) โหลดอาจารย์
  const faculty = await fetchFaculty();
  renderFacultyList(faculty);

  // 3) ระบบค้นหาอาจารย์ (ค้นสดทุกครั้งที่พิมพ์)
  const searchInput = document.getElementById("faculty-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = faculty.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        (f.expertise || "").toLowerCase().includes(q) ||
        (f.role || "").toLowerCase().includes(q)
      );
      renderFacultyList(filtered);
    });
  }
}

/** แสดงรายการหลักสูตร */
function renderCourses(items) {
  const box = document.getElementById("course-list");
  if (!box) return;
  box.innerHTML = "";

  (items || []).forEach((c) => {
    const card = document.createElement("div");
    card.className = "info-item";
    card.innerHTML = `
      <p class="text-item-title">${c.name}</p>
      <p class="text-meta"><strong>ระดับ:</strong> ${c.level} • <strong>วุฒิการศึกษา:</strong> ${c.degree}</p>
      <p class="text-meta"><strong>ปีหลักสูตร:</strong> ${c.years || "-"}</p>
      <p class="text-meta"><strong>ประธานหลักสูตร:</strong> ${c.chairperson || "-"}</p>
      <p class="text-meta">${c.detail || ""}</p>
      ${
        c.source_url
          ? `<a href="${c.source_url}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:0.9rem;margin-top:0.5rem;">ดูรายละเอียดจากเว็บคณะ</a>`
          : ""
      }
    `;
    box.appendChild(card);
  });
}

/** แสดงทำเนียบอาจารย์ */
function renderFacultyList(items) {
  const box = document.getElementById("faculty-list");
  if (!box) return;
  box.innerHTML = "";

  if (!items || items.length === 0) {
    box.innerHTML = '<p class="text-meta">ไม่พบอาจารย์ที่ค้นหา</p>';
    return;
  }

  items.forEach((f) => {
    const card = document.createElement("div");
    card.className = "info-item";
    card.innerHTML = `
      <p class="text-item-title">${f.name}</p>
      <p class="text-meta"><strong>ตำแหน่ง:</strong> ${f.position || "-"}</p>
      <p class="text-meta"><strong>บทบาท:</strong> ${f.role || "-"}</p>
      <p class="text-meta"><strong>สาขาวิชา:</strong> ${f.expertise || "-"}</p>
      <p class="text-meta">📞 ${f.phone || "-"} • ✉️ ${f.email || "-"}</p>
    `;
    box.appendChild(card);
  });
}