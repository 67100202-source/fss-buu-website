/* =====================================================================
   ไฟล์: js/gallery.js
   ตรรกะของหน้าคลังภาพและวิดีโอ
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) โหลดรายการ media จาก fetchMedia() (data.js)
   2) แสดงภาพ/วิดีโอในรูปแบบ grid (DOM: #media-list)
   3) รองรับการฝังวิดีโอ YouTube
   4) จัดการสถานะว่าง (#media-empty)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ทำงานเฉพาะหน้าที่มี #media-list เท่านั้น
  if (!document.getElementById("media-list")) return;
  initGalleryPage();
});

async function initGalleryPage() {
  const media = await fetchMedia();
  renderGallery(media);
  // สร้าง lightbox (modal) สำหรับดูภาพเต็ม — สร้างครั้งเดียว
  createLightbox();
  // สร้าง lightbox สำหรับดูวิดีโอ YouTube ในหน้า
  createVideoLightbox();
}

/* ---------------------------------------------------------------------
   Lightbox สำหรับดูภาพเต็มเมื่อคลิกที่ thumbnail
   --------------------------------------------------------------------- */
let lightboxEl = null;

function createLightbox() {
  if (lightboxEl) return;
  lightboxEl = document.createElement("div");
  lightboxEl.id = "gallery-lightbox";
  lightboxEl.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:9999;padding:1rem;cursor:zoom-out;";
  lightboxEl.innerHTML = `
    <button id="lightbox-close" aria-label="ปิด" style="position:absolute;top:1rem;right:1rem;background:#fff;border:none;border-radius:50%;width:40px;height:40px;font-size:1.2rem;cursor:pointer;">✕</button>
    <img id="lightbox-img" alt="" style="max-width:90vw;max-height:85vh;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.5);" />
    <p id="lightbox-caption" style="position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);color:#fff;font-size:1rem;text-align:center;max-width:90vw;"></p>
  `;
  document.body.appendChild(lightboxEl);

  const closeBtn = lightboxEl.querySelector("#lightbox-close");
  const img = lightboxEl.querySelector("#lightbox-img");

  function close() {
    lightboxEl.style.display = "none";
    img.src = "";
  }
  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxEl.style.display !== "none") close();
  });
}

function openLightbox(src, caption) {
  if (!lightboxEl) createLightbox();
  const img = lightboxEl.querySelector("#lightbox-img");
  const cap = lightboxEl.querySelector("#lightbox-caption");
  img.src = src;
  img.alt = caption || "";
  cap.textContent = caption || "";
  lightboxEl.style.display = "flex";
}

/* ---------------------------------------------------------------------
   Lightbox สำหรับดูวิดีโอ YouTube ในหน้า (iframe embed)
   --------------------------------------------------------------------- */
let videoLightboxEl = null;

function createVideoLightbox() {
  if (videoLightboxEl) return;
  videoLightboxEl = document.createElement("div");
  videoLightboxEl.id = "video-lightbox";
  videoLightboxEl.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:9999;padding:1rem;cursor:pointer;";
  videoLightboxEl.innerHTML = `
    <button id="vlightbox-close" aria-label="ปิด" style="position:absolute;top:1rem;right:1rem;background:#fff;border:none;border-radius:50%;width:40px;height:40px;font-size:1.2rem;cursor:pointer;z-index:10000;">✕</button>
    <div style="width:min(90vw,800px);aspect-ratio:16/9;">
      <iframe id="vlightbox-iframe" src="" title="วิดีโอ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border-radius:8px;"></iframe>
    </div>
    <p id="vlightbox-caption" style="position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);color:#fff;font-size:1rem;text-align:center;max-width:90vw;"></p>
  `;
  document.body.appendChild(videoLightboxEl);

  const closeBtn = videoLightboxEl.querySelector("#vlightbox-close");
  const iframe = videoLightboxEl.querySelector("#vlightbox-iframe");

  function close() {
    videoLightboxEl.style.display = "none";
    iframe.src = "";
  }
  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  videoLightboxEl.addEventListener("click", (e) => {
    if (e.target === videoLightboxEl) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoLightboxEl.style.display !== "none") close();
  });
}

function openVideoLightbox(youtubeUrl, title) {
  if (!videoLightboxEl) createVideoLightbox();
  const iframe = videoLightboxEl.querySelector("#vlightbox-iframe");
  const cap = videoLightboxEl.querySelector("#vlightbox-caption");
  iframe.src = toEmbedUrl(youtubeUrl) + "?autoplay=1";
  cap.textContent = title || "";
  videoLightboxEl.style.display = "flex";
}

/** แปลงวันที่ ISO เป็นรูปแบบภาษาไทย เช่น "31 ต.ค. 2569" */
function formatDateTH(isoDate) {
  if (!isoDate) return "";
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

/** แปลงลิงก์ YouTube เป็น URL สำหรับ embed */
function toEmbedUrl(url) {
  if (!url) return "";
  // รองรับทั้ง watch?v= และ youtu.be/
  let id = "";
  try {
    if (url.includes("watch?v=")) {
      id = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1].split("?")[0];
    }
  } catch (e) {
    id = "";
  }
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

function renderGallery(items) {
  const box = document.getElementById("media-list");
  const empty = document.getElementById("media-empty");
  if (!box) return;

  box.innerHTML = "";

  if (!items || items.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  items.forEach((m) => {
    const card = document.createElement("div");
    card.className = "media-item";

    // --- ส่วนภาพ/วิดีโอ ---
    const thumb = document.createElement("div");
    thumb.className = "media-thumb" + (m.type === "video" ? " video" : "");

    // --- ส่วนข้อมูล (สร้างก่อน เพื่อให้ append ลิงก์ได้) ---
    const body = document.createElement("div");
    body.className = "media-body";

    if (m.type === "video" && m.youtube_url) {
      // วิดีโอ: แสดงภาพ thumbnail — คลิกเพื่อดูวิดีโอในหน้า (lightbox)
      const img = document.createElement("img");
      img.src = m.image_url || "https://placehold.co/400x225?text=Video";
      img.alt = m.title;
      img.loading = "lazy";
      thumb.style.cursor = "pointer";
      thumb.style.position = "relative";
      thumb.addEventListener("click", () => openVideoLightbox(m.youtube_url, m.title));
      thumb.appendChild(img);

      // ไอคอน play ตรงกลาง (ไม่ซ้อนกับลิงก์)
      const playBadge = document.createElement("span");
      playBadge.textContent = "▶";
      playBadge.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.6);pointer-events:none;";
      thumb.appendChild(playBadge);

      // ลิงก์ YouTube ย้ายไปอยู่ใน body (ไม่ซ้อนกับรูป)
      const link = document.createElement("a");
      link.className = "youtube-link";
      link.href = m.youtube_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "▶ เปิดดูบน YouTube";
      link.style.display = "inline-block";
      link.style.marginTop = "0.5rem";
      link.addEventListener("click", (e) => e.stopPropagation());
      body.appendChild(link);
    } else {
      // ภาพ: แสดงรูป ( placeholder ถ้าไม่มีรูปจริง ) — คลิกเพื่อดูเต็ม
      const img = document.createElement("img");
      const src = m.image_url || "https://placehold.co/400x225?text=" + encodeURIComponent(m.title);
      img.src = src;
      img.alt = m.title;
      img.loading = "lazy";
      thumb.style.cursor = "zoom-in";
      thumb.addEventListener("click", () => openLightbox(src, m.title));
      thumb.appendChild(img);
    }

    // --- ส่วนข้อมูล ---
    const title = document.createElement("p");
    title.className = "media-title";
    title.textContent = m.title;

    const date = document.createElement("p");
    date.className = "media-date";
    date.textContent = m.date ? formatDateTH(m.date) : "";

    const type = document.createElement("p");
    type.className = "media-type";
    type.textContent = m.type === "video" ? "วิดีโอ" : "ภาพ";

    // คำใบ้สำหรับดูเต็ม (ภาพ/วิดีโอ)
    const hint = document.createElement("p");
    hint.className = "media-date";
    hint.style.color = "var(--color-green)";
    hint.style.fontWeight = "600";
    hint.textContent = m.type === "video" ? "▶ แตะเพื่อดูวิดีโอ" : "🔍 แตะเพื่อดูรูปเต็ม";
    body.appendChild(hint);

    body.appendChild(title);
    body.appendChild(date);
    body.appendChild(type);

    card.appendChild(thumb);
    card.appendChild(body);
    box.appendChild(card);
  });
}
