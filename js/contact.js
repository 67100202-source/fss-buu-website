/* =====================================================================
   ไฟล์: js/contact.js
   ตรรกะของหน้าติดต่อและสมัครเรียน
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
     1) โหลดข้อมูลติดต่อคณะจาก fetchContactInfo() (data.js)
     2) ส่งแบบฟอร์มติดต่อ/สมัครกิจกรรมไปยัง Supabase (ตาราง form_submissions)
     3) แสดงข้อความยืนยันเมื่อส่งสำเร็จ
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("contact-info")) return;
  initContactPage();
});

async function initContactPage() {
  // 1) โหลดข้อมูลติดต่อคณะ
  const info = await fetchContactInfo();
  renderContactInfo(info);

  // 2) ตั้งค่าฟอร์มส่งข้อความ
  const form = document.getElementById("contactForm");
  const msgBox = document.getElementById("cfMessageBox");
  const submitBtn = document.getElementById("cfSubmitBtn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = "กำลังส่ง...";
      msgBox.style.display = "none";

      const submission = {
        submission_type: document.getElementById("cfType").value,
        sender_name: document.getElementById("cfName").value.trim(),
        sender_email: document.getElementById("cfEmail").value.trim(),
        sender_phone: document.getElementById("cfPhone").value.trim() || null,
        subject_or_activity: document.getElementById("cfSubject").value.trim(),
        message: document.getElementById("cfMessage").value.trim(),
        is_new: true,
      };

      try {
        await submitFormSubmission(submission);

        msgBox.className = "form-message success";
        msgBox.textContent = "ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะตอบกลับทางอีเมลในเร็ว ๆ นี้ค่ะ";
        msgBox.style.display = "block";
        form.reset();
      } catch (err) {
        console.error("Send form error:", err);
        msgBox.className = "form-message error";
        msgBox.textContent = "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง (" + err.message + ")";
        msgBox.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "ส่งข้อความ";
      }
    });
  }
}

/** แสดงข้อมูลติดต่อคณะ */
function renderContactInfo(info) {
  const box = document.getElementById("contact-info");
  if (!box) return;

  const facultyName = info.facultyName || "คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา";
  const address = info.address || "169 ถ.แสนสุข ต.แสนสุข อ.เมือง จ.ชลบุรี 20131";
  const phone = info.phone || "038-102060";
  const email = info.email || "fss@buu.ac.th";
  const facebook = info.facebook || "";
  const youtube = info.youtube || "";
  const tiktok = info.tiktok || "";

  box.innerHTML = `
    <p><strong>${facultyName}</strong></p>
    <p>📍 ${address}</p>
    <p>📞 ${phone}</p>
    <p>✉️ <a href="mailto:${email}">${email}</a></p>
  `;

  // อัปเดตลิงก์โซเชียลมีเดียถ้ามี URL จริง
  const socials = document.querySelectorAll(".social-btn");
  socials.forEach((btn) => {
    const label = btn.getAttribute("aria-label");
    let url = "";
    if (label === "Facebook" && facebook) url = facebook;
    if (label === "YouTube" && youtube) url = youtube;
    if (label === "TikTok" && tiktok) url = tiktok;
    if (url) btn.href = url;
  });
}

/** ส่งข้อมูลแบบฟอร์มไปยัง Supabase (ตาราง form_submissions) */
async function submitFormSubmission(data) {
  const sb = getSupabase();
  if (!sb) {
    // ยังไม่ได้ตั้งค่า Supabase → แสดงเฉพาะข้อความจำลอง (สำหรับพัฒนา)
    console.log("ยังไม่ได้เชื่อม Supabase บันทึกแบบจำลอง:", data);
    return { success: true, simulated: true };
  }

  const { error } = await sb.from("form_submissions").insert([data]);
  if (error) throw error;
  return { success: true };
}