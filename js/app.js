/* =====================================================================
   ไฟล์: js/app.js
   ตรรกะของหน้าแรก (Home) — โหลดข้อมูลจาก data.js มาแสดงผล
   และจัดการปุ่มเมนู, ช่องค้นหา, ปุ่มเลือกชั้นปี, ปุ่มสลับภาษา
   ===================================================================== */

// รอให้หน้าเว็บโหลดเสร็จก่อนเริ่มทำงาน
document.addEventListener("DOMContentLoaded", () => {
  // ข้อมูลติดต่อใน footer — แสดงทุกหน้า
  renderContact();

  // เมนูและการค้นหา — ใช้ทุกหน้า
  initMenuDrawer();
  initSearch();
  initLangToggle();

  // ส่วนที่เฉพาะหน้าแรก
  loadHomepage();

  // เมื่อเปลี่ยนภาษา ให้ re-render เนื้อหาทันที
  window.addEventListener("languagechange", () => {
    renderContact();
    rerenderHomepage();
  });
});

/* ---------------------------------------------------------------------
   สร้าง element ย่อยที่ใช้ซ้ำ (Helper)
   --------------------------------------------------------------------- */
/** แปลงวันที่รูปแบบ YYYY-MM-DD เป็นข้อความไทย เช่น "15 ต.ค. 2569" */
function formatDateTH(isoDate) {
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543; // เปลี่ยนเป็น พ.ศ.
  return `${day} ${month} ${year}`;
}

/** คืน class สีแถบซ้ายตามหมวดข่าว */
function categoryClass(category) {
  const map = {
    "ข่าวกีฬาและการแข่งขัน": "news-card sports",
    "ข่าวสารและกิจกรรมคณะ": "news-card activity",
    "ความร่วมมือและงานวิจัย": "news-card research",
    "ประกาศด่วน": "news-card urgent",
    "ทุน": "news-card scholarship",
    "กิจกรรม": "news-card activity",
    "รับสมัคร": "news-card admission",
  };
  return map[category] || "news-card";
}

/* ---------------------------------------------------------------------
   1) เมนู Drawer (ปุ่ม Hamburger บนมือถือ)
   --------------------------------------------------------------------- */
function initMenuDrawer() {
  const menuToggle = document.getElementById("menu-toggle");
  const navDrawer = document.getElementById("nav-drawer");
  const navClose = document.getElementById("nav-close");
  const overlay = document.getElementById("overlay");

  if (!menuToggle || !navDrawer) return;

  function openMenu() {
    navDrawer.hidden = false;
    if (overlay) overlay.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // กันเลื่อนหน้าหลัง
  }
  function closeMenu() {
    navDrawer.hidden = true;
    if (overlay) overlay.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", openMenu);
  if (navClose) navClose.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  // ปิดด้วยปุ่ม Escape บนคีย์บอร์ด
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !navDrawer.hidden) closeMenu();
  });

  // เก็บฟังก์ชันไว้ใช้ตอนกดลิงก์ในเมนู
  window.__closeMenu = closeMenu;
}

/* ---------------------------------------------------------------------
   2) ช่องค้นหาภายในเว็บ ( ฟีเจอร์บังคับ 1 )
   ตอนนี้ค้นจากข้อมูลตัวอย่างในหน่วยความจำ
   เมื่อมีหลายหน้าแล้ว ควรส่งค่าไปค้นที่ server หรือ Supabase
   --------------------------------------------------------------------- */
function initSearch() {
  const toggle = document.getElementById("search-toggle");
  const drawer = document.getElementById("search-drawer");
  const input = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  const closeBtn = document.getElementById("search-close");

  if (!toggle || !drawer) return;

  function openSearch() {
    drawer.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    if (input) input.focus();
  }
  function closeSearch() {
    drawer.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    if (drawer.hidden) openSearch();
    else closeSearch();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);

  // กด ✕ เพื่อล้างคำค้น
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (input) {
        input.value = "";
        input.focus();
        renderSearchResults("");
      }
    });
  }

  // ค้นสดทุกครั้งที่พิมพ์ ( ใช้ข้อมูลตัวอย่าง )
  if (input) {
    input.addEventListener("input", (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }
}

/** แสดงผลการค้นหาจากคำค้น ( ค้นข่าว ทุน อาจารย์ และหลักสูตร ) */
async function renderSearchResults(query) {
  const box = document.getElementById("search-results");
  if (!box) return;
  box.innerHTML = "";

  // ถ้าไม่มีคำค้น ไม่ต้องแสดงอะไร
  if (!query) return;

  const q = query.toLowerCase();
  const results = [];

  // โหลดข้อมูลจริงจากฐานข้อมูล ( ถ้ายังไม่ได้ตั้งค่าจะใช้ข้อมูลตัวอย่างแทน )
  const [news, scholarships, faculty, courses] = await Promise.all([
    fetchNews(),
    fetchScholarships(),
    fetchFaculty(),
    fetchCourses(),
  ]);

  // ค้นในข่าว
  news.forEach((n) => {
    if (
      n.title.toLowerCase().includes(q) ||
      (n.excerpt || "").toLowerCase().includes(q)
    ) {
      results.push({
        type: "ข่าว",
        text: n.title,
        url: `news-detail.html?id=${n.id}`,
      });
    }
  });

  // ค้นในทุน
  scholarships.forEach((s) => {
    if (s.title.toLowerCase().includes(q)) {
      results.push({ type: "ทุน", text: s.title, url: "scholarships.html" });
    }
  });

  // ค้นในอาจารย์
  faculty.forEach((f) => {
    if (
      f.name.toLowerCase().includes(q) ||
      (f.expertise || "").toLowerCase().includes(q) ||
      (f.role || "").toLowerCase().includes(q)
    ) {
      results.push({
        type: "อาจารย์",
        text: `${f.name} — ${f.expertise}`,
        url: "curriculum.html#faculty",
      });
    }
  });

  // ค้นในหลักสูตร
  courses.forEach((c) => {
    if (
      c.name.toLowerCase().includes(q) ||
      (c.detail || "").toLowerCase().includes(q)
    ) {
      results.push({ type: "หลักสูตร", text: c.name, url: "curriculum.html" });
    }
  });

  // แสดงผล
  if (results.length === 0) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = `ไม่พบผลลัพธ์สำหรับ "${query}"`;
    box.appendChild(empty);
    return;
  }

  results.slice(0, 12).forEach((r) => {
    const item = document.createElement("a");
    item.className = "search-result-item";
    item.href = r.url || "#";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = r.type;
    const text = document.createElement("p");
    text.className = "text-item-title";
    text.textContent = r.text;
    item.appendChild(badge);
    item.appendChild(text);
    box.appendChild(item);
  });
}

/* ---------------------------------------------------------------------
   4) โหลดข้อมูลทั้งหมดของหน้าแรก
   --------------------------------------------------------------------- */
// แคชข้อมูลหน้าแรก เพื่อ re-render เมื่อเปลี่ยนภาษา
let homeDataCache = null;

async function loadHomepage() {
  // ทำงานเฉพาะหน้าแรกเท่านั้น ( หน้าอื่นมี logic ของตัวเอง )
  if (!document.getElementById("hero-track")) return;

  const data = {
    banners: await fetchBanners(),
    services: await fetchServices(),
    partners: await fetchPartners(),
    urgent: await fetchUrgent(),
    news: await fetchNews(),
    activities: await fetchActivities(),
    sports: await fetchSportsNews(),
    courses: await fetchCourses(),
    faculty: await fetchFaculty(),
    scholarships: await fetchScholarships(),
    achievements: await fetchAchievements(),
    media: await fetchMedia(),
  };
  homeDataCache = data;

  // Hero slider ( สไลด์ Banner ด้านบนสุด )
  initHeroSlider(data.banners);

  // ตารางไอคอนบริการ
  renderServices(data.services);

  // แถบพันธมิตร
  renderPartners(data.partners);

  // ประกาศด่วน
  renderUrgent(data.urgent);

  // ข่าวสารล่าสุด 3 รายการ
  renderNews(data.news.slice(0, 3));

  // กิจกรรมที่กำลังจะมาถึง
  renderActivities(data.activities);

  // ไฮไลต์ข่าวกีฬา ( ข่าวกีฬา 2 ข่าวล่าสุด )
  renderSportsHighlight(data.sports);

  // หลักสูตรและอาจารย์
  renderCourses(data.courses);
  renderFaculty(data.faculty);

  // ทุนล่าสุด
  renderScholarships(data.scholarships);

  // ผลงานและคลังสื่อ
  renderAchievements(data.achievements);
  renderMedia(data.media);
}

/** re-render เนื้อหาหน้าแรกเมื่อเปลี่ยนภาษา (ไม่ต้องโหลดใหม่) */
function rerenderHomepage() {
  if (!homeDataCache) return;
  const d = homeDataCache;
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";

  // Hero slider: อัปเดตข้อความในสไลด์ที่มีอยู่ (ไม่ต้อง re-init)
  const track = document.getElementById("hero-track");
  if (track && d.banners) {
    const slides = track.querySelectorAll(".hero-slide");
    slides.forEach((slide, i) => {
      const b = d.banners[i];
      if (!b) return;
      const tag = (isEn && b.tag_en) ? b.tag_en : b.tag;
      const title = (isEn && b.title_en) ? b.title_en : b.title;
      const subtitle = (isEn && b.subtitle_en) ? b.subtitle_en : b.subtitle;
      const cta = (isEn && b.cta_en) ? b.cta_en : b.cta;
      const tagEl = slide.querySelector(".hero-tag");
      const titleEl = slide.querySelector(".hero-title");
      const subEl = slide.querySelector(".hero-subtitle");
      const ctaEl = slide.querySelector(".hero-cta");
      if (tagEl) tagEl.textContent = tag;
      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.textContent = subtitle;
      if (ctaEl) ctaEl.textContent = cta;
    });
  }

  renderUrgent(d.urgent);
  renderNews(d.news.slice(0, 3));
  renderActivities(d.activities);
  renderSportsHighlight(d.sports);
  renderCourses(d.courses);
  renderFaculty(d.faculty);
  renderScholarships(d.scholarships);
  renderAchievements(d.achievements);
  renderMedia(d.media);
  renderServices(d.services);
  renderPartners(d.partners);
  renderQuickLinks(d.quicklinks || []);
}

/** แสดงประกาศด่วน */
function renderUrgent(items) {
  const box = document.getElementById("urgent-list");
  if (!box) return;
  box.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  (items || []).forEach((u) => {
    const banner = document.createElement("div");
    banner.className = "urgent-banner";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = isEn ? "Urgent" : "ประกาศด่วน";
    const text = document.createElement("p");
    text.className = "text-item-title";
    text.textContent = (isEn && u.title_en) ? u.title_en : u.title;
    banner.appendChild(badge);
    banner.appendChild(text);
    box.appendChild(banner);
  });
}

/** แสดงข่าวสาร ( การ์ด ) */
function renderNews(items) {
  const box = document.getElementById("news-list");
  if (!box) return;
  box.innerHTML = "";
  (items || []).forEach((n) => {
    const a = document.createElement("a");
    a.href = `news-detail.html?id=${n.id}`; // ไปหน้าอ่านข่าว
    a.className = categoryClass(n.category);

    const rowTop = document.createElement("div");
    rowTop.className = "row-top";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `[${n.category}]`;
    const date = document.createElement("span");
    date.className = "meta";
    date.textContent = formatDateTH(n.created_at);
    rowTop.appendChild(badge);
    rowTop.appendChild(date);

    // เลือกภาษา ( 2 ภาษา )
    const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
    const titleText = (isEn && n.title_en) ? n.title_en : n.title;
    const excerptText = (isEn && n.excerpt_en) ? n.excerpt_en : n.excerpt;

    const title = document.createElement("p");
    title.className = "text-item-title";
    title.textContent = titleText;

    // ย่อหน้าสั้น ๆ ( ถ้ามีข้อมูล )
    if (excerptText) {
      const excerpt = document.createElement("p");
      excerpt.className = "text-meta";
      excerpt.textContent = excerptText;
      a.appendChild(rowTop);
      a.appendChild(title);
      a.appendChild(excerpt);
    } else {
      a.appendChild(rowTop);
      a.appendChild(title);
    }

    box.appendChild(a);
  });
}

/** แสดงกิจกรรมที่กำลังจะมาถึง ( badge วันที่แบบ KMITL: เดือน/วัน/ปี ) */
function renderActivities(items) {
  const box = document.getElementById("activity-list");
  if (!box) return;
  box.innerHTML = "";

  const monthsTH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
                    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  (items || []).forEach((act) => {
    const d = new Date(act.date);
    const card = document.createElement("div");
    card.className = "event-card";

    // กล่องวันที่ด้านซ้าย ( เดือน / วัน / ปี )
    const dateBox = document.createElement("div");
    dateBox.className = "event-date";
    if (!isNaN(d)) {
      const month = document.createElement("span");
      month.className = "ev-month";
      month.textContent = monthsTH[d.getMonth()];
      const day = document.createElement("span");
      day.className = "ev-day";
      day.textContent = String(d.getDate()).padStart(2, "0");
      const year = document.createElement("span");
      year.className = "ev-year";
      year.textContent = d.getFullYear() + 543;
      dateBox.appendChild(month);
      dateBox.appendChild(day);
      dateBox.appendChild(year);
    }

    // ข้อมูลกิจกรรมด้านขวา
    const info = document.createElement("div");
    info.className = "event-info";
    const title = document.createElement("p");
    title.className = "ev-title";
    title.textContent = act.title;
    const place = document.createElement("p");
    place.className = "ev-place";
    place.textContent = act.location;
    info.appendChild(title);
    info.appendChild(place);

    card.appendChild(dateBox);
    card.appendChild(info);
    box.appendChild(card);
  });
}

/** แสดงหลักสูตร */
function renderCourses(items) {
  const box = document.getElementById("course-list");
  if (!box) return;
  box.innerHTML = "";
  (items || []).forEach((c) => {
    const item = document.createElement("div");
    item.className = "info-item";
    const name = document.createElement("p");
    name.className = "text-item-title";
    name.textContent = c.name;
    const detail = document.createElement("p");
    detail.className = "text-meta";
    detail.textContent = c.detail;
    item.appendChild(name);
    item.appendChild(detail);
    box.appendChild(item);
  });
}

/** แสดงอาจารย์ */
function renderFaculty(items) {
  const box = document.getElementById("faculty-list");
  if (!box) return;
  box.innerHTML = "";
  (items || []).slice(0, 5).forEach((f) => {
    const item = document.createElement("div");
    item.className = "info-item";
    const name = document.createElement("p");
    name.className = "text-item-title";
    name.textContent = f.name;
    const exp = document.createElement("p");
    exp.className = "text-meta";
    exp.textContent = f.expertise || "";
    item.appendChild(name);
    item.appendChild(exp);
    box.appendChild(item);
  });
}

/** แสดงประกาศทุน ( พร้อมวันปิดรับสมัคร ) */
function renderScholarships(items) {
  const box = document.getElementById("scholarship-list");
  if (!box) return;
  box.innerHTML = "";
  (items || []).forEach((s) => {
    const item = document.createElement("div");
    item.className = "info-item";
    const title = document.createElement("p");
    title.className = "text-item-title";
    title.textContent = s.title;
    const deadline = document.createElement("p");
    deadline.className = "badge";
    deadline.textContent = `ปิดรับสมัคร ${formatDateTH(s.deadline)}`;
    const detail = document.createElement("p");
    detail.className = "text-meta";
    detail.textContent = s.detail || "";
    item.appendChild(title);
    item.appendChild(deadline);
    item.appendChild(detail);
    box.appendChild(item);
  });
}

/** แสดงผลงานนิสิต/ศิษย์เก่า */
function renderAchievements(items) {
  const box = document.getElementById("achievement-list");
  if (!box) return;
  box.innerHTML = "";
  (items || []).forEach((a) => {
    const item = document.createElement("div");
    item.className = "info-item";
    const title = document.createElement("p");
    title.className = "text-item-title";
    title.textContent = a.title;
    const person = document.createElement("p");
    person.className = "text-meta";
    person.textContent = a.person;
    item.appendChild(title);
    item.appendChild(person);
    box.appendChild(item);
  });
}

/** แสดงไฮไลต์ข่าวกีฬา 2 ข่าวล่าสุด ( ในหน้าแรก ) */
function renderSportsHighlight(items) {
  const box = document.getElementById("sports-highlight-list");
  if (!box) return;
  box.innerHTML = "";

  // เรียงจากใหม่ไปเก่า แล้วเอา 2 ข่าวแรก
  const latest = (items || [])
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 2);

  latest.forEach((n) => {
    const a = document.createElement("a");
    a.className = "news-card sports";
    a.href = `sports-news-detail.html?id=${n.id}`;

    const rowTop = document.createElement("div");
    rowTop.className = "row-top";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `[${n.category}]`;
    const date = document.createElement("span");
    date.className = "meta";
    date.textContent = formatDateTH(n.created_at);
    rowTop.appendChild(badge);
    rowTop.appendChild(date);

    const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
    const titleText = (isEn && n.title_en) ? n.title_en : n.title;

    const title = document.createElement("p");
    title.className = "text-item-title";
    title.textContent = titleText;

    a.appendChild(rowTop);
    a.appendChild(title);
    box.appendChild(a);
  });
}

/** แสดงคลังภาพ/วิดีโอ */
function renderMedia(items) {
  const box = document.getElementById("media-list");
  if (!box) return;
  box.innerHTML = "";
  (items || []).forEach((m) => {
    const cell = document.createElement("div");
    cell.className = "gallery-item";
    cell.textContent = m.title;
    box.appendChild(cell);
  });
}

/** แสดงข้อมูลติดต่อใน footer */
async function renderContact() {
  const box = document.getElementById("footer-contact");
  if (!box) return;

  // ดึงข้อมูลติดต่อ ( จาก DB ถ้าเชื่อมแล้ว ไม่งั้นใช้ค่าใน data.js )
  const info = await fetchContactInfo();

  box.querySelector(".faculty-name").textContent = info.facultyName || info.faculty_name || "";
  box.querySelector(".address").textContent = info.address || "";
  box.querySelector(".phone").textContent = info.phone || "";
  box.querySelector(".email").textContent = info.email || "";

  // อัปเดตลิงก์โซเชียลมีเดีย ถ้ามีข้อมูล
  const socials = [
    { sel: 'a[aria-label="Facebook"]', url: info.facebook },
    { sel: 'a[aria-label="YouTube"]', url: info.youtube },
    { sel: 'a[aria-label="TikTok"]', url: info.tiktok },
  ];
  socials.forEach((s) => {
    const link = box.querySelector(s.sel);
    if (link && s.url) link.href = s.url;
  });
}

/* =====================================================================
   คอมโพเนนต์สไตล์ KMITL : Hero slider / ทางลัด / ไอคอนบริการ / พันธมิตร
   ===================================================================== */

/** คลังไอคอน SVG สำหรับทางลัดและบริการ ( ใช้สีปัจจุบันผ่าน currentColor ) */
const ICONS = {
  student:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5"/></svg>',
  apply:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 15h6"/></svg>',
  alumni:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
  staff:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  book:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  users:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  award:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>',
  calendar:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  image:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
  phone:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
};

/**
 * สร้าง Hero slider พร้อมระบบปัดสไลด์ ( swipe / drag )
 * ผู้ใช้ลากนิ้วหรือเมาส์ควรลากแนวนอนเพื่อเปลี่ยนสไลด์
 */
function initHeroSlider(banners) {
  const track = document.getElementById("hero-track");
  const dotsBox = document.getElementById("hero-dots");
  const hint = document.getElementById("hero-hint");
  if (!track || !banners || banners.length === 0) return;

  let current = 0;
  let timer = null;

  // --- สร้างสไลด์ ---
  track.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  banners.forEach((b) => {
    const tag = (isEn && b.tag_en) ? b.tag_en : b.tag;
    const title = (isEn && b.title_en) ? b.title_en : b.title;
    const subtitle = (isEn && b.subtitle_en) ? b.subtitle_en : b.subtitle;
    const cta = (isEn && b.cta_en) ? b.cta_en : b.cta;
    const slide = document.createElement("div");
    slide.className = `hero-slide theme-${b.theme || "green"}`;
    slide.innerHTML = `
      <span class="hero-tag">${tag}</span>
      <h2 class="hero-title">${title}</h2>
      <p class="hero-subtitle">${subtitle}</p>
      <a class="hero-cta" href="${b.url}">${cta}</a>
    `;
    track.appendChild(slide);
  });

  // --- สร้างจุดบอกสไลด์ ---
  dotsBox.innerHTML = "";
  banners.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `สไลด์ที่ ${i + 1}`);
    dot.addEventListener("click", () => {
      goTo(i);
      hideHint();
    });
    dotsBox.appendChild(dot);
  });

  const dots = Array.from(dotsBox.children);

  /** เลื่อนไปสไลด์ที่ index */
  function goTo(index) {
    current = (index + banners.length) % banners.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    restartAuto();
  }

  /** เริ่มเลื่อนอัตโนมัติทุก 6 วินาที */
  function restartAuto() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  /** ซ่อนคำใบ้ "ปัดเพื่อเลื่อนสไลด์" */
  function hideHint() {
    if (hint && !hint.classList.contains("is-hidden")) {
      hint.classList.add("is-hidden");
    }
  }

  // --- ระบบปัดสไลด์ ( รองรับทั้งนิ้วและเมาส์ ) ---
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let isDragging = false;
  let isPointerDown = false;
  let suppressClick = false;   // ใช้กันคลิกลิงก์หลังปัดจบ

  /** เริ่มกด / แตะ */
  function onPointerDown(e) {
    // ใช้ Pointer Events รองรับทั้งมือถือและคอมพิวเตอร์
    isPointerDown = true;
    isDragging = false;
    deltaX = 0;
    startX = e.clientX;
    startY = e.clientY;
    track.classList.add("is-dragging");
  }

  /** กำลังลาก — เลื่อนสไลด์ตามนิ้ว */
  function onPointerMove(e) {
    if (!isPointerDown) return;

    deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // ถ้ายังไม่ชัดเจนว่าจะเลื่อนแนวไหน ให้รอก่อน ( กันบังการเลื่อนหน้าแนวตั้ง )
    if (!isDragging) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      // ถ้าเลื่อนแนวตั้งมากกว่าแนวนอน แปลว่า user ต้องการเลื่อนหน้า ไม่ใช่เปลี่ยนสไลด์
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        track.classList.remove("is-dragging");
        isPointerDown = false;
        return;
      }
      isDragging = true;
    }

    // เลื่อนสไลด์ตามนิ้วจริง ( ไม่ wrap รอบแรก )
    const width = track.offsetWidth || 1;
    const percent = (-current * 100) + (deltaX / width) * 100;
    track.style.transform = `translateX(${percent}%)`;
  }

  /** ปล่อยนิ้ว — ตัดสินว่าจะเปลี่ยนสไลด์ไหม */
  function onPointerUp() {
    if (!isPointerDown) return;
    isPointerDown = false;
    track.classList.remove("is-dragging");

    if (isDragging) {
      const width = track.offsetWidth || 1;
      // ปัดเกิน 20% ของความกว้างสไลด์ ถือว่าต้องการเปลี่ยนสไลด์
      const threshold = width * 0.2;

      if (deltaX < -threshold) {
        goTo(current + 1);
        suppressClick = true;   // ปัดจริง → กันคลิกลิงก์ชั่วคราว
      } else if (deltaX > threshold) {
        goTo(current - 1);
        suppressClick = true;   // ปัดจริง → กันคลิกลิงก์ชั่วคราว
      } else {
        // ปัดไม่พอ ให้กลับสไลด์เดิม
        track.style.transform = `translateX(-${current * 100}%)`;
        restartAuto();
      }
      hideHint();
    }
    isDragging = false;
  }

  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerUp);
  track.addEventListener("pointerleave", onPointerUp);

  // ถ้าผู้ใช้ "ปัด" ( drag ) แล้วปล่อย ต้องไม่ให้ไปกดลิงก์โดยไม่ตั้งใจ
  track.addEventListener(
    "click",
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    },
    true
  );

  // --- คำใบ้จะหายไปเองใน 4 วินาที ---
  if (hint) {
    setTimeout(hideHint, 4000);
  }

  restartAuto();
}

/** แสดงการ์ดทางลัดตามกลุ่มผู้ใช้ */
function renderQuickLinks(items) {
  const box = document.getElementById("quicklinks-grid");
  if (!box) return;
  box.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  (items || []).forEach((q) => {
    const label = (isEn && q.label_en) ? q.label_en : q.label;
    const desc = (isEn && q.desc_en) ? q.desc_en : q.desc;
    const a = document.createElement("a");
    a.className = "quicklink-card";
    a.href = q.url;
    a.innerHTML = `
      <span class="ql-label">${label}</span>
      <span class="ql-desc">${desc}</span>
    `;
    box.appendChild(a);
  });
}

/** แสดงตารางไอคอนบริการ */
function renderServices(items) {
  const box = document.getElementById("services-grid");
  if (!box) return;
  box.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  (items || []).forEach((s) => {
    const label = (isEn && s.label_en) ? s.label_en : s.label;
    const a = document.createElement("a");
    a.className = "service-tile";
    a.href = s.url;
    a.innerHTML = `
      <span class="service-icon">${ICONS[s.icon] || ""}</span>
      <span class="svc-label">${label}</span>
    `;
    box.appendChild(a);
  });
}

/** แสดงแถบพันธมิตร */
function renderPartners(items) {
  const box = document.getElementById("partners-strip");
  if (!box) return;
  box.innerHTML = "";
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  (items || []).forEach((p) => {
    const el = document.createElement("span");
    el.className = "partner-item";
    el.textContent = (isEn && p.name_en) ? p.name_en : p.name;
    box.appendChild(el);
  });
}

/* ---------------------------------------------------------------------
   5) ปุ่มสลับภาษา ( ฟีเจอร์เสริม: 2 ภาษา )
   ปุ่มนี้จะต่อยอดเมื่อทำหน้าอื่น ๆ เพิ่ม ( เก็บค่าไว้ใน localStorage )
   --------------------------------------------------------------------- */
function initLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;

  // โหลดภาษาที่เลือกไว้ครั้งก่อน
  const saved = localStorage.getItem("fss-lang") || "th";
  updateLangLabel(btn, saved);

  btn.addEventListener("click", () => {
    const current = localStorage.getItem("fss-lang") || "th";
    const next = current === "th" ? "en" : "th";
    localStorage.setItem("fss-lang", next);
    // แปลเนื้อหา UI ทั้งหน้า ( header / footer / element ที่มี data-i18n )
    if (typeof applyLanguage === "function") applyLanguage(next);
  });
}

function updateLangLabel(btn, lang) {
  btn.textContent = lang === "th" ? "TH" : "EN";
  btn.setAttribute("aria-label", lang === "th" ? "เปลี่ยนเป็นภาษาอังกฤษ" : "Switch to Thai");
}
