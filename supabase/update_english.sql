-- =====================================================================
-- อัปเดตฟิลด์ภาษาอังกฤษ ( English fields ) สำหรับระบบ 2 ภาษา
-- รันไฟล์นี้ใน Supabase SQL Editor หลังจากรัน schema.sql + seed.sql แล้ว
-- =====================================================================

-- 1) เพิ่มคอลัมน์ (ถ้ายังไม่มี)
ALTER TABLE public.instructors ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.instructors ADD COLUMN IF NOT EXISTS academic_position_en TEXT;
ALTER TABLE public.instructors ADD COLUMN IF NOT EXISTS department_en TEXT;
ALTER TABLE public.instructors ADD COLUMN IF NOT EXISTS expertise_en TEXT;

ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS summary_en TEXT;
ALTER TABLE public.news_articles ADD COLUMN IF NOT EXISTS content_en TEXT;

-- 2) แปล expertise ของอาจารย์ (ตาม department)
UPDATE public.instructors
SET expertise_en = CASE
  WHEN department ILIKE '%สื่อสาร%' THEN 'Sport Communication'
  WHEN department ILIKE '%การจัดการ%' THEN 'Sport Management and Coaching'
  ELSE 'Exercise and Sport Science'
END
WHERE expertise_en IS NULL;

-- 3) แปลชื่อข่าว (title_en) ตาม id
UPDATE public.news_articles SET title_en = 'FSS Co-Working Space opens extended hours until midnight', summary_en = 'FSS Co-Working Space on 1st floor extends opening hours until midnight.' WHERE id = 1;
UPDATE public.news_articles SET title_en = 'Senior-Junior meetup guides career paths in sport industry', summary_en = 'Senior students meet juniors to share career guidance in sport and fitness industry.' WHERE id = 2;
UPDATE public.news_articles SET title_en = 'Retirement tribute for Assoc. Prof. Dr. Thanida Julvanichpong', summary_en = 'Retirement tribute ceremony for Assoc. Prof. Dr. Thanida Julvanichpong, academic year 2026.' WHERE id = 3;
UPDATE public.news_articles SET title_en = 'BUU 71st Anniversary Celebration 2026', summary_en = 'Join the 71st anniversary celebration of Burapha University, academic year 2026.' WHERE id = 4;
UPDATE public.news_articles SET title_en = 'MOU signing with Danang Sport University, Vietnam', summary_en = 'Academic MOU signing with Danang Sport University, Vietnam at FSS-605 meeting room.' WHERE id = 5;
UPDATE public.news_articles SET title_en = 'Kiattisak Singharphong wins Suzuka 4 Hours Endurance ST600', summary_en = 'Kiattisak Singharphong, 1st-year student, wins Suzuka 4 Hours Endurance ST600 in Japan.' WHERE id = 6;
UPDATE public.news_articles SET title_en = 'BUU athletes win medals at 48th University Games', summary_en = 'BUU athletes win medals at the 48th University Games "Dok Jan Ban Chiang Games".' WHERE id = 7;
UPDATE public.news_articles SET title_en = 'BUU House drives baseball and cricket championship media', summary_en = 'BUU House operation center drives baseball and cricket championship media in Thailand.' WHERE id = 8;
UPDATE public.news_articles SET title_en = 'Sport Science Games build event management skills', summary_en = 'Internal Sport Science Games build event management skills and unity among students.' WHERE id = 9;
UPDATE public.news_articles SET title_en = 'BUU Night Run and Khao Sam Muk run event', summary_en = 'BUU Night Run and Khao Sam Muk traditional run event organized by FSS.' WHERE id = 10;

-- 4) ชื่ออาจารย์ (name_en) ใช้ชื่อเดิม (proper noun) — ไม่ต้องแปล
--    แต่ถ้าต้องการให้แสดงชื่อภาษาอังกฤษ ให้รัน UPDATE ด้านล่าง (ตัวอย่าง)
-- UPDATE public.instructors SET name_en = name_th WHERE name_en IS NULL;

SELECT 'English fields updated' AS result;
