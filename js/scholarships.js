/* =====================================================================
   ไฟล์: js/scholarships.js
   ตรรกะของหน้าทุนการศึกษาและทุนวิจัย
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) โหลดรายการทุนจาก fetchScholarships() (data.js)
     2) คำนวณสถานะว่าเปิดรับหรือปิดรับแล้ว (เปรียบเทียบวันปิดรับกับวันนี้)
     3) แสดงรายการทุนพร้อมไฟล์เอกสารแนบ
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("scholarship-list")) return;
  initScholarshipsPage();
});

async function initScholarshipsPage() {
  const scholarships = await fetchScholarships();
  renderScholarships(scholarships);
}

function renderScholarships(items) {
  const box = document.getElementById("scholarship-list");
  const empty = document.getElementById("scholarship-empty");
  if (!box) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  box.innerHTML = "";

  if (!items || items.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  items.forEach((s) => {
    const card = document.createElement("div");
    card.className = "scholarship-card";

    const deadlineDate = s.deadline ? new Date(s.deadline) : null;
    const isOpen = deadlineDate ? deadlineDate >= today : false;

    const statusBadge = isOpen
      ? '<span class="badge-open">เปิดรับสมัคร</span>'
      : '<span class="badge-closed">ปิดรับสมัครแล้ว</span>';

    const deadlineText = s.deadline
      ? formatDateTH(s.deadline)
      : "-";

    const fileHtml = s.file_name
      ? `<p class="sch-file">📎 เอกสารแนบ: ${s.file_name}</p>`
      : "";

    card.innerHTML = `
      <p class="sch-title">${s.title}</p>
      <p class="sch-type">${s.type || "-"}</p>
      ${statusBadge}
      <p class="sch-meta">📅 ปิดรับสมัคร ${deadlineText}</p>
      <p class="sch-detail">${s.detail || "-"}</p>
      ${fileHtml}
      <p class="sch-deadline ${isOpen ? "" : "expired"}">
        ${isOpen ? "ยังเปิดรับสมัครอยู่ค่ะ" : "ปิดรับสมัครแล้วค่ะ"}
      </p>
    `;

    box.appendChild(card);
  });
}

/** แปลงวันที่ ISO เป็นรูปแบบภาษาไทย เช่น "31 ต.ค. 2569" */
function formatDateTH(isoDate) {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}