/* =====================================================================
   ไฟล์: js/supabase-config.js
   ตั้งค่าการเชื่อมต่อฐานข้อมูล Supabase
   ---------------------------------------------------------------------
   ⚠️ ข้อสำคัญเรื่องความปลอดภัย
   ---------------------------------------------------------------------
   ในไฟล์นี้ใช้ "anon key" เท่านั้น ( คีย์สาธารณะ ออกแบบมาให้ใส่ในโค้ดหน้าเว็บได้ )
   ห้ามใส่ "service_role key" เด็ดขาด เพราะคีย์นั้นสามารถ
   ข้ามกฎความปลอดภัย ( RLS ) ได้ ถ้าหลุดออกไปจะอันตรายมาก
   ---------------------------------------------------------------------
   วิธีหาค่าทั้งสอง:
     1) เปิด Supabase Dashboard > Project Settings > API
     2) คัดลอก "Project URL" และ "anon public" key
     3) วางลงในไฟล์นี้ตามช่องที่ระบุไว้
   ===================================================================== */

/* ---------------------------------------------------------------------
   ค่าการตั้งค่อ ( ใส่ค่าจริงของคุณตรงนี้ )
   --------------------------------------------------------------------- */
const SUPABASE_URL = "https://wssrecnfyljacgyejpfj.supabase.co";      // Project URL ของคุณ (ห้ามมี /rest/v1/ ต่อท้าย)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzc3JlY25meWxqYWNneWVqcGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1Nzg0NDUsImV4cCI6MjEwODE1NDQ0NX0.AfqynoY0jWdcLnlsBlXIuTz2XQN4ugwX1tRV4J5Poaw";  // anon public key ของคุณ

/* ---------------------------------------------------------------------
   ตรวจสอบว่าตั้งค่าครบหรือยัง
   --------------------------------------------------------------------- */
function isSupabaseConfigured() {
  return (
    SUPABASE_URL !== "https://YOUR-PROJECT-REF.supabase.co" &&
    SUPABASE_ANON_KEY !== "YOUR-ANON-PUBLIC-KEY" &&
    SUPABASE_URL.includes("supabase.co")
  );
}

/* ---------------------------------------------------------------------
   สร้างตัวเชื่อมต่อ Supabase
   ---------------------------------------------------------------------
   เรียกคีย์ซ้ำได้ ( จะคืนตัวเดิมเสมอ ) เพื่อไม่ให้เปิดการเชื่อมต่อซ้ำหลายครั้ง
   --------------------------------------------------------------------- */
let supabaseClient = null;

function getSupabase() {
  // ยังไม่ได้ใส่คีย์ → คืน null ( โค้ดจะใช้ข้อมูลตัวอย่างแทน )
  if (!isSupabaseConfigured()) return null;

  // ถ้ามี window.supabase แล้ว ( โหลดจาก CDN ) ให้ใช้ตัวนั้น
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase === "undefined") {
    console.warn(
      "ยังไม่ได้โหลดคลัง supabase-js — ตรวจสอบว่ามี <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> ในไฟล์ HTML"
    );
    return null;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

/* ---------------------------------------------------------------------
   ช่องเก็บรูปภาพ ( Storage bucket )
   --------------------------------------------------------------------- */
const STORAGE_BUCKET = "fss-media";
