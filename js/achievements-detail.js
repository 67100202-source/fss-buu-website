/* =====================================================================
   ไฟล์: js/achievements-detail.js
   หน้ารายละเอียดผลงานนิสิตและศิษย์เก่า
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("achievement-detail")) return;
  initAchievementDetailPage();
});

async function initAchievementDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  const box = document.getElementById("achievement-detail");
  if (!box) return;

  if (!id || isNaN(id)) {
    box.innerHTML = '<p class="text-meta">ไม่พบผลงานที่ต้องการ</p>';
    return;
  }

  const a = await fetchAchievementById(id);
  if (!a) {
    box.innerHTML = '<p class="text-meta">ไม่พบผลงานที่ต้องการ</p>';
    return;
  }

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  const title = (isEn && a.title_en) ? a.title_en : a.title;
  const person = (isEn && a.person_en) ? a.person_en : (a.person || "-");
  const role = (isEn && a.role_en) ? a.role_en : (a.role || "-");
  const category = (isEn && a.category_en) ? a.category_en : (a.category || "-");
  const detail = (isEn && a.detail_en) ? a.detail_en : (a.detail || "");

  document.title = `${title} - BUU | FSS`;

  const head = document.createElement("div");
  head.className = "article-head";

  const cat = document.createElement("span");
  cat.className = "article-cat";
  cat.textContent = category;

  const h1 = document.createElement("h1");
  h1.className = "article-title";
  h1.textContent = title;

  const meta = document.createElement("div");
  meta.className = "article-meta";
  const personSpan = document.createElement("span");
  personSpan.textContent = person;
  const roleSpan = document.createElement("span");
  roleSpan.textContent = role;
  const yearSpan = document.createElement("span");
  yearSpan.textContent = a.year ? `${isEn ? "Year" : "ปี"} ${a.year}` : "";
  meta.appendChild(personSpan);
  meta.appendChild(roleSpan);
  if (a.year) meta.appendChild(yearSpan);

  head.appendChild(cat);
  head.appendChild(h1);
  head.appendChild(meta);

  const hero = document.createElement("div");
  if (a.image_url) {
    hero.className = "article-hero has-img";
    const img = document.createElement("img");
    img.src = a.image_url;
    img.alt = title;
    img.style.cssText = "width:100%;height:auto;display:block;border-radius:10px;";
    hero.appendChild(img);
  } else {
    hero.className = `article-hero theme-${a.theme || "green"}`;
    hero.textContent = category;
  }

  const body = document.createElement("div");
  body.className = "article-body";
  if (detail) {
    const p = document.createElement("p");
    p.textContent = detail;
    body.appendChild(p);
  }

  const actions = document.createElement("div");
  actions.style.marginTop = "1rem";
  if (a.source_url) {
    const link = document.createElement("a");
    link.href = a.source_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "btn btn-outline";
    link.textContent = isEn ? "View source" : "ดูที่มา";
    actions.appendChild(link);
  }
  const back = document.createElement("a");
  back.href = "achievements.html";
  back.className = "btn btn-outline";
  back.style.marginLeft = "0.5rem";
  back.textContent = isEn ? "Back" : "กลับ";
  actions.appendChild(back);

  box.innerHTML = "";
  box.appendChild(head);
  box.appendChild(hero);
  box.appendChild(body);
  box.appendChild(actions);

  window.addEventListener("languagechange", () => initAchievementDetailPage());
}

window.addEventListener("languagechange", () => {
  // ป้องกันการเรียกซ้ำซ้อน แต่ให้ render ใหม่เมื่อเปลี่ยนภาษา
});
