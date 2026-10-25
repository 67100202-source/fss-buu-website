/* =====================================================================
   ไฟล์: js/layout.js
   ส่วนหัวเว็บ (Header) และส่วนท้ายเว็บ (Footer) กลาง
   ---------------------------------------------------------------------
   ทำไมต้องมีไฟล์นี้?
   เว็บนี้มี 9 หน้า ถ้าเขียน Header/Footer ซ้ำในทุกไฟล์ HTML
   เวลาจะแก้เมนูหรือเปลี่ยนสี เราต้องไปแก้ทั้ง 9 ไฟล์ (เสี่ยงแก้ตก / แก้ไม่ครบ)
   วิธีนี้คือเขียนรวมที่เดียว แล้วทุกหน้าจะดึงไปใช้อัตโนมัติ
   ---------------------------------------------------------------------
   วิธีใช้ในไฟล์ HTML ทุกหน้า:
     1) ใส่ <div id="site-header"></div> ไว้ตรงที่ต้องการ Header
     2) ใส่ <div id="site-footer"></div> ไว้ตรงที่ต้องการ Footer
     3) ใส่ <script src="js/layout.js"></script> ก่อน js/app.js
   ===================================================================== */

/* ---------------------------------------------------------------------
   ช่วยเลือก path ให้ถูกตามว่าอยู่ในโฟลเดอร์ admin/ หรือไม่
   --------------------------------------------------------------------- */
function pathPrefix() {
  return window.location.pathname.indexOf("/admin/") !== -1 ? "../" : "";
}
function resolveUrl(url) {
  if (!url) return url;
  // ลิงก์ภายใน admin/ ( เช่น login.html ) อยู่โฟลเดอร์เดียวกัน
  if (url.indexOf("admin/") === 0) {
    return pathPrefix() + url.replace("admin/", "");
  }
  return pathPrefix() + url;
}

/* ---------------------------------------------------------------------
   รายการเมนูหลัก 7 รายการ ( ตาม docs/sitemap.md )
   --------------------------------------------------------------------- */
const MENU_ITEMS = [
  { label: "หน้าแรก", url: "index.html", key: "home", i18n: "menu.home" },
  { label: "ปฏิทินกิจกรรม", url: "calendar.html", key: "calendar", i18n: "menu.calendar" },
  { label: "ข่าวสารและกีฬา", url: "news.html", key: "news", i18n: "menu.news" },
  { label: "หลักสูตรที่เปิดสอน", url: "curriculum.html", key: "curriculum", i18n: "menu.curriculum" },
  { label: "อาจารย์และเจ้าหน้าที่", url: "faculty.html", key: "faculty", i18n: "menu.faculty",
    sub: [
      { label: "อาจารย์", url: "faculty.html", key: "faculty", i18n: "menu.teachers" },
      { label: "เจ้าหน้าที่", url: "staff.html", key: "staff", i18n: "menu.staff" },
    ],
  },
  { label: "ทุนการศึกษาและวิจัย", url: "scholarships.html", key: "scholarships", i18n: "menu.scholarships" },
  { label: "ผลงานและคลังสื่อ", url: "achievements.html", key: "achievements", i18n: "menu.achievements" },
  { label: "ติดต่อและสมัครเรียน", url: "contact.html", key: "contact", i18n: "menu.contact" },
];

/* ---------------------------------------------------------------------
   ระบบ 2 ภาษา ( i18n ) — พจนานุกรม UI
   --------------------------------------------------------------------- */
const I18N = {
  th: {
    "menu.home": "หน้าแรก",
    "menu.calendar": "ปฏิทินกิจกรรม",
    "menu.news": "ข่าวสารและกีฬา",
    "menu.curriculum": "หลักสูตรที่เปิดสอน",
    "menu.faculty": "อาจารย์และเจ้าหน้าที่",
    "menu.teachers": "อาจารย์",
    "menu.staff": "เจ้าหน้าที่",
    "menu.scholarships": "ทุนการศึกษาและวิจัย",
    "menu.achievements": "ผลงานและคลังสื่อ",
    "menu.contact": "ติดต่อและสมัครเรียน",
    "search.placeholder": "ค้นหาข่าว ทุน อาจารย์ หลักสูตร...",
    "footer.contact": "ติดต่อคณะ",
    "footer.quicklinks": "ลิงก์ด่วน",
    "footer.staff": "สำหรับเจ้าหน้าที่",
    "footer.apply": "สมัครเรียนต่อ",
    "footer.scholarship": "ทุนการศึกษา",
    "footer.faculty": "อาจารย์และเจ้าหน้าที่",
    "footer.admin": "เข้าสู่ระบบผู้ดูแล (Admin)",
    "sample.notice": "หน้านี้กำลังแสดงข้อมูลตัวอย่างเพื่อการพัฒนา — เมื่อเชื่อมฐานข้อมูล Supabase แล้วจะดึงข้อมูลจริงมาแสดงแทน",
    "common.loading": "กำลังโหลด...",
    "page.curriculum": "หลักสูตร",
    "page.faculty": "อาจารย์และเจ้าหน้าที่",
    "page.staff": "บุคลากรสำนักงานคณบดี",
    "page.contact": "ข้อมูลติดต่อคณะ",
    "page.map": "แผนที่คณะ",
    "page.contactform": "แบบฟอร์มติดต่อ / สมัครกิจกรรม",
    "page.news": "ข่าวสารล่าสุด",
  },
  en: {
    "menu.home": "Home",
    "menu.calendar": "Calendar & Events",
    "menu.news": "News & Sports",
    "menu.curriculum": "Programs",
    "menu.faculty": "Faculty & Staff",
    "menu.teachers": "Teachers",
    "menu.staff": "Staff",
    "menu.scholarships": "Scholarships & Research",
    "menu.achievements": "Achievements & Media",
    "menu.contact": "Contact & Admission",
    "search.placeholder": "Search news, scholarships, faculty, programs...",
    "footer.contact": "Contact Faculty",
    "footer.quicklinks": "Quick Links",
    "footer.staff": "For Staff",
    "footer.apply": "Apply for Admission",
    "footer.scholarship": "Scholarships",
    "footer.faculty": "Faculty & Staff",
    "footer.admin": "Admin Login",
    "sample.notice": "This page shows sample data for development — real data will be loaded once Supabase is connected.",
    "common.loading": "Loading...",
    "page.curriculum": "Curriculum",
    "page.faculty": "Faculty & Staff",
    "page.staff": "Faculty Staff",
    "page.contact": "Contact Information",
    "page.map": "Faculty Map",
    "page.contactform": "Contact / Activity Registration Form",
    "page.news": "Latest News",
  },
};

function getCurrentLang() {
  return localStorage.getItem("fss-lang") || "th";
}

function t(key) {
  const lang = getCurrentLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N.th[key] || key);
}

function applyLanguage(lang) {
  if (lang) localStorage.setItem("fss-lang", lang);
  const l = getCurrentLang();
  document.documentElement.lang = l === "en" ? "en" : "th";

  // แปลง element ที่มี data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) el.textContent = val;
  });
  // แปลง placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = t(key);
    if (val) el.setAttribute("placeholder", val);
  });

  // อัปเดตปุ่มสลับภาษา (ถ้ามี)
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.textContent = l === "th" ? "TH" : "EN";
    langBtn.setAttribute("aria-label", l === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย");
  }

  // แจ้งหน้าอื่นให้ re-render เนื้อหา (2 ภาษา) ทันที
  try {
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: l } }));
  } catch (e) {
    /* IE fallback not needed */
  }
}

// ให้เรียกจากไฟล์อื่นได้
window.applyLanguage = applyLanguage;
window.getCurrentLang = getCurrentLang;
window.t = t;

/* ---------------------------------------------------------------------
   สร้าง HTML ของ Header
   --------------------------------------------------------------------- */
function buildHeaderHTML() {
  // ดูว่าหน้านี้คือหน้าไหน เพื่อทำไฮไลต์เมนูให้ถูกตัว
  // ( ใช้ <body data-page="schedule"> ในไฟล์ HTML แต่ละหน้า )
  const currentPage = document.body.getAttribute("data-page") || "home";

  // --- เมนูแนวนอนสำหรับจอใหญ่ ---
  const desktopLinks = MENU_ITEMS.map((m) => {
    const hasActiveSub = m.sub && m.sub.some((s) => s.key === currentPage);
    const active = (m.key === currentPage || hasActiveSub) ? ' class="is-active"' : "";
    if (m.sub && m.sub.length) {
      const subLinks = m.sub
        .map((s) => {
          const subActive = s.key === currentPage ? ' class="is-active"' : "";
          return `<a href="${resolveUrl(s.url)}"${subActive} data-i18n="${s.i18n}">${s.label}</a>`;
        })
        .join("\n          ");
      return `
      <div class="nav-dropdown">
        <a href="${resolveUrl(m.url)}"${active} data-i18n="${m.i18n}">${m.label} ▾</a>
        <div class="nav-dropdown-menu">
          ${subLinks}
        </div>
      </div>`;
    }
    return `<a href="${resolveUrl(m.url)}"${active} data-i18n="${m.i18n}">${m.label}</a>`;
  }).join("\n        ");

  // --- เมนูแนวตั้งสำหรับมือถือ ( ใน Drawer ) ---
  const mobileLinks = MENU_ITEMS.map((m) => {
    const hasActiveSub = m.sub && m.sub.some((s) => s.key === currentPage);
  const active = (m.key === currentPage || hasActiveSub) ? " is-active" : "";
    let html = `<a class="nav-link${active}" href="${resolveUrl(m.url)}" data-i18n="${m.i18n}">${m.label}</a>`;
    // ถ้ามีเมนูย่อย ให้เพิ่มรายการย่อยต่อท้าย
    if (m.sub) {
      const subs = m.sub
        .map((s) => `<a href="${s.url}">${s.label}</a>`)
        .join("\n          ");
      html += `
        <div class="nav-submenu">
          ${subs}
        </div>`;
    }
    return `<li>${html}</li>`;
  }).join("\n      ");

  return `
  <header class="site-header">
    <div class="header-inner">

      <!-- โลโก้ BUU | FSS (รูปภาพฝั่งซ้าย คลิกกลับหน้าแรก) -->
      <a class="logo" href="${resolveUrl("index.html")}" aria-label="กลับหน้าแรก">
        <img class="logo-img" src="https://wssrecnfyljacgyejpfj.supabase.co/storage/v1/object/public/fss-media/media/1792702527883_Logo2.jpg" alt="โลโก้คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา" />
      </a>

      <!-- แถบเมนูแนวนอน ( แสดงเมื่อจอ >= 900px ) -->
      <nav class="desktop-nav" aria-label="เมนูหลัก">
        ${desktopLinks}
      </nav>

      <!-- ปุ่มกดด้านขวา (Utility Bar 44x44px ทุกปุ่ม) -->
      <div class="header-actions">
        <button id="search-toggle" class="icon-btn" aria-expanded="false"
                aria-controls="search-drawer" aria-label="ค้นหาข้อมูลในเว็บไซต์" title="ค้นหา">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        <button id="lang-toggle" class="lang-btn" aria-label="สลับภาษา TH / EN">TH | EN</button>

        <!-- ปุ่มเข้าสู่ระบบผู้ดูแล ( ลิงก์ไปหน้า login ; หน้าใน admin/ ใช้ path สั้น ) -->
        <a id="admin-toggle" class="icon-btn" href="${window.location.pathname.includes("/admin/") ? "login.html" : "admin/login.html"}"
           aria-label="เข้าสู่ระบบผู้ดูแล (Admin)" title="Admin Login">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </a>

        <button id="menu-toggle" class="icon-btn menu-toggle" aria-expanded="false"
                aria-controls="nav-drawer" aria-label="เปิดเมนูหลัก" title="เมนู">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- ช่องค้นหาภายในเว็บ -->
  <section id="search-drawer" class="search-drawer" hidden aria-label="ค้นหา">
    <div class="search-drawer-inner">
      <div class="search-box">
        <input id="search-input" class="search-input" type="search"
               placeholder="ค้นหาข่าว ทุน อาจารย์ หลักสูตร..."
               data-i18n-placeholder="search.placeholder"
aria-label="พิมพ์คำค้นหา" />
        <button id="search-clear" class="icon-btn" aria-label="ล้างคำค้น">✕</button>
        <button id="search-close" class="icon-btn" aria-label="ปิดการค้นหา">ปิด</button>
      </div>
      <div id="search-results" class="search-results" role="region" aria-live="polite"></div>
    </div>
  </section>

  <!-- ม่านดำโปร่งใสถ้าเปิดเมนู -->
  <div id="overlay" class="overlay" hidden></div>

  <!-- เมนู Drawer สำหรับมือถือ -->
  <nav id="nav-drawer" class="nav-drawer" hidden aria-label="เมนูหลัก">
    <div class="nav-drawer-header">
      <span class="text-item-title">เมนูหลัก</span>
      <button id="nav-close" class="icon-btn" aria-label="ปิดเมนู">✕</button>
    </div>
    <ul class="nav-list">
      ${mobileLinks}
    </ul>
  </nav>`;
}

/* ---------------------------------------------------------------------
   สร้าง HTML ของ Footer
   --------------------------------------------------------------------- */
function buildFooterHTML() {
  return `
  <footer class="site-footer">
    <div class="footer-inner">

      <div id="footer-contact" class="footer-group">
        <h3 data-i18n="footer.contact">ติดต่อคณะ</h3>
        <p class="faculty-name"></p>
        <p class="address"></p>
        <p class="phone"></p>
        <p class="email"></p>

        <!-- ปุ่มโซเชียลมีเดีย -->
        <div class="social-row">
          <a class="social-btn" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">f</a>
          <a class="social-btn" href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube">▶</a>
          <a class="social-btn" href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok">♪</a>
        </div>
      </div>

      <div class="footer-group">
        <h3 data-i18n="footer.quicklinks">ลิงก์ด่วน</h3>
        <p><a href="${resolveUrl("contact.html")}" data-i18n="footer.apply">สมัครเรียนต่อ</a></p>
        <p><a href="${resolveUrl("scholarships.html")}" data-i18n="footer.scholarship">ทุนการศึกษา</a></p>
        <p><a href="${resolveUrl("faculty.html")}" data-i18n="footer.faculty">อาจารย์และเจ้าหน้าที่</a></p>
      </div>

      <div class="footer-group">
        <h3 data-i18n="footer.staff">สำหรับเจ้าหน้าที่</h3>
        <p><a href="${resolveUrl("admin/login.html")}" data-i18n="footer.admin">เข้าสู่ระบบผู้ดูแล (Admin)</a></p>
      </div>

    </div>
  </footer>`;
}

/* ---------------------------------------------------------------------
   สร้างปุ่ม "เพิ่มลงใน Google Calendar" สำหรับกิจกรรม
   รูปแบบ URL ของ Google Calendar:
     https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...
   --------------------------------------------------------------------- */
function buildGoogleCalendarLink(act) {
  // แปลงวันที่เป็นรูปแบบ Google ต้องการ: 20261115T080000
  const start = act.date.replace(/-/g, "");
  // ถ้ามีเวลาเริ่มให้ใช้เวลานั้น ไม่มีใช้เวลา 08:00 เริ่มต้น
  const startTime = (act.time || "08:00").replace(":", "");
  const endDate = act.end_date || act.date;
  const endTime = (act.end_time || "17:00").replace(":", "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: act.title,
    dates: `${start}T${startTime}00/${endDate.replace(/-/g, "")}T${endTime}00`,
    details: act.detail || act.title,
    location: act.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ---------------------------------------------------------------------
   เมื่อหน้าเว็บโหลดเสร็จ ให้เติม Header และ Footer ลงในจุดที่กำหนด
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // เติมส่วนหัวเว็บ
  const headerBox = document.getElementById("site-header");
  if (headerBox) {
    headerBox.innerHTML = buildHeaderHTML();
  }

  // เติมส่วนท้ายเว็บ
  const footerBox = document.getElementById("site-footer");
  if (footerBox) {
    footerBox.innerHTML = buildFooterHTML();
  }

  // ---- เพิ่ม SVG icon ให้หัวข้อหมวดหมู่ทุกหัว (ตามกติกา UX/UI ส่วนที่ 1) ----
  document.querySelectorAll(".section-head").forEach((section) => {
    if (section.querySelector(".section-icon")) return;
    const icon = document.createElement("span");
    icon.className = "section-icon";
    icon.setAttribute("aria-hidden", "true");
    // ไอคอนสัญลักษณ์หมวดหมู่ (สามารถเปลี่ยนสีได้ผ่าน currentColor ใน CSS)
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
    </svg>`;
    section.insertBefore(icon, section.firstChild);
  });

  // ใช้ภาษาที่เลือกไว้ (2 ภาษา)
  if (typeof applyLanguage === "function") applyLanguage(getCurrentLang());
});
