/* =====================================================================
   ไฟล์: js/calendar.js
   ตรรกะของหน้าตารางเรียนและปฏิทิน
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) สร้างปฏิทินกิจกรรมแบบรายเดือน ( ฟีเจอร์บังคับ )
     2) แตะวันที่ → แสดงรายละเอียดกิจกรรมของวันนั้น
     3) รายการกิจกรรมทั้งหมดในเดือน + ปุ่ม "เพิ่มลงใน Google Calendar"
     4) ตารางเรียนรายชั้นปี ( ปี 1 - ปี 4 )
   ===================================================================== */

// ชื่อเดือนภาษาไทย
const MONTH_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
// ชื่อวันย่อภาษาไทย ( เริ่มวันอาทิตย์ ตามปกติของไทย )
const DAY_TH = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

// ตัวแปรเก็บสถานะปฏิทิน
let calYear;
let calMonth;   // 0 = มกราคม ... 11 = ธันวาคม
let calSelectedDate = null;   // วันที่ที่ผู้ใช้เลือก (รูปแบบ YYYY-MM-DD)
let allActivities = [];       // กิจกรรมทั้งหมดที่โหลดมา

// รอให้หน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
  // ถ้าไม่ได้อยู่ในหน้านี้ ไม่ต้องทำอะไร
  if (!document.getElementById("cal-grid")) return;

  initCalendar();
  initTimetableTabs();
});

/* ---------------------------------------------------------------------
   1) ตั้งค่าเริ่มต้นและผูกปุ่มเลื่อนเดือน
   --------------------------------------------------------------------- */
async function initCalendar() {
  // เริ่มจากเดือนปัจจุบัน
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();

  // โหลดกิจกรรมทั้งหมด
  allActivities = await fetchActivities();

  // ผูกปุ่มเลื่อนเดือน
  const prevBtn = document.getElementById("cal-prev");
  const nextBtn = document.getElementById("cal-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      calMonth--;
      if (calMonth < 0) {
        calMonth = 11;
        calYear--;
      }
      calSelectedDate = null;
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      calMonth++;
      if (calMonth > 11) {
        calMonth = 0;
        calYear++;
      }
      calSelectedDate = null;
      renderCalendar();
    });
  }

  // วาดปฏิทินครั้งแรก
  renderCalendar();
}
/* ---------------------------------------------------------------------
   2) วาดปฏิทินรายเดือน
   --------------------------------------------------------------------- */
function renderCalendar() {
  const grid = document.getElementById("cal-grid");
  const label = document.getElementById("cal-label");
  if (!grid) return;

  // --- ชื่อเดือนที่กำลังดู ---
  if (label) {
    label.textContent = `${MONTH_TH[calMonth]} ${calYear + 543}`;
  }

  grid.innerHTML = "";

  // --- แถวหัวตาราง ชื่อวัน อา. - ส. ---
  DAY_TH.forEach((d, i) => {
    const head = document.createElement("div");
    head.className = "cal-head";
    // เสาร์-อาทิตย์ ทำสีแดง ( วันหยุด )
    if (i === 0 || i === 6) head.classList.add("is-weekend");
    head.textContent = d;
    head.setAttribute("role", "columnheader");
    grid.appendChild(head);
  });

  // --- วันที่ 1 ของเดือนนี้ตกวันอะไร ---
  const firstDay = new Date(calYear, calMonth, 1);
  const startWeekday = firstDay.getDay();

  // จำนวนวันในเดือนนี้
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // จำนวนวันในเดือนก่อนหน้า ( เพื่อเติมช่องว่างด้านหน้า )
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  // --- วันที่วันนี้ ( เพื่อทำกรอบเขียว ) ---
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  let cells = 0;   // นับจำนวนช่องที่วาดแล้ว ( ให้ครบ 35 หรือ 42 ช่อง )

  // --- ช่องว่างด้านหน้า : วันที่ของเดือนก่อนหน้า ---
  for (let i = startWeekday - 1; i >= 0; i--) {
    const cell = document.createElement("div");
    cell.className = "cal-cell is-empty";
    cell.setAttribute("aria-hidden", "true");
    grid.appendChild(cell);
    cells++;
  }

  // --- วันที่ของเดือนนี้ ---
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${calYear}-${calMonth}-${day}`;   // ใช้ค้นหากิจกรรม
    const isoDate = toISODate(calYear, calMonth, day);

    // กิจกรรมที่มีในวันนี้
    const dayActs = allActivities.filter((a) => a.date === isoDate);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-cell";
    cell.setAttribute("role", "gridcell");

    // วันหยุดสุดสัปดาห์
    const weekday = new Date(calYear, calMonth, day).getDay();
    if (weekday === 0 || weekday === 6) cell.classList.add("is-weekend");

    // วันนี้
    if (dateKey === todayKey) cell.classList.add("is-today");

    // วันที่มีกิจกรรม
    if (dayActs.length > 0) cell.classList.add("has-event");

    // วันที่ถูกเลือก
    if (isoDate === calSelectedDate) cell.classList.add("is-selected");

    // เลขวัน
    const num = document.createElement("span");
    num.className = "cal-daynum";
    num.textContent = day;
    cell.appendChild(num);

    // จุดบอกว่ามีกิจกรรม
    if (dayActs.length > 0) {
      const dot = document.createElement("span");
      dot.className = "cal-dot";
      cell.appendChild(dot);
    }

    // คำอธิบายสำหรับโปรแกรมอ่านจอ ( accessibility )
    cell.setAttribute(
      "aria-label",
      `วันที่ ${day} ${MONTH_TH[calMonth]} ${calYear + 543}` +
        (dayActs.length > 0 ? ` มีกิจกรรม ${dayActs.length} รายการ` : "")
    );

    // กดเพื่อดูรายละเอียด
    cell.addEventListener("click", () => {
      calSelectedDate = isoDate;
      renderCalendar();
      renderDayDetail(isoDate);
    });

    grid.appendChild(cell);
    cells++;
  }

  // --- เติมช่องว่างด้านหลังให้ครบแถว ( 35 หรือ 42 ช่อง ) ---
  while (cells < 35) {
    const cell = document.createElement("div");
    cell.className = "cal-cell is-empty";
    cell.setAttribute("aria-hidden", "true");
    grid.appendChild(cell);
    cells++;
  }

  // อัปเดตรายการกิจกรรมทั้งหมดของเดือนให้ตรงกับเดือนที่เลือก
  renderMonthActivities();
}

/** แปลงเป็นรูปแบบ YYYY-MM-DD */
function toISODate(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/* ---------------------------------------------------------------------
   3) แสดงรายละเอียดกิจกรรมของวันที่เลือก
   --------------------------------------------------------------------- */
function renderDayDetail(isoDate) {
  const box = document.getElementById("cal-detail");
  if (!box) return;
  box.innerHTML = "";

  const acts = allActivities.filter((a) => a.date === isoDate);

  // ถ้าไม่มีกิจกรรมในวันนั้น
  if (acts.length === 0) {
    const p = document.createElement("p");
    p.className = "cal-detail-row";
    p.textContent = "วันนี้ไม่มีกิจกรรมที่กำหนดไว้";
    box.appendChild(p);
    return;
  }

  acts.forEach((act) => {
    // ชื่อกิจกรรม
    const title = document.createElement("p");
    title.className = "cal-detail-title";
    title.textContent = act.title;
    box.appendChild(title);

    // เวลา
    if (act.time) {
      const time = document.createElement("p");
      time.className = "cal-detail-row";
      time.textContent = `เวลา: ${act.time}${act.end_time ? " - " + act.end_time : ""} น.`;
      box.appendChild(time);
    }

    // สถานที่
    if (act.location) {
      const loc = document.createElement("p");
      loc.className = "cal-detail-row";
      loc.textContent = `สถานที่: ${act.location}`;
      box.appendChild(loc);
    }

    // รายละเอียด
    if (act.detail) {
      const detail = document.createElement("p");
      detail.className = "cal-detail-row";
      detail.textContent = act.detail;
      box.appendChild(detail);
    }

    // ปุ่มเพิ่มลงใน Google Calendar
    box.appendChild(buildCalendarButton(act));
  });
}

/* ---------------------------------------------------------------------
   4) รายการกิจกรรมทั้งหมดในเดือนที่เลือก + ปุ่ม Google Calendar
   --------------------------------------------------------------------- */
function renderMonthActivities() {
  const box = document.getElementById("activity-month-list");
  const countBox = document.getElementById("activity-count");
  if (!box) return;
  box.innerHTML = "";

  // กิจกรรมที่อยู่ในเดือน/ปีที่กำลังดู
  const prefix = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
  const acts = allActivities
    .filter((a) => a.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  // แสดงจำนวน
  if (countBox) {
    countBox.textContent = `ทั้งหมด ${acts.length} รายการ`;
  }

  // ถ้าไม่มีกิจกรรม
  if (acts.length === 0) {
    const p = document.createElement("p");
    p.className = "text-meta";
    p.textContent = "เดือนนี้ยังไม่มีกิจกรรมที่กำหนดไว้";
    box.appendChild(p);
    return;
  }

  acts.forEach((act) => {
    const item = document.createElement("div");
    item.className = "activity-item";

    // กล่องวันที่
    const dateBox = document.createElement("div");
    dateBox.className = "event-date";
    const d = new Date(act.date);
    const month = document.createElement("span");
    month.className = "ev-month";
    month.textContent = MONTH_TH[d.getMonth()].slice(0, 3);
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
    title.textContent = act.title;
    const meta = document.createElement("p");
    meta.className = "act-meta";
    meta.textContent = `${act.time || ""} น. • ${act.location || ""}`;
    body.appendChild(title);
    body.appendChild(meta);

    // ปุ่มเพิ่มลง Google Calendar
    body.appendChild(buildCalendarButton(act));

    item.appendChild(dateBox);
    item.appendChild(body);
    box.appendChild(item);
  });
}

/**
 * สร้างปุ่ม "เพิ่มลงใน Google Calendar"
 * ( ฟีเจอร์เสริม: ระบบแจ้งเตือนกิจกรรม )
 */
function buildCalendarButton(act) {
  const btn = document.createElement("a");
  btn.className = "btn-calendar";
  btn.href = buildGoogleCalendarLink(act);
  btn.target = "_blank";
  btn.rel = "noopener";
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4M8 2v4M3 10h18"></path>
      <path d="M12 14v4M10 16h4"></path>
    </svg>
    เพิ่มลงปฏิทิน
  `;
  return btn;
}

/* ---------------------------------------------------------------------
   5) ตารางเรียนรายชั้นปี ( ปี 1 - ปี 4 )
   --------------------------------------------------------------------- */
async function initTimetableTabs() {
  // ทำงานเฉพาะหน้าที่มีตารางเรียนเท่านั้น
  if (!document.getElementById("timetable-body")) return;

  const tabs = document.querySelectorAll(".year-tab");
  if (tabs.length === 0) return;

  // แสดงตารางเรียนปี 1 เป็นค่าเริ่มต้น
  renderTimetable(await fetchSchedules(1));

  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      // เปลี่ยนปุ่มที่ถูกเลือก
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const year = parseInt(tab.dataset.year, 10);
      const schedules = await fetchSchedules(year);
      renderTimetable(schedules);
    });
  });
}

/** วาดตารางเรียนลงในตาราง */
function renderTimetable(items) {
  const body = document.getElementById("timetable-body");
  if (!body) return;
  body.innerHTML = "";

  if (!items || items.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.className = "text-meta";
    td.textContent = "ยังไม่มีตารางเรียนสำหรับชั้นปีนี้";
    tr.appendChild(td);
    body.appendChild(tr);
    return;
  }

  // จัดกลุ่มตามวัน
  const byDay = {};
  items.forEach((s) => {
    if (!byDay[s.day]) byDay[s.day] = [];
    byDay[s.day].push(s);
  });

  // ลำดับวันมาตรฐาน
  const dayOrder = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

  dayOrder.forEach((day) => {
    if (!byDay[day]) return;
    byDay[day].forEach((s) => {
      const tr = document.createElement("tr");

      const tdDay = document.createElement("td");
      tdDay.textContent = day;

      const tdTime = document.createElement("td");
      tdTime.className = "time";
      tdTime.textContent = s.time;

      const tdSubject = document.createElement("td");
      tdSubject.textContent = s.subject;

      const tdRoom = document.createElement("td");
      tdRoom.textContent = s.room;

      tr.appendChild(tdDay);
      tr.appendChild(tdTime);
      tr.appendChild(tdSubject);
      tr.appendChild(tdRoom);
      body.appendChild(tr);
    });
  });
}
