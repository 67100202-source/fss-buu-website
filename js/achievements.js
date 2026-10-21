/* =====================================================================
   ไฟล์: js/achievements.js
   ตรรกะของหน้าผลงานนิสิตและศิษย์เก่า
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) โหลดรายการผลงานจาก fetchAchievements() (data.js)
     2) แสดงรางวัล ชื่อบุคคล บทบาท หมวดหมู่ และปีที่ได้รับ
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("achievement-list")) return;
  initAchievementsPage();
});

async function initAchievementsPage() {
  const achievements = await fetchAchievements();
  renderAchievements(achievements);
}

function renderAchievements(items) {
  const box = document.getElementById("achievement-list");
  const empty = document.getElementById("achievement-empty");
  if (!box) return;

  box.innerHTML = "";

  if (!items || items.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  items.forEach((a) => {
    const card = document.createElement("div");
    card.className = "achievement-card";

    card.innerHTML = `
      <p class="ach-title">${a.title}</p>
      <p class="ach-person">${a.person || "-"}</p>
      <p class="ach-role">${a.role || "-"}</p>
      <div class="ach-meta">
        <span class="ach-category">${a.category || "-"}</span>
        ${a.year ? `<span class="ach-meta">📅 ปี ${a.year}</span>` : ""}
      </div>
      ${a.source_url
        ? `<a href="${a.source_url}" target="_blank" rel="noopener" style="font-size:0.9rem;color:var(--color-green);text-decoration:underline;">ดูที่มา</a>`
        : ""
      }
    `;

    box.appendChild(card);
  });
}