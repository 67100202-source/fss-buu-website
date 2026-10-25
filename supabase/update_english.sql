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

-- 5) บริการ (sport_enterprise_services)
ALTER TABLE public.sport_enterprise_services ADD COLUMN IF NOT EXISTS service_name_en TEXT;
ALTER TABLE public.sport_enterprise_services ADD COLUMN IF NOT EXISTS description_en TEXT;

UPDATE public.sport_enterprise_services SET service_name_en = 'Physical Fitness Testing Service' WHERE id = 1;
UPDATE public.sport_enterprise_services SET service_name_en = 'Exercise Leaders Service' WHERE id = 2;
UPDATE public.sport_enterprise_services SET service_name_en = 'Sport Event Management, Recreation and BUU House Operation Center' WHERE id = 3;

-- 6) ทุน (scholarships)
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS scholarship_type_en TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS eligibility_en TEXT;

UPDATE public.scholarships SET title_en = 'Scholarship for Doctoral Thesis Research, Graduate School, Burapha University', scholarship_type_en = 'Research Thesis Support Scholarship', eligibility_en = 'Doctoral students of Burapha University; thesis research support 10,000 THB.' WHERE id = 1;
UPDATE public.scholarships SET title_en = 'Special Talent in Sports Program (Chang Suek Project) Academic Year 2026', scholarship_type_en = 'Sports Talent Scholarship', eligibility_en = 'New applicants with sports talent; apply via TCAS system.' WHERE id = 2;
UPDATE public.scholarships SET title_en = 'Scholarship for Potential and Volunteer Students, Faculty of Sport Science', scholarship_type_en = 'Potential & Volunteer Scholarship', eligibility_en = 'Potential students and volunteer students of FSS, years 1-4.' WHERE id = 3;

-- 7) ผลงาน (achievements)
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS person_name_en TEXT;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS person_role_en TEXT;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS award_title_en TEXT;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS story_detail_en TEXT;
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS category_en TEXT;

UPDATE public.achievements SET award_title_en = 'Thesis Research Support Scholarship, Graduate School, Burapha University (10,000 THB)', person_name_en = 'Phakphum Paluek', person_role_en = 'Doctoral student', category_en = 'Research Award' WHERE id = 1;
UPDATE public.achievements SET award_title_en = 'Kiattisak Singharphong wins Suzuka 4 Hours Endurance ST600', person_name_en = 'Kiattisak Singharphong', person_role_en = '1st-year student', category_en = 'Sports Competition' WHERE id = 2;
UPDATE public.achievements SET award_title_en = 'Follow-Up Weekly Training Distribution and Accumulated Internal Load Effects on Young Football Players (Sports Science Journal)', person_name_en = 'Research team', person_role_en = 'Faculty researchers', category_en = 'Research Publication' WHERE id = 3;
UPDATE public.achievements SET award_title_en = 'BUU athletes win medals at 48th University Games', person_name_en = 'BUU athletes team', person_role_en = 'Student athletes', category_en = 'Sports Competition' WHERE id = 4;

-- 8) คลังสื่อ (media_gallery)
ALTER TABLE public.media_gallery ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.media_gallery ADD COLUMN IF NOT EXISTS description_en TEXT;

UPDATE public.media_gallery SET title_en = 'Faculty introduction video' WHERE id = 1;
UPDATE public.media_gallery SET title_en = 'U2T project: 1 Tambon 1 University' WHERE id = 2;
UPDATE public.media_gallery SET title_en = 'FSS Co-Working Space and laboratories album' WHERE id = 3;

-- 9) ปฏิทินกิจกรรม (calendar_events)
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS event_type_en TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS location_en TEXT;

UPDATE public.calendar_events SET title_en = 'TCAS Admission 2026 (BUU TCAS)', event_type_en = 'Academic Calendar', location_en = 'Online (e-admission.buu.ac.th)' WHERE id = 1;
UPDATE public.calendar_events SET title_en = 'Sport Science Games (Internal Sports Competition)', event_type_en = 'Faculty Activity', location_en = 'FSS sports field and building' WHERE id = 2;
UPDATE public.calendar_events SET title_en = 'BUU Sport Science Volunteer Camp', event_type_en = 'Volunteer Activity', location_en = 'Communities in Chonburi and Eastern region' WHERE id = 3;
UPDATE public.calendar_events SET title_en = 'Exercise for Quality of Life (85111059)', event_type_en = 'Course Activity', location_en = 'Exercise laboratory, FSS building' WHERE id = 4;

SELECT 'English fields updated' AS result;
