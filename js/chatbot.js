/* =====================================================================
   ไฟล์: js/chatbot.js
   แชทบอทตอบคำถามที่พบบ่อย (FAQ Chatbot) — ฟีเจอร์เสริม
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) แสดงปุ่มแชทลอย (floating button) มุมขวาล่างของทุกหน้า
   2) เปิด/ปิดหน้าต่างแชท
   3) ตอบคำถามจากคลัง FAQ (≥10 ข้อ) ด้วยการจับคู่คำสำคัญ (keyword matching)
   4) รองรับ 2 ภาษา (ไทย/อังกฤษ) ตาม localStorage fss-lang
   ===================================================================== */

// คลังคำถามที่พบบ่อย (FAQ) — อย่างน้อย 10 ข้อ
const FAQ_LIST = [
  {
    keywords: ["หลักสูตร", "สาขาวิชา", "เรียน", "วิชา", "program", "course", "major"],
    q_th: "คณะเปิดสอนหลักสูตรอะไรบ้าง?",
    a_th: "คณะเปิดสอน 3 สาขาในระดับปริญญาตรี: 1) วิทยาศาสตร์การออกกำลังกายและการกีฬา (วท.บ.) 2) การจัดการกีฬาและการเป็นผู้ฝึกสอนกีฬา (ศศ.บ.) 3) สื่อสารมวลชนทางกีฬา (ศศ.บ.) รวมถึงระดับปริญญาโทและเอก",
    q_en: "What programs does the faculty offer?",
    a_en: "The faculty offers 3 bachelor's programs: 1) Exercise and Sport Science (B.Sc.), 2) Sport Management and Coaching (B.A.), 3) Sport Communication (B.A.), plus Master's and Doctoral programs.",
  },
  {
    keywords: ["สมัคร", "TCAS", "admission", "apply", "รับสมัคร", "เข้าเรียน"],
    q_th: "สมัครเรียนต่อคณะอย่างไร?",
    a_th: "สมัครผ่านระบบ TCAS ของมหาวิทยาลัยบูรพา (e-admission.buu.ac.th) โครงการช้างเผือก และโควตาต่าง ๆ ดูรายละเอียดที่หน้า 'ติดต่อและสมัครเรียน'",
    q_en: "How to apply for admission?",
    a_en: "Apply via BUU TCAS system (e-admission.buu.ac.th), special talent programs (Chang Suek), and other quotas. See 'Contact & Admission' page for details.",
  },
  {
    keywords: ["ทุน", "scholarship", "ทุนการศึกษา", "ทุนวิจัย"],
    q_th: "มีทุนการศึกษาอะไรบ้าง?",
    a_th: "มีทุนสนับสนุนการทำวิจัยดุษฎีนิพนธ์ (10,000 บาท), โครงการผู้มีความสามารถพิเศษทางกีฬา (ช้างเผือก), และทุนส่งเสริมการศึกษาสำหรับนิสิตผู้มีศักยภาพและนิสิตจิตอาสา",
    q_en: "What scholarships are available?",
    a_en: "Doctoral thesis research support (10,000 THB), special talent in sports (Chang Suek project), and scholarships for potential/volunteer students.",
  },
  {
    keywords: ["ติดต่อ", "เบอร์", "โทร", "อีเมล", "email", "phone", "address", "ที่อยู่"],
    q_th: "ติดต่อคณะได้อย่างไร?",
    a_th: "คณะวิทยาศาสตร์การกีฬา ม.บูรพา 169 ถ.แสนสุข ต.แสนสุข อ.เมือง จ.ชลบุรี 20131 โทร 038-102060 อีเมล fss@buu.ac.th",
    q_en: "How to contact the faculty?",
    a_en: "Faculty of Sport Science, Burapha University, 169 Long-Hard Bangsaen Rd., Saensuk, Mueang, Chonburi 20131. Tel 038-102060, email fss@buu.ac.th",
  },
  {
    keywords: ["ปฏิทิน", "calendar", "กิจกรรม", "event", "กำหนดการ"],
    q_th: "ดูกิจกรรมและปฏิทินได้ที่ไหน?",
    a_th: "ดูปฏิทินกิจกรรมรายเดือนได้ที่เมนู 'ปฏิทินกิจกรรม' สามารถคลิกวันเพื่อดูรายละเอียดและเพิ่มลง Google Calendar ได้",
    q_en: "Where to see activities and calendar?",
    a_en: "View monthly activity calendar under 'Calendar & Events' menu. Click a date for details and add to Google Calendar.",
  },
  {
    keywords: ["อาจารย์", "faculty", "อาจารย์ประจำ", "อาจารย์ผู้สอน"],
    q_th: "มีอาจารย์กี่คน?",
    a_th: "คณะมีอาจารย์ประจำสาขา 21 คน ครอบคลุม 3 สาขาวิชา ดูรายชื่อและค้นหาได้ที่หน้า 'หลักสูตรและอาจารย์'",
    q_en: "How many faculty members?",
    a_en: "The faculty has 21 instructors across 3 programs. See the list and search on 'Curriculum & Faculty' page.",
  },
  {
    keywords: ["ข่าว", "news", "ข่าวสาร", "กิจกรรมคณะ"],
    q_th: "ติดตามข่าวสารคณะได้ที่ไหน?",
    a_th: "ติดตามข่าวสารและกิจกรรมคณะได้ที่หน้า 'ข่าวสารและกีฬา' รวมถึงข่าวกีฬาและการแข่งขัน สามารถแชร์ไป Facebook, X, LINE ได้",
    q_en: "Where to follow faculty news?",
    a_en: "Follow news and activities on 'News & Sports' page, including sports news. Share to Facebook, X, LINE.",
  },
  {
    keywords: ["คลังภาพ", "gallery", "รูป", "ภาพ", "วิดีโอ", "youtube"],
    q_th: "ดูรูปภาพและวิดีโอได้ที่ไหน?",
    a_th: "ดูคลังภาพและวิดีโอได้ที่เมนู 'ผลงานและคลังสื่อ' รองรับการฝังวิดีโอจาก YouTube",
    q_en: "Where to view photos and videos?",
    a_en: "View photo and video gallery under 'Achievements & Media' menu, supports YouTube embeds.",
  },
  {
    keywords: ["ผลงาน", "รางวัล", "achievement", "ศิษย์เก่า", "alumni"],
    q_th: "มีผลงานนิสิตและศิษย์เก่าอะไรบ้าง?",
    a_th: "มีผลงานนิสิตและศิษย์เก่าที่ได้รับรางวัลระดับชาติและนานาชาติ เช่น แข่งรถทางเรียบ Suzuka 4 Hours, กีฬามหาวิทยาลัยแห่งประเทศไทย ดูรายละเอียดที่ 'ผลงานและคลังสื่อ'",
    q_en: "What are student/alumni achievements?",
    a_en: "Students and alumni have won national and international awards, e.g. Suzuka 4 Hours Endurance, University Games. See 'Achievements & Media'.",
  },
  {
    keywords: ["library", "ห้องสมุด", "ทรัพยากร", "resource"],
    q_th: "มีห้องสมุดหรือไม่?",
    a_th: "คณะใช้ห้องสมุดกลางของมหาวิทยาลัยบูรพา และมี FSS Co-Working Space สำหรับนิสิตเปิดถึงเที่ยงคืน",
    q_en: "Is there a library?",
    a_en: "The faculty uses the central library of Burapha University, plus FSS Co-Working Space open until midnight.",
  },
  {
    keywords: ["หอพัก", "dorm", "ที่พัก", "ที่อยู่"],
    q_th: "มีหอพักหรือไม่?",
    a_th: "นิสิตสามารถสมัครหอพักของมหาวิทยาลัยบูรพา (บางแสน) ได้ คณะตั้งอยู่ในเขตบางแสน จ.ชลบุรี",
    q_en: "Is there a dormitory?",
    a_en: "Students can apply for Burapha University dormitories (Bangsaen). Faculty is in Bangsaen, Chonburi.",
  },
  {
    keywords: ["ภาษา", "language", "english", "อังกฤษ", "thai", "ไทย"],
    q_th: "รองรับภาษาอังกฤษหรือไม่?",
    a_th: "เว็บไซต์รองรับ 2 ภาษา (ไทย/อังกฤษ) กดปุ่ม TH/EN ที่มุมขวาบนเพื่อสลับภาษา",
    q_en: "Does it support English?",
    a_en: "The website supports 2 languages (Thai/English). Click TH/EN button at top right to switch.",
  },
];

// สร้าง UI แชทบอท
(function () {
  // ปุ่มลอย
  const btn = document.createElement("button");
  btn.id = "chatbot-toggle";
  btn.setAttribute("aria-label", "Chatbot FAQ");
  btn.style.cssText = "position:fixed;bottom:1rem;right:1rem;z-index:9998;width:56px;height:56px;border-radius:50%;border:none;background:#2e7d32;color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);";
  btn.textContent = "💬";
  document.body.appendChild(btn);

  // หน้าต่างแชท
  const win = document.createElement("div");
  win.id = "chatbot-window";
  win.style.cssText = "position:fixed;bottom:5rem;right:1rem;z-index:9998;width:320px;max-width:90vw;height:420px;max-height:70vh;background:#fff;border:1px solid #ddd;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.2);display:none;flex-direction:column;overflow:hidden;font-family:inherit;";
  win.innerHTML = `
    <div style="background:#2e7d32;color:#fff;padding:0.75rem 1rem;font-weight:700;display:flex;justify-content:space-between;align-items:center;">
      <span>💬 FAQ Chatbot</span>
      <button id="chatbot-close" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">✕</button>
    </div>
    <div id="chatbot-messages" style="flex:1;overflow-y:auto;padding:0.75rem;font-size:0.95rem;display:flex;flex-direction:column;gap:0.5rem;"></div>
    <div style="display:flex;border-top:1px solid #ddd;">
      <input id="chatbot-input" type="text" placeholder="พิมพ์คำถาม..." style="flex:1;height:44px;border:none;padding:0 0.75rem;font-family:inherit;font-size:1rem;outline:none;" />
      <button id="chatbot-send" style="width:44px;height:44px;border:none;background:#2e7d32;color:#fff;cursor:pointer;font-size:1.1rem;">➤</button>
    </div>
  `;
  document.body.appendChild(win);

  const messages = win.querySelector("#chatbot-messages");
  const input = win.querySelector("#chatbot-input");
  const sendBtn = win.querySelector("#chatbot-send");
  const closeBtn = win.querySelector("#chatbot-close");

  function isEn() {
    return (localStorage.getItem("fss-lang") || "th") === "en";
  }

  function addMsg(text, from) {
    const div = document.createElement("div");
    div.style.cssText = from === "user"
      ? "align-self:flex-end;background:#e8f5e9;padding:0.5rem 0.75rem;border-radius:10px;max-width:85%;white-space:pre-wrap;"
      : "align-self:flex-start;background:#f5f5f5;padding:0.5rem 0.75rem;border-radius:10px;max-width:85%;white-space:pre-wrap;";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function findAnswer(q) {
    const lower = q.toLowerCase();
    let best = null;
    let bestScore = 0;
    FAQ_LIST.forEach((f) => {
      let score = 0;
      f.keywords.forEach((kw) => {
        if (lower.includes(kw.toLowerCase())) score += kw.length; // คำที่ยาวกว่ามีน้ำหนักมากกว่า
      });
      if (score > bestScore) {
        bestScore = score;
        best = f;
      }
    });
    if (best && bestScore > 0) {
      return isEn() ? best.a_en : best.a_th;
    }
    return isEn()
      ? "Sorry, I couldn't find an answer. Please contact the faculty at fss@buu.ac.th or 038-102060."
      : "ขออภัย ไม่พบคำตอบที่ตรงกับคำถาม กรุณาติดต่อคณะที่ fss@buu.ac.th หรือ 038-102060";
  }

  function send() {
    const q = input.value.trim();
    if (!q) return;
    addMsg(q, "user");
    input.value = "";
    setTimeout(() => {
      addMsg(findAnswer(q), "bot");
    }, 300);
  }

  // ข้อความต้อนรับ
  function greet() {
    messages.innerHTML = "";
    addMsg(isEn() ? "Hello! Ask me anything about the faculty." : "สวัสดีค่ะ ถามคำถามเกี่ยวกับคณะได้เลยค่ะ", "bot");
  }

  btn.addEventListener("click", () => {
    const open = win.style.display === "flex";
    win.style.display = open ? "none" : "flex";
    if (!open && messages.childElementCount === 0) greet();
  });
  closeBtn.addEventListener("click", () => { win.style.display = "none"; });
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  // อัปเดต placeholder เมื่อเปลี่ยนภาษา
  window.addEventListener("languagechange", () => {
    input.placeholder = isEn() ? "Type your question..." : "พิมพ์คำถาม...";
    if (messages.childElementCount > 0) greet();
  });
})();
