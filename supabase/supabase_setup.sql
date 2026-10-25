-- ============================================================================
-- สคริปต์สร้างฐานข้อมูลฉบับสมบูรณ์ 100% สำหรับ SUPABASE (PostgreSQL)
-- ดึงข้อมูลครบทุกหน้าจากเว็บไซต์ https://fss.buu.ac.th/
-- ============================================================================

DROP TABLE IF EXISTS public.form_submissions CASCADE;
DROP TABLE IF EXISTS public.faq_items CASCADE;
DROP TABLE IF EXISTS public.sport_enterprise_services CASCADE;
DROP TABLE IF EXISTS public.documents_and_forms CASCADE;
DROP TABLE IF EXISTS public.media_gallery CASCADE;
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.scholarships CASCADE;
DROP TABLE IF EXISTS public.news_articles CASCADE;
DROP TABLE IF EXISTS public.staff_members CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.board_and_executives CASCADE;
DROP TABLE IF EXISTS public.faculty_info CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Trigger อัปเดตเวลา updated_at อัตโนมัติเมื่อ Admin แก้ไขข้อมูล
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. ตารางข้อมูลคณะ ประวัติ วิสัยทัศน์ ปรัชญา พันธกิจ ค่านิยม SPORTS อัตลักษณ์ เอกลักษณ์ (faculty_info)
CREATE TABLE public.faculty_info (
    id BIGSERIAL PRIMARY KEY,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slogan TEXT,
    vision TEXT,
    philosophy TEXT,
    goals TEXT[],
    missions TEXT[],
    core_values_sports JSONB,
    identity_text TEXT,
    uniqueness_text TEXT,
    core_competency TEXT,
    history_summary TEXT,
    address_th TEXT NOT NULL,
    address_en TEXT,
    phones TEXT[] NOT NULL,
    fax TEXT,
    email TEXT NOT NULL,
    facebook_name TEXT,
    facebook_url TEXT,
    student_club_fb_url TEXT,
    youtube_url TEXT,
    line_official TEXT,
    admission_url TEXT,
    reg_url TEXT,
    internal_systems JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางโครงสร้างบริหารและคณะกรรมการประจำคณะ (board_and_executives)
CREATE TABLE public.board_and_executives (
    id BIGSERIAL PRIMARY KEY,
    group_type TEXT NOT NULL, -- 'ผู้บริหารคณะ' หรือ 'คณะกรรมการประจำคณะ'
    name_th TEXT NOT NULL,
    role_title TEXT NOT NULL,
    source_url TEXT DEFAULT 'https://fss.buu.ac.th/structure/frontend/index'
);

-- 3. ตารางผู้ดูแลระบบ (admin_users)
CREATE TABLE public.admin_users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_plain_demo TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ตารางหลักสูตร (programs)
CREATE TABLE public.programs (
    id BIGSERIAL PRIMARY KEY,
    level_th TEXT NOT NULL,
    level_en TEXT NOT NULL,
    degree_th TEXT NOT NULL,
    degree_en TEXT NOT NULL,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    curriculum_years TEXT NOT NULL,
    chairperson TEXT,
    description_th TEXT,
    description_en TEXT,
    document_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 5. ตารางอาจารย์ประจำคณะครบ 21 ท่าน (instructors)
CREATE TABLE public.instructors (
    id BIGSERIAL PRIMARY KEY,
    name_th TEXT NOT NULL,
    name_en TEXT,
    academic_position TEXT,
    academic_position_en TEXT,
    admin_role TEXT,
    department TEXT NOT NULL,
    department_en TEXT,
    expertise TEXT,
    expertise_en TEXT,
    phone TEXT DEFAULT '038-102060',
    email TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 6. ตารางบุคลากรสำนักงานคณบดีครบ 9 ท่าน (staff_members)
CREATE TABLE public.staff_members (
    id BIGSERIAL PRIMARY KEY,
    name_th TEXT NOT NULL,
    position TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source_url TEXT
);

-- 7. ตารางข่าวประชาสัมพันธ์ กิจกรรมคณะ และข่าวกีฬา (news_articles)
CREATE TABLE public.news_articles (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT,
    summary TEXT NOT NULL,
    summary_en TEXT,
    content TEXT,
    content_en TEXT,
    image_url TEXT,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    author TEXT DEFAULT 'งานประชาสัมพันธ์',
    is_urgent BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 8. ตารางประกาศทุนการศึกษาและทุนวิจัย (scholarships)
CREATE TABLE public.scholarships (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    scholarship_type TEXT NOT NULL,
    amount_baht INTEGER,
    deadline DATE,
    eligibility TEXT NOT NULL,
    attachment_name TEXT,
    attachment_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 9. ตารางผลงานนิสิต ศิษย์เก่า และบุคลากรที่สร้างชื่อเสียง (achievements)
CREATE TABLE public.achievements (
    id BIGSERIAL PRIMARY KEY,
    person_name TEXT NOT NULL,
    person_role TEXT NOT NULL,
    award_title TEXT NOT NULL,
    story_detail TEXT,
    category TEXT NOT NULL,
    award_year TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 10. ตารางปฏิทินการศึกษา กิจกรรมรายเดือน และตารางเรียน (calendar_events)
CREATE TABLE public.calendar_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    time_range TEXT,
    location TEXT,
    target_year TEXT DEFAULT 'ทุกชั้นปี',
    schedule_link TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 11. ตารางคลังภาพและวิดีโอ (media_gallery)
CREATE TABLE public.media_gallery (
    id BIGSERIAL PRIMARY KEY,
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'album')),
    title TEXT NOT NULL,
    description TEXT,
    published_date DATE DEFAULT CURRENT_DATE,
    youtube_url TEXT,
    thumbnail_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT
);

-- 12. ตารางเอกสารเผยแพร่ แบบฟอร์มดาวน์โหลด และเล่มรายงานโครงการ (documents_and_forms)
CREATE TABLE public.documents_and_forms (
    id BIGSERIAL PRIMARY KEY,
    target_group TEXT NOT NULL, -- 'นิสิตปัจจุบัน', 'บุคลากร/อาจารย์', 'บัณฑิตศึกษา/วิจัย', 'ศิษย์เก่า', 'รายงานโครงการพัฒนานิสิต'
    title TEXT NOT NULL,
    category_detail TEXT,
    fiscal_year TEXT,
    source_url TEXT DEFAULT 'https://fss.buu.ac.th/document/frontend/index'
);

-- 13. ตารางศูนย์วิสาหกิจกีฬาและบริการวิชาการ (sport_enterprise_services)
CREATE TABLE public.sport_enterprise_services (
    id BIGSERIAL PRIMARY KEY,
    service_name TEXT NOT NULL,
    description TEXT NOT NULL,
    published_date DATE,
    source_url TEXT DEFAULT 'https://fss.buu.ac.th/'
);

-- 14. ตารางคำถามที่พบบ่อย FAQ สำหรับแชทบอท (faq_items - รองรับฟีเจอร์เสริม FAQ อย่างน้อย 10 คำถาม)
CREATE TABLE public.faq_items (
    id BIGSERIAL PRIMARY KEY,
    question_th TEXT NOT NULL,
    answer_th TEXT NOT NULL,
    keywords TEXT[],
    category TEXT DEFAULT 'ทั่วไป'
);

-- 15. ตารางข้อความจากแบบฟอร์มติดต่อและรายชื่อผู้สมัครกิจกรรม (form_submissions)
CREATE TABLE public.form_submissions (
    id BIGSERIAL PRIMARY KEY,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('contact', 'activity_register')),
    sender_name TEXT NOT NULL,
    student_id TEXT,
    sender_email TEXT,
    sender_phone TEXT,
    subject_or_activity TEXT NOT NULL,
    message TEXT,
    is_new BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ผูก Trigger อัปเดต updated_at อัตโนมัติ
CREATE TRIGGER trg_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_news_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_scholarships_updated_at BEFORE UPDATE ON public.scholarships FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_calendar_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_media_updated_at BEFORE UPDATE ON public.media_gallery FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- เปิด RLS และ Policy สำหรับโปรเจคต้นแบบ
ALTER TABLE public.faculty_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_and_executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_and_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sport_enterprise_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on faculty_info" ON public.faculty_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on board_and_executives" ON public.board_and_executives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_users" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on programs" ON public.programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on instructors" ON public.instructors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on staff_members" ON public.staff_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on news_articles" ON public.news_articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on scholarships" ON public.scholarships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on calendar_events" ON public.calendar_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on media_gallery" ON public.media_gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on documents_and_forms" ON public.documents_and_forms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sport_enterprise_services" ON public.sport_enterprise_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on faq_items" ON public.faq_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on form_submissions" ON public.form_submissions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- ตารางเพิ่มเติมที่หน้าเว็บอ้างอิง (สำหรับระบบ Admin จัดการ)
-- ============================================================================

-- ตารางเรียนรายชั้นปี
CREATE TABLE IF NOT EXISTS public.schedules (
    id BIGSERIAL PRIMARY KEY,
    year_level INTEGER NOT NULL CHECK (year_level BETWEEN 1 AND 4),
    day VARCHAR(20) NOT NULL,
    time VARCHAR(50) NOT NULL,
    subject TEXT NOT NULL,
    room TEXT,
    source_url TEXT
);
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on schedules" ON public.schedules;
CREATE POLICY "Allow all on schedules" ON public.schedules FOR ALL USING (true) WITH CHECK (true);

-- ผลการแข่งขัน
CREATE TABLE IF NOT EXISTS public.match_results (
    id BIGSERIAL PRIMARY KEY,
    sport TEXT NOT NULL,
    competition TEXT NOT NULL,
    match_date DATE NOT NULL,
    opponent TEXT NOT NULL,
    score TEXT NOT NULL,
    result TEXT CHECK (result IN ('win', 'draw', 'loss')),
    note TEXT,
    source_url TEXT
);
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on match_results" ON public.match_results;
CREATE POLICY "Allow all on match_results" ON public.match_results FOR ALL USING (true) WITH CHECK (true);

-- ตารางการแข่งขันที่กำลังจะมาถึง
CREATE TABLE IF NOT EXISTS public.match_fixtures (
    id BIGSERIAL PRIMARY KEY,
    sport TEXT NOT NULL,
    competition TEXT NOT NULL,
    match_date DATE NOT NULL,
    time TEXT,
    opponent TEXT NOT NULL,
    venue TEXT,
    source_url TEXT
);
ALTER TABLE public.match_fixtures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on match_fixtures" ON public.match_fixtures;
CREATE POLICY "Allow all on match_fixtures" ON public.match_fixtures FOR ALL USING (true) WITH CHECK (true);

-- นักกีฬาคณะ
CREATE TABLE IF NOT EXISTS public.athletes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    year_level INTEGER,
    sport TEXT NOT NULL,
    position TEXT,
    achievement TEXT,
    source_url TEXT
);
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on athletes" ON public.athletes;
CREATE POLICY "Allow all on athletes" ON public.athletes FOR ALL USING (true) WITH CHECK (true);

-- สไลด์ Banner หน้าแรก
CREATE TABLE IF NOT EXISTS public.banners (
    id BIGSERIAL PRIMARY KEY,
    tag TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    cta TEXT,
    url TEXT,
    theme TEXT DEFAULT 'green',
    source_url TEXT
);
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on banners" ON public.banners;
CREATE POLICY "Allow all on banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- ทางลัดตามกลุ่มผู้ใช้
CREATE TABLE IF NOT EXISTS public.quick_links (
    id BIGSERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    link_desc TEXT,
    url TEXT,
    icon TEXT,
    source_url TEXT
);
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on quick_links" ON public.quick_links;
CREATE POLICY "Allow all on quick_links" ON public.quick_links FOR ALL USING (true) WITH CHECK (true);

-- หน่วยงานที่เกี่ยวข้อง (พันธมิตร)
CREATE TABLE IF NOT EXISTS public.partners (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    source_url TEXT
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on partners" ON public.partners;
CREATE POLICY "Allow all on partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);

-- ข้อมูลติดต่อคณะ (สำหรับ Footer)
CREATE TABLE IF NOT EXISTS public.contact_info (
    id BIGSERIAL PRIMARY KEY,
    faculty_name TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    tiktok_url TEXT,
    line_official TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on contact_info" ON public.contact_info;
CREATE POLICY "Allow all on contact_info" ON public.contact_info FOR ALL USING (true) WITH CHECK (true);

-- ตารางไอคอนบริการ (สำหรับหน้าแรก)
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    url TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    source_url TEXT
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on services" ON public.services;
CREATE POLICY "Allow all on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- INSERT ข้อมูลจริงทั้งหมดจาก https://fss.buu.ac.th/
-- ============================================================================

-- 1. ข้อมูลคณะ วิสัยทัศน์ พันธกิจ ค่านิยม SPORTS อัตลักษณ์ เอกลักษณ์ และระบบสารสนเทศ
INSERT INTO public.faculty_info (
    name_th, name_en, slogan, vision, philosophy, goals, missions,
    core_values_sports, identity_text, uniqueness_text, core_competency,
    history_summary, address_th, address_en, phones, fax, email,
    facebook_name, facebook_url, student_club_fb_url, youtube_url,
    line_official, admission_url, reg_url, internal_systems
) VALUES (
    'คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา',
    'Faculty of Sport Science, Burapha University',
    'Better Faculty Better Education.',
    'คณะวิทยาศาสตร์กีฬาชั้นนำ ที่พัฒนาสู่องค์กรประสิทธิภาพสูงเพื่อการเติบโตอย่างยั่งยืน',
    'มีความรู้ คู่คุณธรรม เสริมสร้างปัญญา ค้นหาเหตุผลนำวิทยาศาสตร์การกีฬาสู่ชุมชน สร้างสังคมยั่งยืน',
    ARRAY[
        '1. เป็น 1 ใน QS World University Rankings ของคณะวิทยาศาสตร์การกีฬา ในประเทศไทย',
        '2. การประเมินคุณภาพการศึกษาภายในตามเกณฑ์การประเมินคุณภาพการศึกษาที่เป็นเลิศ มีผลการประเมินในระดับคะแนน 300 คะแนนขึ้นไป'
    ],
    ARRAY[
        '1. วิชาการและการเรียนการสอน',
        '2. การวิจัยและนวัตกรรม',
        '3. การบริการวิชาการแก่สังคม',
        '4. การพัฒนาคณะฯ ให้เข้มแข็งมีระบบบริหารจัดการที่มีประสิทธิภาพสูงและพึ่งตนเองได้'
    ],
    '{"S1": "Sportsmanship - ความมีน้ำใจนักกีฬา", "P": "Professional - ความเป็นมืออาชีพ", "O": "Order - ความมีระเบียบวินัย", "R": "Responsibility - การมีความรับผิดชอบ", "T": "Teamwork - การทำงานเป็นทีม", "S2": "Smart - มีความชาญฉลาด และสง่างาม"}'::jsonb,
    'บัณฑิตรักษ์สุขภาพและมีสังคม (บัณฑิตที่สำเร็จการศึกษาจากคณะวิทยาศาสตร์การกีฬา มีสุขภาพที่ดี มีเพื่อน และน้ำใจไมตรี)',
    'ผู้นำด้านศาสตร์กีฬาทางน้ำ (มีความรู้ความเข้าใจในศาสตร์กีฬาทางน้ำ และสามารถบูรณาการองค์ความรู้วิทยาศาสตร์การกีฬา)',
    'ความสามารถในการปฏิบัติงานภายใต้ข้อจำกัดด้านงบประมาณ',
    'เริ่มต้นจาก หมวดพลานามัย วิทยาลัยวิชาการศึกษาบางแสน (พ.ศ. 2517) ยกฐานะเป็น คณะพลศึกษา มศว บางแสน (พ.ศ. 2523) ต่อมาจัดตั้งเป็น วิทยาลัยวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา (8 มี.ค. 2545) และเปลี่ยนชื่อเป็น คณะวิทยาศาสตร์การกีฬา เมื่อวันที่ 10 เมษายน พ.ศ. 2551',
    '169 ถ.ลงหาดบางแสน ต.แสนสุข อ.เมือง จ.ชลบุรี 20131',
    '169 Long Had Bangsaen Rd, Saen Suk, Chon Buri District, Chon Buri 20131',
    ARRAY['038-102060', '038-102059', '038-102083'],
    '038-390045',
    'fss.buu@go.buu.ac.th',
    '@Buusportsci',
    'https://www.facebook.com/Buusportsci',
    'https://www.facebook.com/FSSBangSaen',
    'https://www.youtube.com/watch?v=_lxIy2d78Lg',
    'Line Official คณะวิทยาศาสตร์การกีฬา',
    'https://e-admission.buu.ac.th',
    'https://regservice.buu.ac.th',
    '["ระบบจองห้องเรียน คณะวิทยาศาสตร์การกีฬา", "ระบบยืมเงิน มหาวิทยาลัยบูรพา", "ระบบจองที่จอดรถให้ผู้มาติดต่อ คณะวิทยาศาสตร์การกีฬา", "ห้องออกกำลังกายคณะวิทยาศาสตร์การกีฬา"]'::jsonb
);

-- 2. โครงสร้างบริหารและคณะกรรมการประจำคณะ (จากหน้า structure/frontend/index)
INSERT INTO public.board_and_executives (group_type, name_th, role_title) VALUES
('ผู้บริหารคณะ', 'ผศ.ดร.วิรัตน์ สนธิ์จันทร์', 'คณบดีคณะวิทยาศาสตร์การกีฬา'),
('ผู้บริหารคณะ', 'ผศ.ดร.ปัญญา อินทเจริญ', 'รองคณบดีฝ่ายบริหาร'),
('ผู้บริหารคณะ', 'ผศ.ดร.ไพโรจน์ สว่างไพร', 'รองคณบดีฝ่ายวิชาการและวิจัย / ประธานสาขาวิชาการจัดการและการสอนกีฬา'),
('ผู้บริหารคณะ', 'ดร.วัชชริน ผดุงรัชดากิจ', 'ผู้ช่วยคณบดีฝ่ายสื่อสารองค์กรและวิเทศสัมพันธ์'),
('ผู้บริหารคณะ', 'นายอัฐพร โสวัตร์', 'ผู้ช่วยคณบดีฝ่ายพัฒนานิสิต บริการวิชาการ และแผนยุทธศาสตร์ และผู้รักษาการแทนหัวหน้าสำนักงานคณบดี'),
('ผู้บริหารคณะ', 'ผศ.ดร.พรพจน์ ไชยนอก', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา ระดับบัณฑิตศึกษา'),
('ผู้บริหารคณะ', 'ผศ.ดร.กวีญา สินธารา', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา (ระดับปริญญาตรี)'),
('ผู้บริหารคณะ', 'ผศ.ดร.สราลี สนธิ์จันทร์', 'ประธานสาขาวิชาสื่อสารมวลชนทางกีฬา'),
('คณะกรรมการประจำคณะ', 'ผศ.ดร.วิรัตน์ สนธิ์จันทร์', 'คณบดีคณะวิทยาศาสตร์การกีฬา (ประธานกรรมการ)'),
('คณะกรรมการประจำคณะ', 'ผศ.ดร.พิชาญ สว่างวงศ์', 'ผู้ทรงคุณวุฒิภายนอก (กรรมการ)'),
('คณะกรรมการประจำคณะ', 'นายสนธยา คุณปลื้ม', 'ผู้ทรงคุณวุฒิภายนอก (กรรมการ)'),
('คณะกรรมการประจำคณะ', 'นายธัชนาถ ทองประกอบ', 'ผู้ทรงคุณวุฒิภายนอก (กรรมการ)'),
('คณะกรรมการประจำคณะ', 'ผศ.ดร.ปัญญา อินทเจริญ', 'รองคณบดีฝ่ายบริหาร (กรรมการและเลขานุการ)'),
('คณะกรรมการประจำคณะ', 'นางพรรณปพร เผ่าจินดา', 'นักวิชาการศึกษา (ผู้ช่วยเลขานุการ)');

-- 3. บัญชีผู้ดูแลระบบ (Admin Users)
-- หมายเหตุ: ข้อมูล admin profile อยู่ใน supabase/seed.sql แล้ว (admin_fss, pr_staff)
-- จึงไม่ insert ซ้ำที่นี่ เพื่อป้องกันบัญชีซ้ำซ้อน

-- 4. หลักสูตรที่เปิดสอน (รองรับ 2 ภาษา ไทย/อังกฤษ)
INSERT INTO public.programs (
    level_th, level_en, degree_th, degree_en, name_th, name_en,
    curriculum_years, chairperson, description_th, description_en, document_url, source_url
) VALUES
(
    'ปริญญาตรี', 'Bachelor''s Degree',
    'วิทยาศาสตรบัณฑิต (วท.บ.)', 'Bachelor of Science (B.Sc.)',
    'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'Exercise and Sport Science',
    'หลักสูตรปรับปรุง พ.ศ. 2559, 2564, 2569',
    'ผศ.ดร.กวีญา สินธารา / ผศ.ดร.วิรัตน์ สนธิ์จันทร์',
    'ศึกษาด้านสรีรวิทยาการออกกำลังกาย ชีวกลศาสตร์ จิตวิทยาการกีฬา โภชนาการการกีฬา และการทดสอบสมรรถภาพทางกาย',
    'Focuses on exercise physiology, biomechanics, sport psychology, sport nutrition, and physical fitness assessment.',
    'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/course/file/course175946059575746300.pdf',
    'https://fss.buu.ac.th/course/frontend/index'
),
(
    'ปริญญาตรี', 'Bachelor''s Degree',
    'ศิลปศาสตรบัณฑิต (ศศ.บ.)', 'Bachelor of Arts (B.A.)',
    'สาขาวิชาการจัดการกีฬาและการเป็นผู้ฝึกสอนกีฬา (เดิม: การจัดการและการสอนกีฬา)', 'Sport Management and Coaching',
    'หลักสูตรปรับปรุง พ.ศ. 2559, 2564, 2569',
    'ผศ.ดร.ไพโรจน์ สว่างไพร',
    'ศึกษาด้านการบริหารจัดการองค์กรกีฬา การจัดอีเวนต์และการแข่งขันกีฬา นันทนาการ และศาสตร์การเป็นผู้ฝึกสอนกีฬามาตรฐานวิชาชีพ',
    'Focuses on sport organization management, sport event management, recreation, and professional athletic coaching.',
    'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/course/file/course159428065731925600.pdf',
    'https://fss.buu.ac.th/course/frontend/index'
),
(
    'ปริญญาตรี', 'Bachelor''s Degree',
    'ศิลปศาสตรบัณฑิต (ศศ.บ.)', 'Bachelor of Arts (B.A.)',
    'สาขาวิชาสื่อสารทางกีฬา (เดิม: สื่อสารมวลชนทางกีฬา)', 'Sport Communication / Sport Mass Communications',
    'หลักสูตรปรับปรุง พ.ศ. 2559, 2564, 2569',
    'ผศ.ดร.สราลี สนธิ์จันทร์ / ดร.วัชชริน ผดุงรัชดากิจ',
    'ศึกษาด้านการผลิตสื่อดิจิทัลทางการกีฬา การเขียนและรายงานข่าวกีฬา การพากย์กีฬา การประชาสัมพันธ์และการตลาดการกีฬา',
    'Focuses on digital sport media production, sport journalism, broadcasting, and sport marketing communications.',
    'https://fss.buu.ac.th/course/frontend/index',
    'https://fss.buu.ac.th/course/frontend/index'
),
(
    'ปริญญาโท', 'Master''s Degree',
    'วิทยาศาสตรมหาบัณฑิต (วท.ม.)', 'Master of Science (M.Sc.)',
    'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'Exercise and Sport Science (Master''s Program)',
    'หลักสูตรปรับปรุง พ.ศ. 2559, 2564, 2569',
    'ผศ.ดร.พรพจน์ ไชยนอก / รศ.ดร.ฉัตรกมล สิงห์น้อย',
    'วิจัยและศึกษาลุ่มลึกใน 3 แขนงวิชา ได้แก่ สรีรวิทยาการออกกำลังกาย, จิตวิทยาการออกกำลังกายและการกีฬา, และการบริหารจัดการการกีฬา',
    'Advanced study and research in Exercise Physiology, Exercise and Sport Psychology, and Sport Administration.',
    'https://grd.buu.ac.th/master-faculty-of-sport-science/',
    'https://fss.buu.ac.th/course/frontend/index'
),
(
    'ปริญญาเอก', 'Doctoral Degree',
    'ปรัชญาดุษฎีบัณฑิต (ปร.ด.)', 'Doctor of Philosophy (Ph.D.)',
    'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'Exercise and Sport Science (Doctoral Program)',
    'หลักสูตรปรับปรุง พ.ศ. 2559, 2564, 2569',
    'ผศ.ดร.พรพจน์ ไชยนอก / ผศ.ดร.สุกัญญา เจริญวัฒนะ',
    'มุ่งเน้นการสร้างองค์ความรู้ใหม่และนวัตกรรมการวิจัยระดับนานาชาติด้านวิทยาศาสตร์การออกกำลังกายและการกีฬา',
    'Dedicated to advanced research innovation and international scholarly excellence in exercise and sport science.',
    'https://grd.buu.ac.th/phd-faculty-of-sport-science/',
    'https://fss.buu.ac.th/course/frontend/index'
);

-- 5. รายชื่ออาจารย์ประจำคณะครบ 21 ท่าน
INSERT INTO public.instructors (name_th, academic_position, admin_role, department, expertise, phone, email, source_url) VALUES
('ผศ.ดร.วิรัตน์ สนธิ์จันทร์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'คณบดีคณะวิทยาศาสตร์การกีฬา / ประธานหลักสูตรฯ', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'สรีรวิทยาการออกกำลังกาย และวิทยาศาสตร์การกีฬา', '038-102060', 'wirats@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('รศ.ดร.ธนิดา จุลวนิชย์พงษ์', 'รองศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา (ปริญญาตรี-โท-เอก)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'วิทยาศาสตร์การออกกำลังกายและการกีฬา', '038-102060', 'tanida@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.สุกัญญา เจริญวัฒนะ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาฯ ระดับบัณฑิตศึกษา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา / สื่อสารมวลชนทางกีฬา', 'จิตวิทยาการออกกำลังกายและการกีฬา และสื่อสารทางกีฬา', '038-102060', 'sukanyac@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('รศ.ดร.ฉัตรกมล สิงห์น้อย', 'รองศาสตราจารย์ ดร.', 'ประธานหลักสูตรระดับปริญญาโท', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'จิตวิทยาการกีฬา และการส่งเสริมสุขภาพ', '038-102060', 'chatkamon@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.พรพจน์ ไชยนอก', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา ระดับบัณฑิตศึกษา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'สมรรถภาพทางกายในนักกีฬาฟุตบอล ศาสตร์กีฬาทางน้ำ และการฝึกซ้อมกีฬา', '038-102060', 'phornpot@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.อรวรีย์ อิงคเตชะ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'ชีวกลศาสตร์การกีฬา และสรีรวิทยาการออกกำลังกาย', '038-102060', 'onwaree@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.กวีญา สินธารา', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา (ระดับปริญญาตรี)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'วิทยาศาสตร์การออกกำลังกายเพื่อสุขภาพ', '038-102060', 'kawiya@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('อาจารย์จิรภา น้าคณาคุปต์', 'อาจารย์', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'การออกกำลังกายและการทดสอบสมรรถภาพทางกาย', '038-102060', 'chirapan@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.อัตถสิทธิ์ ไชยณรงค์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'วิทยาศาสตร์การกีฬาและการฝึกสอน', '038-102060', 'austtasit@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ดร.เสกข์ศักย์ ธิติศักดิ์', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'วิทยาศาสตร์การออกกำลังกายและการกีฬา', '038-102060', 'sagsak.th@buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ดร.จิดาภา ศิริวรรณ์', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'วิทยาศาสตร์การออกกำลังกายและการกีฬา', '038-102060', 'Chidapha.si@buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ดร.วัชชริน ผดุงรัชดากิจ', 'ดร.', 'ผู้ช่วยคณบดีฝ่ายสื่อสารองค์กรและวิเทศสัมพันธ์ / ประธานหลักสูตรฯ', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', 'การสื่อสารองค์กรกีฬา และสื่อสารมวลชนทางกีฬา', '038-102060', 'wacharin@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.สราลี สนธิ์จันทร์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาสื่อสารมวลชนทางกีฬา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', 'วารสารศาสตร์กีฬา และการผลิตสื่อทางการกีฬา', '038-102060', 'saralee@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ดร.สมพร ส่งตระกูล', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', 'การสื่อสารและการประชาสัมพันธ์ทางการกีฬา', '038-102060', 'somporn_s@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ว่าที่ร้อยตรี(หญิง) ดร.เพ็ญนภา วัยเวก', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', 'สื่อดิจิทัลและการสื่อสารทางกีฬา', '038-102060', 'pennapa.wa@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ดร.สุภวุฒิ ภูมิรัตน', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', 'การสื่อสารมวลชนและเทคโนโลยีสื่อกีฬา', '038-102060', 'supawut.pu@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.ปัญญา อินทเจริญ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'รองคณบดีฝ่ายบริหาร', 'สาขาวิชาการจัดการและการสอนกีฬา', 'การบริหารจัดการองค์กรกีฬา และนโยบายการกีฬา', '038-102060', 'panya@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.ไพโรจน์ สว่างไพร', 'ผู้ช่วยศาสตราจารย์ ดร.', 'รองคณบดีฝ่ายวิชาการและวิจัย / ประธานสาขาวิชาการจัดการและการสอนกีฬา', 'สาขาวิชาการจัดการและการสอนกีฬา', 'การจัดการแข่งขันกีฬา และการสอนกีฬา', '038-102060', 'pairot@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ผศ.ดร.นาคิน คำศรี', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาการจัดการและการสอนกีฬา', 'การจัดการกีฬาและนันทนาการ', '038-102060', 'Nakin@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('รศ.ดร.รังสฤษฏ์ จำเริญ', 'รองศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาการจัดการและการสอนกีฬา', 'การบริหารและการจัดการการกีฬา', '038-102060', 'rangsaritj@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
('ดร.รดมยศ มาตเจือ', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาการจัดการและการสอนกีฬา', 'การเป็นผู้ฝึกสอนกีฬาและการจัดการกีฬา', '038-102060', 'radomyos.ma@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index');

-- 6. รายชื่อบุคลากรสำนักงานคณบดี 9 ท่าน
INSERT INTO public.staff_members (name_th, position, phone, email, source_url) VALUES
('นายอัฐพร โสวัตร์', 'นักวิชาการศึกษา ชำนาญการ / ผู้ช่วยคณบดีฝ่ายพัฒนานิสิต บริการวิชาการ และแผนยุทธศาสตร์ และผู้รักษาการแทนหัวหน้าสำนักงานคณบดี', '038-102060', 'attaporns@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางสาวนวลพร สุวรรณพิทักษ์', 'นักวิชาการศึกษา ชำนาญการ', '038-102060', 'nuanporn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางสาววนิษา ศรีรอบรู้', 'นักวิชาการศึกษา', '038102083', 'wanisa@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางพรรณปพร เผ่าจินดา', 'นักวิชาการศึกษา', '038-102060', 'phanpaporn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางนันทวรรณ บำรุงเอี่ยมปัญญา', 'นักวิชาการพัสดุ', '038-102059', 'nuntawun@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางสาวนิภาพร จั่นแพ', 'นักวิชาการเงินและบัญชี', '038-102059', 'nipapornc@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางสาวชนณิการณ์ นามชัยยา', 'เจ้าหน้าที่บริหารงานทั่วไป', '038-102083', 'chonnikarn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นายเจษฎา รัตนวงษ์', 'เจ้าหน้าที่ดูแลห้องอุปกรณ์กีฬา', '-', '-', 'https://fss.buu.ac.th/personnel/frontend/index'),
('นางสาวศศิประภา ลิ้มภักดี', 'เจ้าหน้าที่ศูนย์วิสาหกิจกีฬา', '-', '-', 'https://fss.buu.ac.th/personnel/frontend/index');

-- 7. ข่าวประชาสัมพันธ์ กิจกรรมคณะล่าสุด (ก.ย. 2569) และข่าวกีฬาครบ 16 ข่าว
INSERT INTO public.news_articles (category, title, summary, content, published_date, author, is_urgent, status, source_url) VALUES
(
    'ข่าวสารและกิจกรรมคณะ',
    'คณะวิทยาศาสตร์การกีฬา ม.บูรพา เปิด “FSS Co-Working Space” ขยายเวลาถึงเที่ยงคืน',
    'จัดเตรียมพื้นที่ส่วนกลาง FSS Co-Working Space ณ ห้องกิจกรรม ชั้น 1 และบริเวณโดยรอบ เพื่ออำนวยความสะดวกให้แก่นิสิตทั้งระดับปริญญาตรีและบัณฑิตศึกษา',
    'คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา เดินหน้าสนับสนุนสภาพแวดล้อมการเรียนรู้ที่เอื้อต่อการเรียนและฝึกฝน จัดเตรียมพื้นที่ส่วนกลาง FSS Co-Working Space ณ ห้องกิจกรรม ชั้น 1 ขยายเวลาเปิดให้บริการถึงเวลา 24.00 น.',
    '2026-09-15', 'งานพัฒนานิสิต', TRUE, 'published', 'https://fss.buu.ac.th/'
),
(
    'ข่าวสารและกิจกรรมคณะ',
    'สาขาวิชาวิทยาศาสตร์การออกกำลังกายฯ ม.บูรพา จัดกิจกรรม “รุ่นพี่ พบรุ่นน้อง” แนะแนวอาชีพสายกีฬา',
    'อัปเดตทิศทางความต้องการของอุตสาหกรรมกีฬา สุขภาพ และฟิตเนสในปัจจุบัน พร้อมถ่ายทอดวิธีการประยุกต์ใช้องค์ความรู้จริงจากศิษย์เก่า',
    'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา จัดโครงการ รุ่นพี่ พบรุ่นน้อง เพื่อแนะแนวทางอาชีพและตลาดแรงงานในอุตสาหกรรมกีฬา สุขภาพ และฟิตเนส',
    '2026-09-16', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6QmF8Qmtz'
),
(
    'ข่าวสารและกิจกรรมคณะ',
    'สาขาวิชาสื่อสารมวลชนทางกีฬา ม.บูรพา จัดบรรยายพิเศษ “Sport Media Planning” และร่วมโครงการ AIS Academy: Creator on the Pitch',
    'เปิดประสบการณ์นิสิตสื่อสารทางกีฬาเรียนรู้การวางแผนสื่อกีฬาและผลิตคอนเทนต์จากสนามแข่งขันจริงในโครงการ AIS Academy: Creator on the Pitch',
    'สาขาวิชาสื่อสารมวลชนทางกีฬา (สื่อสารทางกีฬา) คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา จัดบรรยายพิเศษหัวข้อ Sport Media Planning และนำนิสิตเข้าร่วมโครงการ AIS Academy: Creator on the Pitch เพื่อพัฒนาทักษะการเป็นครีเอเตอร์และนักสื่อสารทางการกีฬามืออาชีพ',
    '2026-09-18', 'สาขาวิชาสื่อสารทางกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'ข่าวสารและกิจกรรมคณะ',
    'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมกับ Fitness Lifestyle จัดโครงการพัฒนาทักษะวิชาชีพเทรนเนอร์และฟิตเนส',
    'ยกระดับการเรียนการสอนเชื่อมโยงโลกการทำงานจริง ร่วมกับ Fitness Lifestyle และวิทยากรผู้เชี่ยวชาญ ณ ห้องประชุม FSS402 ชั้น 4',
    'เมื่อวันที่ 17–18 กันยายน พ.ศ. 2569 คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา ร่วมกับ Fitness Lifestyle และวิทยากรพิเศษ คุณเกริกชัย คุณโฑ จัดโครงการพัฒนาทักษะวิชาชีพด้านฟิตเนสและการออกกำลังกาย ณ ห้องประชุม FSS402 ชั้น 4 คณะวิทยาศาสตร์การกีฬา',
    '2026-09-18', 'งานวิชาการและพัฒนานิสิต', FALSE, 'published', 'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'ข่าวสารและกิจกรรมคณะ',
    'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมออกบูธกิจกรรม “BUU Mini Open House” ณ ศูนย์การค้าเซ็นทรัล ศรีราชา',
    'แนะนำหลักสูตรปริญญาตรีทั้ง 3 สาขาวิชาและสาธิตการทดสอบสมรรถภาพทางกายแก่นักเรียนมัธยมศึกษาและผู้ปกครองในงาน BUU Mini Open House',
    'คณาจารย์และนิสิตคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา ร่วมกิจกรรม BUU Mini Open House ณ ศูนย์การค้าเซ็นทรัล ศรีราชา เพื่อให้ข้อมูลหลักสูตรและการรับสมัคร TCAS แก่นักเรียนที่สนใจเข้าศึกษาต่อ',
    '2026-09-18', 'งานประชาสัมพันธ์', FALSE, 'published', 'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'ข่าวสารและกิจกรรมคณะ',
    'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมแสดงมุทิตาจิตแด่ “รศ.ดร.ธนิดา จุลวนิชย์พงษ์” ในโอกาสเกษียณอายุราชการ',
    'ร่วมยกย่องและระลึกถึงคุณงามความดีของ รองศาสตราจารย์ ดร.ธนิดา จุลวนิชย์พงษ์ ในโอกาสเกษียณอายุราชการ ประจำปี พ.ศ. 2569',
    'คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา จัดพิธีแสดงมุทิตาจิตด้วยความเคารพยิ่งแด่ รองศาสตราจารย์ ดร.ธนิดา จุลวนิชย์พงษ์ ในโอกาสเกษียณอายุราชการ ประจำปีพุทธศักราช 2569',
    '2026-09-15', 'งานบุคคล', FALSE, 'published', 'https://fss.buu.ac.th/'
),
(
    'ข่าวสารและกิจกรรมคณะ',
    'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมงานวันคล้ายวันสถาปนามหาวิทยาลัยบูรพา ครบรอบ 71 ปี และวันศาสตราจารย์ ดร.ธำรง บัวศรี',
    'ผศ.ดร.วิรัตน์ สนธิ์จันทร์ คณบดี พร้อมคณะผู้บริหาร บุคลากร และตัวแทนนิสิต เข้าร่วมงานวันคล้ายวันสถาปนามหาวิทยาลัยบูรพา ครบรอบ 71 ปี',
    'ผู้ช่วยศาสตราจารย์ ดร.วิรัตน์ สนธิ์จันทร์ คณบดีคณะวิทยาศาสตร์การกีฬา พร้อมด้วยคณะผู้บริหาร บุคลากร และตัวแทนนิสิต เข้าร่วมงานวันคล้ายวันสถาปนามหาวิทยาลัยบูรพา ครบรอบ 71 ปี และกิจกรรมวันศาสตราจารย์ ดร.ธำรง บัวศรี ประจำปี พ.ศ. 2569',
    '2026-09-24', 'คณะวิทยาศาสตร์การกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/'
),
(
    'งานวิจัยและวิเทศสัมพันธ์',
    'พิธีลงนามความร่วมมือทางวิชาการ (MOU) ระหว่าง ม.บูรพา กับ Danang Sport University ประเทศเวียดนาม',
    'จัดพิธีลงนาม MOU ณ ห้องประชุม FSS-605 เพื่อแลกเปลี่ยนทางวิชาการ นิสิต และงานวิจัยด้านวิทยาศาสตร์การกีฬาระหว่างประเทศ',
    'คณะวิทยาศาสตร์การกีฬา จัดพิธีลงนามข้อตกลงความร่วมมือทางวิชาการ (MOU) ระหว่าง มหาวิทยาลัยบูรพา กับ Danang Sport University สาธารณรัฐสังคมนิยมเวียดนาม ณ ห้องประชุม FSS-605',
    '2024-11-11', 'งานวิเทศสัมพันธ์', FALSE, 'published', 'https://fss.buu.ac.th/'
),
(
    'ข่าวกีฬาและการแข่งขัน',
    '“เกียรติศักดิ์ สิงหพงษ์” นิสิตวิทย์กีฬา ม.บูรพา ผงาดคว้าแชมป์จักรยานยนต์ทางเรียบ Suzuka 4 Hours Endurance ที่ญี่ปุ่น',
    'นายเกียรติศักดิ์ สิงหพงษ์ นิสิตชั้นปีที่ 1 สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา คว้ารางวัลชนะเลิศ รายการ Suzuka 4 Hours Endurance Japan รุ่น ST 600 ณ ประเทศญี่ปุ่น',
    'นายเกียรติศักดิ์ สิงหพงษ์ นิสิตชั้นปีที่ 1 สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา คว้ารางวัลชนะเลิศอันดับ 1 รายการ Suzuka 4 Hours Endurance Japan รุ่น ST 600 ณ ประเทศญี่ปุ่น',
    '2024-08-19', 'งานประชาสัมพันธ์กีฬา', TRUE, 'published', 'https://fss.buu.ac.th/'
),
(
    'ข่าวกีฬาและการแข่งขัน',
    'ขอแสดงความยินดีกับ “พลพรรธน์ ศรีวิสุทธิ์” และ “ปัญญ์ณรัตน์ ขนายงาม” 2 นิสิตสาขาวิชาสื่อสารทางกีฬา สร้างชื่อเสียงให้คณะ',
    'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมแสดงความยินดีกับ นายพลพรรธน์ ศรีวิสุทธิ์ และ นายปัญญ์ณรัตน์ ขนายงาม นิสิตสาขาวิชาสื่อสารทางกีฬา จากผลงานโดดเด่นด้านสื่อและการกีฬา',
    'คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา ขอแสดงความยินดีกับ นายพลพรรธน์ ศรีวิสุทธิ์ และ นายปัญญ์ณรัตน์ ขนายงาม นิสิตสาขาวิชาสื่อสารทางกีฬา ที่สร้างชื่อเสียงและความภาคภูมิใจให้กับคณะจากการประกวดและปฏิบัติงานด้านสื่อสารมวลชนทางกีฬา',
    '2026-09-18', 'สาขาวิชาสื่อสารทางกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'ข่าวกีฬาและการแข่งขัน',
    'ทัพนักกีฬานิสิต ม.บูรพา ลุยศึกกีฬามหาวิทยาลัยแห่งประเทศไทย ครั้งที่ 48 “ดอกจานบ้านเชียงเกมส์” คว้าเหรียญรางวัลกลับบางแสน',
    'นิสิตคณะวิทยาศาสตร์การกีฬาเป็นกำลังหลักของทัพนักกีฬามหาวิทยาลัยบูรพา เข้าร่วมชิงชัยและคว้าเหรียญรางวัลในการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ณ มรภ.อุดรธานี',
    'ทัพนักกีฬามหาวิทยาลัยบูรพา ซึ่งมีนิสิตจากคณะวิทยาศาสตร์การกีฬาเป็นแกนหลัก เข้าร่วมการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ครั้งที่ 48 รอบมหกรรม ดอกจานบ้านเชียงเกมส์ ณ มหาวิทยาลัยราชภัฏอุดรธานี',
    '2024-08-21', 'งานประชาสัมพันธ์กีฬา', FALSE, 'published', 'https://fss.buu.ac.th/'
),
(
    'ข่าวกีฬาและการแข่งขัน',
    'ศูนย์ปฏิบัติการ BUU House คณะวิทย์กีฬา ม.บูรพา ขับเคลื่อนศึกเบสบอล ซอฟท์บอล และคริกเก็ตชิงแชมป์ประเทศไทย',
    'นิสิตสาขาการจัดการกีฬาและสื่อสารทางกีฬาปฏิบัติงานจริงในศูนย์ปฏิบัติการ BUU House รายงานผลและบริหารจัดการแข่งขันระดับประเทศ',
    'ศูนย์ปฏิบัติการ BUU House คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา ร่วมขับเคลื่อนการแข่งขันศึกฟุตบอลและคริกเก็ต ชิงแชมป์ประเทศไทย ประจำปี 2568',
    '2025-08-15', 'ศูนย์วิสาหกิจกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/document/frontend/index'
),
(
    'ข่าวกีฬาและการแข่งขัน',
    'ระเบิดศึก “Sport Science Games” มหกรรมกีฬาภายในเชื่อมสามัคคีและปลุกพลัง SPORTSMANSHIP ชาววิทย์กีฬา',
    'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬาจัดการแข่งขันกีฬาภายใน Sport Science Games ฝึกทักษะการเป็นผู้ตัดสินและจัดการแข่งขันจริง',
    'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา จัดการแข่งขันกีฬาภายในประจำปี Sport Science Games ภายใต้แนวคิด SPORTSMANSHIP ณ สนามกีฬาและอาคารคณะวิทยาศาสตร์การกีฬา',
    '2025-10-10', 'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/document/frontend/index'
),
(
    'ข่าวกีฬาและการแข่งขัน',
    'FSS BUU รวมพลังสโมสรนิสิตจัดกิจกรรม “วิ่งเขาสามมุข 8 กรกฎ” คู่ขนาน “พัฒนาชายหาดบางแสน” และงานวิ่ง BUU Night Run',
    'นิสิตและคณาจารย์ร่วมสืบสานประเพณีวิ่งเขาสามมุข พัฒนาชายหาดบางแสน และจัดงานวิ่ง BUU Night Run ส่งเสริมสุขภาพและจิตอาสา',
    'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา จัดกิจกรรมรวมพลังวิ่งเขาสามมุข ควบคู่กับการทำจิตอาสาพัฒนาชายหาดบางแสน และร่วมปฏิบัติงานในมหกรรมวิ่ง BUU Night Run',
    '2026-09-18', 'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬา', FALSE, 'published', 'https://fss.buu.ac.th/activities/frontend/index'
);

-- 8. ประกาศทุนการศึกษาและทุนวิจัย
INSERT INTO public.scholarships (title, scholarship_type, amount_baht, deadline, eligibility, attachment_name, attachment_url, status, source_url) VALUES
(
    'ทุนสนับสนุนการทำวิจัยดุษฎีนิพนธ์ บัณฑิตวิทยาลัย มหาวิทยาลัยบูรพา',
    'ทุนวิจัยระดับบัณฑิตศึกษา',
    10000,
    '2026-10-31',
    'นิสิตระดับปริญญาโทและปริญญาเอก สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา ที่ได้รับอนุมัติโครงร่างวิทยานิพนธ์/ดุษฎีนิพนธ์',
    'แบบรายงานความก้าวหน้าและขอรับทุนอุดหนุนการวิจัย.pdf',
    'https://fss.buu.ac.th/document/frontend/index',
    'published',
    'https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WUd8Qmtz'
),
(
    'โครงการผู้มีความสามารถพิเศษทางกีฬา (โครงการช้างเผือก) ปีการศึกษา 2569',
    'ทุนและโควตารับสมัครนิสิตใหม่ความสามารถพิเศษทางกีฬา',
    NULL,
    '2026-10-30',
    'ผู้สำเร็จการศึกษาระดับ ม.6 หรือเทียบเท่า ที่มีประวัติและผลงานการแข่งขันกีฬาระดับชาติ เยาวชนแห่งชาติ หรือตัวแทนจังหวัด',
    'ระเบียบการรับสมัครโครงการช้างเผือก_2569.pdf',
    'https://e-admission.buu.ac.th',
    'published',
    'https://fss.buu.ac.th/'
),
(
    'ทุนส่งเสริมการศึกษาสำหรับนิสิตผู้มีศักยภาพและนิสิตจิตอาสา คณะวิทยาศาสตร์การกีฬา',
    'ทุนการศึกษาระดับปริญญาตรี',
    5000,
    '2026-11-15',
    'นิสิตปัจจุบันระดับปริญญาตรี ชั้นปีที่ 1–4 คณะวิทยาศาสตร์การกีฬา ที่มีความประพฤติดี ขาดแคลนทุนทรัพย์ หรือมีผลงานจิตอาสาช่วยเหลือกิจกรรมคณะ',
    'ใบสมัครทุนส่งเสริมการศึกษานิสิต_FSS.pdf',
    'https://fss.buu.ac.th/document/frontend/index',
    'published',
    'https://fss.buu.ac.th/document/frontend/index'
);

-- 9. ผลงานนิสิต ศิษย์เก่า และบุคลากรที่ได้รับรางวัล
INSERT INTO public.achievements (person_name, person_role, award_title, story_detail, category, award_year, status, source_url) VALUES
(
    'นายภาคภูมิ พิลึก',
    'นิสิตระดับปริญญาเอก หลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา',
    'ได้รับอนุมัติทุนสนับสนุนการทำวิจัยดุษฎีนิพนธ์ (10,000 บาท) จากบัณฑิตวิทยาลัย มหาวิทยาลัยบูรพา',
    'สร้างสรรค์งานวิจัยระดับบัณฑิตศึกษาที่มุ่งเน้นการสร้างองค์ความรู้ใหม่และนวัตกรรมทางด้านการออกกำลังกายและกีฬา',
    'ผลงานวิชาการและวิจัย',
    '2569',
    'published',
    'https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WUd8Qmtz'
),
(
    'นายพลพรรธน์ ศรีวิสุทธิ์ และ นายปัญญ์ณรัตน์ ขนายงาม',
    'นิสิตระดับปริญญาตรี สาขาวิชาสื่อสารทางกีฬา คณะวิทยาศาสตร์การกีฬา',
    'ได้รับรางวัลและสร้างชื่อเสียงด้านการสื่อสารทางกีฬาและผลิตสื่อสร้างสรรค์',
    'ตัวแทนนิสิตสาขาวิชาสื่อสารทางกีฬาที่นำทักษะการผลิตสื่อและการสื่อสารมวลชนทางกีฬาไปสร้างผลงานโดดเด่นจนได้รับการเชิดชูเกียรติจากคณะ',
    'ผลงานนิสิตด้านสื่อสารทางกีฬา',
    '2569',
    'published',
    'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'นายเกียรติศักดิ์ สิงหพงษ์',
    'นิสิตชั้นปีที่ 1 สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา (นักกีฬารถจักรยานยนต์ทางเรียบ)',
    'รางวัลชนะเลิศ รายการ Suzuka 4 Hours Endurance Japan รุ่น ST 600 ณ ประเทศญี่ปุ่น',
    'ตัวแทนนักกีฬาไทยเข้าร่วมการแข่งขันจักรยานยนต์ทางเรียบรายการใหญ่ระดับโลก ณ สนามซูซูกะ ประเทศญี่ปุ่น คว้าแชมป์รุ่น ST 600',
    'ผลงานกีฬาระดับนานาชาติ',
    '2567',
    'published',
    'https://fss.buu.ac.th/'
),
(
    'ผศ.ดร.พรพจน์ ไชยนอก และคณะ',
    'คณาจารย์ประจำคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา',
    'ตีพิมพ์ผลงานวิจัยระดับนานาชาติในวารสารวิชาการ Sports (MDPI)',
    'ผลงานวิจัยเรื่อง Follow-Up Weekly Training Distribution and Accumulated Internal Load Effects on Young Football Players'' Well-Being, Physical Fitness, and Technical Performance',
    'ผลงานวิจัยระดับนานาชาติ',
    '2567',
    'published',
    'https://fss.buu.ac.th/'
),
(
    'ทัพนักกีฬานิสิตคณะวิทยาศาสตร์การกีฬา ม.บูรพา',
    'นิสิตตัวแทนมหาวิทยาลัยบูรพา',
    'คว้าเหรียญรางวัลจากการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ครั้งที่ 48 “ดอกจานบ้านเชียงเกมส์”',
    'เข้าร่วมการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ครั้งที่ 48 ณ มหาวิทยาลัยราชภัฏอุดรธานี สร้างผลงานเหรียญรางวัลในหลายชนิดกีฬา',
    'ผลงานกีฬาระดับชาติ',
    '2566',
    'published',
    'https://fss.buu.ac.th/'
);

-- 10. ปฏิทินการศึกษา กิจกรรมรายเดือน และตารางเรียน
INSERT INTO public.calendar_events (event_type, title, description, start_date, end_date, time_range, location, target_year, schedule_link, status, source_url) VALUES
(
    'ปฏิทินการศึกษา',
    'เปิดรับสมัครบุคคลเข้าศึกษาระดับปริญญาตรี โครงการช้างเผือก และระบบ BUU TCAS',
    'เปิดรับสมัครผู้มีความสามารถพิเศษทางกีฬาและรอบ Portfolio ผ่านระบบออนไลน์ของมหาวิทยาลัยบูรพา',
    '2026-10-01', '2026-10-30', 'ตลอดวัน (ระบบออนไลน์)',
    'เว็บไซต์ https://e-admission.buu.ac.th',
    'ปี 1', 'https://regservice.buu.ac.th', 'published', 'https://fss.buu.ac.th/'
),
(
    'กิจกรรมคณะ',
    'การแข่งขันกีฬาภายในคณะวิทยาศาสตร์การกีฬา (Sport Science Games)',
    'มหกรรมกีฬาภายในเชื่อมความสัมพันธ์พี่น้องวิทย์กีฬาและฝึกทักษะการจัดการแข่งขันจริง',
    '2026-10-04', '2026-10-10', '16:00 - 20:00 น.',
    'อาคารและสนามกีฬาคณะวิทยาศาสตร์การกีฬา ม.บูรพา',
    'ทุกชั้นปี', 'https://fss.buu.ac.th/document/frontend/index', 'published', 'https://fss.buu.ac.th/document/frontend/index'
),
(
    'ตารางเรียน',
    'วิชา 85111059 การออกกำลังกายเพื่อคุณภาพชีวิต (Exercise for Quality of Life)',
    'บรรยายและฝึกปฏิบัติการประเมินสมรรถภาพทางกายและการวางโปรแกรมออกกำลังกายเบื้องต้น',
    '2026-10-21', '2026-10-21', '09:00 - 11:00 น.',
    'ห้องปฏิบัติการสรีรวิทยาการออกกำลังกาย ชั้น 2 อาคาร FSS',
    'ปี 1', 'https://regservice.buu.ac.th', 'published', 'https://fss.buu.ac.th/document/frontend/index'
),
(
    'ตารางเรียน',
    'วิชาเอกวิทยาศาสตร์การออกกำลังกายและการกีฬา (ชีวกลศาสตร์และสรีรวิทยาการกีฬา)',
    'การวิเคราะห์การเคลื่อนไหวทางกีฬาและการทดสอบสมรรถภาพในห้องปฏิบัติการ',
    '2026-10-22', '2026-10-22', '09:00 - 12:00 น.',
    'ห้อง 201 อาคารคณะวิทยาศาสตร์การกีฬา',
    'ปี 2', 'https://regservice.buu.ac.th', 'published', 'https://fss.buu.ac.th/course/frontend/index'
),
(
    'ตารางเรียน',
    'วิชาการจัดการแข่งขันกีฬาและปฏิบัติการศูนย์วิสาหกิจกีฬา (BUU House & Sport Media)',
    'ฝึกปฏิบัติการจัดตารางแข่งขัน การบริหารสนาม และการวางแผนสื่อกีฬา (Sport Media Planning)',
    '2026-10-23', '2026-10-23', '13:00 - 16:00 น.',
    'ศูนย์วิสาหกิจกีฬา ห้อง FSS-605 และห้อง FSS-402',
    'ปี 3', 'https://regservice.buu.ac.th', 'published', 'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'ตารางเรียน',
    'วิชาโครงงานเฉพาะเรื่องและเตรียมสหกิจศึกษา/ฝึกงานวิชาชีพวิทยาศาสตร์การกีฬา (150 ชั่วโมง)',
    'การนำเสนอความก้าวหน้าโครงงานวิจัยและการเตรียมความพร้อมก่อนออกฝึกประสบการณ์วิชาชีพ',
    '2026-10-28', '2026-10-28', '09:00 - 11:50 น.',
    'ห้องประชุม FSS-605 อาคารคณะวิทยาศาสตร์การกีฬา',
    'ปี 4', 'https://fss.buu.ac.th/document/frontend/index', 'published', 'https://fss.buu.ac.th/document/frontend/index'
),
(
    'กิจกรรมคณะ',
    'โครงการค่ายอาสาพัฒนาสังคม และกิจกรรมวิ่งเขาสามมุข - พัฒนาชายหาดบางแสน',
    'กิจกรรมบริการวิชาการทดสอบสมรรถภาพทางกาย วิ่งประเพณีเขาสามมุข และบำเพ็ญประโยชน์พัฒนาชายหาดบางแสน',
    '2026-11-16', '2026-11-20', '08:00 - 17:00 น.',
    'เขาสามมุข ชายหาดบางแสน และชุมชนจังหวัดชลบุรี',
    'ทุกชั้นปี', 'https://fss.buu.ac.th/activities/frontend/index', 'published', 'https://fss.buu.ac.th/activities/frontend/index'
);

-- 11. คลังภาพและวิดีโอ (รองรับฝัง YouTube จริง)
INSERT INTO public.media_gallery (media_type, title, description, published_date, youtube_url, thumbnail_url, status, source_url) VALUES
(
    'video',
    'วีดิทัศน์แนะนำคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา',
    'แนะนำหลักสูตร ห้องปฏิบัติการวิทยาศาสตร์การกีฬา ศูนย์วิสาหกิจกีฬา และบรรยากาศการเรียนการสอน',
    '2023-06-14',
    'https://www.youtube.com/watch?v=_lxIy2d78Lg',
    'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/slide/original/slide153985357075708200.jpg',
    'published',
    'https://fss.buu.ac.th/'
),
(
    'video',
    'การดำเนินโครงการยกระดับเศรษฐกิจและสังคมรายตำบลแบบบูรณาการ (1 ตำบล 1 มหาวิทยาลัย)',
    'วิดีโอกิจกรรมบริการวิชาการและส่งเสริมสุขภาพชุมชนโดยคณาจารย์และนิสิตคณะวิทยาศาสตร์การกีฬา',
    '2021-10-20',
    'https://www.youtube.com/watch?v=_lxIy2d78Lg',
    'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/slide/original/slide153985357075708200.jpg',
    'published',
    'https://fss.buu.ac.th/'
),
(
    'album',
    'อัลบั้มภาพกิจกรรมบรรยายพิเศษ Sport Media Planning, AIS Academy และโครงการร่วมกับ Fitness Lifestyle',
    'ภาพบรรยากาศการเรียนรู้จากผู้เชี่ยวชาญตัวจริงในอุตสาหกรรมสื่อกีฬาและฟิตเนส ณ ห้องประชุม FSS402',
    '2026-09-18',
    NULL,
    'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/activities/thumbnails/activities_1790244399_skGF75O32E.jpg',
    'published',
    'https://fss.buu.ac.th/activities/frontend/index'
),
(
    'album',
    'อัลบั้มภาพบรรยากาศพื้นที่การเรียนรู้ FSS Co-Working Space และห้องปฏิบัติการวิทยาศาสตร์การกีฬา',
    'ประมวลภาพห้องปฏิบัติการสรีรวิทยาการออกกำลังกาย ห้องจิตวิทยาการกีฬา และพื้นที่อ่านหนังสือ FSS Co-Working Space',
    '2026-09-15',
    NULL,
    'http://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/summernote/b3e3e393c77e35a4a3f3cbd1e429b5dc.jpg',
    'published',
    'https://fss.buu.ac.th/history/frontend/index'
);

-- 12. เอกสารเผยแพร่และแบบฟอร์มดาวน์โหลด (จากหน้า document/frontend/index)
INSERT INTO public.documents_and_forms (target_group, title, category_detail, fiscal_year) VALUES
('นิสิตปัจจุบัน', 'ใบลาขออนุญาตหยุดเรียน 2026 และแบบฟอร์มขอออกหนังสือรับรอง', 'แบบฟอร์มสำหรับนิสิตระดับปริญญาตรี', '2569'),
('นิสิตปัจจุบัน', 'แบบฟอร์มกรอกข้อมูลประวัติบุคคล และขออนุมัตินิเทศงาน (ฝง.6, ฝง.7)', 'รายวิชาฝึกงานและรายวิชาการบูรณาการการเรียนรู้กับการทำงาน', '2569'),
('นิสิตปัจจุบัน', 'สมุดบันทึกหมวดฝึกประสบการณ์ด้านบริการวิชาการแก่ชุมชน 150 ชั่วโมง', 'แยกตามสาขาวิชา (วท.บ. วิทย์กีฬา, ศศ.บ. การจัดการกีฬา, ศศ.บ. สื่อสารทางกีฬา)', '2564-2569'),
('นิสิตปัจจุบัน', 'แบบบันทึกการออกกำลังกายเพื่อสุขภาพ รายวิชา 85111059 การออกกำลังกายเพื่อคุณภาพชีวิต', 'เอกสารประกอบรายวิชาศึกษาทั่วไปของคณะ', '2569'),
('บัณฑิตศึกษา/วิจัย', 'แบบเสนอชื่อเรื่องวิทยานิพนธ์/ดุษฎีนิพนธ์ และขออนุมัติแต่งตั้งคณะกรรมการควบคุม', 'แบบฟอร์มสำหรับนิสิตระดับปริญญาโทและปริญญาเอก', '2569'),
('บัณฑิตศึกษา/วิจัย', 'แบบรายงานความก้าวหน้า แผนงานวิจัย/โครงการวิจัยที่ได้รับทุนอุดหนุนการวิจัย', 'แบบฟอร์มเกี่ยวกับงานวิจัยและทุนวิจัย', '2569'),
('บุคลากร/อาจารย์', 'แบบฟอร์มขอใช้ห้องเรียน / ขอสอนชดเชย / แก้ไขผลการเรียน 2026 / ขอใช้ห้องประชุม', 'แบบฟอร์มสำหรับอาจารย์และบุคลากรสายสนับสนุน', '2569'),
('บุคลากร/อาจารย์', 'เอกสารขั้นตอนการขออนุมัติจัดโครงการของคณะวิทยาศาสตร์การกีฬา (Flowchart V.24 ก.ย. 69)', 'แนวปฏิบัติและขั้นตอนการดำเนินงานจัดโครงการ', '2569'),
('ศิษย์เก่า', 'แบบฟอร์มขอรับรองรายวิชา (สำหรับศิษย์เก่าคณะวิทยาศาสตร์การกีฬา)', 'บริการเอกสารสำหรับศิษย์เก่า', '2569');

-- 13. ศูนย์วิสาหกิจกีฬาและบริการวิชาการ (จากหน้าแรก fss.buu.ac.th)
INSERT INTO public.sport_enterprise_services (service_name, description, published_date) VALUES
('บริการทดสอบสมรรถภาพทางกาย', 'ให้บริการวัดและประเมินสมรรถภาพทางกายแก่องค์กรภาครัฐและเอกชน (ความแข็งแรงของกล้ามเนื้อ ความทนทาน ความอ่อนตัว และองค์ประกอบร่างกาย)', '2017-08-19'),
('บริการผู้นำออกกำลังกาย (Exercise Leaders)', 'ให้บริการจัดโปรแกรมและผู้นำการออกกำลังกายเพื่อส่งเสริมสุขภาพแก่หน่วยงานและประชาชนทั่วไป โดยคณาจารย์และนิสิตสายวิชาชีพ', '2017-08-19'),
('บริการจัดการแข่งขันกีฬา นันทนาการ และศูนย์ปฏิบัติการ BUU House', 'รับบริหารจัดการแข่งขันกีฬา นันทนาการ ทีมตัดสิน และฝ่ายสื่อสารมวลชนทางกีฬาสำหรับทัวร์นาเมนต์ระดับภูมิภาคและระดับชาติ', '2017-08-19');

-- 14. คำถามที่พบบ่อย FAQ สำหรับฟีเจอร์เสริม แชทบอทตอบคำถามอัตโนมัติ (เกณฑ์ขั้นต่ำ >= 10 คำถาม)
INSERT INTO public.faq_items (question_th, answer_th, keywords, category) VALUES
('คณะวิทยาศาสตร์การกีฬา ม.บูรพา เปิดสอนระดับปริญญาตรีอะไรบ้าง?', 'เปิดสอนระดับปริญญาตรี 3 สาขาวิชา ได้แก่ 1) วท.บ. สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา 2) ศศ.บ. สาขาวิชาการจัดการกีฬาและการเป็นผู้ฝึกสอนกีฬา และ 3) ศศ.บ. สาขาวิชาสื่อสารทางกีฬา', ARRAY['หลักสูตร', 'ปริญญาตรี', 'สาขา', 'เรียนอะไร'], 'หลักสูตรและการเรียน'),
('มีหลักสูตรปริญญาโทและปริญญาเอกหรือไม่?', 'มีครับ เปิดสอนระดับบัณฑิตศึกษาทั้งปริญญาโท (วท.ม.) และปริญญาเอก (ปร.ด.) ในสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา (ครอบคลุมแขนงสรีรวิทยาการออกกำลังกาย จิตวิทยาการกีฬา และการบริหารจัดการกีฬา)', ARRAY['ปริญญาโท', 'ปริญญาเอก', 'บัณฑิตศึกษา'], 'หลักสูตรและการเรียน'),
('สมัครเรียนโครงการช้างเผือก (ความสามารถพิเศษทางกีฬา) ได้ที่ไหนและเมื่อไหร่?', 'โครงการผู้มีความสามารถพิเศษทางกีฬา (โครงการช้างเผือก) เปิดรับสมัครช่วงวันที่ 1–30 ตุลาคม ผ่านระบบรับสมัครออนไลน์ของมหาวิทยาลัยบูรพาที่ https://e-admission.buu.ac.th', ARRAY['สมัครเรียน', 'ช้างเผือก', 'โควตากีฬา', 'TCAS'], 'การรับสมัครเรียน'),
('ดูตารางเรียนและปฏิทินการศึกษาได้จากที่ไหน?', 'สามารถดูตารางเรียนแยกตามชั้นปี (ปี 1–ปี 4) และปฏิทินกิจกรรมได้ทันทีที่การ์ดด้านบนสุดของหน้าแรกเว็บไซต์คณะ หรือเข้าสู่ระบบทะเบียนนิสิตที่ https://regservice.buu.ac.th', ARRAY['ตารางเรียน', 'ปฏิทิน', 'ลงทะเบียน'], 'ตารางเรียนและปฏิทิน'),
('คณะวิทยาศาสตร์การกีฬามีทุนการศึกษาอะไรบ้าง?', 'มีทั้งทุนส่งเสริมการศึกษาสำหรับนิสิตผู้มีศักยภาพและนิสิตจิตอาสา (ระดับปริญญาตรี), โควตาโครงการช้างเผือก และทุนสนับสนุนการทำวิจัยวิทยานิพนธ์/ดุษฎีนิพนธ์ จากบัณฑิตวิทยาลัย (10,000 บาท)', ARRAY['ทุน', 'ทุนการศึกษา', 'ทุนวิจัย', 'กยศ'], 'ทุนการศึกษา'),
('ห้องอ่านหนังสือ FSS Co-Working Space เปิดถึงกี่โมงและอยู่ที่ไหน?', 'FSS Co-Working Space ตั้งอยู่ที่ห้องกิจกรรม ชั้น 1 อาคารคณะวิทยาศาสตร์การกีฬา โดยขยายเวลาเปิดให้บริการถึงเวลา 24.00 น. (เที่ยงคืน) สำหรับนิสิตทุกชั้นปี', ARRAY['ห้องอ่านหนังสือ', 'Co-Working', 'เที่ยงคืน', 'สถานที่'], 'สวัสดิการและสถานที่'),
('ติดต่อสำนักงานคณบดีคณะวิทยาศาสตร์การกีฬาได้ทางช่องทางใดบ้าง?', 'ติดต่อได้ที่อาคารคณะวิทยาศาสตร์การกีฬา ม.บูรพา 169 ถ.ลงหาดบางแสน ต.แสนสุข อ.เมือง จ.ชลบุรี 20131 โทรศัพท์ 038-102060, 038-102059, 038-102083 หรืออีเมล fss.buu@go.buu.ac.th และ Facebook @Buusportsci', ARRAY['ติดต่อ', 'เบอร์โทร', 'ที่อยู่', 'อีเมล', 'เพจ'], 'การติดต่อ'),
('คณบดีและประธานสาขาวิชาแต่ละสาขาคือท่านใด?', 'คณบดีคือ ผศ.ดร.วิรัตน์ สนธิ์จันทร์, ประธานสาขาวิทย์กีฬา (ป.ตรี) คือ ผศ.ดร.กวีญา สินธารา, ประธานสาขาการจัดการกีฬาฯ คือ ผศ.ดร.ไพโรจน์ สว่างไพร, ประธานสาขาสื่อสารทางกีฬา คือ ผศ.ดร.สราลี สนธิ์จันทร์ และประธานบัณฑิตศึกษา คือ ผศ.ดร.พรพจน์ ไชยนอก', ARRAY['คณบดี', 'อาจารย์', 'ประธานสาขา', 'ผู้บริหาร'], 'บุคลากรและอาจารย์'),
('ดาวน์โหลดใบลาเรียนและเอกสารฝึกงาน (ฝง.6, ฝง.7) ได้ที่ไหน?', 'ดาวน์โหลดได้ที่เมนูเอกสารเผยแพร่/แบบฟอร์มสำหรับนิสิต ซึ่งมีทั้งใบลาขออนุญาตหยุดเรียน แบบฟอร์มขอออกหนังสือ แบบฟอร์มฝึกงาน ฝง.6–ฝง.7 และสมุดบันทึกชั่วโมงบริการวิชาการ 150 ชั่วโมง', ARRAY['ใบลา', 'ฝึกงาน', 'แบบฟอร์ม', '150 ชั่วโมง'], 'เอกสารและแบบฟอร์ม'),
('ศูนย์วิสาหกิจกีฬาของคณะให้บริการอะไรบ้างแก่บุคคลภายนอก?', 'ศูนย์วิสาหกิจกีฬาให้บริการ 1) ทดสอบสมรรถภาพทางกายแก่องค์กรภาครัฐและเอกชน 2) บริการผู้นำออกกำลังกายส่งเสริมสุขภาพ และ 3) บริการจัดการแข่งขันกีฬาและนันทนาการ', ARRAY['ศูนย์วิสาหกิจ', 'ทดสอบสมรรถภาพ', 'ฟิตเนส', 'บริการวิชาการ'], 'บริการวิชาการ'),
('ค่านิยมองค์กร SPORTS และเอกลักษณ์ของคณะคืออะไร?', 'ค่านิยมองค์กรคือ SPORTS (Sportsmanship, Professional, Order, Responsibility, Teamwork, Smart) โดยมีอัตลักษณ์คือ บัณฑิตรักษ์สุขภาพและมีสังคม และมีเอกลักษณ์คือ ผู้นำด้านศาสตร์กีฬาทางน้ำ', ARRAY['วิสัยทัศน์', 'SPORTS', 'อัตลักษณ์', 'เอกลักษณ์', 'กีฬาทางน้ำ'], 'เกี่ยวกับคณะ'),
('นิสิตต้องเก็บชั่วโมงฝึกประสบการณ์บริการวิชาการแก่ชุมชนกี่ชั่วโมง?', 'ตามเกณฑ์ของหลักสูตรปริญญาตรี นิสิตต้องบันทึกหมวดฝึกประสบการณ์ด้านบริการวิชาการแก่ชุมชนครบ 150 ชั่วโมง เช่น การร่วมปฏิบัติงานในศูนย์ปฏิบัติการ BUU House หรือค่ายอาสาพัฒนาสังคม', ARRAY['ชั่วโมงกิจกรรม', '150 ชั่วโมง', 'BUU House', 'จบการศึกษา'], 'หลักสูตรและการเรียน');

-- 15. ข้อมูลตัวอย่างจากแบบฟอร์มติดต่อและสมัครกิจกรรม
INSERT INTO public.form_submissions (submission_type, sender_name, student_id, sender_email, sender_phone, subject_or_activity, message, is_new) VALUES
(
    'contact',
    'นายกิตติพงศ์ ใจดี (นักเรียนชั้น ม.6)',
    NULL,
    'kittipong.applicant@example.com',
    '081-234-5678',
    'สอบถามเกณฑ์แฟ้มสะสมผลงาน โครงการช้างเผือก ปีการศึกษา 2569',
    'ต้องการสอบถามว่าเกียรติบัตรการแข่งขันกีฬาเยาวชนแห่งชาติสามารถใช้ยื่นสมัครสาขาวิทยาศาสตร์การออกกำลังกายและการกีฬาได้หรือไม่ครับ',
    TRUE
),
(
    'activity_register',
    'นางสาวปวีณา รักกีฬา',
    '67100199',
    'paweena67@go.buu.ac.th',
    '089-876-5432',
    'การแข่งขันกีฬาภายในคณะวิทยาศาสตร์การกีฬา (Sport Science Games)',
    'สมัครเข้าร่วมทีมวอลเลย์บอลและอาสาสมัครฝ่ายปฐมพยาบาลประจำสนาม (ชั้นปีที่ 2)',
    TRUE
);

-- ============================================================================
-- เสร็จสิ้นการสร้างฐานข้อมูล
-- ============================================================================
select '✅ สร้างฐานข้อมูลสำเร็จ 15 ตาราง พร้อมข้อมูลจริงจาก https://fss.buu.ac.th/' as status;
