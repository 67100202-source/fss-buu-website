/* =====================================================================
   ไฟล์: js/achievements.js
   ตรรกะของหน้าผลงานนิสิตและศิษย์เก่า
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) โหลดรายการผลงานจาก fetchAchievements() (data.js)
     2) แสดงรางวัล ชื่อบุคคล บทบาท หมวดหมู่ และปีที่ได้รับ
   ===================================================================== */

let achievementsCache = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("achievement-list")) return;
  initAchievementsPage();
});

async function initAchievementsPage() {
  const achievements = await fetchAchievements();
  achievementsCache = achievements;
  renderAchievements(achievements);

  window.addEventListener("languagechange", () => {
    if (achievementsCache) renderAchievements(achievementsCache);
  });
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

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  items.forEach((a) => {
    const card = document.createElement("div");
    card.className = "achievement-card";

    const title = (isEn && a.title_en) ? a.title_en : a.title;
    const person = (isEn && a.person_en) ? a.person_en : (a.person || "-");
    const role = (isEn && a.role_en) ? a.role_en : (a.role || "-");
    const category = (isEn && a.category_en) ? a.category_en : (a.category || "-");

    card.innerHTML = `
      <p class="ach-title">${title}</p>
      <p class="ach-person">${person}</p>
      <p class="ach-role">${role}</p>
      <div class="ach-meta">
        <span class="ach-category">${category}</span>
        ${a.year ? `<span class="ach-meta">📅 ${isEn ? "Year" : "ปี"} ${a.year}</span>` : ""}
      </div>
      ${a.source_url
        ? `<a href="${a.source_url}" target="_blank" rel="noopener" style="font-size:0.9rem;color:var(--color-green);text-decoration:underline;">${isEn ? "Source" : "ดูที่มา"}</a>`
        : ""
      }
    `;

    box.appendChild(card);
  });
}