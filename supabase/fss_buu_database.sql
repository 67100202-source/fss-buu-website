-- ============================================================================
-- ฐานข้อมูลจริง (Real Database Seed) ดึงข้อมูลจาก https://fss.buu.ac.th/
-- สำหรับโปรเจคต้นแบบเว็บไซต์คณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา (BUU | FSS)
-- รองรับทั้ง 9 หน้าบังคับ + ฟีเจอร์บังคับ 4 รายการ + ระบบผู้ดูแล (Admin CRUD)
-- ============================================================================

DROP TABLE IF EXISTS form_submissions;
DROP TABLE IF EXISTS media_gallery;
DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS scholarships;
DROP TABLE IF EXISTS news_articles;
DROP TABLE IF EXISTS staff_members;
DROP TABLE IF EXISTS instructors;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS admin_users;

-- 1. ตารางผู้ดูแลระบบ (Admin Users - สำหรับล็อกอินเข้าหน้า Admin)
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    email VARCHAR(100)
);

-- 2. ตารางหลักสูตร (Programs - หน้าหลักสูตรและอาจารย์)
CREATE TABLE programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level VARCHAR(50) NOT NULL,
    degree_th VARCHAR(100) NOT NULL,
    degree_en VARCHAR(100) NOT NULL,
    name_th VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    curriculum_years VARCHAR(50),
    chairperson VARCHAR(150),
    description TEXT,
    source_url VARCHAR(255)
);

-- 3. ตารางอาจารย์ประจำคณะ (Instructors - หน้าหลักสูตรและอาจารย์ & ระบบค้นหาภาษาไทย)
CREATE TABLE instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th VARCHAR(150) NOT NULL,
    academic_position VARCHAR(100),
    admin_role VARCHAR(200),
    department VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    source_url VARCHAR(255)
);

-- 4. ตารางบุคลากรสำนักงานคณบดี (Staff Members)
CREATE TABLE staff_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th VARCHAR(150) NOT NULL,
    position VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    source_url VARCHAR(255)
);

-- 5. ตารางข่าวสาร กิจกรรม และข่าวกีฬา (News & Sports Articles - จัดการ CRUD ผ่าน Admin)
CREATE TABLE news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    published_date DATE NOT NULL,
    author VARCHAR(100),
    status VARCHAR(20) DEFAULT 'published', -- 'draft' หรือ 'published'
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source_url VARCHAR(255)
);

-- 6. ตารางประกาศทุนการศึกษาและทุนวิจัย (Scholarships - จัดการ CRUD ผ่าน Admin)
CREATE TABLE scholarships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    scholarship_type VARCHAR(100) NOT NULL,
    amount_baht INTEGER,
    deadline DATE,
    eligibility TEXT,
    attachment_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'published',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source_url VARCHAR(255)
);

-- 7. ตารางผลงานนิสิตและศิษย์เก่า (Student & Alumni Achievements)
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_name VARCHAR(150) NOT NULL,
    person_role VARCHAR(255),
    award_title TEXT NOT NULL,
    category VARCHAR(100),
    award_year VARCHAR(10),
    source_url VARCHAR(255)
);

-- 8. ตารางปฏิทินการศึกษา กิจกรรม และตารางเรียน (Calendar & Schedules)
CREATE TABLE calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255),
    target_year VARCHAR(100),
    status VARCHAR(20) DEFAULT 'published',
    source_url VARCHAR(255)
);

-- 9. ตารางคลังภาพและวิดีโอ (Media Gallery - รองรับฝัง YouTube)
CREATE TABLE media_gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_type VARCHAR(50) NOT NULL, -- 'video' หรือ 'album'
    title VARCHAR(255) NOT NULL,
    published_date DATE,
    youtube_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'published',
    source_url VARCHAR(255)
);

-- 10. ตารางข้อมูลติดต่อและผู้สมัครกิจกรรม (Form Submissions - สำหรับ Admin เปิดดู)
CREATE TABLE form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_type VARCHAR(50) NOT NULL, -- 'contact' หรือ 'activity_register'
    sender_name VARCHAR(150) NOT NULL,
    sender_email VARCHAR(100),
    sender_phone VARCHAR(50),
    subject_or_activity VARCHAR(255) NOT NULL,
    message TEXT,
    is_new INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERT ข้อมูลจริงจาก https://fss.buu.ac.th/
-- ============================================================================

INSERT INTO admin_users (username, password_hash, full_name, role, email) VALUES
('admin_fss', 'hashed_password_demo_2569', 'นายอัฐพร โสวัตร์ (ผู้ดูแลระบบ)', 'superadmin', 'attaporns@go.buu.ac.th'),
('pr_staff', 'hashed_password_demo_2569', 'นางพรรณปพร เผ่าจินดา (งานประชาสัมพันธ์)', 'editor', 'phanpaporn@go.buu.ac.th');

INSERT INTO programs (id, level, degree_th, degree_en, name_th, name_en, curriculum_years, chairperson, description, source_url) VALUES
(1, 'ปริญญาตรี', 'วิทยาศาสตรบัณฑิต (วท.บ.)', 'Bachelor of Science (B.Sc.)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'Exercise and Sport Science', '2559,2564,2569', 'ผศ.ดร.กวีญา สินธารา / ผศ.ดร.วิรัตน์ สนธิ์จันทร์', 'มุ่งเน้นองค์ความรู้ด้านสรีรวิทยาการออกกำลังกาย ชีวกลศาสตร์ จิตวิทยาการกีฬา โภชนาการ และการทดสอบสมรรถภาพทางกาย', 'https://fss.buu.ac.th/course/frontend/index'),
(2, 'ปริญญาตรี', 'ศิลปศาสตรบัณฑิต (ศศ.บ.)', 'Bachelor of Arts (B.A.)', 'สาขาวิชาการจัดการกีฬาและการเป็นผู้ฝึกสอนกีฬา (เดิม: การจัดการและการสอนกีฬา)', 'Sport Management and Coaching / Sport Studies and Sport Management', '2559,2564,2569', 'ผศ.ดร.ไพโรจน์ สว่างไพร', 'มุ่งเน้นการบริหารจัดการองค์กรกีฬา การจัดการแข่งขันกีฬาและนันทนาการ และทักษะการเป็นผู้ฝึกสอนกีฬามาตรฐานวิชาชีพ', 'https://fss.buu.ac.th/course/frontend/index'),
(3, 'ปริญญาตรี', 'ศิลปศาสตรบัณฑิต (ศศ.บ.)', 'Bachelor of Arts (B.A.)', 'สาขาวิชาสื่อสารทางกีฬา (เดิม: สื่อสารมวลชนทางกีฬา)', 'Sport Communication / Sport Mass Communications', '2559,2564,2569', 'ผศ.ดร.สราลี สนธิ์จันทร์ / ดร.วัชชริน ผดุงรัชดากิจ', 'มุ่งเน้นการผลิตสื่อทางการกีฬา การรายงานข่าวกีฬา การพากย์กีฬา การประชาสัมพันธ์และการตลาดดิจิทัลสำหรับงานกีฬา', 'https://fss.buu.ac.th/course/frontend/index'),
(4, 'ปริญญาโท', 'วิทยาศาสตรมหาบัณฑิต (วท.ม.)', 'Master of Science (M.Sc.)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'Exercise and Sport Science (Master''s Degree)', '2559,2564,2569', 'ผศ.ดร.พรพจน์ ไชยนอก / รศ.ดร.ฉัตรกมล สิงห์น้อย', 'ศึกษาลุ่มลึกด้านสรีรวิทยาการออกกำลังกาย จิตวิทยาการออกกำลังกายและการกีฬา และการบริหารจัดการการกีฬา', 'https://fss.buu.ac.th/course/frontend/index'),
(5, 'ปริญญาเอก', 'ปรัชญาดุษฎีบัณฑิต (ปร.ด.)', 'Doctor of Philosophy (Ph.D.)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'Exercise and Sport Science (Doctoral Degree)', '2559,2564,2569', 'ผศ.ดร.พรพจน์ ไชยนอก / ผศ.ดร.สุกัญญา เจริญวัฒนะ', 'มุ่งเน้นการวิจัยขั้นสูงและสร้างนวัตกรรมองค์ความรู้ใหม่ด้านวิทยาศาสตร์การออกกำลังกายและการกีฬาระดับสากล', 'https://fss.buu.ac.th/course/frontend/index');

INSERT INTO instructors (id, name_th, academic_position, admin_role, department, phone, email, source_url) VALUES
(1, 'ผศ.ดร.วิรัตน์ สนธิ์จันทร์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'คณบดีคณะวิทยาศาสตร์การกีฬา / ประธานหลักสูตรฯ', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'wirats@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(2, 'รศ.ดร.ธนิดา จุลวนิชย์พงษ์', 'รองศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา (ปริญญาตรี-โท-เอก)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'tanida@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(3, 'ผศ.ดร.สุกัญญา เจริญวัฒนะ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา ระดับบัณฑิตศึกษา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา / สื่อสารมวลชนทางกีฬา', '038102060', 'sukanyac@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(4, 'รศ.ดร.ฉัตรกมล สิงห์น้อย', 'รองศาสตราจารย์ ดร.', 'อาจารย์ / ประธานหลักสูตรระดับปริญญาโท', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'chatkamon@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(5, 'ผศ.ดร.พรพจน์ ไชยนอก', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา ระดับบัณฑิตศึกษา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'phornpot@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(6, 'ผศ.ดร.อรวรีย์ อิงคเตชะ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'onwaree@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(7, 'ผศ.ดร.กวีญา สินธารา', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา (ระดับปริญญาตรี)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'kawiya@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(8, 'อาจารย์จิรภา น้าคณาคุปต์', 'อาจารย์', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'chirapan@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(9, 'ผศ.ดร.อัตถสิทธิ์ ไชยณรงค์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'austtasit@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(10, 'ดร.เสกข์ศักย์ ธิติศักดิ์', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'sagsak.th@buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(11, 'ดร.จิดาภา ศิริวรรณ์', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'Chidapha.si@buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(12, 'ดร.วัชชริน ผดุงรัชดากิจ', 'ดร.', 'ผู้ช่วยคณบดีฝ่ายสื่อสารองค์กรและวิเทศสัมพันธ์ / ประธานหลักสูตรฯ', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', '038102060', 'wacharin@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(13, 'ผศ.ดร.สราลี สนธิ์จันทร์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิชาสื่อสารมวลชนทางกีฬา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', '038102060', 'saralee@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(14, 'ดร.สมพร ส่งตระกูล', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', '038102060', 'somporn_s@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(15, 'ว่าที่ร้อยตรี(หญิง) ดร.เพ็ญนภา วัยเวก', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', '038102060', 'pennapa.wa@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(16, 'ดร.สุภวุฒิ ภูมิรัตน', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาสื่อสารมวลชนทางกีฬา', '038102060', 'supawut.pu@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(17, 'ผศ.ดร.ปัญญา อินทเจริญ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'รองคณบดีฝ่ายบริหาร', 'สาขาวิชาการจัดการและการสอนกีฬา', '038102060', 'panya@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(18, 'ผศ.ดร.ไพโรจน์ สว่างไพร', 'ผู้ช่วยศาสตราจารย์ ดร.', 'รองคณบดีฝ่ายวิชาการและวิจัย / ประธานสาขาวิชาการจัดการและการสอนกีฬา', 'สาขาวิชาการจัดการและการสอนกีฬา', '038102060', 'pairot@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(19, 'ผศ.ดร.นาคิน คำศรี', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาการจัดการและการสอนกีฬา', '038102060', 'Nakin@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(20, 'รศ.ดร.รังสฤษฏ์ จำเริญ', 'รองศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาการจัดการและการสอนกีฬา', '038102060', 'rangsaritj@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(21, 'ดร.รดมยศ มาตเจือ', 'ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาการจัดการและการสอนกีฬา', '038102060', 'radomyos.ma@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index');

INSERT INTO staff_members (id, name_th, position, phone, email, source_url) VALUES
(1, 'นายอัฐพร โสวัตร์', 'นักวิชาการศึกษา ชำนาญการ / ผู้ช่วยคณบดีฝ่ายพัฒนานิสิต บริการวิชาการ และแผนยุทธศาสตร์ และผู้รักษาการแทนหัวหน้าสำนักงานคณบดี', '038102060', 'attaporns@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(2, 'นางสาวนวลพร สุวรรณพิทักษ์', 'นักวิชาการศึกษา ชำนาญการ', '038102060', 'nuanporn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(3, 'นางสาววนิษา ศรีรอบรู้', 'นักวิชาการศึกษา', '038102083', 'wanisa@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(4, 'นางพรรณปพร เผ่าจินดา', 'นักวิชาการศึกษา', '038102060', 'phanpaporn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(5, 'นางนันทวรรณ บำรุงเอี่ยมปัญญา', 'นักวิชาการพัสดุ', '038102059', 'nuntawun@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(6, 'นางสาวนิภาพร จั่นแพ', 'นักวิชาการเงินและบัญชี', '038102059', 'nipapornc@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(7, 'นางสาวชนณิการณ์ นามชัยยา', 'เจ้าหน้าที่บริหารงานทั่วไป', '038102083', 'chonnikarn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(8, 'นายเจษฎา รัตนวงษ์', 'เจ้าหน้าที่ดูแลห้องอุปกรณ์กีฬา', '-', '-', 'https://fss.buu.ac.th/personnel/frontend/index'),
(9, 'นางสาวศศิประภา ลิ้มภักดี', 'เจ้าหน้าที่ศูนย์วิสาหกิจกีฬา', '-', '-', 'https://fss.buu.ac.th/personnel/frontend/index');

INSERT INTO news_articles (id, category, title, summary, published_date, author, status, source_url) VALUES
(1, 'ข่าวสารและกิจกรรมคณะ', 'คณะวิทยาศาสตร์การกีฬา ม.บูรพา เปิด “FSS Co-Working Space” ขยายเวลาถึงเที่ยงคืน', 'จัดเตรียมพื้นที่ส่วนกลาง FSS Co-Working Space ณ ห้องกิจกรรม ชั้น 1 และบริเวณโดยรอบ เพื่ออำนวยความสะดวกให้แก่นิสิตทั้งระดับปริญญาตรีและบัณฑิตศึกษาในการทบทวนบทเรียนและทำงานกลุ่ม', '2026-09-15', 'งานพัฒนานิสิต', 'published', 'https://fss.buu.ac.th/'),
(2, 'ข่าวสารและกิจกรรมคณะ', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายฯ ม.บูรพา จัดกิจกรรม “รุ่นพี่ พบรุ่นน้อง” แนะแนวอาชีพสายกีฬา', 'อัปเดตทิศทางความต้องการของอุตสาหกรรมกีฬา สุขภาพ และฟิตเนสในปัจจุบัน พร้อมถ่ายทอดวิธีการประยุกต์ใช้องค์ความรู้จริงจากศิษย์เก่าสู่รุ่นน้อง', '2026-09-16', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'published', 'https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6QmF8Qmtz'),
(3, 'ข่าวสารและกิจกรรมคณะ', 'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมแสดงมุทิตาจิตแด่ “รศ.ดร.ธนิดา จุลวนิชย์พงษ์” ในโอกาสเกษียณอายุราชการ', 'ร่วมยกย่องและระลึกถึงคุณงามความดีของ รองศาสตราจารย์ ดร.ธนิดา จุลวนิชย์พงษ์ ในโอกาสเกษียณอายุราชการ ประจำปี พ.ศ. 2569', '2026-09-15', 'งานบุคคล', 'published', 'https://fss.buu.ac.th/'),
(4, 'ข่าวสารและกิจกรรมคณะ', 'คณะวิทยาศาสตร์การกีฬา ม.บูรพา ร่วมงานวันคล้ายวันสถาปนามหาวิทยาลัยบูรพา ครบรอบ 71 ปี', 'ผศ.ดร.วิรัตน์ สนธิ์จันทร์ คณบดี พร้อมคณะผู้บริหาร บุคลากร และตัวแทนนิสิต เข้าร่วมงานวันคล้ายวันสถาปนามหาวิทยาลัยบูรพา ครบรอบ 71 ปี ประจำปี พ.ศ. 2569', '2026-09-24', 'คณะวิทยาศาสตร์การกีฬา', 'published', 'https://fss.buu.ac.th/'),
(5, 'ความร่วมมือและงานวิจัย', 'พิธีลงนามความร่วมมือทางวิชาการ (MOU) ระหว่าง ม.บูรพา กับ Danang Sport University ประเทศเวียดนาม', 'จัดพิธีลงนาม MOU ณ ห้องประชุม FSS-605 เพื่อแลกเปลี่ยนทางวิชาการ นิสิต และงานวิจัยด้านวิทยาศาสตร์การกีฬาระหว่างประเทศ', '2024-11-11', 'งานวิเทศสัมพันธ์', 'published', 'https://fss.buu.ac.th/'),
(6, 'ข่าวกีฬาและการแข่งขัน', '“เกียรติศักดิ์ สิงหพงษ์” นิสิตวิทย์กีฬา ม.บูรพา คว้าแชมป์แข่งรถจักรยานยนต์ทางเรียบ Suzuka 4 Hours Endurance ที่ญี่ปุ่น', 'นายเกียรติศักดิ์ สิงหพงษ์ นิสิตชั้นปีที่ 1 สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา คว้ารางวัลชนะเลิศ รายการ Suzuka 4 Hours Endurance Japan รุ่น ST 600 ณ ประเทศญี่ปุ่น', '2024-08-19', 'งานประชาสัมพันธ์', 'published', 'https://fss.buu.ac.th/'),
(7, 'ข่าวกีฬาและการแข่งขัน', 'ทัพนักกีฬานิสิต ม.บูรพา คว้าเหรียญรางวัลในการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ครั้งที่ 48 “ดอกจานบ้านเชียงเกมส์”', 'นิสิตคณะวิทยาศาสตร์การกีฬาเป็นกำลังหลักของทัพนักกีฬามหาวิทยาลัยบูรพา เข้าร่วมชิงชัยและคว้าเหรียญรางวัลในการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ณ มรภ.อุดรธานี', '2024-08-21', 'งานประชาสัมพันธ์', 'published', 'https://fss.buu.ac.th/'),
(8, 'ข่าวกีฬาและการแข่งขัน', 'ศูนย์ปฏิบัติการ BUU House ขับเคลื่อนศึกเบสบอลและคริกเก็ตชิงแชมป์ประเทศไทย ประจำปี 2568', 'คณะวิทยาศาสตร์การกีฬาจัดตั้งศูนย์ปฏิบัติการ BUU House สนับสนุนการจัดการแข่งขันและสื่อสารมวลชนทางกีฬาในศึกเบสบอลและคริกเก็ตชิงแชมป์ประเทศไทย', '2025-08-15', 'ศูนย์วิสาหกิจกีฬา', 'published', 'https://fss.buu.ac.th/document/frontend/index'),
(9, 'ข่าวกีฬาและการแข่งขัน', 'ระเบิดศึกกีฬาภายใน “Sport Science Games” เสริมสร้างน้ำใจนักกีฬาและความสามัคคีพี่น้องวิทย์กีฬา', 'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬาจัดการแข่งขันกีฬาภายใน Sport Science Games เพื่อฝึกทักษะการจัดการแข่งขันจริงและเชื่อมความสัมพันธ์ระหว่างชั้นปี', '2025-10-10', 'สโมสรนิสิตคณะวิทยาศาสตร์การกีฬา', 'published', 'https://fss.buu.ac.th/document/frontend/index'),
(10, 'ข่าวกีฬาและการแข่งขัน', 'คณะวิทย์กีฬา ม.บูรพา ผนึกกำลังจัดงานวิ่ง “BUU Night Run” และประเพณีวิ่ง 8 กรกฎ ส่งเสริมสุขภาพชุมชนบางแสน', 'นิสิตและคณาจารย์ร่วมปฏิบัติงานจัดการแข่งขันวิ่ง BUU Night Run และงานวิ่งประเพณี 8 กรกฎ ประยุกต์ใช้วิทยาศาสตร์การกีฬาดูแลความปลอดภัยของนักวิ่ง', '2025-08-14', 'ศูนย์วิสาหกิจกีฬา', 'published', 'https://fss.buu.ac.th/document/frontend/index');

INSERT INTO scholarships (id, title, scholarship_type, amount_baht, deadline, eligibility, attachment_name, status, source_url) VALUES
(1, 'ทุนสนับสนุนการทำวิจัยดุษฎีนิพนธ์ บัณฑิตวิทยาลัย มหาวิทยาลัยบูรพา', 'ทุนวิจัยระดับบัณฑิตศึกษา', 10000, '2026-10-31', 'นิสิตระดับปริญญาโท-เอก สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา ที่ได้รับอนุมัติหัวข้อวิทยานิพนธ์/ดุษฎีนิพนธ์', 'แบบรายงานความก้าวหน้าและขอรับทุนอุดหนุนการวิจัย.pdf', 'published', 'https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WUd8Qmtz'),
(2, 'ทุนโครงการผู้มีความสามารถพิเศษทางกีฬา (โครงการช้างเผือก) ปีการศึกษา 2569', 'ทุนรับสมัครนิสิตใหม่ความสามารถพิเศษทางกีฬา', NULL, '2026-10-30', 'ผู้สมัครเข้าศึกษาระดับปริญญาตรีที่มีประวัติและผลงานการแข่งขันกีฬาระดับชาติ เยาวชนแห่งชาติ หรือตัวแทนจังหวัด', 'ระเบียบการรับสมัครโครงการช้างเผือก_2569.pdf', 'published', 'https://fss.buu.ac.th/'),
(3, 'ทุนส่งเสริมการศึกษาสำหรับนิสิตผู้มีศักยภาพและนิสิตจิตอาสา คณะวิทยาศาสตร์การกีฬา', 'ทุนการศึกษาระดับปริญญาตรี', 5000, '2026-11-15', 'นิสิตปัจจุบันระดับปริญญาตรี ชั้นปีที่ 1–4 ที่มีความประพฤติดี ขาดแคลนทุนทรัพย์ หรือมีผลงานจิตอาสาช่วยเหลือกิจกรรมคณะ', 'ใบสมัครทุนส่งเสริมการศึกษานิสิต_FSS.pdf', 'published', 'https://fss.buu.ac.th/document/frontend/index');

INSERT INTO achievements (id, person_name, person_role, award_title, category, award_year, source_url) VALUES
(1, 'นายภาคภูมิ พิลึก', 'นิสิตระดับปริญญาเอก หลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', 'ได้รับการพิจารณาอนุมัติทุนสนับสนุนการทำวิจัยดุษฎีนิพนธ์ (10,000 บาท) จากบัณฑิตวิทยาลัย มหาวิทยาลัยบูรพา', 'ผลงานวิชาการและวิจัย', '2569', 'https://fss.buu.ac.th/news/frontend/detail/MTZ8fFl6WUd8Qmtz'),
(2, 'นายเกียรติศักดิ์ สิงหพงษ์', 'นิสิตชั้นปีที่ 1 สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา (นักกีฬารถจักรยานยนต์ทางเรียบ)', 'รางวัลชนะเลิศ รายการ Suzuka 4 Hours Endurance Japan รุ่น ST 600 ณ ประเทศญี่ปุ่น', 'ผลงานกีฬาสร้างชื่อเสียงระดับนานาชาติ', '2567', 'https://fss.buu.ac.th/'),
(3, 'ผศ.ดร.พรพจน์ ไชยนอก และคณะ', 'คณาจารย์คณะวิทยาศาสตร์การกีฬา', 'ตีพิมพ์ผลงานวิจัยเรื่อง ''Follow-Up Weekly Training Distribution and Accumulated Internal Load Effects on Young Football Players'' ในวารสารวิชาการนานาชาติ Sports', 'ผลงานวิจัยระดับนานาชาติ', '2567', 'https://fss.buu.ac.th/'),
(4, 'ทัพนักกีฬานิสิตคณะวิทยาศาสตร์การกีฬา ม.บูรพา', 'นิสิตปัจจุบันตัวแทนมหาวิทยาลัยบูรพา', 'คว้าเหรียญรางวัลจากการแข่งขันกีฬามหาวิทยาลัยแห่งประเทศไทย ครั้งที่ 48 รอบมหกรรม ''ดอกจานบ้านเชียงเกมส์''', 'ผลงานการแข่งขันกีฬาระดับชาติ', '2566', 'https://fss.buu.ac.th/');

INSERT INTO calendar_events (id, event_type, title, start_date, end_date, location, target_year, status, source_url) VALUES
(1, 'ปฏิทินการศึกษา/รับสมัคร', 'เปิดรับสมัครบุคคลเข้าศึกษาระดับปริญญาตรี โครงการช้างเผือก และระบบ BUU TCAS', '2026-10-01', '2026-10-30', 'ระบบออนไลน์ https://e-admission.buu.ac.th', 'ผู้สมัครใหม่ / ปี 1', 'published', 'https://fss.buu.ac.th/'),
(2, 'กิจกรรมคณะ', 'การแข่งขันกีฬาภายในคณะวิทยาศาสตร์การกีฬา (Sport Science Games)', '2026-10-04', '2026-10-10', 'สนามกีฬาและอาคารคณะวิทยาศาสตร์การกีฬา ม.บูรพา', 'ทุกชั้นปี (ปี 1 - ปี 4)', 'published', 'https://fss.buu.ac.th/document/frontend/index'),
(3, 'กิจกรรมจิตอาสา', 'โครงการค่ายอาสาพัฒนาสังคม และ BUU Sport Science Volunteer', '2026-11-16', '2026-11-20', 'ชุมชนในจังหวัดชลบุรีและภาคตะวันออก', 'ทุกชั้นปี (ปี 1 - ปี 4)', 'published', 'https://fss.buu.ac.th/document/frontend/index'),
(4, 'ตารางเรียนตัวอย่าง (85111059)', 'รายวิชา 85111059 การออกกำลังกายเพื่อคุณภาพชีวิต (Exercise for Quality of Life)', '2026-10-21', '2026-10-21', 'ห้องปฏิบัติการออกกำลังกาย อาคารคณะวิทยาศาสตร์การกีฬา (09:00 - 11:00 น.)', 'ปี 1 - ปี 2', 'published', 'https://fss.buu.ac.th/document/frontend/index');

INSERT INTO media_gallery (id, media_type, title, published_date, youtube_url, thumbnail_url, status, source_url) VALUES
(1, 'video', 'วีดิทัศน์แนะนำคณะวิทยาศาสตร์การกีฬา มหาวิทยาลัยบูรพา', '2023-06-14', 'https://www.youtube.com/watch?v=_lxIy2d78Lg', 'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/slide/original/slide153985357075708200.jpg', 'published', 'https://fss.buu.ac.th/'),
(2, 'video', 'การดำเนินโครงการยกระดับเศรษฐกิจและสังคมรายตำบลแบบบูรณาการ (1 ตำบล 1 มหาวิทยาลัย - U2T)', '2021-10-20', 'https://www.youtube.com/watch?v=_lxIy2d78Lg', 'https://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/slide/original/slide153985357075708200.jpg', 'published', 'https://fss.buu.ac.th/'),
(3, 'album', 'อัลบั้มภาพบรรยากาศพื้นที่การเรียนรู้ FSS Co-Working Space และห้องปฏิบัติการวิทยาศาสตร์การกีฬา', '2026-09-15', NULL, 'http://fss.buu.ac.th/public/backend/upload/fss.buu.ac.th/summernote/b3e3e393c77e35a4a3f3cbd1e429b5dc.jpg', 'published', 'https://fss.buu.ac.th/history/frontend/index');

INSERT INTO form_submissions (submission_type, sender_name, sender_email, sender_phone, subject_or_activity, message, is_new) VALUES
('contact', 'ผู้สนใจสมัครเรียน (บุคคลภายนอก)', 'applicant@example.com', '081-234-5678', 'สอบถามเกณฑ์การรับสมัครโครงการช้างเผือก ปี 2569', 'อยากทราบว่าต้องยื่นแฟ้มสะสมผลงานกีฬาภายในวันที่เท่าไหร่ครับ', 1),
('activity_register', 'นิสิตชั้นปีที่ 2 สาขาวิทย์กีฬา', 'student67@go.buu.ac.th', '089-876-5432', 'สมัครเข้าร่วมกิจกรรม Sport Science Games', 'ลงทะเบียนเข้าร่วมการแข่งขันวิ่งประเพณีและทีมซอฟท์บอล', 1);