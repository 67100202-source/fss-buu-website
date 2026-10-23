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
   รายการเมนูหลัก 7 รายการ ( ตาม docs/sitemap.md )
   --------------------------------------------------------------------- */
const MENU_ITEMS = [
  { label: "หน้าแรก", url: "index.html", key: "home" },
  { label: "ปฏิทินกิจกรรม", url: "index.html#activities", key: "calendar" },
  { label: "ข่าวสารและกีฬา", url: "news.html", key: "news" },
  { label: "หลักสูตรและอาจารย์", url: "curriculum.html", key: "curriculum" },
  { label: "ทุนการศึกษาและวิจัย", url: "scholarships.html", key: "scholarships" },
  { label: "ผลงานและคลังสื่อ", url: "achievements.html", key: "achievements" },
  { label: "ติดต่อและสมัครเรียน", url: "contact.html", key: "contact" },
];

/* ---------------------------------------------------------------------
   สร้าง HTML ของ Header
   --------------------------------------------------------------------- */
function buildHeaderHTML() {
  // ดูว่าหน้านี้คือหน้าไหน เพื่อทำไฮไลต์เมนูให้ถูกตัว
  // ( ใช้ <body data-page="schedule"> ในไฟล์ HTML แต่ละหน้า )
  const currentPage = document.body.getAttribute("data-page") || "home";

  // --- เมนูแนวนอนสำหรับจอใหญ่ ---
  const desktopLinks = MENU_ITEMS.map((m) => {
    const active = m.key === currentPage ? ' class="is-active"' : "";
    return `<a href="${m.url}"${active}>${m.label}</a>`;
  }).join("\n        ");

  // --- เมนูแนวตั้งสำหรับมือถือ ( ใน Drawer ) ---
  const mobileLinks = MENU_ITEMS.map((m) => {
    const active = m.key === currentPage ? " is-active" : "";
    let html = `<a class="nav-link${active}" href="${m.url}">${m.label}</a>`;
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
      <a class="logo" href="index.html" aria-label="กลับหน้าแรก">
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

        <button id="member-toggle" class="icon-btn" aria-expanded="false"
                aria-label="ระบบสมาชิกนิสิต" title="ระบบสมาชิกนิสิต">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </button>

        <button id="admin-toggle" class="icon-btn" aria-label="เข้าสู่ระบบผู้ดูแล (Admin)" title="Admin Login">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </button>

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
        <h3>ติดต่อคณะ</h3>
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
        <h3>ลิงก์ด่วน</h3>
        <p><a href="contact.html">สมัครเรียนต่อ</a></p>
        <p><a href="scholarships.html">ทุนการศึกษา</a></p>
      </div>

      <div class="footer-group">
        <h3>สำหรับเจ้าหน้าที่</h3>
        <p><a href="admin/login.html">เข้าสู่ระบบผู้ดูแล (Admin)</a></p>
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
});
