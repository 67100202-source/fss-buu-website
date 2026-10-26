-- =====================================================================
-- คืนข้อมูลอาจารย์ (instructors) และบุคลากร (staff_members)
-- ที่ถูกลบโดย clear_sample_data.sql
-- วิธีใช้: เปิด Supabase > SQL Editor แล้ววางไฟล์นี้แล้วกด Run
-- =====================================================================

-- คืนข้อมูลตาราง instructors
TRUNCATE TABLE public.instructors RESTART IDENTITY CASCADE;
insert into public.instructors (id, name_th, academic_position, admin_role, department, phone, email, source_url) values
(1, 'ผศ.ดร.วิรัตน์ สนธิ์จันทร์', 'ผู้ช่วยศาสตราจารย์ ดร.', 'คณบดีคณะวิทยาศาสตร์การกีฬา / ประธานหลักสูตรฯ', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'wirats@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(2, 'รศ.ดร.ธนิดา จุลวนิชย์พงษ์', 'รองศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา (ปริญญาตรี-โท-เอก)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'tanida@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(3, 'ผศ.ดร.สุกัญญา เจริญวัฒนะ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิทยาศาสตร์การออกกำลังกายและการกีฬา ระดับบัณฑิตศึกษา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา / สื่อสารมวลชนทางกีฬา', '038102060', 'sukanyac@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(4, 'รศ.ดร.ฉัตรกมล สิงห์น้อย', 'รองศาสตราจารย์ ดร.', 'อาจารย์ / ประธานหลักสูตรระดับปริญญาโท', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'chatkamon@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(5, 'ผศ.ดร.พรพจน์ ไชยนอก', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิทยาศาสตร์การออกกำลังกายและการกีฬา ระดับบัณฑิตศึกษา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'phornpot@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(6, 'ผศ.ดร.อรวรีย์ อิงคเตชะ', 'ผู้ช่วยศาสตราจารย์ ดร.', 'อาจารย์ประจำสาขา', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'onwaree@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
(7, 'ผศ.ดร.กวีญา สินธารา', 'ผู้ช่วยศาสตราจารย์ ดร.', 'ประธานสาขาวิทยาศาสตร์การออกกำลังกายและการกีฬา (ระดับปริญญาตรี)', 'สาขาวิชาวิทยาศาสตร์การออกกำลังกายและการกีฬา', '038102060', 'kawiya@go.buu.ac.th', 'https://fss.buu.ac.th/teacher/frontend/index'),
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

-- คืนข้อมูลตาราง staff_members
TRUNCATE TABLE public.staff_members RESTART IDENTITY CASCADE;
insert into public.staff_members (id, name_th, position, phone, email, source_url) values
(1, 'นายอัฐพร โสวัตร์', 'นักวิชาการศึกษา ชำนาญการ / ผู้ช่วยคณบดีฝ่ายพัฒนานิสิต บริการวิชาการ และแผนยุทธศาสตร์ และผู้รักษาการแทนหัวหน้าสำนักงานคณบดี', '038102060', 'attaporns@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(2, 'นางสาวนวลพร สุวรรณพิทักษ์', 'นักวิชาการศึกษา ชำนาญการ', '038102060', 'nuanporn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(3, 'นางสาววนิษา ศรีรอบรู้', 'นักวิชาการศึกษา', '038102083', 'wanisa@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(4, 'นางพรรณปพร เผ่าจินดา', 'นักวิชาการศึกษา', '038102060', 'phanpaporn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(5, 'นางนันทวรรณ บำรุงเอี่ยมปัญญา', 'นักวิชาการพัสดุ', '038102059', 'nuntawun@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(6, 'นางสาวนิภาพร จั่นแพ', 'นักวิชาการเงินและบัญชี', '038102059', 'nipapornc@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(7, 'นางสาวชนณิการณ์ นามชัยยา', 'เจ้าหน้าที่บริหารงานทั่วไป', '038102083', 'chonnikarn@go.buu.ac.th', 'https://fss.buu.ac.th/personnel/frontend/index'),
(8, 'นายเจษฎา รัตนวงษ์', 'เจ้าหน้าที่ดูแลห้องอุปกรณ์กีฬา', '-', '-', 'https://fss.buu.ac.th/personnel/frontend/index'),
(9, 'นางสาวศศิประภา ลิ้มภักดี', 'เจ้าหน้าที่ศูนย์วิสาหกิจกีฬา', '-', '-', 'https://fss.buu.ac.th/personnel/frontend/index');

