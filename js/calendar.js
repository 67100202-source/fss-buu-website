/* =====================================================================
   ไฟล์: js/calendar.js
   ตรรกะของหน้าปฏิทินกิจกรรม
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) โหลดรายการกิจกรรม (จาก DB ถ้าเชื่อมแล้ว ไม่งั้นใช้ข้อมูลตัวอย่าง)
   2) แสดงปฏิทินรายเดือน (grid 7 คอลัมน์) พร้อม badge กิจกรรมในแต่ละวัน
   3) คลิกวันที่เพื่อดูรายละเอียดกิจกรรมของวันนั้น
   4) ปุ่มเปลี่ยนเดือน (ก่อนหน้า/ถัดไป) และไฮไลต์วันนี้
   ===================================================================== */

// ชื่อเดือนภาษาไทย
const CAL_MONTHS_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
// ชื่อวันในสัปดาห์ (อาทิตย์ -> เสาร์)
const CAL_WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

// สถานะปัจจุบัน
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-11
let calEvents = [];
let calSelectedDate = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("calendar-grid")) return;
  initCalendarPage();
});

async function initCalendarPage() {
  // โหลดกิจกรรมทั้งหมด (ไม่กรองวันที่ เพื่อให้ปฏิทินย้อนหลัง/ล่วงหน้าได้)
  calEvents = await fetchCalendarEvents();
  renderCalendar();
  createEventModal();

  // ปุ่มเปลี่ยนเดือน
  const prevBtn = document.getElementById("cal-prev");
  const nextBtn = document.getElementById("cal-next");
  if (prevBtn) prevBtn.addEventListener("click", () => changeMonth(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => changeMonth(1));

  // re-render เมื่อเปลี่ยนภาษา
  window.addEventListener("languagechange", () => {
    renderCalendar();
  });
}

/** ดึงกิจกรรมทั้งหมด (ไม่กรองวันที่) — fallback ข้อมูลตัวอย่าง */
async function fetchCalendarEvents() {
  const sb = (typeof getSupabase === "function") ? getSupabase() : null;
  if (sb) {
    try {
      const { data, error } = await sb
        .from("calendar_events")
        .select("*")
        .eq("status", "published")
        .order("start_date", { ascending: true });
      if (!error && data) {
        return data.map((r) => ({
          id: r.id,
          title: r.title,
          title_en: r.title_en || "",
          date: r.start_date,
          end_date: r.end_date,
          time: r.time_range || "",
          location: r.location || "",
          location_en: r.location_en || "",
          category: r.event_type,
          category_en: r.event_type_en || "",
          detail: r.description || "",
          detail_en: r.description_en || "",
          source_url: r.source_url || "",
        }));
      }
      if (error) console.error("โหลดกิจกรรมไม่สำเร็จ:", error.message);
    } catch (e) {
      console.warn("ดึงข้อมูลกิจกรรมจาก DB ไม่สำเร็จ ใช้ข้อมูลตัวอย่างแทน", e);
    }
  }
  // ยังไม่ได้ตั้งค่า Supabase -> ใช้ข้อมูลตัวอย่าง
  if (typeof sampleActivities !== "undefined") return sampleActivities;
  return [];
}

/** เปลี่ยนเดือน */
function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  calSelectedDate = null;
  renderCalendar();
}

/** คืนรายการกิจกรรมที่เกิดขึ้นในวันที่กำหนด (YYYY-MM-DD) */
function eventsOnDate(isoDate) {
  const result = [];
  (calEvents || []).forEach((ev) => {
    const start = ev.date;
    const end = ev.end_date || ev.date;
    if (isoDate >= start && isoDate <= end) {
      result.push(ev);
    }
  });
  return result;
}

/** สร้างปฏิทินของเดือนปัจจุบัน */
function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const title = document.getElementById("cal-month-title");
  if (!grid) return;

  if (title) {
    title.textContent = `${CAL_MONTHS_TH[calMonth]} ${calYear + 543}`;
  }

  grid.innerHTML = "";

  // หัวตารางวันในสัปดาห์
  CAL_WEEKDAYS.forEach((wd) => {
    const cell = document.createElement("div");
    cell.className = "calendar-weekday";
    cell.textContent = wd;
    grid.appendChild(cell);
  });

  const firstDay = new Date(calYear, calMonth, 1);
  const startWeekday = firstDay.getDay(); // 0 = อาทิตย์
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // ช่องว่างก่อนวันที่ 1
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day is-other-month";
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    if (iso === todayISO) cell.classList.add("is-today");
    if (calSelectedDate === iso) cell.classList.add("is-selected");

    const num = document.createElement("span");
    num.className = "day-num";
    num.textContent = day;
    cell.appendChild(num);

    const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
    const evs = eventsOnDate(iso);
    evs.slice(0, 2).forEach((ev) => {
      const title = (isEn && ev.title_en) ? ev.title_en : ev.title;
      const badge = document.createElement("span");
      badge.className = "ev-badge";
      // ตัดชื่อกิจกรรมให้สั้น เพื่อไม่ให้ล้นขอบเซลล์
      const short = title.length > 14 ? title.slice(0, 14) + "…" : title;
      badge.textContent = short;
      badge.title = title; // tooltip แสดงชื่อเต็มเมื่อ hover
      cell.appendChild(badge);
    });
    if (evs.length > 2) {
      const more = document.createElement("span");
      more.className = "ev-badge";
      more.textContent = `+${evs.length - 2} กิจกรรม`;
      cell.appendChild(more);
    }

    cell.addEventListener("click", () => {
      calSelectedDate = iso;
      renderCalendar();
      openEventModal(iso);
    });

    grid.appendChild(cell);
  }
}

/* ---------------------------------------------------------------------
   Popup (Modal) สำหรับแสดงรายละเอียดกิจกรรมของวันที่เลือก
   --------------------------------------------------------------------- */
let eventModalEl = null;

function createEventModal() {
  if (eventModalEl) return;
  eventModalEl = document.createElement("div");
  eventModalEl.id = "event-modal";
  eventModalEl.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);display:none;align-items:center;justify-content:center;z-index:9999;padding:1rem;";

  eventModalEl.innerHTML = `
    <div style="background:#fff;border-radius:12px;max-width:520px;width:100%;max-height:85vh;overflow:auto;padding:1.25rem;position:relative;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
      <button id="event-modal-close" aria-label="ปิด" style="position:absolute;top:0.75rem;right:0.75rem;background:#f0f0f0;border:none;border-radius:50%;width:36px;height:36px;font-size:1.1rem;cursor:pointer;">✕</button>
      <div id="event-modal-body"></div>
    </div>
  `;
  document.body.appendChild(eventModalEl);

  const closeBtn = eventModalEl.querySelector("#event-modal-close");
  function close() {
    eventModalEl.style.display = "none";
  }
  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  eventModalEl.addEventListener("click", (e) => {
    if (e.target === eventModalEl) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && eventModalEl.style.display !== "none") close();
  });
}

function openEventModal(isoDate) {
  if (!eventModalEl) createEventModal();
  const body = eventModalEl.querySelector("#event-modal-body");
  body.innerHTML = "";

  // หัวข้อวันที่
  const h = document.createElement("h3");
  h.style.cssText = "margin:0 0 0.75rem;font-size:1.15rem;color:var(--color-green-dark,#1b5e20);";
  h.textContent = formatDateTH(isoDate);
  body.appendChild(h);

  const isEn = (typeof getCurrentLang === "function") && getCurrentLang() === "en";
  const evs = eventsOnDate(isoDate);
  if (evs.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = isEn ? "No activities on this day" : "ไม่มีกิจกรรมในวันนี้";
    body.appendChild(p);
    eventModalEl.style.display = "flex";
    return;
  }

  evs.forEach((ev) => {
    const item = document.createElement("div");
    item.style.cssText = "background:var(--color-gray-bg,#f5f5f5);border:1px solid var(--color-gray-light,#e0e0e0);border-radius:8px;padding:0.75rem;margin-bottom:0.6rem;";

    const titleText = (isEn && ev.title_en) ? ev.title_en : ev.title;
    const title = document.createElement("p");
    title.style.cssText = "font-weight:600;margin:0 0 0.25rem;";
    title.textContent = titleText;

    const meta = document.createElement("p");
    meta.style.cssText = "font-size:0.9rem;color:var(--color-gray-medium,#666);margin:0 0 0.4rem;";
    const parts = [];
    if (ev.time) parts.push(`⏰ ${ev.time}`);
    const loc = (isEn && ev.location_en) ? ev.location_en : ev.location;
    if (loc) parts.push(`📍 ${loc}`);
    const cat = (isEn && ev.category_en) ? ev.category_en : ev.category;
    if (cat) parts.push(`🏷 ${cat}`);
    meta.textContent = parts.join(" • ") || "—";

    const detailText = (isEn && ev.detail_en) ? ev.detail_en : ev.detail;
    if (detailText) {
      const detail = document.createElement("p");
      detail.style.cssText = "font-size:0.9rem;margin:0 0 0.5rem;";
      detail.textContent = detailText;
      item.appendChild(detail);
    }

    item.appendChild(title);
    item.appendChild(meta);



    // ปุ่มเพิ่มลง Google Calendar
    if (typeof buildGoogleCalendarLink === "function") {
      const link = document.createElement("a");
      link.className = "btn btn-outline";
      link.style.fontSize = "0.9rem";
      link.target = "_blank";
      link.rel = "noopener";
      link.href = buildGoogleCalendarLink(ev);
      link.textContent = "➕ เพิ่มลง Google Calendar";
      item.appendChild(link);
    }

    body.appendChild(item);
  });

  eventModalEl.style.display = "flex";
}

/** แปลงวันที่ ISO เป็นข้อความไทย */
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
