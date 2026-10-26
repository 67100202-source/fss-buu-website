/* =====================================================================
   ไฟล์: js/news.js
   ตรรกะของหน้าข่าวสารและกิจกรรม
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) news.html       — รายการข่าว + กรองหมวดหมู่ + แบ่งหน้า
     2) news-detail.html — อ่านข่าวรายฉบับ + ปุ่มแชร์โซเชียลมีเดีย
     3) sports-news.html — ข่าวกีฬา + ผลการแข่งขัน + ตารางแข่งขัน + นักกีฬาคณะ
   ===================================================================== */

// จำนวนข่าวต่อหน้า
const NEWS_PER_PAGE = 6;

// ตัวแปรสถานะของหน้ารายการข่าว
let newsCategory = "ทั้งหมด";
let newsPage = 1;
let newsDataCache = [];
let sportsDataCache = [];

/* ---------------------------------------------------------------------
   คลังไอคอนสำหรับปุ่มแชร์
   --------------------------------------------------------------------- */
const SHARE_ICONS = {
  facebook:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  line:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6.4 8.2-1.9 8.9c-.15.65-.5.8-1.05.5l-2.9-2.15-1.4 1.35c-.15.15-.3.3-.6.3l.2-3 5.6-5.05c.25-.2-.05-.3-.35-.1l-6.9 4.35-3-1c-.65-.2-.65-.65.15-.95l11.7-4.5c.55-.2 1 .15.85.8z"/></svg>',
  link:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
};

/* ---------------------------------------------------------------------
   เริ่มทำงานเมื่อหน้าเว็บโหลดเสร็จ
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // ตรวจว่าอยู่หน้าไหน แล้วเรียกฟังก์ชันที่ตรงกับหน้านั้น
  if (document.getElementById("news-list-page")) {
    initNewsListPage();
  }
  if (document.getElementById("news-detail")) {
    initNewsDetailPage();
  }
  if (document.getElementById("sports-news-list")) {
    initSportsPage();
  }
});

/* =====================================================================
   ส่วนที่ 1 : หน้ารายการข่าว ( news.html )
   ===================================================================== */
async function initNewsListPage() {
  newsDataCache = await fetchNews();

  // แสดงปุ่มกรองหมวดหมู่
  renderCategoryFilter();
  renderNewsList();

  // ผูกกับปุ่มกรอง
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      newsCategory = chip.dataset.category;
      newsPage = 1;   // เปลี่ยนหมวดหมู่แล้วกลับไปหน้าแรก
      renderNewsList();
    });
  });

  // เมื่อเปลี่ยนภาษา ให้ re-render รายการข่าวทันที
  window.addEventListener("languagechange", () => {
    renderNewsList();
  });
}

/** แสดงปุ่มกรองหมวดหมู่ทั้งหมดที่มีในข้อมูล */
function renderCategoryFilter() {
  const box = document.getElementById("news-filter");
  if (!box) return;
  box.innerHTML = "";

  // หมวดหมู่ที่ต้องการให้มีปุ่มกรอง ( เรียงตามลำดับที่ออกแบบไว้ )
  const allCategories = [
    "ทั้งหมด",
    "ข่าวสารกิจกรรมคณะ",
    "ข่าวกีฬาและการแข่งขัน",
    "ข่าวประชาสัมพันธ์",
  ];

  allCategories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-chip" + (cat === newsCategory ? " is-active" : "");
    btn.dataset.category = cat;
    btn.textContent = cat;
    box.appendChild(btn);
  });
}

/** แสดงรายการข่าว + เลขหน้า */
function renderNewsList() {
  const box = document.getElementById("news-list-page");
  if (!box) return;
  box.innerHTML = "";

  // กรองตามหมวดหมู่
  let items = newsDataCache;
  if (newsCategory !== "ทั้งหมด") {
    items = items.filter((n) => n.category === newsCategory);
  }

  // เรียงจากใหม่ไปเก่า
  items = items.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));

  // แสดงจำนวนข่าวในหัวข้อ
  const countBox = document.getElementById("news-count");
  if (countBox) {
    countBox.textContent = `ทั้งหมด ${items.length} ข่าว`;
  }

  // ถ้าไม่มีข่าวในหมวดหมู่นั้น
  if (items.length === 0) {
    const p = document.createElement("p");
    p.className = "text-meta";
    p.textContent = "ยังไม่มีข่าวในหมวดหมู่นี้";
    box.appendChild(p);
    return;
  }

  // จำนวนหน้า
  const totalPages = Math.ceil(items.length / NEWS_PER_PAGE);
  if (newsPage > totalPages) newsPage = totalPages;

  // ข่าวในหน้านี้
  const start = (newsPage - 1) * NEWS_PER_PAGE;
  const pageItems = items.slice(start, start + NEWS_PER_PAGE);

  pageItems.forEach((n) => {
    box.appendChild(buildNewsCard(n, "news-detail.html"));
  });

  // แสดงเลขหน้า
  renderPagination(totalPages);
}

/**
 * สร้างการ์ดข่าว
 * @param {Object} n ข้อมูลข่าว
 * @param {string} detailUrl ลิงก์ไปหน้าอ่านข่าว
 */
function buildNewsCard(n, detailUrl) {
  const a = document.createElement("a");
  a.className = "news-item";
  a.href = `${detailUrl}?id=${n.id}`;

  // ภาพประกอบ ( ถ้ามีรูปจาก DB ให้แสดงรูป ไม่งั้นใช้กรอบสำหรับใส่รูป )
  const thumb = document.createElement("div");
  if (n.image_url) {
    thumb.className = `news-thumb theme-${n.theme || "green"}`;
    const img = document.createElement("img");
    img.src = n.image_url;
    img.alt = n.title;
    img.loading = "lazy";
    img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block;";
    thumb.appendChild(img);
  } else {
    thumb.className = "news-thumb-empty";
  }
  const thumbTag = document.createElement("span");
  thumbTag.className = "thumb-tag";
  thumbTag.textContent = n.category;
  thumb.appendChild(thumbTag);

  // เนื้อหา
  const body = document.createElement("div");
  body.className = "news-item-body";

  // แถวบน: หมวด + วันที่
  const top = document.createElement("div");
  top.className = "ni-top";
  const cat = document.createElement("span");
  cat.className = "ni-cat";
  cat.textContent = n.category;
  const date = document.createElement("span");
  date.className = "ni-date";
  date.textContent = formatDateTH(n.created_at);
  top.appendChild(cat);
  top.appendChild(date);

  // เลือกภาษา ( 2 ภาษา )
  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  const titleText = (isEn && n.title_en) ? n.title_en : n.title;
  const excerptText = (isEn && n.excerpt_en) ? n.excerpt_en : n.excerpt;

  // หัวข้อข่าว
  const title = document.createElement("p");
  title.className = "ni-title";
  title.textContent = titleText;

  // ย่อหน้า
  const excerpt = document.createElement("p");
  excerpt.className = "ni-excerpt";
  excerpt.textContent = excerptText;

  // แถวล่าง: ผู้เขียน + เวลาอ่าน
  const foot = document.createElement("div");
  foot.className = "ni-foot";
  const author = document.createElement("span");
  author.className = "ni-author";
  author.textContent = n.author || "งานประชาสัมพันธ์คณะ";
  const readtime = document.createElement("span");
  readtime.className = "ni-readtime";
  readtime.textContent = `อ่าน ${n.read_minutes || 2} นาที`;
  foot.appendChild(author);
  foot.appendChild(readtime);

  body.appendChild(top);
  body.appendChild(title);
  body.appendChild(excerpt);
  body.appendChild(foot);

  a.appendChild(thumb);
  a.appendChild(body);
  return a;
}

/** แสดงเลขหน้า */
function renderPagination(totalPages) {
  const box = document.getElementById("news-pagination");
  if (!box) return;
  box.innerHTML = "";

  // ถ้ามีหน้าเดียว ไม่ต้องแสดง
  if (totalPages <= 1) return;

  // ปุ่มก่อนหน้า
  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.textContent = "‹";
  prev.setAttribute("aria-label", "หน้าก่อนหน้า");
  prev.disabled = newsPage === 1;
  prev.addEventListener("click", () => {
    if (newsPage > 1) {
      newsPage--;
      renderNewsList();
      scrollToTop();
    }
  });
  box.appendChild(prev);

  // ปุ่มเลขหน้า
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === newsPage ? " is-active" : "");
    btn.textContent = String(i);
    btn.setAttribute("aria-label", `หน้าที่ ${i}`);
    if (i === newsPage) btn.setAttribute("aria-current", "page");
    btn.addEventListener("click", () => {
      newsPage = i;
      renderNewsList();
      scrollToTop();
    });
    box.appendChild(btn);
  }

  // ปุ่มถัดไป
  const next = document.createElement("button");
  next.className = "page-btn";
  next.textContent = "›";
  next.setAttribute("aria-label", "หน้าถัดไป");
  next.disabled = newsPage === totalPages;
  next.addEventListener("click", () => {
    if (newsPage < totalPages) {
      newsPage++;
      renderNewsList();
      scrollToTop();
    }
  });
  box.appendChild(next);
}

/** เลื่อนหน้าจอขึ้นบนเมื่อเปลี่ยนหน้า */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================================================================
   ส่วนที่ 2 : หน้าอ่านข่าว ( news-detail.html )
   ===================================================================== */
async function initNewsDetailPage() {
  // ดึง id จาก URL เช่น news-detail.html?id=3
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const box = document.getElementById("news-detail");
  if (!box) return;

  // ถ้าไม่พบข่าว
  if (!id || isNaN(id)) {
    showNotFound(box);
    return;
  }

  // ดึงข้อมูลข่าว ( ลองหาข่าวกีฬาก่อน เผื่อเปิดจากหน้าข่าวกีฬา )
  let news = await fetchNewsById(id);
  let isSports = false;
  if (!news) {
    news = await fetchSportsNewsById(id);
    isSports = true;
  }

  if (!news) {
    showNotFound(box);
    return;
  }

  // เปลี่ยนชื่อแท็บและคำอธิบายของหน้า
  document.title = `${news.title} — BUU | FSS`;

  // --- ส่วนหัวข่าว ---
  const head = document.createElement("div");
  head.className = "article-head";

  const cat = document.createElement("span");
  cat.className = "article-cat";
  cat.textContent = news.category;

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  const titleText = (isEn && news.title_en) ? news.title_en : news.title;

  const title = document.createElement("h1");
  title.className = "article-title";
  title.textContent = titleText;

  const meta = document.createElement("div");
  meta.className = "article-meta";
  const metaDate = document.createElement("span");
  metaDate.textContent = `วันที่ ${formatDateTH(news.created_at)}`;
  const metaAuthor = document.createElement("span");
  metaAuthor.textContent = `• ${news.author || "งานประชาสัมพันธ์คณะ"}`;
  const metaRead = document.createElement("span");
  metaRead.textContent = `• อ่าน ${news.read_minutes || 2} นาที`;
  meta.appendChild(metaDate);
  meta.appendChild(metaAuthor);
  meta.appendChild(metaRead);

  head.appendChild(cat);
  head.appendChild(title);
  head.appendChild(meta);

  // --- ภาพประกอบ ---
  const hero = document.createElement("div");
  if (news.image_url) {
    hero.className = "article-hero has-img";
    const img = document.createElement("img");
    img.src = news.image_url;
    img.alt = news.title;
    img.style.cssText = "width:100%;height:auto;display:block;border-radius:10px;";
    hero.appendChild(img);
  } else {
    hero.className = `article-hero theme-${news.theme || "green"}`;
    hero.textContent = news.category;
  }

  // --- เนื้อหาข่าว ---
  const body = document.createElement("div");
  body.className = "article-body";
  const bodyParas = (isEn && news.body_en && news.body_en.length) ? news.body_en : (news.body || [news.excerpt]);
  bodyParas.forEach((para) => {
    const p = document.createElement("p");
    p.textContent = para;
    body.appendChild(p);
  });

  // --- กล่องแชร์ ---
  const shareBox = buildShareBox(news);

  // --- ข่าวที่เกี่ยวข้อง ---
  const related = document.createElement("section");
  related.className = "content-section-card";
  related.style.marginTop = "1rem";
  const relHead = document.createElement("div");
  relHead.className = "section-head green";
  const relTitle = document.createElement("h2");
  relTitle.className = "text-section-title";
  relTitle.textContent = "ข่าวที่เกี่ยวข้อง";
  relHead.appendChild(relTitle);
  related.appendChild(relHead);

  const relGrid = document.createElement("div");
  relGrid.className = "news-grid";

  // ดึงข่าวทั้งหมดมาใช้หา "ข่าวที่เกี่ยวข้อง"
  // ( หน้านี้อาจถูกเปิดโดยตรง ไม่ได้ผ่านหน้ารายการข่าว จึงต้องโหลดใหม่ )
  let pool;
  let relatedUrl;

  if (isSports) {
    // ข่าวกีฬา → แสดงข่าวกีฬาที่เกี่ยวข้อง
    pool = sportsDataCache;
    if (pool.length === 0) {
      pool = await fetchSportsNews();
      sportsDataCache = pool;
    }
    relatedUrl = "sports-news-detail.html";
  } else {
    // ข่าวคณะ → แสดงข่าวคณะที่เกี่ยวข้อง
    pool = newsDataCache;
    if (pool.length === 0) {
      pool = await fetchNews();
      newsDataCache = pool;
    }
    relatedUrl = "news-detail.html";
  }

  const relatedItems = pool
    .filter((n) => n.id !== news.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  relatedItems.forEach((n) => {
    relGrid.appendChild(buildNewsCard(n, relatedUrl));
  });
  related.appendChild(relGrid);

  // --- ปุ่มกลับ ---
  const backLink = document.createElement("a");
  backLink.className = "btn btn-outline";
  backLink.href = isSports ? "sports-news.html" : "news.html";
  backLink.textContent = "← กลับไปหน้ารายการข่าว";

  // นำทุกอย่างไปใส่ในกล่อง
  box.innerHTML = "";
  box.appendChild(head);
  box.appendChild(hero);
  box.appendChild(body);
  box.appendChild(shareBox);
  box.appendChild(related);
  box.appendChild(backLink);

  // re-render เมื่อเปลี่ยนภาษา (ไม่ซ้ำ listener)
  if (!window.__newsDetailLangBound) {
    window.__newsDetailLangBound = true;
    window.addEventListener("languagechange", () => {
      initNewsDetailPage();
    });
  }
}

/** แสดงข้อความ "ไม่พบข่าว" */
function showNotFound(box) {
  box.innerHTML = `
    <div class="content-section-card">
      <h1 class="text-section-title">ไม่พบข่าวที่ต้องการ</h1>
      <p class="text-meta">ข่าวที่คุณเปิดอาจถูกลบไปแล้ว หรือลิงก์ไม่ถูกต้อง</p>
      <a class="btn btn-primary" href="news.html">← กลับไปหน้าข่าวสาร</a>
    </div>`;
}

/**
 * สร้างกล่องปุ่มแชร์ไปโซเชียลมีเดีย ( ฟีเจอร์บังคับ )
 */
function buildShareBox(news) {
  const box = document.createElement("div");
  box.className = "article-share-box";

  const label = document.createElement("span");
  label.className = "share-label";
  label.textContent = "แชร์ข่าวนี้:";

  const row = document.createElement("div");
  row.className = "share-row";

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(news.title);

  // Facebook
  const fb = document.createElement("a");
  fb.className = "share-btn";
  fb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  fb.target = "_blank";
  fb.rel = "noopener";
  fb.setAttribute("aria-label", "แชร์ไป Facebook");
  fb.innerHTML = SHARE_ICONS.facebook;
  row.appendChild(fb);

  // X (Twitter)
  const x = document.createElement("a");
  x.className = "share-btn";
  x.href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  x.target = "_blank";
  x.rel = "noopener";
  x.setAttribute("aria-label", "แชร์ไป X");
  x.innerHTML = SHARE_ICONS.x;
  row.appendChild(x);

  // LINE
  const line = document.createElement("a");
  line.className = "share-btn";
  line.href = `https://social-plugins.line.me/lineit/share?url=${url}`;
  line.target = "_blank";
  line.rel = "noopener";
  line.setAttribute("aria-label", "แชร์ไป LINE");
  line.innerHTML = SHARE_ICONS.line;
  row.appendChild(line);

  // คัดลอกลิงก์
  const copy = document.createElement("button");
  copy.className = "share-btn";
  copy.type = "button";
  copy.setAttribute("aria-label", "คัดลอกลิงก์ข่าว");
  copy.innerHTML = SHARE_ICONS.link;
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copy.classList.add("is-copied");
      copy.setAttribute("aria-label", "คัดลอกแล้ว");
      setTimeout(() => {
        copy.classList.remove("is-copied");
        copy.setAttribute("aria-label", "คัดลอกลิงก์ข่าว");
      }, 2000);
    } catch (err) {
      console.warn("คัดลอกลิงก์ไม่สำเร็จ:", err);
    }
  });
  row.appendChild(copy);

  box.appendChild(label);
  box.appendChild(row);
  return box;
}

/* =====================================================================
   ส่วนที่ 3 : หน้าข่าวกีฬา ( sports-news.html )
   ===================================================================== */
async function initSportsPage() {
  sportsDataCache = await fetchSportsNews();

  // --- ข่าวกีฬา ---
  renderSportsNewsList();

  // เมื่อเปลี่ยนภาษา ให้ re-render รายการข่าวกีฬาทันที
  window.addEventListener("languagechange", () => {
    renderSportsNewsList();
  });
}

/** แสดงรายการข่าวกีฬา */
function renderSportsNewsList() {
  const box = document.getElementById("sports-news-list");
  if (!box) return;
  box.innerHTML = "";

  const items = sportsDataCache
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  items.forEach((n) => {
    box.appendChild(buildNewsCard(n, "sports-news-detail.html"));
  });
}

/** แสดงตารางผลการแข่งขัน */
function renderMatchResults(items) {
  const box = document.getElementById("match-results-body");
  if (!box) return;
  box.innerHTML = "";

  const resultText = { win: "ชนะ", draw: "เสมอ", loss: "แพ้" };

  (items || []).forEach((m) => {
    const tr = document.createElement("tr");

    const tdSport = document.createElement("td");
    tdSport.textContent = m.sport;

    const tdComp = document.createElement("td");
    tdComp.textContent = m.competition;

    const tdDate = document.createElement("td");
    tdDate.className = "time";
    tdDate.textContent = formatDateTH(m.match_date);

    const tdOpp = document.createElement("td");
    tdOpp.textContent = m.opponent;

    const tdScore = document.createElement("td");
    tdScore.className = "time";
    tdScore.textContent = m.score;

    const tdResult = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `result-badge ${m.result}`;
    badge.textContent = resultText[m.result] || m.result;
    tdResult.appendChild(badge);

    const tdNote = document.createElement("td");
    tdNote.textContent = m.note;

    tr.appendChild(tdSport);
    tr.appendChild(tdComp);
    tr.appendChild(tdDate);
    tr.appendChild(tdOpp);
    tr.appendChild(tdScore);
    tr.appendChild(tdResult);
    tr.appendChild(tdNote);
    box.appendChild(tr);
  });
}

/** แสดงตารางการแข่งขันที่กำลังจะมาถึง */
function renderMatchFixtures(items) {
  const box = document.getElementById("match-fixtures-list");
  if (!box) return;
  box.innerHTML = "";

  (items || []).forEach((m) => {
    const item = document.createElement("div");
    item.className = "activity-item";

    // กล่องวันที่
    const d = new Date(m.match_date);
    const dateBox = document.createElement("div");
    dateBox.className = "event-date";
    const month = document.createElement("span");
    month.className = "ev-month";
    month.textContent = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][d.getMonth()];
    const day = document.createElement("span");
    day.className = "ev-day";
    day.textContent = String(d.getDate()).padStart(2, "0");
    const year = document.createElement("span");
    year.className = "ev-year";
    year.textContent = d.getFullYear() + 543;
    dateBox.appendChild(month);
    dateBox.appendChild(day);
    dateBox.appendChild(year);

    // เนื้อหา
    const body = document.createElement("div");
    body.className = "act-body";
    const title = document.createElement("p");
    title.className = "act-title";
    title.textContent = `${m.sport} พบ ${m.opponent}`;
    const meta = document.createElement("p");
    meta.className = "act-meta";
    meta.textContent = `${m.time} น. • ${m.venue} • ${m.competition}`;
    body.appendChild(title);
    body.appendChild(meta);

    item.appendChild(dateBox);
    item.appendChild(body);
    box.appendChild(item);
  });
}

/** ทำงานแท็บสลับ */
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // ทำให้ปุ่มที่เลือกเป็นตัว active
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      // แสดงแท็บที่เลือก
      panels.forEach((p) => {
        p.classList.toggle("is-active", p.id === target);
      });
    });
  });
}
