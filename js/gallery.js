/* =====================================================================
   ไฟล์: js/gallery.js
   ตรรกะของหน้าคลังภาพและวิดีโอ
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) โหลดรายการสื่อจาก fetchMedia() (data.js)
     2) แยกประเภทภาพและวิดีโอ (YouTube)
     3) แสดงเป็นกริดตอบสนองตามขนาดหน้าจอ
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("media-list")) return;
  initGalleryPage();
});

async function initGalleryPage() {
  const media = await fetchMedia();
  renderMedia(media);
}

function renderMedia(items) {
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
    const item = document.createElement("div");
    item.className = "media-item";

    const isVideo = m.type === "video" || (m.youtube_url && m.youtube_url.trim() !== "");
    const thumbUrl = m.image_url || "";

    let thumbHtml = "";
    if (thumbUrl) {
      thumbHtml = `<img src="${thumbUrl}" alt="${m.title}" loading="lazy" onerror="this.style.display='none';this.parentElement.querySelector('.media-placeholder').style.display='flex';" />`;
    } else {
      thumbHtml = `<div class="media-placeholder">ไม่มีภาพ</div>`;
    }

    const dateText = m.date ? formatDateTH(m.date) : "-";

    item.innerHTML = `
      <div class="media-thumb ${isVideo ? "video" : ""}">
        ${thumbHtml}
        <div class="media-placeholder" style="display:none;">ไม่มีภาพ</div>
      </div>
      <div class="media-body">
        <p class="media-title">${m.title}</p>
        <p class="media-date">${dateText}</p>
        <span class="media-type">${isVideo ? "วิดีโอ" : "รูปภาพ"}</span>
        ${m.youtube_url
          ? `<a href="${m.youtube_url}" target="_blank" rel="noopener" class="youtube-link">▶ ดูวิดีโอบน YouTube</a>`
          : ""
        }
      </div>
    `;

    box.appendChild(item);
  });
}

/** แปลงวันที่ ISO เป็นรูปแบบภาษาไทย เช่น "15 ก.ย. 2569" */
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