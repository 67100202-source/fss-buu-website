-- =====================================================================
-- ลบข้อมูลตัวอย่าง (Sample Data) ออกจากฐานข้อมูล
-- เก็บโครงสร้างตาราง (schema) และบัญชี Admin ไว้
-- รันใน Supabase SQL Editor หลังจากรัน schema.sql + seed.sql แล้ว
-- =====================================================================

-- ลบข้อมูลตัวอย่าง (เก็บ admin_users ไว้)
TRUNCATE TABLE public.news_articles RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.calendar_events RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.scholarships RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.achievements RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.media_gallery RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.programs RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.instructors RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.staff_members RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.sport_enterprise_services RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.form_submissions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.faculty_info RESTART IDENTITY CASCADE;

-- หมายเหตุ: admin_users ไม่ถูก truncate (เก็บบัญชีผู้ดูแลไว้)
-- ถ้าต้องการลบ admin ด้วย ให้รัน: TRUNCATE TABLE public.admin_users RESTART IDENTITY CASCADE;

SELECT 'Sample data cleared' AS result;
