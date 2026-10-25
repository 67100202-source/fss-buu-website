/* =====================================================================
   ไฟล์: js/admin.js
   ระบบผู้ดูแล (Admin) — Route Guard และฟังก์ชันกลาง
   ---------------------------------------------------------------------
   หน้าที่ของไฟล์นี้
   1) Route Guard: ถ้าไม่ได้ล็อกอิน ให้เด้งไปหน้า login.html
   2) ฟังก์ชันออกจากระบบ (adminLogout) ที่ล้าง session ทั้ง localStorage
      และ Supabase Auth แล้วกลับไปหน้า login
   3) ฟังก์ชันช่วย (adminGetSupabase) สำหรับหน้า Admin อื่น ๆ
   ใช้ในทุกหน้าภายใต้ admin/ (ยกเว้น login.html)
   ===================================================================== */

(function () {
  "use strict";

  // ตรวจสอบว่าอยู่หน้า login หรือไม่ (ไม่ต้อง guard)
  const isLoginPage =
    (document.body && document.body.getAttribute("data-page") === "admin-login") ||
    window.location.pathname.endsWith("login.html");

  // --- Route Guard ---
  function checkAuth() {
    const token = localStorage.getItem("sb-access-token");
    const user = localStorage.getItem("sb-admin-user");
    if (!token || !user) {
      // ยังไม่ได้ล็อกอิน → ส่งไปหน้า login
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  if (!isLoginPage) {
    if (!checkAuth()) return;
  }

  // --- ออกจากระบบ ---
  window.adminLogout = function () {
    try {
      localStorage.removeItem("sb-access-token");
      localStorage.removeItem("sb-admin-user");
    } catch (e) {
      console.warn("ล้าง localStorage ไม่สำเร็จ:", e);
    }
    try {
      const sb = window.getSupabase ? window.getSupabase() : null;
      if (sb && sb.auth && typeof sb.auth.signOut === "function") {
        sb.auth.signOut();
      }
    } catch (e) {
      console.warn("signOut ไม่สำเร็จ:", e);
    }
    window.location.href = "login.html";
  };

  // --- ช่วยดึง Supabase (defensive) ---
  window.adminGetSupabase = function () {
    try {
      if (typeof window.getSupabase === "function") return window.getSupabase();
    } catch (e) {
      console.warn("getSupabase ไม่สำเร็จ:", e);
    }
    return null;
  };
})();
